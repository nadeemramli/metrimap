// MVP canonical schema definitions (CVS-139).
//
// 13 schemas across three families prove the contract for the Tier-1 connectors
// (GA4, Stripe, WooCommerce, Shopify, PostHog). Each is the shared envelope
// extended with a `schema` literal and a typed `attributes` object; money-bearing
// schemas re-require currency/amount/amount_unit. Later schemas (marketing, sales,
// balance_transaction, …) are registered as names in `registry.ts` and defined
// when their connectors land. See docs/data/canonical-schemas.md.
import { z } from 'zod';
import { canonical, canonicalEnvelope, moneyRequired } from './envelope';

// --- Payments & finance ---------------------------------------------------

export const PaymentStatus = z.enum([
  'succeeded',
  'pending',
  'failed',
  'refunded',
  'partially_refunded',
  'canceled',
]);

export const paymentSchema = canonicalEnvelope.extend({
  schema: z.literal('payment'),
  ...moneyRequired,
  attributes: z.object({
    status: PaymentStatus,
    customer_source_id: z.string().optional(),
    payment_method: z.string().optional(),
    description: z.string().optional(),
  }),
});
export type PaymentRecord = z.infer<typeof paymentSchema>;

export const RefundStatus = z.enum(['succeeded', 'pending', 'failed', 'canceled']);

export const refundSchema = canonicalEnvelope.extend({
  schema: z.literal('refund'),
  ...moneyRequired,
  attributes: z.object({
    status: RefundStatus,
    payment_source_id: z.string().optional(),
    reason: z.string().optional(),
  }),
});
export type RefundRecord = z.infer<typeof refundSchema>;

export const PayoutStatus = z.enum(['paid', 'pending', 'in_transit', 'failed', 'canceled']);

export const payoutSchema = canonicalEnvelope.extend({
  schema: z.literal('payout'),
  ...moneyRequired,
  attributes: z.object({
    status: PayoutStatus,
    arrival_date: z.string().datetime({ offset: true }).optional(),
    method: z.string().optional(),
  }),
});
export type PayoutRecord = z.infer<typeof payoutSchema>;

export const SubscriptionStatus = z.enum([
  'active',
  'trialing',
  'past_due',
  'canceled',
  'unpaid',
  'paused',
  'incomplete',
]);
export const BillingInterval = z.enum(['day', 'week', 'month', 'year']);

export const subscriptionSchema = canonicalEnvelope.extend({
  schema: z.literal('subscription'),
  attributes: z.object({
    status: SubscriptionStatus,
    customer_source_id: z.string().optional(),
    plan: z.string().optional(),
    interval: BillingInterval.optional(),
    quantity: z.number().int().nonnegative().optional(),
    current_period_start: z.string().datetime({ offset: true }).optional(),
    current_period_end: z.string().datetime({ offset: true }).optional(),
  }),
});
export type SubscriptionRecord = z.infer<typeof subscriptionSchema>;

export const InvoiceStatus = z.enum(['draft', 'open', 'paid', 'void', 'uncollectible']);

export const invoiceSchema = canonicalEnvelope.extend({
  schema: z.literal('invoice'),
  ...moneyRequired,
  attributes: z.object({
    status: InvoiceStatus,
    customer_source_id: z.string().optional(),
    number: z.string().optional(),
    due_at: z.string().datetime({ offset: true }).optional(),
    paid_at: z.string().datetime({ offset: true }).optional(),
  }),
});
export type InvoiceRecord = z.infer<typeof invoiceSchema>;

// --- Commerce -------------------------------------------------------------

export const OrderStatus = z.enum([
  'pending',
  'paid',
  'fulfilled',
  'shipped',
  'delivered',
  'completed',
  'canceled',
  'refunded',
]);

export const commerceOrderSchema = canonicalEnvelope.extend({
  schema: z.literal('commerce_order'),
  ...moneyRequired,
  attributes: z.object({
    status: OrderStatus,
    customer_source_id: z.string().optional(),
    line_item_count: z.number().int().nonnegative().optional(),
    financial_status: z.string().optional(),
    fulfillment_status: z.string().optional(),
  }),
});
export type CommerceOrderRecord = z.infer<typeof commerceOrderSchema>;

export const orderLineItemSchema = canonicalEnvelope.extend({
  schema: z.literal('order_line_item'),
  attributes: z.object({
    order_source_id: z.string().min(1),
    product_source_id: z.string().optional(),
    sku: z.string().optional(),
    title: z.string().optional(),
    quantity: z.number().int().positive(),
    unit_amount: z.number().finite().optional(),
  }),
});
export type OrderLineItemRecord = z.infer<typeof orderLineItemSchema>;

