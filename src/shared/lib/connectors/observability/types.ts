// Connector observability contracts (CVS-145): payload-free run/audit records + the
// health state derived from them. Nothing here can carry a token, payload, or request
// body — only counts, cursor tokens, error classes, and safe messages.
import type { ConnectorErrorClass } from '../runtime';

export type RunStatus = 'running' | 'success' | 'error' | 'partial';

/** Distinguishes a stream-run audit row from a connection lifecycle event. */
export type ConnectorEvent =
  | 'run_started'
  | 'run_finished'
  | 'run_failed'
  | 'connection_connected'
  | 'connection_refreshed'
  | 'connection_revoked'
  | 'connection_disconnected'
  | 'auth_failed';

/** Operator-facing health of a connection/stream, derived from recent runs + status. */
export type ConnectorHealth =
  | 'healthy'
  | 'needs_reconnect'
  | 'rate_limited'
  | 'stale'
  | 'failing'
  | 'paused';

/** A row written to / read from `connector_runs` (payload-free by construction). */
export interface ConnectorRunRow {
  connected_account_id?: string | null;
  connector_id: string;
  stream?: string | null;
  event: ConnectorEvent;
  status: RunStatus;
  sync_mode?: string | null;
  pages: number;
  fetched: number;
  accepted: number;
  skipped: number;
  rejected: number;
  materialized: number;
  cursor?: string | null;
  error_class?: ConnectorErrorClass | string | null;
  error_message?: string | null;
  resumable: boolean;
  duration_ms?: number | null;
  started_at?: string | null;
  finished_at?: string | null;
}

/** Extra context the runtime's RunReport doesn't carry (workspace, account, downstream counts). */
export interface RunRecordMeta {
  connectedAccountId?: string;
  workspaceId?: string;
  accepted?: number;
  materialized?: number;
}
