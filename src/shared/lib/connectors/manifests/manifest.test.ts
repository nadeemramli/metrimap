import { describe, it, expect } from 'vitest';
import {
  CONNECTOR_MANIFESTS,
  connectorsForSchema,
  getConnector,
  listConnectors,
  listStreams,
  publicCatalog,
  streamsForSchema,
  toPublicManifest,
  validateManifest,
  type ConnectorManifest,
} from './index';
import { KNOWN_CANONICAL_NAMES } from './manifest';

const stripe = getConnector('stripe') as ConnectorManifest;

describe('connector registry', () => {
  it('registers the seven MVP + placeholder connectors with unique ids', () => {
    const ids = CONNECTOR_MANIFESTS.map((m) => m.id);
    expect(ids).toEqual(['ga4', 'stripe', 'woocommerce', 'shopify', 'posthog', 'csv_manual', 'airbyte']);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every declared manifest validates', () => {
    for (const m of CONNECTOR_MANIFESTS) {
      const res = validateManifest(m);
      expect(res.ok, `${m.id}: ${res.ok ? '' : JSON.stringify(res.errors)}`).toBe(true);
    }
  });

  it('every stream targets a known canonical schema', () => {
    for (const m of CONNECTOR_MANIFESTS) {
      for (const s of m.streams) {
        expect(KNOWN_CANONICAL_NAMES).toContain(s.canonical_schema);
      }
    }
  });

  it('no connector stores raw payloads (locked decision CVS-137 §3)', () => {
    for (const m of CONNECTOR_MANIFESTS) expect(m.stores_raw_payloads).toBe(false);
  });
});

describe('filtering', () => {
  it('getConnector returns a manifest by id, undefined otherwise', () => {
    expect(getConnector('stripe')?.display_name).toBe('Stripe');
    expect(getConnector('nope')).toBeUndefined();
  });

  it('lists connectors by category', () => {
    const commerce = listConnectors({ category: 'commerce' }).map((m) => m.id);
    expect(commerce).toEqual(['woocommerce', 'shopify']);
  });

  it('lists connectors by status', () => {
    expect(listConnectors({ status: 'placeholder' }).map((m) => m.id)).toEqual(['airbyte']);
  });

  it('finds connectors that can populate a canonical schema', () => {
    expect(connectorsForSchema('payment').map((m) => m.id).sort()).toEqual(['csv_manual', 'stripe']);
    // analytics_event is served by both GA4 and PostHog
    expect(connectorsForSchema('analytics_event').map((m) => m.id).sort()).toEqual(['csv_manual', 'ga4', 'posthog']);
  });
});

describe('stream catalog', () => {
  it('flattens streams and tags each with its connector + schema family', () => {
    const all = listStreams();
    const total = CONNECTOR_MANIFESTS.reduce((n, m) => n + m.streams.length, 0);
    expect(all).toHaveLength(total);
    const payments = all.find((s) => s.canonical_schema === 'payment');
    expect(payments?.family).toBe('payments');
  });

  it('streamsForSchema returns only matching streams', () => {
    const streams = streamsForSchema('commerce_order');
    expect(streams.length).toBeGreaterThan(0);
    expect(streams.every((s) => s.canonical_schema === 'commerce_order')).toBe(true);
    expect(streams.map((s) => s.connector_id).sort()).toEqual(['csv_manual', 'shopify', 'woocommerce']);
  });
});

describe('public projection', () => {
  it('drops runtime-internal fields and stays JSON-serializable', () => {
    const pub = toPublicManifest(stripe);
    expect(pub).not.toHaveProperty('normalizer_version');
    expect(pub).not.toHaveProperty('rate_limit');
    // streams lose the cursor field but keep binding metadata
    for (const s of pub.streams) expect(s).not.toHaveProperty('cursor_field');
    expect(() => JSON.stringify(pub)).not.toThrow();
    expect(pub.streams.find((s) => s.name === 'payments')?.family).toBe('payments');
  });

  it('publicCatalog projects every connector', () => {
    expect(publicCatalog()).toHaveLength(CONNECTOR_MANIFESTS.length);
  });
});

describe('validateManifest — rejects malformed manifests', () => {
  const base = (): ConnectorManifest => structuredClone(stripe);

  it('rejects an unknown canonical schema', () => {
    const m = base();
    m.streams[0].canonical_schema = 'not_a_schema';
    const res = validateManifest(m);
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.errors[0].code).toBe('unknown_canonical_schema');
  });

  it('rejects duplicate stream names', () => {
    const m = base();
    m.streams[1].name = m.streams[0].name;
    const res = validateManifest(m);
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.errors.some((e) => e.code === 'duplicate_stream_name')).toBe(true);
  });

  it('rejects a default history mode that is not supported', () => {
    const m = base();
    m.history_modes = ['live_query'];
    m.default_history_mode = 'metric_materialization';
    const res = validateManifest(m);
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.errors.some((e) => e.code === 'default_mode_unsupported')).toBe(true);
  });

  it('rejects storing raw payloads under a no_raw_payload policy', () => {
    const m = base();
    m.storage_policy = 'no_raw_payload';
    m.stores_raw_payloads = true;
    const res = validateManifest(m);
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.errors.some((e) => e.code === 'raw_payload_conflict')).toBe(true);
  });

  it('rejects an MVP connector with no streams', () => {
    const m = base();
    m.streams = [];
    const res = validateManifest(m);
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.errors.some((e) => e.code === 'mvp_without_streams')).toBe(true);
  });

  it('rejects a malformed id via the Zod shape', () => {
    const m = base();
    (m as { id: string }).id = 'Bad Id';
    const res = validateManifest(m);
    expect(res.ok).toBe(false);
  });
});
