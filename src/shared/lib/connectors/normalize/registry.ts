// Mapper registry (CVS-143): resolve a source-specific normalizer for a connector
// stream. Keys are `${connectorId}:${streamName}`, aligned with the CVS-140 manifest
// stream names; connectors (CVS-146+) resolve their mapper via getMapper.
import { mapGa4Event, mapGa4PageMetric } from './mappers/ga4';
import { mapPosthogEvent } from './mappers/posthog';
import { mapShopifyOrder } from './mappers/shopify';
import { mapStripePayment } from './mappers/stripe';
import { mapWooOrder } from './mappers/woocommerce';
import type { Mapper } from './types';

export const MAPPERS: Record<string, Mapper> = {
  'stripe:payments': mapStripePayment, // stream name matches the CVS-140 Stripe manifest (CVS-320 fix)
  'ga4:page_metrics': mapGa4PageMetric, // stream name matches the CVS-140 GA4 manifest
  'ga4:events': mapGa4Event,
  'woocommerce:orders': mapWooOrder,
  'shopify:orders': mapShopifyOrder,
  'posthog:events': mapPosthogEvent,
};

export const MAPPER_KEYS = Object.keys(MAPPERS);

/** Resolve the mapper for a connector stream, or undefined if none is registered. */
export function getMapper(connectorId: string, streamName: string): Mapper | undefined {
  return MAPPERS[`${connectorId}:${streamName}`];
}
