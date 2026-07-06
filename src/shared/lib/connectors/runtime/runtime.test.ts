import { describe, it, expect } from 'vitest';
import type { ConnectorManifest, RateLimitStrategy, StreamManifest } from '../manifests';
import { runStream, InMemoryCursorStore, cursorKeyFor, ConnectorFetchError, backoffDelay, DEFAULT_RETRY } from './index';
import { createManualClock, createMockConnector } from './mockConnector';
import type { RunStreamOptions } from './types';

const stream: StreamManifest = {
  name: 'payments',
  display_name: 'Payments',
  canonical_schema: 'payment',
  supported_sync_modes: ['full_refresh', 'incremental'],
};

function manifestWith(rate: RateLimitStrategy): ConnectorManifest {
  return {
    id: 'mock',
    display_name: 'Mock',
    category: 'payments',
    status: 'mvp',
    auth: { type: 'none' },
    history_modes: ['metric_materialization'],
    default_history_mode: 'metric_materialization',
    storage_policy: 'metric_materialization',
    stores_raw_payloads: false,
    normalizer_version: '1.0.0',
    rate_limit: rate,
    streams: [stream],
  };
}

const NO_RATE: RateLimitStrategy = { strategy: 'none' };
const KEY = cursorKeyFor('acct', 'mock', 'payments');

function baseOptions(over: Partial<RunStreamOptions> = {}): RunStreamOptions {
  return {
    credentials: {},
    syncMode: 'incremental',
    cursorStore: new InMemoryCursorStore(),
    cursorKey: KEY,
    clock: createManualClock(),
    ...over,
  };
}

describe('runStream — pagination + cursor', () => {
  it('walks every page, collects records, and persists the last cursor', async () => {
    const { adapter, calls } = createMockConnector('mock', {
      payments: {
        pages: [
          { records: [1, 2], cursor: 'c1' },
          { records: [3, 4], cursor: 'c2' },
          { records: [5], cursor: 'c3' },
        ],
      },
    });
    const store = new InMemoryCursorStore();
    const report = await runStream(adapter, manifestWith(NO_RATE), stream, baseOptions({ cursorStore: store }));

    expect(report.pages).toBe(3);
    expect(report.fetched).toBe(5);
    expect(report.error_class).toBeUndefined();
    expect(report.cursor).toBe('c3');
    expect(store.snapshot()[KEY]).toBe('c3');
    expect(calls.map((c) => c.pageIndex)).toEqual([0, 1, 2]);
  });

  it('caps at maxRecords and stops early', async () => {
    const { adapter } = createMockConnector('mock', {
      payments: { pages: [{ records: [1, 2, 3, 4, 5] }, { records: [6, 7, 8, 9, 10] }, { records: [11] }] },
    });
    const report = await runStream(adapter, manifestWith(NO_RATE), stream, baseOptions({ maxRecords: 7 }));
    expect(report.fetched).toBe(7);
    expect(report.pages).toBe(2);
  });

  it('aggregates skipped/rejected from the record handler', async () => {
    const { adapter } = createMockConnector('mock', { payments: { pages: [{ records: [1, 2, 3, 4] }] } });
    const report = await runStream(
      adapter,
      manifestWith(NO_RATE),
      stream,
      baseOptions({ onRecords: (r) => ({ accepted: r.length - 2, skipped: 1, rejected: 1 }) })
    );
    expect(report.fetched).toBe(4);
    expect(report.skipped).toBe(1);
    expect(report.rejected).toBe(1);
  });
});

