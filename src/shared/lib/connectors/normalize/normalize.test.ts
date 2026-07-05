import { describe, it, expect } from 'vitest';
import type { CanonicalRecord } from '../canonical';
import {
  getMapper,
  mapGa4Event,
  mapGa4PageMetric,
  mapPosthogEvent,
  mapShopifyOrder,
  mapStripePayment,
  mapWooOrder,
  normalizeRecords,
  toRecordHandler,
  type NormalizationContext,
} from './index';

const ctx = (over: Partial<NormalizationContext> = {}): NormalizationContext => ({
  source: 'stripe',
  sourceAccountId: 'acct_1',
  workspaceId: 'ws_1',
  connectorVersion: 'stripe@1.0.0',
  observedAt: '2026-07-06T00:00:00Z',
  ...over,
});

const stripePI = {
  id: 'pi_1', amount: 12900, currency: 'myr', status: 'succeeded',
  created: 1751539800, customer: 'cus_1', payment_method_types: ['card'],
};

describe('mappers — happy paths validate into canonical records', () => {
  it('stripe payment', () => {
    const r = normalizeRecords([stripePI], mapStripePayment, ctx());
    expect(r.acceptedCount).toBe(1);
    expect(r.rejectedCount).toBe(0);
    expect(r.accepted[0].schema).toBe('payment');
    expect(r.accepted[0].amount).toBe(12900);
    expect(r.accepted[0].source).toBe('stripe');
    expect(r.accepted[0].lineage.normalizer_version).toBe('payment@1.0.0');
  });

  it('ga4 page metric + event', () => {
    const pm = normalizeRecords(
      [{ date: '20260701', pagePath: '/pricing', metric: 'screenPageViews', value: 1240, country: 'MY' }],
      mapGa4PageMetric, ctx({ source: 'ga4', connectorVersion: 'ga4@1.0.0' })
    );
    expect(pm.accepted[0].schema).toBe('page_metric');
    expect(pm.accepted[0].occurred_at).toBe('2026-07-01T00:00:00Z');

    const ev = normalizeRecords(
      [{ date: '20260701', eventName: 'sign_up', eventCount: 42 }],
      mapGa4Event, ctx({ source: 'ga4', connectorVersion: 'ga4@1.0.0' })
    );
    expect(ev.accepted[0].schema).toBe('analytics_event');
  });

  it('shopify order → order + line item', () => {
    const raw = {
      id: 'gid://shopify/Order/123', displayFinancialStatus: 'PAID', processedAt: '2026-07-03T09:00:00Z',
      totalPriceSet: { shopMoney: { amount: '89.90', currencyCode: 'MYR' } },
      customer: { id: 'gid://shopify/Customer/9' },
      lineItems: { nodes: [{ id: 'li_1', sku: 'S', title: 'Shirt', quantity: 2, originalTotalSet: { shopMoney: { amount: '89.90', currencyCode: 'MYR' } } }] },
    };
    const r = normalizeRecords([raw], mapShopifyOrder, ctx({ source: 'shopify', connectorVersion: 'shopify@1.0.0' }));
    expect(r.rejectedCount).toBe(0);
    expect(r.accepted.map((x) => x.schema)).toEqual(['commerce_order', 'order_line_item']);
    expect(r.accepted[0].amount).toBe(8990);
  });

  it('posthog event', () => {
    const raw = { uuid: 'evt_1', event: 'signed_up', distinct_id: 'user_9', timestamp: '2026-07-03T10:00:00Z', properties: { $session_id: 'sess_2', plan: 'pro' } };
    const r = normalizeRecords([raw], mapPosthogEvent, ctx({ source: 'posthog', connectorVersion: 'posthog@1.0.0' }));
    expect(r.accepted[0].schema).toBe('analytics_event');
    if (r.accepted[0].schema === 'analytics_event') expect(r.accepted[0].attributes.session_id).toBe('sess_2');
  });
});

