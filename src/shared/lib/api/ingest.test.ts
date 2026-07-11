import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/shared/lib/supabase/services/metric-cards', () => ({
  updateMetricCard: vi.fn(async () => ({})),
}));
vi.mock('@/shared/lib/supabase/services/trackedMetrics', () => ({
  syncCardValuesToCatalog: vi.fn(async () => undefined),
}));

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/shared/lib/supabase/types';
import { createIngest, parseCsv } from './ingest';
import * as cards from '@/shared/lib/supabase/services/metric-cards';
import * as tracked from '@/shared/lib/supabase/services/trackedMetrics';

// Minimal chainable Supabase mock: from() dequeues a builder that resolves to the
// next configured result at any terminal (.single/.maybeSingle/.order/await).
type Result = { data?: unknown; error?: unknown };
function makeClient(results: Result[]) {
  const q = [...results];
  const fromSpy = vi.fn(() => {
    const result = q.shift() ?? { data: null, error: null };
    const b: Record<string, unknown> = {};
    const ret = () => b;
    for (const m of ['insert', 'select', 'eq', 'order', 'update', 'in', 'upsert']) {
      b[m] = vi.fn(ret);
    }
    b.single = vi.fn(async () => result);
    b.maybeSingle = vi.fn(async () => result);
    b.then = (resolve: (r: Result) => unknown) => resolve(result);
    return b;
  });
  return { from: fromSpy } as unknown as SupabaseClient<Database>;
}

const PROJECT = '11111111-1111-1111-1111-111111111111';
const BATCH = '22222222-2222-2222-2222-222222222222';
const CARD = '33333333-3333-3333-3333-333333333333';

beforeEach(() => vi.clearAllMocks());

describe('parseCsv', () => {
  it('parses a header + rows', () => {
    expect(parseCsv('period,value\n2026-01,10\n2026-02,20')).toEqual({
      columns: ['period', 'value'],
      rows: [
        { period: '2026-01', value: '10' },
        { period: '2026-02', value: '20' },
      ],
    });
  });
  it('handles quoted fields with commas and escaped quotes', () => {
    const { rows } = parseCsv('name,note\n"Doe, Jane","said ""hi"""');
    expect(rows[0]).toEqual({ name: 'Doe, Jane', note: 'said "hi"' });
  });
  it('handles CRLF and ignores blank lines', () => {
    expect(parseCsv('a,b\r\n1,2\r\n').rows).toEqual([{ a: '1', b: '2' }]);
  });
  it('returns empty for empty input', () => {
    expect(parseCsv('')).toEqual({ columns: [], rows: [] });
  });
  it('keeps newlines inside quoted fields (RFC 4180)', () => {
    expect(parseCsv('period,value\n"Q1\n2024",10\n2026-02,20')).toEqual({
      columns: ['period', 'value'],
      rows: [
        { period: 'Q1\n2024', value: '10' },
        { period: '2026-02', value: '20' },
      ],
    });
  });
  it('keeps CRLF inside quoted fields while splitting records on CRLF', () => {
    const { columns, rows } = parseCsv('period,note\r\n"Q1\r\n2024","line1\r\nline2"\r\n');
    expect(columns).toEqual(['period', 'note']);
    expect(rows).toEqual([{ period: 'Q1\r\n2024', note: 'line1\r\nline2' }]);
  });
  it('handles embedded newlines together with escaped quotes', () => {
    const { rows } = parseCsv('name,note\n"Doe, Jane","said ""hi""\nthen left"');
    expect(rows[0]).toEqual({ name: 'Doe, Jane', note: 'said "hi"\nthen left' });
  });
});

describe('stageSeries', () => {
  it('stages a batch + rows and reports the count', async () => {
    const client = makeClient([{ data: { id: 'b1' } }, { error: null }]);
    const ingest = createIngest(client, 'u1');
    const out = await ingest.stageSeries({ projectId: PROJECT, series: [{ period: '2026-01', value: 10 }] });
    expect(out).toEqual({ batchId: 'b1', kind: 'series', rowCount: 1 });
    expect(client.from).toHaveBeenNthCalledWith(1, 'import_batches');
    expect(client.from).toHaveBeenNthCalledWith(2, 'import_rows');
  });
  it('rejects an empty series', async () => {
    const ingest = createIngest(makeClient([]), 'u1');
    await expect(ingest.stageSeries({ projectId: PROJECT, series: [] })).rejects.toThrow();
  });
});

describe('uploadCsv', () => {
  it('parses + stages CSV, returning columns', async () => {
    const client = makeClient([{ data: { id: 'b2' } }, { error: null }]);
    const ingest = createIngest(client, 'u1');
    const out = await ingest.uploadCsv({ projectId: PROJECT, csv: 'period,value\n2026-01,10' });
    expect(out).toEqual({ batchId: 'b2', kind: 'csv', columns: ['period', 'value'], rowCount: 1 });
  });
});

