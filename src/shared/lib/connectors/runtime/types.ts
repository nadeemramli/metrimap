// Fetch-runtime contracts (CVS-142).
//
// The adapter interface a connector implements, the page/run shapes the runtime drives,
// the payload-free run report it produces, and the small injectable seams (clock, cursor
// store) that keep the runtime deterministic in tests. Credentials are *injected* — the
// runtime never reads secrets itself; the connection/token model (CVS-141) resolves them
// at the connector-MVP layer (CVS-146+). See docs/data/connector-runtime.md.
import type { StreamManifest, SyncMode } from '../manifests';
import type { ConnectorErrorClass } from './errors';

/** Opaque, already-resolved credentials handed to an adapter — never persisted or logged. */
export type ConnectorCredentials = Readonly<Record<string, string>>;

/** Everything an adapter needs to fetch one page of one stream. */
export interface FetchPageInput {
  stream: StreamManifest;
  syncMode: SyncMode;
  credentials: ConnectorCredentials;
  /** Incremental cursor carried across runs (from the cursor store). */
  cursor?: string;
  /** Pagination token within the current run (from the previous page). */
  pageToken?: string;
  /** Aborted when the run is cancelled or a page times out. */
  signal: AbortSignal;
}

/** One page of source records plus how to continue. */
export interface FetchPageResult {
  /** Raw source records for this page — normalization/validation is CVS-143, not here. */
  records: unknown[];
  /** Token for the next page in this run; absent/undefined means the stream is exhausted. */
  nextPageToken?: string;
  /** Updated incremental cursor after this page; the runtime persists it on success. */
  cursor?: string;
}

/** A connector's fetch surface. One method — the runtime owns the loop, retries, and pacing. */
export interface ConnectorAdapter {
  connectorId: string;
  fetchPage(input: FetchPageInput): Promise<FetchPageResult>;
}

/**
 * Per-page disposition reported by an optional record handler (e.g. the CVS-143
 * normalizer). Lets the run summary carry accepted/skipped/rejected without the fetch
 * runtime knowing anything about canonical validation.
 */
export interface PageOutcome {
  accepted: number;
  skipped?: number;
  rejected?: number;
}

/** Handles the records of a page and reports how many were accepted/skipped/rejected. */
export type RecordHandler = (records: unknown[]) => PageOutcome | Promise<PageOutcome>;

/** Injectable clock so retry/backoff and rate-limit waits are deterministic in tests. */
export interface Clock {
  now(): number;
  sleep(ms: number, signal?: AbortSignal): Promise<void>;
}

/** Payload-free cursor persistence. Real impl is DB-backed (payload-free) at a later step. */
export interface CursorStore {
  read(key: string): Promise<string | undefined>;
  write(key: string, cursor: string): Promise<void>;
}

/** Backoff policy for retryable failures. */
export interface RetryPolicy {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  /** Deterministic jitter in [0,1) — defaults to Math.random; injected in tests. */
  jitter?: () => number;
}

export interface RunStreamOptions {
  credentials: ConnectorCredentials;
  syncMode: SyncMode;
  cursorStore: CursorStore;
  /** Stable key the cursor persists under, e.g. `${accountId}:${connector}:${stream}`. */
  cursorKey: string;
  /** Cap on records fetched this run — powers sample-preview mode (decision CVS-137 §8). */
  maxRecords?: number;
  /** Per-page timeout; omit to disable. */
  pageTimeoutMs?: number;
  retry?: Partial<RetryPolicy>;
  clock?: Clock;
  signal?: AbortSignal;
  /** Optional per-page record handler (normalization plugs in here). */
  onRecords?: RecordHandler;
}

/** Structured, payload-free summary of a single stream run. */
export interface RunReport {
  connector_id: string;
  stream: string;
  sync_mode: SyncMode;
  pages: number;
  fetched: number;
  skipped: number;
  rejected: number;
  /** Cursor persisted at the end of the run (undefined if none advanced). */
  cursor?: string;
  /** Set when the run ended on a failure; the class is stable and payload-free. */
  error_class?: ConnectorErrorClass;
  /** Safe, source-agnostic error message (never a payload/token). */
  error_message?: string;
  /** True when the run stopped early on failure but a resumable cursor was persisted. */
  resumable: boolean;
  started_at: string;
  finished_at: string;
}
