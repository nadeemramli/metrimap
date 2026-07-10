// SERVER-ONLY connector run host (CVS-320) — the orchestrator that composes every
// merged connector layer into one invocation:
//
//   secrets (CVS-141) → fetch runtime (CVS-142) → normalize (CVS-143)
//     → bind/materialize (CVS-144) → metric_values, audited by CVS-145.
//
// Runs wherever a service-role client exists (the connector-run edge function, tests,
// later the CVS-323 scheduler). Holds canonical records in memory for the duration of
// the run only — no raw payloads persist (locked decision CVS-137).
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/shared/lib/supabase/types';
import type { CanonicalRecord } from '../canonical';
import { collectRecords, materializeBinding, upsertMetricValues } from '../binding';
import { getConnector, type SyncMode } from '../manifests';
import { getMapper, toRecordHandler, type NormalizationContext } from '../normalize';
import { recordRun } from '../observability';
import {
  ConnectorFetchError,
  InMemoryCursorStore,
  cursorKeyFor,
  runStream,
  type Clock,
  type CursorStore,
  type RunReport,
} from '../runtime';
import { loadBindings } from './bindings';
import { createAdapter } from './adapters';
import { resolveCredentials, type HostEnv } from './credentials';
import { SupabaseCursorStore } from './cursorStore';

type ServiceClient = SupabaseClient<Database>;

const PREVIEW_MAX_RECORDS = 10; // sample-preview cap (locked decision CVS-137 §8)

export interface RunHostDeps {
  /** SERVICE-ROLE client — the host reads secrets and writes cursors/values/audit. */
  service: ServiceClient;
  /** CONNECTOR_SECRET_KEY (base64, 32 bytes). */
  secretKey: string;
  env?: HostEnv;
  fetchImpl?: typeof fetch;
  clock?: Clock;
  /** Injectable for tests; defaults to the DB-backed store (in-memory for previews). */
  cursorStore?: CursorStore;
}

export interface RunConnectorInput {
  accountId: string;
  stream: string;
  syncMode?: SyncMode;
  /** Preview: capped fetch, in-memory cursor, nothing persisted, sample returned. */
  preview?: boolean;
  maxRecords?: number;
  pageTimeoutMs?: number;
}

export interface RunHostSummary {
  ok: boolean;
  report?: RunReport;
  /** metric_values rows written across all bindings. */
  materialized: number;
  bindingsApplied: number;
  /** Binding rows whose recipe failed to parse — skipped, never guessed at. */
  malformedBindingIds: string[];
  /** Preview only: the normalized sample (held in memory, never persisted). */
  sample?: CanonicalRecord[];
  /** Safe, payload-free error when the run could not start or fetch failed. */
  error?: string;
  errorClass?: string;
}

const RUNNABLE_STATUSES = new Set(['connected', 'error']); // error = retry may heal

/** Run one connected account's stream through the full pipeline. Never throws for
 *  source/auth failures — they come back as a payload-free summary. */
export async function runConnectorStream(deps: RunHostDeps, input: RunConnectorInput): Promise<RunHostSummary> {
  const { service } = deps;
  const preview = input.preview === true;

  const { data: account, error: accErr } = await service
    .from('connected_accounts')
    .select('*')
    .eq('id', input.accountId)
    .maybeSingle();
  if (accErr) throw new Error(accErr.message);
  if (!account) return failSummary('connection not found');
  if (!RUNNABLE_STATUSES.has(account.status)) {
    return failSummary(`connection is ${account.status} — reconnect before syncing`);
  }

  const manifest = getConnector(account.connector_id);
  if (!manifest) return failSummary(`unknown connector '${account.connector_id}'`);
  const stream = manifest.streams.find((s) => s.name === input.stream);
  if (!stream) return failSummary(`connector '${manifest.id}' has no stream '${input.stream}'`);
  const mapper = getMapper(manifest.id, stream.name);
  if (!mapper) return failSummary(`no normalizer registered for ${manifest.id}:${stream.name}`);

  let credentials;
  try {
    credentials = await resolveCredentials(service, {
      accountId: account.id,
      connectorId: account.connector_id,
      workspaceId: account.workspace_id ?? undefined,
      secretKey: deps.secretKey,
      env: deps.env ?? {},
      fetchImpl: deps.fetchImpl,
    });
  } catch (err) {
    if (err instanceof ConnectorFetchError) {
      return { ...failSummary(err.message), errorClass: err.class };
    }
    throw err;
  }

  const adapter = createAdapter(account, deps.fetchImpl);
  const ctx: NormalizationContext = {
    source: manifest.id,
    sourceAccountId: account.source_account_id ?? account.id,
    workspaceId: account.workspace_id ?? account.created_by,
    connectorVersion: `${manifest.id}@${manifest.normalizer_version}`,
    observedAt: new Date().toISOString(),
  };
  const collected = collectRecords();

  const cursorStore =
    deps.cursorStore ??
    (preview
      ? new InMemoryCursorStore()
      : new SupabaseCursorStore(service, { workspaceId: account.workspace_id, createdBy: account.created_by }));

  const report = await runStream(adapter, manifest, stream, {
    credentials,
    syncMode: preview ? 'full_refresh' : (input.syncMode ?? 'incremental'),
    cursorStore,
    cursorKey: cursorKeyFor(account.id, manifest.id, stream.name),
    maxRecords: preview ? (input.maxRecords ?? PREVIEW_MAX_RECORDS) : input.maxRecords,
    pageTimeoutMs: input.pageTimeoutMs ?? 30_000,
    clock: deps.clock,
    onRecords: toRecordHandler(mapper, ctx, collected.sink),
  });

  if (preview) {
    return {
      ok: !report.error_class,
      report,
      materialized: 0,
      bindingsApplied: 0,
      malformedBindingIds: [],
      sample: collected.records,
      error: report.error_message,
      errorClass: report.error_class,
    };
  }

  // A clean run heals an `error` connection; an auth failure during fetch marks it.
  const now = new Date().toISOString();
  let effectiveStatus = account.status;
  if (!report.error_class && account.status === 'error') {
    await service
      .from('connected_accounts')
      .update({ status: 'connected', status_detail: null, updated_at: now })
      .eq('id', account.id);
    effectiveStatus = 'connected';
  } else if (report.error_class === 'auth') {
    await service
      .from('connected_accounts')
      .update({ status: 'error', status_detail: 'authentication failed during sync', updated_at: now })
      .eq('id', account.id);
    effectiveStatus = 'error';
  }

  const { bindings, malformedIds } = await loadBindings(service, account.id, stream.name);
  let materialized = 0;
  for (const binding of bindings) {
    const result = materializeBinding(collected.records, binding, { status: effectiveStatus });
    if (result.status === 'materialized') {
      materialized += await upsertMetricValues(service, result.rows);
    }
  }

  await recordRun(service, report, {
    connectedAccountId: account.id,
    workspaceId: account.workspace_id ?? undefined,
    materialized,
  });

  if (!report.error_class) {
    await service
      .from('connected_accounts')
      .update({ last_synced_at: now, updated_at: now })
      .eq('id', account.id);
  }

  return {
    ok: !report.error_class,
    report,
    materialized,
    bindingsApplied: bindings.length,
    malformedBindingIds: malformedIds,
    error: report.error_message,
    errorClass: report.error_class,
  };
}

function failSummary(error: string): RunHostSummary {
  return { ok: false, materialized: 0, bindingsApplied: 0, malformedBindingIds: [], error };
}