export const ProductStatus = z.enum(['active', 'archived', 'draft']);

export const productSchema = canonicalEnvelope.extend({
  schema: z.literal('product'),
  attributes: z.object({
    title: z.string().min(1),
    sku: z.string().optional(),
    status: ProductStatus.optional(),
    vendor: z.string().optional(),
    product_type: z.string().optional(),
  }),
});
export type ProductRecord = z.infer<typeof productSchema>;

export const customerSchema = canonicalEnvelope.extend({
  schema: z.literal('customer'),
  attributes: z.object({
    email: z.string().email().optional(),
    name: z.string().optional(),
    country: z.string().optional(),
    orders_count: z.number().int().nonnegative().optional(),
    created_source_at: z.string().datetime({ offset: true }).optional(),
  }),
});
export type CustomerRecord = z.infer<typeof customerSchema>;

// --- Analytics & product usage (no money) ---------------------------------

export const analyticsEventSchema = canonicalEnvelope.extend({
  schema: z.literal('analytics_event'),
  attributes: z.object({
    event_name: z.string().min(1),
    user_source_id: z.string().optional(),
    session_id: z.string().optional(),
    count: z.number().int().nonnegative().default(1),
    properties: z.record(z.unknown()).optional(),
  }),
});
export type AnalyticsEventRecord = z.infer<typeof analyticsEventSchema>;

export const pageMetricSchema = canonicalEnvelope.extend({
  schema: z.literal('page_metric'),
  attributes: z.object({
    page_path: z.string().min(1),
    metric: z.string().min(1),
    value: z.number().finite(),
    dimensions: z.record(z.unknown()).optional(),
  }),
});
export type PageMetricRecord = z.infer<typeof pageMetricSchema>;

export const funnelStepSchema = canonicalEnvelope.extend({
  schema: z.literal('funnel_step'),
  attributes: z.object({
    funnel: z.string().min(1),
    step_name: z.string().min(1),
    step_index: z.number().int().nonnegative(),
    users: z.number().int().nonnegative(),
    conversion_rate: z.number().min(0).max(1).optional(),
  }),
});
export type FunnelStepRecord = z.infer<typeof funnelStepSchema>;

export const cohortSchema = canonicalEnvelope.extend({
  schema: z.literal('cohort'),
  attributes: z.object({
    cohort_key: z.string().min(1),
    cohort_date: z.string().datetime({ offset: true }).optional(),
    size: z.number().int().nonnegative(),
    metric: z.string().optional(),
    value: z.number().finite().optional(),
  }),
});
export type CohortRecord = z.infer<typeof cohortSchema>;

// --- Registered definitions (name → def + metadata) -----------------------

/** Union of every MVP canonical record type — the validated output of `validateRecord`. */
export type AnyCanonicalRecord =
  | PaymentRecord
  | RefundRecord
  | PayoutRecord
  | SubscriptionRecord
  | InvoiceRecord
  | CommerceOrderRecord
  | OrderLineItemRecord
  | ProductRecord
  | CustomerRecord
  | AnalyticsEventRecord
  | PageMetricRecord
  | FunnelStepRecord
  | CohortRecord;

export const MVP_SCHEMA_DEFS = [
  canonical('payment', 'payments', paymentSchema, { money: 'required' }),
  canonical('refund', 'payments', refundSchema, { money: 'required' }),
  canonical('payout', 'payments', payoutSchema, { money: 'required' }),
  canonical('subscription', 'payments', subscriptionSchema, { money: 'optional' }),
  canonical('invoice', 'payments', invoiceSchema, { money: 'required' }),
  canonical('commerce_order', 'commerce', commerceOrderSchema, { money: 'required' }),
  canonical('order_line_item', 'commerce', orderLineItemSchema, { money: 'optional' }),
  canonical('product', 'commerce', productSchema, { money: 'optional' }),
  canonical('customer', 'commerce', customerSchema, { money: 'none' }),
  canonical('analytics_event', 'analytics', analyticsEventSchema, { money: 'none' }),
  canonical('page_metric', 'analytics', pageMetricSchema, { money: 'none' }),
  canonical('funnel_step', 'analytics', funnelStepSchema, { money: 'none' }),
  canonical('cohort', 'analytics', cohortSchema, { money: 'none' }),
] as const;