describe('runStream — retries + failures', () => {
  it('retries transient failures then succeeds', async () => {
    const { adapter, calls } = createMockConnector('mock', {
      payments: {
        pages: [{ records: [1], cursor: 'c1' }],
        failures: { 0: { error: new ConnectorFetchError('transient', 'blip'), times: 2 } },
      },
    });
    const report = await runStream(adapter, manifestWith(NO_RATE), stream, baseOptions());
    expect(report.error_class).toBeUndefined();
    expect(report.fetched).toBe(1);
    expect(calls).toHaveLength(3); // 2 failed attempts + 1 success
  });

  it('gives up after maxAttempts and reports the error class', async () => {
    const { adapter } = createMockConnector('mock', {
      payments: { pages: [{ records: [1] }], failures: { 0: { error: new ConnectorFetchError('transient', 'down'), times: 99 } } },
    });
    const report = await runStream(adapter, manifestWith(NO_RATE), stream, baseOptions());
    expect(report.error_class).toBe('transient');
    expect(report.fetched).toBe(0);
  });

  it('fails fast on a non-retryable (auth) error', async () => {
    const { adapter, calls } = createMockConnector('mock', {
      payments: { pages: [{ records: [1] }], failures: { 0: { error: new ConnectorFetchError('auth', 'bad key'), times: 5 } } },
    });
    const report = await runStream(adapter, manifestWith(NO_RATE), stream, baseOptions());
    expect(report.error_class).toBe('auth');
    expect(calls).toHaveLength(1);
  });

  it('persists the last good cursor and marks the run resumable when it fails partway', async () => {
    const { adapter } = createMockConnector('mock', {
      payments: {
        pages: [{ records: [1], cursor: 'c1' }, { records: [2], cursor: 'c2' }],
        failures: { 1: { error: new ConnectorFetchError('permanent', 'boom'), times: 99 } },
      },
    });
    const store = new InMemoryCursorStore();
    const report = await runStream(adapter, manifestWith(NO_RATE), stream, baseOptions({ cursorStore: store }));
    expect(report.error_class).toBe('permanent');
    expect(report.resumable).toBe(true);
    expect(report.cursor).toBe('c1');
    expect(store.snapshot()[KEY]).toBe('c1');

    // A resumed run reads that cursor and hands it to the adapter's first call.
    const { adapter: adapter2, calls: calls2 } = createMockConnector('mock', {
      payments: { pages: [{ records: [2], cursor: 'c2' }] },
    });
    await runStream(adapter2, manifestWith(NO_RATE), stream, baseOptions({ cursorStore: store }));
    expect(calls2[0].cursor).toBe('c1');
  });
});

describe('runStream — rate limiting + timeout', () => {
  it('paces requests by the manifest requests_per_minute', async () => {
    const clock = createManualClock();
    const { adapter } = createMockConnector('mock', {
      payments: { pages: [{ records: [1] }, { records: [2] }, { records: [3] }] },
    });
    // 60 rpm → one request/second; 3 pages → two 1s waits.
    await runStream(adapter, manifestWith({ strategy: 'token_bucket', requests_per_minute: 60 }), stream, baseOptions({ clock }));
    expect(clock.total()).toBe(2000);
  });

  it('adds no delay for a "none" rate strategy', async () => {
    const clock = createManualClock();
    const { adapter } = createMockConnector('mock', { payments: { pages: [{ records: [1] }, { records: [2] }] } });
    await runStream(adapter, manifestWith(NO_RATE), stream, baseOptions({ clock }));
    expect(clock.total()).toBe(0);
  });

  it('times out a page that never resolves', async () => {
    const adapter = { connectorId: 'mock', fetchPage: () => new Promise<never>(() => {}) };
    const report = await runStream(adapter, manifestWith(NO_RATE), stream, baseOptions({ pageTimeoutMs: 1000 }));
    expect(report.error_class).toBe('timeout');
    expect(report.pages).toBe(0);
  });
});

describe('runStream — payload-free reporting', () => {
  it('never leaks source records or secrets into the report', async () => {
    const { adapter } = createMockConnector('mock', {
      payments: { pages: [{ records: [{ pan: 'SENTINEL-4242', note: 'SECRET-TOKEN' }], cursor: 'c1' }] },
    });
    const report = await runStream(adapter, manifestWith(NO_RATE), stream, baseOptions({ credentials: { api_key: 'SECRET-TOKEN' } }));
    const serialized = JSON.stringify(report);
    expect(serialized).not.toContain('SENTINEL-4242');
    expect(serialized).not.toContain('SECRET-TOKEN');
    expect(report.fetched).toBe(1);
  });
});

describe('backoffDelay', () => {
  it('grows exponentially and is capped', () => {
    const policy = { ...DEFAULT_RETRY, baseDelayMs: 100, maxDelayMs: 1000 };
    expect(backoffDelay(0, policy, () => 0.999)).toBeLessThan(100);
    expect(backoffDelay(2, policy, () => 0.999)).toBeLessThan(400);
    expect(backoffDelay(10, policy, () => 0.999)).toBeLessThanOrEqual(1000);
  });
});
