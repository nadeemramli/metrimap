// Stream run loop (CVS-142).
//
// Drives one connector stream end to end: paces requests by the manifest rate limit,
// retries transient failures with backoff, times out slow pages, walks pagination, and
// advances the persisted cursor ONLY after a page succeeds — so a run that fails partway
// resumes from the last good page without duplicating or skipping records. Produces a
// payload-free RunReport. See docs/data/connector-runtime.md.
import type { ConnectorManifest, StreamManifest } from '../manifests';
import { classifyError } from './errors';
import { systemClock, withTimeout } from './clock';
import { createRateLimiter } from './rateLimiter';
import { DEFAULT_RETRY, withRetry } from './retry';
import type {
  ConnectorAdapter,
  PageOutcome,
  RetryPolicy,
  RunReport,
  RunStreamOptions,
} from './types';

const NO_OP_OUTCOME = (records: unknown[]): PageOutcome => ({ accepted: records.length, skipped: 0, rejected: 0 });

/**
 * Fetch one stream to completion (or to `maxRecords`), returning a structured summary.
 * Never throws for source/transport failures — a terminal error is captured in the report
 * as a stable `error_class` so Connected Accounts and debug surfaces can render it.
 */
export async function runStream(
  adapter: ConnectorAdapter,
  manifest: ConnectorManifest,
  stream: StreamManifest,
  options: RunStreamOptions
): Promise<RunReport> {
  const clock = options.clock ?? systemClock;
  const retry: RetryPolicy = { ...DEFAULT_RETRY, ...options.retry };
  const limiter = createRateLimiter(manifest.rate_limit, clock);
  const handle = options.onRecords ?? NO_OP_OUTCOME;
  const startedAt = clock.now();

  let cursor = await options.cursorStore.read(options.cursorKey);
  let cursorPersisted = false;
  let pageToken: string | undefined;
  let pages = 0;
  let fetched = 0;
  let skipped = 0;
  let rejected = 0;
  let errorClass: RunReport['error_class'];
  let errorMessage: string | undefined;

  try {
    for (;;) {
      await limiter.acquire(options.signal);

      const currentCursor = cursor;
      const currentToken = pageToken;
      const page = await withRetry(
        (signal) =>
          withTimeout(
            (inner) =>
              adapter.fetchPage({
                stream,
                syncMode: options.syncMode,
                credentials: options.credentials,
                cursor: currentCursor,
                pageToken: currentToken,
                signal: inner,
              }),
            options.pageTimeoutMs,
            signal,
            clock
          ),
        retry,
        clock,
        options.signal
      );

      pages += 1;

      let records = page.records;
      if (options.maxRecords !== undefined) {
        const room = options.maxRecords - fetched;
        if (records.length > room) records = records.slice(0, Math.max(0, room));
      }

      const outcome = await handle(records);
      fetched += records.length;
      skipped += outcome.skipped ?? 0;
      rejected += outcome.rejected ?? 0;

      // Advance the cursor only now that the page has been fetched and handled.
      if (page.cursor !== undefined) {
        cursor = page.cursor;
        await options.cursorStore.write(options.cursorKey, page.cursor);
        cursorPersisted = true;
      }

      pageToken = page.nextPageToken;
      const hitCap = options.maxRecords !== undefined && fetched >= options.maxRecords;
      if (!pageToken || hitCap) break;
    }
  } catch (raw) {
    const err = classifyError(raw);
    errorClass = err.class;
    errorMessage = err.message;
  }

  const finishedAt = clock.now();
  return {
    connector_id: adapter.connectorId,
    stream: stream.name,
    sync_mode: options.syncMode,
    pages,
    fetched,
    skipped,
    rejected,
    cursor: cursorPersisted ? cursor : undefined,
    error_class: errorClass,
    error_message: errorMessage,
    resumable: errorClass !== undefined && cursorPersisted,
    started_at: new Date(startedAt).toISOString(),
    finished_at: new Date(finishedAt).toISOString(),
  };
}
