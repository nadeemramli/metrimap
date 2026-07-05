// Connector manifest shape + validation (CVS-140).
//
// A manifest is the single typed description of a connector: how it authenticates,
// which streams it exposes, which canonical schema each stream normalizes into
// (CVS-139), its cursor/sync/rate-limit behavior, and its storage posture. Manifests
// live versioned in repo code — the source of truth — and are projected into the DB
// for the Settings/Connected-accounts catalog (locked decision on Linear CVS-137 §2).
// Nothing here fetches a source or touches secrets; that is CVS-141/142.
import { z } from 'zod';
import { CANONICAL_SCHEMA_NAMES, LATER_SCHEMA_NAMES } from '../canonical';

/** Every canonical schema name a stream may target — defined (MVP) or registered-for-later. */
export const KNOWN_CANONICAL_NAMES: readonly string[] = [
  ...CANONICAL_SCHEMA_NAMES,
  ...LATER_SCHEMA_NAMES,
];

/** How a connector proves identity to its source. */
export const AuthType = z.enum([
  'oauth2',
  'api_key',
  'basic_auth',
  'manual_upload',
  'none',
]);
export type AuthType = z.infer<typeof AuthType>;

/**
 * How a connector retains history (locked decision CVS-137 §3). v1 defaults bound
 * metrics to `metric_materialization`; `customer_owned_destination` is deferred to
 * CVS-155. `live_query` reads on demand and persists nothing.
 */
export const HistoryMode = z.enum([
  'live_query',
  'metric_materialization',
  'customer_owned_destination',
]);
export type HistoryMode = z.infer<typeof HistoryMode>;

/**
 * The declared retention posture for source data. Per the locked decision, no raw
 * third-party payloads are stored by default and there is no short-TTL raw table in
 * v1 — MVP connectors are `metric_materialization`. The other values exist so the
 * registry can describe future postures without a schema change.
 */
export const StoragePolicy = z.enum([
  'no_raw_payload',
  'short_ttl_staging',
  'metric_materialization',
  'customer_owned_destination',
]);
export type StoragePolicy = z.infer<typeof StoragePolicy>;

export const SyncMode = z.enum(['full_refresh', 'incremental']);
export type SyncMode = z.infer<typeof SyncMode>;

/** Whether a connector is fully specified (`mvp`) or a registered stub (`placeholder`). */
export const ConnectorStatus = z.enum(['mvp', 'placeholder']);
export type ConnectorStatus = z.infer<typeof ConnectorStatus>;

/** UI/category grouping for the connected-accounts catalog. */
export const ConnectorCategory = z.enum([
  'analytics',
  'product_analytics',
  'payments',
  'commerce',
  'manual',
  'research',
]);
export type ConnectorCategory = z.infer<typeof ConnectorCategory>;

export const rateLimitStrategySchema = z.object({
  strategy: z.enum(['token_bucket', 'fixed_window', 'concurrency', 'none']),
  requests_per_minute: z.number().int().positive().optional(),
  max_concurrency: z.number().int().positive().optional(),
  notes: z.string().optional(),
});
export type RateLimitStrategy = z.infer<typeof rateLimitStrategySchema>;

/**
 * One pullable stream. `canonical_schema` names the CVS-139 schema its records
 * normalize into; `cursor_field` is the source field that drives incremental sync;
 * `default_dimensions`/`default_metrics`/`freshness` feed metric binding (CVS-144).
 */
export const streamManifestSchema = z.object({
  name: z.string().min(1),
  display_name: z.string().min(1),
  canonical_schema: z.string().min(1),
  cursor_field: z.string().min(1).optional(),
  supported_sync_modes: z.array(SyncMode).nonempty(),
  default_dimensions: z.array(z.string().min(1)).optional(),
  default_metrics: z.array(z.string().min(1)).optional(),
  freshness: z.string().min(1).optional(),
});
export type StreamManifest = z.infer<typeof streamManifestSchema>;

export const connectorManifestSchema = z.object({
  id: z.string().regex(/^[a-z0-9_]+$/, 'id must be lower_snake slug'),
  display_name: z.string().min(1),
  category: ConnectorCategory,
  status: ConnectorStatus,
  auth: z.object({
    type: AuthType,
    recommended_scopes: z.array(z.string().min(1)).optional(),
  }),
  history_modes: z.array(HistoryMode).nonempty(),
  default_history_mode: HistoryMode,
  storage_policy: StoragePolicy,
  stores_raw_payloads: z.boolean(),
  normalizer_version: z.string().min(1),
  rate_limit: rateLimitStrategySchema,
  streams: z.array(streamManifestSchema),
});
export type ConnectorManifest = z.infer<typeof connectorManifestSchema>;

// --- Validation -----------------------------------------------------------

export interface ManifestError {
  path: string;
  code: string;
  message: string;
}

export type ManifestValidationResult =
  | { ok: true; manifest: ConnectorManifest }
  | { ok: false; errors: ManifestError[] };

function issuePath(issue: z.ZodIssue): string {
  return issue.path.length ? issue.path.join('.') : '$';
}

/**
 * Validate an unknown value as a connector manifest. Returns structured errors so
 * a manifest build or an admin import can report exactly what is wrong — never
 * throws. Beyond the Zod shape it enforces the cross-field rules the object can't:
 * known canonical schema per stream, default mode within supported modes, unique
 * stream names, the no-raw-payload invariant, and that MVP connectors have streams.
 */
export function validateManifest(input: unknown): ManifestValidationResult {
  const parsed = connectorManifestSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.issues.map((i) => ({
        path: issuePath(i),
        code: i.code,
        message: i.message,
      })),
    };
  }
  const m = parsed.data;
  const errors: ManifestError[] = [];

  m.streams.forEach((s, idx) => {
    if (!KNOWN_CANONICAL_NAMES.includes(s.canonical_schema)) {
      errors.push({
        path: `streams.${idx}.canonical_schema`,
        code: 'unknown_canonical_schema',
        message: `Stream "${s.name}" targets unknown canonical schema "${s.canonical_schema}"`,
      });
    }
  });

  const names = m.streams.map((s) => s.name);
  const dupes = names.filter((n, i) => names.indexOf(n) !== i);
  if (dupes.length) {
    errors.push({
      path: 'streams',
      code: 'duplicate_stream_name',
      message: `Duplicate stream names: ${[...new Set(dupes)].join(', ')}`,
    });
  }

  if (!m.history_modes.includes(m.default_history_mode)) {
    errors.push({
      path: 'default_history_mode',
      code: 'default_mode_unsupported',
      message: `default_history_mode "${m.default_history_mode}" is not in history_modes`,
    });
  }

  if (m.storage_policy === 'no_raw_payload' && m.stores_raw_payloads) {
    errors.push({
      path: 'stores_raw_payloads',
      code: 'raw_payload_conflict',
      message: 'stores_raw_payloads must be false when storage_policy is "no_raw_payload"',
    });
  }

  if (m.status === 'mvp' && m.streams.length === 0) {
    errors.push({
      path: 'streams',
      code: 'mvp_without_streams',
      message: 'An MVP connector must declare at least one stream',
    });
  }

  return errors.length ? { ok: false, errors } : { ok: true, manifest: m };
}
