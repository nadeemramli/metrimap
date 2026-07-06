// MVP connector manifests (CVS-140).
//
// The Tier-1 native connectors from the locked sequence (GA4 → Stripe → WooCommerce
// → Shopify → PostHog), plus the Tier-0 CSV/manual adapter and an Airbyte research
// placeholder (locked decision CVS-137 §6). Each stream names the CVS-139 canonical
// schema its records normalize into. Per the decision, no raw payloads are stored:
// every connector is `metric_materialization` with `stores_raw_payloads: false`.
// These are data only — fetching/OAuth land in CVS-141/142/146–150.
import type { ConnectorManifest } from './manifest';

const NORMALIZER_V1 = '1.0.0';

/** GA4 — analytics pull via the Data API (CVS-146). */
export const ga4Manifest: ConnectorManifest = {
  id: 'ga4',
  display_name: 'Google Analytics 4',
  category: 'analytics',
  status: 'mvp',
  auth: {
    type: 'oauth2',
    recommended_scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  },
  history_modes: ['live_query', 'metric_materialization'],
  default_history_mode: 'metric_materialization',
  storage_policy: 'metric_materialization',
  stores_raw_payloads: false,
  normalizer_version: NORMALIZER_V1,
  rate_limit: { strategy: 'token_bucket', requests_per_minute: 600, notes: 'GA4 Data API token/property quotas' },
  streams: [
    {
      name: 'events',
      display_name: 'Events',
      canonical_schema: 'analytics_event',
      cursor_field: 'date',
      supported_sync_modes: ['full_refresh', 'incremental'],
      default_dimensions: ['date', 'eventName'],
      default_metrics: ['eventCount'],
      freshness: 'P1D',
    },
    {
      name: 'page_metrics',
      display_name: 'Page metrics',
      canonical_schema: 'page_metric',
      cursor_field: 'date',
      supported_sync_modes: ['full_refresh', 'incremental'],
      default_dimensions: ['date', 'pagePath'],
      default_metrics: ['screenPageViews', 'sessions'],
      freshness: 'P1D',
    },
    {
      name: 'funnels',
      display_name: 'Funnels',
      canonical_schema: 'funnel_step',
      cursor_field: 'date',
      supported_sync_modes: ['full_refresh'],
      freshness: 'P1D',
    },
  ],
};

/** Stripe — payments/finance family (CVS-147). */
export const stripeManifest: ConnectorManifest = {
  id: 'stripe',
  display_name: 'Stripe',
  category: 'payments',
  status: 'mvp',
  auth: { type: 'api_key', recommended_scopes: ['rak_read_only'] },
  history_modes: ['live_query', 'metric_materialization'],
  default_history_mode: 'metric_materialization',
  storage_policy: 'metric_materialization',
  stores_raw_payloads: false,
  normalizer_version: NORMALIZER_V1,
  rate_limit: { strategy: 'token_bucket', requests_per_minute: 6000, notes: 'Stripe ~100 read req/s live' },
  streams: [
    { name: 'payments', display_name: 'Payments', canonical_schema: 'payment', cursor_field: 'created', supported_sync_modes: ['full_refresh', 'incremental'], default_metrics: ['gross_volume'], freshness: 'PT1H' },
    { name: 'refunds', display_name: 'Refunds', canonical_schema: 'refund', cursor_field: 'created', supported_sync_modes: ['full_refresh', 'incremental'], freshness: 'PT1H' },
    { name: 'payouts', display_name: 'Payouts', canonical_schema: 'payout', cursor_field: 'created', supported_sync_modes: ['full_refresh', 'incremental'], freshness: 'PT6H' },
    { name: 'subscriptions', display_name: 'Subscriptions', canonical_schema: 'subscription', cursor_field: 'created', supported_sync_modes: ['full_refresh', 'incremental'], default_metrics: ['mrr', 'active_subscriptions'], freshness: 'PT1H' },
    { name: 'invoices', display_name: 'Invoices', canonical_schema: 'invoice', cursor_field: 'created', supported_sync_modes: ['full_refresh', 'incremental'], freshness: 'PT1H' },
    { name: 'customers', display_name: 'Customers', canonical_schema: 'customer', cursor_field: 'created', supported_sync_modes: ['full_refresh', 'incremental'], default_metrics: ['new_customers'], freshness: 'PT1H' },
  ],
};

/** WooCommerce — commerce via the REST API, basic auth with consumer key/secret (CVS-148). */
export const wooCommerceManifest: ConnectorManifest = {
  id: 'woocommerce',
  display_name: 'WooCommerce',
  category: 'commerce',
  status: 'mvp',
  auth: { type: 'basic_auth', recommended_scopes: ['read'] },
  history_modes: ['live_query', 'metric_materialization'],
  default_history_mode: 'metric_materialization',
  storage_policy: 'metric_materialization',
  stores_raw_payloads: false,
  normalizer_version: NORMALIZER_V1,
  rate_limit: { strategy: 'concurrency', max_concurrency: 4, notes: 'Self-hosted store capacity varies' },
  streams: [
    { name: 'orders', display_name: 'Orders', canonical_schema: 'commerce_order', cursor_field: 'date_modified_gmt', supported_sync_modes: ['full_refresh', 'incremental'], default_metrics: ['revenue', 'order_count'], freshness: 'PT1H' },
    { name: 'order_line_items', display_name: 'Order line items', canonical_schema: 'order_line_item', supported_sync_modes: ['full_refresh'], freshness: 'PT1H' },
    { name: 'products', display_name: 'Products', canonical_schema: 'product', cursor_field: 'date_modified_gmt', supported_sync_modes: ['full_refresh', 'incremental'], freshness: 'P1D' },
    { name: 'customers', display_name: 'Customers', canonical_schema: 'customer', cursor_field: 'date_modified_gmt', supported_sync_modes: ['full_refresh', 'incremental'], default_metrics: ['new_customers'], freshness: 'P1D' },
    { name: 'refunds', display_name: 'Refunds', canonical_schema: 'refund', cursor_field: 'date_created_gmt', supported_sync_modes: ['full_refresh', 'incremental'], freshness: 'PT1H' },
  ],
};

