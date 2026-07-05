// Normalizer registry (CVS-143).
//
// Maps (connectorId, streamName) → the source-specific mapper, so the runtime can resolve
// the right normalizer for a connector run without hard-coding per-source branches. Each
// mapper module lives under ./mappers and emits the shared canonical contracts.
import type { ConnectorMappers, SourceMapper } from './types';
import { STRIPE_MAPPERS } from './mappers/stripe';
import { GA4_MAPPERS } from './mappers/ga4';
import { WOOCOMMERCE_MAPPERS } from './mappers/woocommerce';
import { SHOPIFY_MAPPERS } from './mappers/shopify';
import { POSTHOG_MAPPERS } from './mappers/posthog';

/** connectorId → { streamName → mapper }. Mirrors the manifest ids from CVS-140. */
export const NORMALIZER_REGISTRY: Record<string, ConnectorMappers> = {
  stripe: STRIPE_MAPPERS,
  ga4: GA4_MAPPERS,
  woocommerce: WOOCOMMERCE_MAPPERS,
  shopify: SHOPIFY_MAPPERS,
  posthog: POSTHOG_MAPPERS,
};

/** Resolve the mapper for a connector stream, or undefined if none is registered. */
export function getMapper(connectorId: string, stream: string): SourceMapper | undefined {
  return NORMALIZER_REGISTRY[connectorId]?.[stream];
}

/** Whether a connector stream has a normalizer. */
export function hasMapper(connectorId: string, stream: string): boolean {
  return Boolean(getMapper(connectorId, stream));
}
