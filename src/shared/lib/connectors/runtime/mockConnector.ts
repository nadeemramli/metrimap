// Mock connector + manual clock for exercising the fetch runtime (CVS-142).
//
// Kept in src (not a .test file) so the connector QA fixture suite (CVS-154) can reuse it.
// The mock serves pre-defined pages with pagination + cursors and can inject transient
// failures on a given page to prove retries and resumed runs, all without a real network.
import { ConnectorFetchError } from './errors';
import type { Clock, ConnectorAdapter, FetchPageInput, FetchPageResult } from './types';

export interface MockPage {
  records: unknown[];
  cursor?: string;
}

export interface MockStreamConfig {
  pages: MockPage[];
  /** Inject failures on a 0-based page index: throw `error` for the first `times` attempts. */
  failures?: Record<number, { error: ConnectorFetchError; times: number }>;
}

export interface MockCall {
  stream: string;
  cursor?: string;
  pageIndex: number;
}

export interface MockConnector {
  adapter: ConnectorAdapter;
  calls: MockCall[];
}

/**
 * Build a mock adapter. `streams` maps a stream name to its ordered pages; the runtime
 * walks them via an integer page token. Records every fetch in `calls` for assertions.
 */
export function createMockConnector(
  connectorId: string,
  streams: Record<string, MockStreamConfig>
): MockConnector {
  const calls: MockCall[] = [];
  const attempts = new Map<string, number>();

  const adapter: ConnectorAdapter = {
    connectorId,
    async fetchPage(input: FetchPageInput): Promise<FetchPageResult> {
      const cfg = streams[input.stream.name];
      if (!cfg) throw new ConnectorFetchError('permanent', `No mock stream "${input.stream.name}"`);

      const pageIndex = input.pageToken ? Number(input.pageToken) : 0;
      calls.push({ stream: input.stream.name, cursor: input.cursor, pageIndex });

      const failure = cfg.failures?.[pageIndex];
      if (failure) {
        const key = `${input.stream.name}:${pageIndex}`;
        const soFar = attempts.get(key) ?? 0;
        if (soFar < failure.times) {
          attempts.set(key, soFar + 1);
          throw failure.error;
        }
      }

      const page = cfg.pages[pageIndex];
      if (!page) throw new ConnectorFetchError('permanent', `Mock page ${pageIndex} out of range`);

      const hasNext = pageIndex + 1 < cfg.pages.length;
      return {
        records: page.records,
        cursor: page.cursor,
        nextPageToken: hasNext ? String(pageIndex + 1) : undefined,
      };
    },
  };

  return { adapter, calls };
}

/**
 * A deterministic clock: `sleep` resolves immediately but advances virtual time, so
 * backoff and rate-limit waits are instant yet `now()` still moves forward. Do not set a
 * per-page timeout with this clock unless you are testing the timeout itself.
 */
export function createManualClock(start = 0): Clock & { total: () => number } {
  let t = start;
  return {
    now: () => t,
    sleep: async (ms: number) => {
      t += ms;
    },
    total: () => t,
  };
}