/** Shopify — commerce via the GraphQL Admin API (CVS-149). */
export const shopifyManifest: ConnectorManifest = {
  id: 'shopify',
  display_name: 'Shopify',
  category: 'commerce',
  status: 'mvp',
  auth: { type: 'oauth2', recommended_scopes: ['read_orders', 'read_products', 'read_customers'] },
  history_modes: ['live_query', 'metric_materialization'],
  default_history_mode: 'metric_materialization',
  storage_policy: 'metric_materialization',
  stores_raw_payloads: false,
  normalizer_version: NORMALIZER_V1,
  rate_limit: { strategy: 'token_bucket', notes: 'Shopify GraphQL calculated query cost / leaky bucket' },
  streams: [
    { name: 'orders', display_name: 'Orders', canonical_schema: 'commerce_order', cursor_field: 'updatedAt', supported_sync_modes: ['full_refresh', 'incremental'], default_metrics: ['revenue', 'order_count'], freshness: 'PT1H' },
    { name: 'order_line_items', display_name: 'Order line items', canonical_schema: 'order_line_item', supported_sync_modes: ['full_refresh'], freshness: 'PT1H' },
    { name: 'products', display_name: 'Products', canonical_schema: 'product', cursor_field: 'updatedAt', supported_sync_modes: ['full_refresh', 'incremental'], freshness: 'P1D' },
    { name: 'customers', display_name: 'Customers', canonical_schema: 'customer', cursor_field: 'updatedAt', supported_sync_modes: ['full_refresh', 'incremental'], default_metrics: ['new_customers'], freshness: 'P1D' },
  ],
};

/** PostHog — product analytics (CVS-150). */
export const posthogManifest: ConnectorManifest = {
  id: 'posthog',
  display_name: 'PostHog',
  category: 'product_analytics',
  status: 'mvp',
  auth: { type: 'api_key', recommended_scopes: ['read'] },
  history_modes: ['live_query', 'metric_materialization'],
  default_history_mode: 'metric_materialization',
  storage_policy: 'metric_materialization',
  stores_raw_payloads: false,
  normalizer_version: NORMALIZER_V1,
  rate_limit: { strategy: 'fixed_window', requests_per_minute: 120, notes: 'PostHog personal API key limits' },
  streams: [
    { name: 'events', display_name: 'Events', canonical_schema: 'analytics_event', cursor_field: 'timestamp', supported_sync_modes: ['full_refresh', 'incremental'], default_metrics: ['event_count'], freshness: 'PT1H' },
    { name: 'funnels', display_name: 'Funnels', canonical_schema: 'funnel_step', supported_sync_modes: ['full_refresh'], freshness: 'P1D' },
    { name: 'cohorts', display_name: 'Cohorts', canonical_schema: 'cohort', supported_sync_modes: ['full_refresh'], freshness: 'P1D' },
    { name: 'persons', display_name: 'Persons', canonical_schema: 'customer', cursor_field: 'created_at', supported_sync_modes: ['full_refresh', 'incremental'], freshness: 'P1D' },
  ],
};

/** CSV / Sheets / manual paste — Tier-0 schema-agnostic import (CVS-151). */
export const csvManualManifest: ConnectorManifest = {
  id: 'csv_manual',
  display_name: 'CSV / manual import',
  category: 'manual',
  status: 'mvp',
  auth: { type: 'manual_upload' },
  history_modes: ['metric_materialization'],
  default_history_mode: 'metric_materialization',
  storage_policy: 'metric_materialization',
  stores_raw_payloads: false,
  normalizer_version: NORMALIZER_V1,
  rate_limit: { strategy: 'none' },
  streams: [
    { name: 'orders', display_name: 'Orders', canonical_schema: 'commerce_order', supported_sync_modes: ['full_refresh'] },
    { name: 'payments', display_name: 'Payments', canonical_schema: 'payment', supported_sync_modes: ['full_refresh'] },
    { name: 'events', display_name: 'Events', canonical_schema: 'analytics_event', supported_sync_modes: ['full_refresh'] },
    { name: 'page_metrics', display_name: 'Metrics', canonical_schema: 'page_metric', supported_sync_modes: ['full_refresh'] },
  ],
};

/** Airbyte — long-tail research adapter, not yet implemented (CVS-152 spike). */
export const airbytePlaceholderManifest: ConnectorManifest = {
  id: 'airbyte',
  display_name: 'Airbyte (research)',
  category: 'research',
  status: 'placeholder',
  auth: { type: 'none' },
  history_modes: ['metric_materialization'],
  default_history_mode: 'metric_materialization',
  storage_policy: 'no_raw_payload',
  stores_raw_payloads: false,
  normalizer_version: '0.0.0',
  rate_limit: { strategy: 'none' },
  streams: [],
};

/** Every manifest the registry serves, in the locked Tier order (CVS-137 §6). */
export const ALL_MANIFESTS: readonly ConnectorManifest[] = [
  ga4Manifest,
  stripeManifest,
  wooCommerceManifest,
  shopifyManifest,
  posthogManifest,
  csvManualManifest,
  airbytePlaceholderManifest,
];
