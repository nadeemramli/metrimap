// Canonical record fixtures for the Tier-1 connector families (CVS-139).
//
// Each entry is a NORMALIZED canonical record (what a connector's normalizer emits,
// not the raw source JSON) plus a deliberately-broken variant. Used by the tests
// and reusable as golden inputs for the normalization runtime (CVS-143) later.
import type { CanonicalSchemaName } from './registry';
import type {
  AnalyticsEventRecord,
  CommerceOrderRecord,
  OrderLineItemRecord,
  PageMetricRecord,
  PaymentRecord,
} from './schemas';

export interface SourceFixture {
  source: string;
  schema: CanonicalSchemaName;
  /** A well-formed record that must validate. */
  valid: unknown;
  /** A malformed record that must be rejected, and why. */
  invalid: unknown;
  invalidReason: string;
}

const ga4PageMetric = {
  schema: 'page_metric',
  schema_version: '1.0.0',
  source: 'ga4',
  source_account_id: 'properties/123456',
  source_object_id: 'ga4:2026-07-01:/pricing:screenPageViews',
  workspace_id: 'ws_1',
  observed_at: '2026-07-02T00:00:00Z',
  occurred_at: '2026-07-01T00:00:00Z',
  attributes: {
    page_path: '/pricing',
    metric: 'screenPageViews',
    value: 1240,
    dimensions: { country: 'MY' },
  },
  lineage: { connector_version: 'ga4@1.0.0', normalizer_version: 'page_metric@1.0.0' },
} satisfies PageMetricRecord;

const stripePayment = {
  schema: 'payment',
  schema_version: '1.0.0',
  source: 'stripe',
  source_account_id: 'acct_123',
  source_object_id: 'pi_abc',
  workspace_id: 'ws_1',
  observed_at: '2026-07-03T12:31:00Z',
  occurred_at: '2026-07-03T12:30:00+08:00',
  currency: 'MYR',
  amount: 12900,
  amount_unit: 'minor',
  attributes: { status: 'succeeded', customer_source_id: 'cus_1', payment_method: 'card' },
  lineage: { connector_version: 'stripe@1.0.0', normalizer_version: 'payment@1.0.0' },
} satisfies PaymentRecord;

const wooOrder = {
  schema: 'commerce_order',
  schema_version: '1.0.0',
  source: 'woocommerce',
  source_account_id: 'store_1',
  source_object_id: 'order_1001',
  workspace_id: 'ws_1',
  observed_at: '2026-07-03T09:00:00Z',
  occurred_at: '2026-07-03T08:59:00Z',
  currency: 'MYR',
  amount: 25990,
  amount_unit: 'minor',
  attributes: { status: 'completed', customer_source_id: 'cust_5', line_item_count: 3 },
  lineage: { connector_version: 'woocommerce@1.0.0', normalizer_version: 'commerce_order@1.0.0' },
} satisfies CommerceOrderRecord;

const shopifyLineItem = {
  schema: 'order_line_item',
  schema_version: '1.0.0',
  source: 'shopify',
  source_account_id: 'shop_1',
  source_object_id: 'li_9',
  workspace_id: 'ws_1',
  observed_at: '2026-07-03T09:00:00Z',
  occurred_at: '2026-07-03T08:59:00Z',
  currency: 'MYR',
  amount: 8990,
  amount_unit: 'minor',
  attributes: {
    order_source_id: 'order_77',
    product_source_id: 'prod_3',
    sku: 'TSHIRT-M',
    title: 'T-Shirt',
    quantity: 2,
    unit_amount: 4495,
  },
  lineage: { connector_version: 'shopify@1.0.0', normalizer_version: 'order_line_item@1.0.0' },
} satisfies OrderLineItemRecord;

const posthogEvent = {
  schema: 'analytics_event',
  schema_version: '1.0.0',
  source: 'posthog',
  source_account_id: 'proj_1',
  source_object_id: 'evt_555',
  workspace_id: 'ws_1',
  observed_at: '2026-07-03T10:00:00Z',
  occurred_at: '2026-07-03T09:59:00Z',
  attributes: {
    event_name: 'signed_up',
    user_source_id: 'user_9',
    session_id: 'sess_2',
    count: 1,
    properties: { plan: 'pro' },
  },
  lineage: { connector_version: 'posthog@1.0.0', normalizer_version: 'analytics_event@1.0.0' },
} satisfies AnalyticsEventRecord;

export const SOURCE_FIXTURES: SourceFixture[] = [
  {
    source: 'ga4',
    schema: 'page_metric',
    valid: ga4PageMetric,
    invalid: { ...ga4PageMetric, attributes: { page_path: '/pricing', metric: 'screenPageViews' } },
    invalidReason: 'page_metric.attributes.value is required',
  },
  {
    source: 'stripe',
    schema: 'payment',
    valid: stripePayment,
    invalid: { ...stripePayment, amount: 129.5 },
    invalidReason: 'amount must be an integer when amount_unit is "minor"',
  },
  {
    source: 'woocommerce',
    schema: 'commerce_order',
    valid: wooOrder,
    invalid: Object.fromEntries(Object.entries(wooOrder).filter(([k]) => k !== 'amount')),
    invalidReason: 'commerce_order requires amount (money required)',
  },
  {
    source: 'shopify',
    schema: 'order_line_item',
    valid: shopifyLineItem,
    invalid: { ...shopifyLineItem, attributes: { ...shopifyLineItem.attributes, quantity: 0 } },
    invalidReason: 'order_line_item.attributes.quantity must be positive',
  },
  {
    source: 'posthog',
    schema: 'analytics_event',
    valid: posthogEvent,
    invalid: { ...posthogEvent, attributes: { user_source_id: 'user_9' } },
    invalidReason: 'analytics_event.attributes.event_name is required',
  },
];