describe('one-to-many: WooCommerce order → order + line items + customer', () => {
  const wooOrder = {
    id: 1001, status: 'completed', total: '259.90', currency: 'myr', date_created: '2026-07-03T08:59:00',
    customer_id: 5, billing: { email: 'a@b.com' },
    line_items: [
      { id: 11, product_id: 3, sku: 'X', name: 'T', quantity: 2, total: '179.80' },
      { id: 12, product_id: 4, sku: 'Y', name: 'U', quantity: 1, total: '80.10' },
    ],
  };

  it('emits 4 canonical records from 1 source object', () => {
    const r = normalizeRecords([wooOrder], mapWooOrder, ctx({ source: 'woocommerce', connectorVersion: 'woocommerce@1.0.0' }));
    expect(r.rejectedCount).toBe(0);
    expect(r.accepted.map((x) => x.schema)).toEqual(['commerce_order', 'order_line_item', 'order_line_item', 'customer']);
    const order = r.accepted[0];
    expect(order.amount).toBe(25990);
    if (order.schema === 'commerce_order') expect(order.attributes.line_item_count).toBe(2);
  });
});

describe('dedupe (warning path): in-batch duplicates are skipped, not rejected', () => {
  it('skips the second identical record', () => {
    const r = normalizeRecords([stripePI, { ...stripePI }], mapStripePayment, ctx());
    expect(r.acceptedCount).toBe(1);
    expect(r.skipped).toBe(1);
    expect(r.rejectedCount).toBe(0);
  });
});

describe('rejections (payload-free)', () => {
  it('missing currency on a money-required schema', () => {
    const r = normalizeRecords([{ id: 'pi_x', amount: 100, status: 'succeeded', created: 1751539800 }], mapStripePayment, ctx());
    expect(r.acceptedCount).toBe(0);
    expect(r.rejected[0].source_object_id).toBe('pi_x');
    expect(r.rejected[0].errors.length).toBeGreaterThan(0);
  });

  it('invalid timestamp', () => {
    const r = normalizeRecords([{ date: 'notadate', pagePath: '/x', metric: 'm', value: 1 }], mapGa4PageMetric, ctx({ source: 'ga4' }));
    expect(r.acceptedCount).toBe(0);
    expect(r.rejected[0].errors.some((e) => e.path === 'occurred_at')).toBe(true);
  });

  it('missing source id', () => {
    const r = normalizeRecords([{ event: 'x', timestamp: '2026-07-03T10:00:00Z' }], mapPosthogEvent, ctx({ source: 'posthog' }));
    expect(r.acceptedCount).toBe(0);
    expect(r.rejected[0].errors.some((e) => e.path === 'source_object_id')).toBe(true);
  });

  it('unsupported status', () => {
    const r = normalizeRecords([{ id: 'pi_z', amount: 100, currency: 'MYR', status: 'flurgle', created: 1751539800 }], mapStripePayment, ctx());
    expect(r.acceptedCount).toBe(0);
    expect(r.rejected[0].errors.some((e) => e.path.startsWith('attributes.status'))).toBe(true);
  });

  it('a throwing mapper is a rejection with a generic (payload-free) message', () => {
    const boom = () => { throw new Error('raw secret 4242424242424242'); };
    const r = normalizeRecords([{}], boom, ctx());
    expect(r.rejectedCount).toBe(1);
    expect(r.rejected[0].errors[0].code).toBe('mapper_error');
    expect(r.rejected[0].errors[0].message).not.toContain('4242');
  });
});

describe('toRecordHandler — plugs into the fetch runtime', () => {
  it('returns a PageOutcome and sends accepted records to the sink', async () => {
    const sink: CanonicalRecord[] = [];
    const handler = toRecordHandler(mapStripePayment, ctx(), (recs) => { sink.push(...recs); });
    const outcome = await handler([stripePI, { ...stripePI }, { id: 'pi_bad', amount: 1, status: 'succeeded', created: 1 }]);
    expect(outcome).toEqual({ accepted: 1, skipped: 1, rejected: 1 });
    expect(sink).toHaveLength(1);
    expect(sink[0].schema).toBe('payment');
  });
});

describe('getMapper', () => {
  it('resolves registered connector:stream keys', () => {
    expect(getMapper('stripe', 'payment_intents')).toBe(mapStripePayment);
    expect(getMapper('woocommerce', 'orders')).toBe(mapWooOrder);
    expect(getMapper('nope', 'nope')).toBeUndefined();
  });
});
