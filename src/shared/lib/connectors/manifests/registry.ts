// Connector manifest registry + stream catalog (CVS-140).
//
// One place that knows every connector manifest, lets callers filter connectors and
// streams by category or canonical schema, and projects a secret-free shape for the
// Settings/Connected-accounts UI. Repo manifests are the source of truth; the DB is a
// read projection (locked decision CVS-137 §2). Runtime fetch/OAuth is CVS-141/142.
import { getSchemaDef } from '../canonical';
import { ALL_MANIFESTS } from './definitions';
import type {
  ConnectorCategory,
  ConnectorManifest,
  ConnectorStatus,
  StreamManifest,
} from './manifest';

/** All connector manifests, keyed by id. */
export const CONNECTOR_MANIFESTS: readonly ConnectorManifest[] = ALL_MANIFESTS;

const BY_ID = new Map(CONNECTOR_MANIFESTS.map((m) => [m.id, m]));

export interface ConnectorFilter {
  category?: ConnectorCategory;
  status?: ConnectorStatus;
  /** Only connectors that expose a stream targeting this canonical schema. */
  canonicalSchema?: string;
}

/** Look up a connector manifest by id. */
export function getConnector(id: string): ConnectorManifest | undefined {
  return BY_ID.get(id);
}

function matches(m: ConnectorManifest, f: ConnectorFilter): boolean {
  if (f.category && m.category !== f.category) return false;
  if (f.status && m.status !== f.status) return false;
  if (f.canonicalSchema && !m.streams.some((s) => s.canonical_schema === f.canonicalSchema)) return false;
  return true;
}

/** List connectors, optionally filtered by category, status, or canonical schema. */
export function listConnectors(filter: ConnectorFilter = {}): ConnectorManifest[] {
  return CONNECTOR_MANIFESTS.filter((m) => matches(m, filter));
}

/** A stream flattened out of its connector — the shape the stream catalog serves. */
export interface CatalogStream extends StreamManifest {
  connector_id: string;
  connector_display_name: string;
  category: ConnectorCategory;
  /** Canonical schema family (payments/commerce/…), or null if the schema is a later stub. */
  family: string | null;
}

function toCatalogStream(m: ConnectorManifest, s: StreamManifest): CatalogStream {
  return {
    ...s,
    connector_id: m.id,
    connector_display_name: m.display_name,
    category: m.category,
    family: getSchemaDef(s.canonical_schema)?.family ?? null,
  };
}

/** The full stream catalog, optionally filtered by category / status / canonical schema. */
export function listStreams(filter: ConnectorFilter = {}): CatalogStream[] {
  return listConnectors(filter).flatMap((m) =>
    m.streams
      .filter((s) => !filter.canonicalSchema || s.canonical_schema === filter.canonicalSchema)
      .map((s) => toCatalogStream(m, s))
  );
}

/** Every stream (across connectors) that normalizes into a given canonical schema. */
export function streamsForSchema(canonicalSchema: string): CatalogStream[] {
  return listStreams({ canonicalSchema });
}

/** Connectors that can populate a given canonical schema. */
export function connectorsForSchema(canonicalSchema: string): ConnectorManifest[] {
  return listConnectors({ canonicalSchema });
}

// --- Public projection (Settings UI / DB) ---------------------------------

export interface PublicStream {
  name: string;
  display_name: string;
  canonical_schema: string;
  family: string | null;
  supported_sync_modes: StreamManifest['supported_sync_modes'];
  default_dimensions?: string[];
  default_metrics?: string[];
  freshness?: string;
}

export interface PublicConnectorManifest {
  id: string;
  display_name: string;
  category: ConnectorCategory;
  status: ConnectorStatus;
  auth: { type: ConnectorManifest['auth']['type']; recommended_scopes?: string[] };
  history_modes: ConnectorManifest['history_modes'];
  default_history_mode: ConnectorManifest['default_history_mode'];
  storage_policy: ConnectorManifest['storage_policy'];
  stores_raw_payloads: boolean;
  streams: PublicStream[];
}

/**
 * Project a manifest into the catalog shape the Settings UI and DB consume. Manifests
 * carry no secrets, but this deliberately drops runtime-internal fields (cursor field,
 * rate-limit strategy, normalizer version) so the client only sees catalog metadata —
 * satisfying "expose manifest data without leaking secrets or runtime internals".
 */
export function toPublicManifest(m: ConnectorManifest): PublicConnectorManifest {
  return {
    id: m.id,
    display_name: m.display_name,
    category: m.category,
    status: m.status,
    auth: { type: m.auth.type, recommended_scopes: m.auth.recommended_scopes },
    history_modes: m.history_modes,
    default_history_mode: m.default_history_mode,
    storage_policy: m.storage_policy,
    stores_raw_payloads: m.stores_raw_payloads,
    streams: m.streams.map((s) => ({
      name: s.name,
      display_name: s.display_name,
      canonical_schema: s.canonical_schema,
      family: getSchemaDef(s.canonical_schema)?.family ?? null,
      supported_sync_modes: s.supported_sync_modes,
      default_dimensions: s.default_dimensions,
      default_metrics: s.default_metrics,
      freshness: s.freshness,
    })),
  };
}

/** The whole catalog as public manifests — the payload the Settings page would render. */
export function publicCatalog(filter: ConnectorFilter = {}): PublicConnectorManifest[] {
  return listConnectors(filter).map(toPublicManifest);
}
