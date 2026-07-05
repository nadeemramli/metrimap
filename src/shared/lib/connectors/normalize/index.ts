// Normalization runtime (CVS-143): source JSON → validated canonical records (CVS-139),
// pluggable into the fetch runtime (CVS-142) via toRecordHandler. Import from here.
// See docs/data/connector-normalization.md.
export * from './types';
export * from './dates';
export * from './normalizeStream';
export * from './registry';
export { mapStripePayment } from './mappers/stripe';
export { mapGa4PageMetric, mapGa4Event } from './mappers/ga4';
export { mapWooOrder } from './mappers/woocommerce';
export { mapShopifyOrder } from './mappers/shopify';
export { mapPosthogEvent } from './mappers/posthog';