describe('materialize', () => {
  it('maps a series batch onto a card and materializes card.data', async () => {
    const client = makeClient([
      { data: { id: BATCH, kind: 'series', status: 'staged' } },
      { data: [{ data: { period: '2026-01', value: 10 } }, { data: { period: '2026-02', value: 'nope' } }] },
      { data: { tracked_metric_id: null } },
      { error: null },
    ]);
    const ingest = createIngest(client, 'u1');
    const report = await ingest.materialize({ batchId: BATCH, mapping: { cardId: CARD } });

    expect(cards.updateMetricCard).toHaveBeenCalledWith(
      CARD,
      { data: [{ period: '2026-01', value: 10, change_percent: 0, trend: 'neutral' }] },
      client
    );
    expect(tracked.syncCardValuesToCatalog).toHaveBeenCalled();
    expect(report).toMatchObject({ batchId: BATCH, cardId: CARD, materialized: 1, skipped: 1, errors: [] });
  });

  it('maps a CSV batch via periodColumn/valueColumn', async () => {
    const client = makeClient([
      { data: { id: BATCH, kind: 'csv', status: 'staged' } },
      { data: [{ data: { month: '2026-01', mrr: '999' } }] },
      { data: { tracked_metric_id: 'tm1' } },
      { error: null },
    ]);
    const ingest = createIngest(client, 'u1');
    const report = await ingest.materialize({
      batchId: BATCH,
      mapping: { cardId: CARD, periodColumn: 'month', valueColumn: 'mrr' },
    });
    expect(cards.updateMetricCard).toHaveBeenCalledWith(
      CARD,
      { data: [{ period: '2026-01', value: 999, change_percent: 0, trend: 'neutral' }] },
      client
    );
    expect(report.materialized).toBe(1);
  });

  it('throws for a CSV batch without a column mapping', async () => {
    const client = makeClient([
      { data: { id: BATCH, kind: 'csv', status: 'staged' } },
      { data: [{ data: { month: '2026-01', mrr: '10' } }] },
    ]);
    const ingest = createIngest(client, 'u1');
    await expect(ingest.materialize({ batchId: BATCH, mapping: { cardId: CARD } })).rejects.toThrow(
      /periodColumn/
    );
  });

  it('skips rows with empty values instead of materializing 0', async () => {
    const client = makeClient([
      { data: { id: BATCH, kind: 'csv', status: 'staged' } },
      { data: [{ data: { month: '2026-01', mrr: '' } }, { data: { month: '2026-02', mrr: '5' } }] },
      { data: { tracked_metric_id: null } },
      { error: null },
    ]);
    const ingest = createIngest(client, 'u1');
    const report = await ingest.materialize({
      batchId: BATCH,
      mapping: { cardId: CARD, periodColumn: 'month', valueColumn: 'mrr' },
    });
    expect(cards.updateMetricCard).toHaveBeenCalledWith(
      CARD,
      { data: [{ period: '2026-02', value: 5, change_percent: 0, trend: 'neutral' }] },
      client
    );
    expect(report).toMatchObject({ materialized: 1, skipped: 1 });
  });

  it('reports materialized: 0 when the card write fails', async () => {
    vi.mocked(cards.updateMetricCard).mockRejectedValueOnce(new Error('RLS denied'));
    const client = makeClient([
      { data: { id: BATCH, kind: 'series', status: 'staged' } },
      { data: [{ data: { period: '2026-01', value: 10 } }] },
      { error: null }, // import_batches status → 'failed'
    ]);
    const ingest = createIngest(client, 'u1');
    const report = await ingest.materialize({ batchId: BATCH, mapping: { cardId: CARD } });
    expect(report.materialized).toBe(0);
    expect(report.errors).toEqual(['RLS denied']);
  });

  it('still reports the card write when only the catalog sync fails', async () => {
    vi.mocked(tracked.syncCardValuesToCatalog).mockRejectedValueOnce(new Error('sync down'));
    const client = makeClient([
      { data: { id: BATCH, kind: 'series', status: 'staged' } },
      { data: [{ data: { period: '2026-01', value: 10 } }] },
      { data: { tracked_metric_id: 'tm1' } },
      { error: null }, // import_batches status → 'failed'
    ]);
    const ingest = createIngest(client, 'u1');
    const report = await ingest.materialize({ batchId: BATCH, mapping: { cardId: CARD } });
    expect(report.materialized).toBe(1);
    expect(report.errors).toEqual(['sync down']);
  });

  it('throws when the batch is missing/expired', async () => {
    const client = makeClient([{ data: null }]);
    const ingest = createIngest(client, 'u1');
    await expect(ingest.materialize({ batchId: BATCH, mapping: { cardId: CARD } })).rejects.toThrow(
      /not found or expired/
    );
  });
});
