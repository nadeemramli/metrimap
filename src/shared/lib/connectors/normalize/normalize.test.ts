import { describe, it, expect } from 'vitest';
import { validateRecord, type CanonicalRecord } from '../canonical';
import { runStream, InMemoryCursorStore, cursorKeyFor } from '../runtime';
import { createMockConnector, createManualClock } from '../runtime/mockConnector';
import { getConnector } from '../manifests';
import {
  NORMALIZER_REGISTRY,
  getMapper,
  hasMapper,
  normalizeBatch,
  normalizeAsHandler,
  type NormalizeContext,
} from './index';
import {
  ga4EventRaw,
  ga4PageRaw,
  posthogEventRaw,
  shopifyOrderRaw,
  stripePaymentRaw,
  wooOrderRaw,
} from './fixtures';

function ctx(over: Partial<NormalizeContext> = {}): NormalizeContext {
  return {
    source: 'stripe',
    source_account_id: 'acct_1',
    workspace_id: 'ws_1',
    connector_version: 'stripe@1.0.0',
    normalizer_version: 'payment@1.0.0',
    observed_at: '2026-07-03T12:31:00Z',
    ...over,
  };
}

describe('mapper registry', () => {
  const table = [
    { connector: 'stripe', stream: 'payments', raw: stripePaymentRaw, schemas: ['payment'] },
    { connector: 'ga4', stream: 'page_metrics', raw: ga4PageRaw, schemas: ['page_metric'] },
    { connector: 'ga4', stream: 'events', raw: ga4EventRaw, schemas: ['analytics_event'] },
    { connector: 'woocommerce', stream: 'orders', raw: wooOrderRaw, schemas: ['commerce_order', 'order_line_item', 'order_line_item', 'customer'] },
    { connector: 'shopify', stream: 'orders', raw: shopifyOrderRaw, schemas: ['commerce_order', 'order_line_item'] },
    { connector: 'posthog', stream: 'events', raw: posthogEventRaw, schemas: ['analytics_event'] },
  ];

  for (const { connector, stream, raw, schemas } of table) {
    it(`${connector}/${stream} maps to valid canonical ${[...new Set(schemas)].join('+')}`, () => {
      const mapper = getMapper(connector, stream);
      expect(mapper).toBeDefined();
      const { records, report } = normalizeBatch(mapper!, [raw], ctx({ source: connector }), { source: connector, stream });
      expect(report.rejected).toBe(0);
      expect(records.map((r) => r.schema)).toEqual(schemas);
      // Every emitted record independently validates against the canonical schema.
      for (const r of records) expect(validateRecord(r).ok).toBe(true);
    });
  }

  it('registers a mapper for every Tier-1 connector in the manifest registry', () => {
    for (const id of Object.keys(NORMALIZER_REGISTRY)) expect(getConnector(id)).toBeDefined();
    expect(hasMapper('stripe', 'payments')).toBe(true);
    expect(hasMapper('stripe', 'nope')).toBe(false);
  });
});

describe('one-to-many + money', () => {
  it('expands a WooCommerce order into order + line items + customer with minor-unit money', () => {
    const { records, report } = normalizeBatch(getMapper('woocommerce', 'orders')!, [wooOrderRaw], ctx({ source: 'woocommerce' }), {
      source: 'woocommerce',
      stream: 'orders',
    });
    expect(report.produced).toBe(4);
    expect(report.accepted).toBe(4);
    const order = records.find((r) => r.schema === 'commerce_order');
    expect(order?.amount).toBe(25990); // "259.90" MYR → minor units
    expect(order?.amount_unit).toBe('minor');
    const lineItems = records.filter((r) => r.schema === 'order_line_item');
    expect(lineItems).toHaveLength(2);
    expect((order?.attributes as { line_item_count: number }).line_item_count).toBe(2);
  });
});

describe('dedupe', () => {
  it('drops a repeated source object as a duplicate', () => {
    const { records, report } = normalizeBatch(
      getMapper('stripe', 'payments')!,
      [stripePaymentRaw, stripePaymentRaw],
      ctx(),
      { source: 'stripe', stream: 'payments' }
    );
    expect(report.produced).toBe(2);
    expect(report.accepted).toBe(1);
    expect(report.duplicates).toBe(1);
    expect(records).toHaveLength(1);
  });
});

describe('rejection paths (payload-free)', () => {
  const run = (raw: unknown, source = 'stripe', stream = 'payments') =>
    normalizeBatch(getMapper(source, stream)!, [raw], ctx({ source }), { source, stream });

  it('rejects a missing source id', () => {
    const { report } = run({ ...stripePaymentRaw, id: undefined });
    expect(report.accepted).toBe(0);
    expect(report.rejections[0].code).toBe('missing_source_id');
  });

  it('rejects an invalid timestamp', () => {
    const { report } = run({ ...stripePaymentRaw, created: 'not-a-date' });
    expect(report.rejections[0].code).toBe('invalid_timestamp');
  });

  it('rejects missing currency on a money-required schema', () => {
    const { report } = run({ ...wooOrderRaw, currency: undefined }, 'woocommerce', 'orders');
    expect(report.rejections.some((r) => r.path === 'currency')).toBe(true);
  });

  it('rejects an unsupported status without leaking the raw value', () => {
    const { report } = run({ ...stripePaymentRaw, status: 'SENSITIVE_STATUS' });
    expect(report.accepted).toBe(0);
    expect(report.rejections.some((r) => r.path?.includes('status'))).toBe(true);
    expect(JSON.stringify(report)).not.toContain('SENSITIVE_STATUS');
  });
});

describe('normalizeAsHandler — wired into the fetch runtime (CVS-142)', () => {
  it('normalizes each page of a mock run and dedupes across pages', async () => {
    const manifest = getConnector('stripe')!;
    const stream = manifest.streams.find((s) => s.name === 'payments')!;
    const p2 = { ...stripePaymentRaw, id: 'pi_def', created: 1751632200 };
    const { adapter } = createMockConnector('stripe', {
      payments: {
        pages: [
          { records: [stripePaymentRaw, p2], cursor: 'c1' },
          { records: [p2], cursor: 'c2' }, // p2 repeats → duplicate across pages
        ],
      },
    });

    const collected: CanonicalRecord[] = [];
    const handler = normalizeAsHandler(
      getMapper('stripe', 'payments')!,
      ctx(),
      { source: 'stripe', stream: 'payments' },
      (recs) => collected.push(...recs)
    );

    const report = await runStream(adapter, manifest, stream, {
      credentials: {},
      syncMode: 'incremental',
      cursorStore: new InMemoryCursorStore(),
      cursorKey: cursorKeyFor('acct_1', 'stripe', 'payments'),
      clock: createManualClock(),
      onRecords: handler,
    });

    expect(report.fetched).toBe(3); // 2 + 1 records seen
    expect(report.skipped).toBe(1); // the cross-page duplicate
    expect(report.error_class).toBeUndefined();
    expect(collected.map((r) => r.source_object_id).sort()).toEqual(['pi_abc', 'pi_def']);
  });
});
