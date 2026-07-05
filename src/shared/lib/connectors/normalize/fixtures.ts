// Raw source fixtures for the normalization runtime (CVS-143).
//
// These are RAW third-party shapes (what a connector adapter yields), the input side of the
// mappers — distinct from the canonical fixtures in ../canonical/fixtures.ts (the output).
// Reused by the tests and by the connector QA suite (CVS-154).

/** Stripe PaymentIntent-like object (amounts already in minor units, epoch-second created). */
export const stripePaymentRaw = {
  id: 'pi_abc',
  created: 1751545800,
  currency: 'myr',
  amount: 12900,
  status: 'succeeded',
  customer: 'cus_1',
  payment_method_type: 'card',
};

/** GA4 page report row (flattened by the connector). */
export const ga4PageRaw = {
  date: '2026-07-01',
  pagePath: '/pricing',
  metric: 'screenPageViews',
  value: 1240,
  dimensions: { country: 'MY' },
};

/** GA4 event report row. */
export const ga4EventRaw = {
  date: '2026-07-01',
  eventName: 'signed_up',
  eventCount: 42,
  dimensions: { country: 'MY' },
};

/** WooCommerce order with two line items and customer detail (major-unit money strings). */
export const wooOrderRaw = {
  id: 1001,
  date_created_gmt: '2026-07-03T08:59:00',
  currency: 'MYR',
  total: '259.90',
  status: 'completed',
  customer_id: 5,
  billing_email: 'buyer@example.com',
  customer_name: 'Buyer One',
  line_items: [
    { id: 11, product_id: 3, sku: 'TSHIRT-M', name: 'T-Shirt', quantity: 2, total: '89.90' },
    { id: 12, product_id: 4, sku: 'MUG', name: 'Mug', quantity: 1, total: '170.00' },
  ],
};

/** Shopify order (adapter-flattened GraphQL node). */
export const shopifyOrderRaw = {
  id: 'gid://shopify/Order/77',
  created_at: '2026-07-03T08:59:00Z',
  currency: 'MYR',
  total_amount: '89.90',
  status: 'paid',
  customer_id: 'gid://shopify/Customer/9',
  line_items: [{ id: 'li_9', product_id: 'prod_3', sku: 'TSHIRT-M', title: 'T-Shirt', quantity: 2, unit_amount: '44.95' }],
};

/** PostHog event. */
export const posthogEventRaw = {
  uuid: 'evt_555',
  event: 'signed_up',
  timestamp: '2026-07-03T09:59:00Z',
  distinct_id: 'user_9',
  properties: { $session_id: 'sess_2', plan: 'pro' },
};
