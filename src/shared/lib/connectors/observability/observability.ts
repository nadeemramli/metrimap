// Connector observability service (CVS-145): record payload-free run/connection audit
// rows and read them back safely. The CVS-142 RunReport is already payload-free; this
// maps it to a row, redacts the message as defense-in-depth, and persists it. Takes any
// RLS-scoped or service-role client (the connector sync supplies one, CVS-146+).
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/shared/lib/supabase/types';
import type { RunReport } from '../runtime';
import type { ConnectorEvent, ConnectorRunRow, RunRecordMeta, RunStatus } from './types';

/** Redact token-like runs + truncate, so a message can never leak a secret or payload. */
export function safeMessage(msg?: string | null): string | null {
  if (!msg) return null;
  let s = String(msg);
  s = s.replace(/\b(?:sk|pk|mk|rk|Bearer|ey)[A-Za-z0-9._-]{8,}/gi, '[redacted]');
  s = s.replace(/[A-Za-z0-9_-]{40,}/g, '[redacted]');
  return s.length > 300 ? `${s.slice(0, 297)}…` : s;
}

/** A run with an error that still made progress is `partial`; one that never started is `error`. */
export function statusFromReport(report: RunReport): RunStatus {
  if (!report.error_class) return 'success';
  return report.pages > 0 ? 'partial' : 'error';
}

function durationMs(start?: string, end?: string): number | null {
  if (!start || !end) return null;
  const d = Date.parse(end) - Date.parse(start);
  return Number.isFinite(d) ? d : null;
}

/** Map a payload-free RunReport (+ downstream counts) to a connector_runs row. */
export function runRowFromReport(report: RunReport, meta: RunRecordMeta = {}): ConnectorRunRow {
  return {
    connected_account_id: meta.connectedAccountId ?? null,
    connector_id: report.connector_id,
    stream: report.stream,
    event: report.error_class ? 'run_failed' : 'run_finished',
    status: statusFromReport(report),
    sync_mode: report.sync_mode,
    pages: report.pages,
    fetched: report.fetched,
    accepted: meta.accepted ?? Math.max(0, report.fetched - report.skipped - report.rejected),
    skipped: report.skipped,
    rejected: report.rejected,
    materialized: meta.materialized ?? 0,
    cursor: report.cursor ?? null,
    error_class: report.error_class ?? null,
    error_message: safeMessage(report.error_message),
    resumable: report.resumable,
    duration_ms: durationMs(report.started_at, report.finished_at),
    started_at: report.started_at,
    finished_at: report.finished_at,
  };
}

type Client = SupabaseClient<Database>;

function withWorkspace(row: ConnectorRunRow, workspaceId?: string): Record<string, unknown> {
  return workspaceId ? { ...row, workspace_id: workspaceId } : { ...row };
}

/** Persist a completed stream run as an audit row. */
export async function recordRun(client: Client, report: RunReport, meta: RunRecordMeta = {}): Promise<void> {
  const { error } = await client
    .from('connector_runs')
    .insert(withWorkspace(runRowFromReport(report, meta), meta.workspaceId) as never);
  if (error) throw new Error(error.message);
}

/** Persist a connection lifecycle event (connected/refreshed/revoked/disconnected/auth_failed). */
export async function recordConnectionEvent(
  client: Client,
  input: { connectorId: string; connectedAccountId?: string; event: ConnectorEvent; errorClass?: string; workspaceId?: string }
): Promise<void> {
  const row: ConnectorRunRow = {
    connected_account_id: input.connectedAccountId ?? null,
    connector_id: input.connectorId,
    stream: null,
    event: input.event,
    status: input.event === 'auth_failed' ? 'error' : 'success',
    pages: 0, fetched: 0, accepted: 0, skipped: 0, rejected: 0, materialized: 0,
    resumable: false,
    error_class: input.errorClass ?? null,
  };
  const { error } = await client.from('connector_runs').insert(withWorkspace(row, input.workspaceId) as never);
  if (error) throw new Error(error.message);
}

const SAFE_COLUMNS =
  'connected_account_id, connector_id, stream, event, status, sync_mode, pages, fetched, accepted, skipped, rejected, materialized, cursor, error_class, error_message, resumable, duration_ms, started_at, finished_at, created_at';

/** Recent audit rows (safe columns), newest first — powers the admin/debug panel. */
export async function listRuns(
  client: Client,
  filters: { connectedAccountId?: string; connectorId?: string; limit?: number } = {}
): Promise<ConnectorRunRow[]> {
  let q = client.from('connector_runs').select(SAFE_COLUMNS).order('created_at', { ascending: false }).limit(filters.limit ?? 50);
  if (filters.connectedAccountId) q = q.eq('connected_account_id', filters.connectedAccountId);
  if (filters.connectorId) q = q.eq('connector_id', filters.connectorId);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as ConnectorRunRow[];
}

/** The most recent run for a connection+stream — feeds `deriveHealth`. */
export async function latestRun(
  client: Client,
  connectedAccountId: string,
  stream?: string
): Promise<ConnectorRunRow | undefined> {
  let q = client
    .from('connector_runs')
    .select(SAFE_COLUMNS)
    .eq('connected_account_id', connectedAccountId)
    .in('event', ['run_finished', 'run_failed'])
    .order('created_at', { ascending: false })
    .limit(1);
  if (stream) q = q.eq('stream', stream);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data?.[0] as unknown as ConnectorRunRow) ?? undefined;
}
