import { describe, it, expect, vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/shared/lib/supabase/types';
import type { CanonicalRecord } from '../canonical';
import {
  collectRecords,
  freshnessOf,
  materialize,
  materializeBinding,
  periodOf,
  previewBinding,
  upsertMetricValues,
  type MetricBinding,
} from './index';

const payment = (occurred_at: string, amount: number, status = 'succeeded'): CanonicalRecord =>
  ({
    schema: 'payment', schema_version: '1.0.0', source: 'stripe', source_account_id: 'acct',
    source_object_id: `pi_${occurred_at}_${amount}`, workspace_id: 'ws', observed_at: occurred_at,
    occurred_at, currency: 'MYR', amount, amount_unit: 'minor', attributes: { status },
    lineage: { connector_version: 'stripe@1.0.0', normalizer_version: 'payment@1.0.0' },
  }) as unknown as CanonicalRecord;

const pageMetric = (occurred_at: string, value: number): CanonicalRecord =>
  ({
    schema: 'page_metric', schema_version: '1.0.0', source: 'ga4', source_account_id: 'p',
    source_object_id: `${occurred_at}:${value}`, workspace_id: 'ws', observed_at: occurred_at,
    occurred_at, attributes: { page_path: '/x', metric: 'sessions', value },
    lineage: { connector_version: 'ga4@1.0.0', normalizer_version: 'page_metric@1.0.0' },
  }) as unknown as CanonicalRecord;

describe('materialize (recipe engine)', () => {
  const recs = [payment('2026-07-01T10:00:00Z', 1000), payment('2026-07-01T18:00:00Z', 500), payment('2026-07-02T09:00:00Z', 250)];

  it('sums by day', () => {
    expect(materialize(recs, { aggregation: 'sum', grain: 'day', field: 'amount' })).toEqual([
      { period: '2026-07-01', value: 1500 },
      { period: '2026-07-02', value: 250 },
    ]);
  });

  it('sums by month', () => {
    expect(materialize(recs, { aggregation: 'sum', grain: 'month', field: 'amount' })).toEqual([{ period: '2026-07', value: 1750 }]);
  });

  it('counts and averages', () => {
    expect(materialize(recs, { aggregation: 'count', grain: 'month' })[0]).toEqual({ period: '2026-07', value: 3 });
    expect(materialize(recs, { aggregation: 'average', grain: 'month', field: 'amount' })[0].value).toBeCloseTo(583.33, 1);
  });

  it('applies a filter (only succeeded counts as revenue)', () => {
    const mixed = [payment('2026-07-01T10:00:00Z', 1000), payment('2026-07-01T11:00:00Z', 999, 'failed')];
    const pts = materialize(mixed, { aggregation: 'sum', grain: 'day', field: 'amount', filter: { path: 'attributes.status', equals: 'succeeded' } });
    expect(pts).toEqual([{ period: '2026-07-01', value: 1000 }]);
  });
});

describe('periodOf', () => {
  it('buckets day / month / week', () => {
    expect(periodOf('2026-07-03T08:59:00Z', 'day')).toBe('2026-07-03');
    expect(periodOf('2026-07-03T08:59:00Z', 'month')).toBe('2026-07');
    expect(periodOf('2026-07-03T08:59:00Z', 'week')).toBe('2026-W27');
  });
});

describe('materializeBinding', () => {
  const revenueBinding: MetricBinding = {
    connectorId: 'stripe', stream: 'payment_intents', canonicalSchema: 'payment',
    recipe: { aggregation: 'sum', grain: 'day', field: 'amount', filter: { path: 'attributes.status', equals: 'succeeded' } },
    targetTrackedMetricId: 'tm_rev', connectedAccountId: 'ca_1',
  };
  const sessionsBinding: MetricBinding = {
    connectorId: 'ga4', stream: 'page_report', canonicalSchema: 'page_metric',
    recipe: { aggregation: 'sum', grain: 'day', field: 'attributes.value' },
    targetTrackedMetricId: 'tm_sessions',
  };

  it('money-style: Stripe revenue → rows with lineage', () => {
    const res = materializeBinding([payment('2026-07-01T10:00:00Z', 1200), payment('2026-07-01T12:00:00Z', 800)], revenueBinding);
    expect(res.status).toBe('materialized');
    expect(res.rows).toEqual([{ tracked_metric_id: 'tm_rev', period: '2026-07-01', value: 2000, source: expect.stringContaining('connector=stripe') }]);
    expect(res.rows[0].source).toContain('schema=payment@1.0.0');
  });

  it('analytics-style: GA4 sessions materialize', () => {
    const res = materializeBinding([pageMetric('2026-07-01T00:00:00Z', 120), pageMetric('2026-07-02T00:00:00Z', 90)], sessionsBinding);
    expect(res.rows.map((r) => r.value)).toEqual([120, 90]);
    expect(res.rows[0].tracked_metric_id).toBe('tm_sessions');
  });

  it('is idempotent — same records produce identical rows', () => {
    const recs = [payment('2026-07-01T10:00:00Z', 1200), payment('2026-07-02T10:00:00Z', 300)];
    expect(materializeBinding(recs, revenueBinding).rows).toEqual(materializeBinding(recs, revenueBinding).rows);
  });

  it('stale when the connection errored — no zeroes written', () => {
    const res = materializeBinding([payment('2026-07-01T10:00:00Z', 1200)], revenueBinding, { status: 'error' });
    expect(res.status).toBe('stale');
    expect(res.rows).toEqual([]);
  });

  it('orphaned when the connection was revoked', () => {
    const res = materializeBinding([payment('2026-07-01T10:00:00Z', 1200)], revenueBinding, { status: 'revoked' });
    expect(res.status).toBe('orphaned');
    expect(res.rows).toEqual([]);
  });

  it('materializes normally for a connected account', () => {
    expect(materializeBinding([payment('2026-07-01T10:00:00Z', 1200)], revenueBinding, { status: 'connected' }).status).toBe('materialized');
  });
});

describe('freshnessOf', () => {
  it('maps connection status to freshness', () => {
    expect(freshnessOf('connected')).toBe('fresh');
    expect(freshnessOf('pending')).toBe('fresh');
    expect(freshnessOf('error')).toBe('stale');
    expect(freshnessOf('revoked')).toBe('orphaned');
  });
});

describe('previewBinding', () => {
  it('computes points without persisting', () => {
    const pts = previewBinding([payment('2026-07-01T10:00:00Z', 1000), payment('2026-07-01T11:00:00Z', 500)], { aggregation: 'sum', grain: 'day', field: 'amount' });
    expect(pts).toEqual([{ period: '2026-07-01', value: 1500 }]);
  });
});

describe('collectRecords', () => {
  it('accumulates accepted records across pages', () => {
    const { records, sink } = collectRecords();
    sink([payment('2026-07-01T10:00:00Z', 100)]);
    sink([payment('2026-07-02T10:00:00Z', 200)]);
    expect(records).toHaveLength(2);
  });
});

describe('upsertMetricValues', () => {
  it('upserts idempotently by (tracked_metric_id, period)', async () => {
    const upsert = vi.fn().mockResolvedValue({ error: null });
    const client = { from: vi.fn(() => ({ upsert })) } as unknown as SupabaseClient<Database>;
    const rows = [{ tracked_metric_id: 'tm', period: '2026-07-01', value: 5, source: 's' }];
    const n = await upsertMetricValues(client, rows);
    expect(n).toBe(1);
    expect(client.from).toHaveBeenCalledWith('metric_values');
    expect(upsert).toHaveBeenCalledWith(rows, { onConflict: 'tracked_metric_id,period' });
  });

  it('no-ops on empty rows', async () => {
    const from = vi.fn();
    const client = { from } as unknown as SupabaseClient<Database>;
    expect(await upsertMetricValues(client, [])).toBe(0);
    expect(from).not.toHaveBeenCalled();
  });
});
