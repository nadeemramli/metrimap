# Connector manifests & stream catalog (data layer)

The connector manifest registry (`src/shared/lib/connectors/manifests/`, CVS-140) is the
typed catalog of every connector Metrimap can pull from. Each connector declares how it
authenticates, which **streams** it exposes, and — the load-bearing link — which
[canonical schema](./canonical-schemas.md) (CVS-139) each stream normalizes into.

Manifests live **versioned in repo code** and are the source of truth; the Settings /
Connected-accounts catalog is a **read projection** of them (locked decision on Linear
**CVS-137 §2**). Nothing here fetches a source, runs OAuth, or touches secrets — that is
CVS-141 (connection/token model) and CVS-142 (fetch runtime).

## The manifest

Every connector (`manifest.ts`) carries:

| field | meaning |
| --- | --- |
| `id` | lower_snake slug, unique (`stripe`, `csv_manual`) |
| `display_name`, `category` | catalog label + grouping (`analytics`, `payments`, `commerce`, `product_analytics`, `manual`, `research`) |
| `status` | `mvp` (fully specified) or `placeholder` (registered stub, e.g. Airbyte) |
| `auth` | `{ type, recommended_scopes? }` — `oauth2` \| `api_key` \| `basic_auth` \| `manual_upload` \| `none` |
| `history_modes` / `default_history_mode` | `live_query` \| `metric_materialization` \| `customer_owned_destination` (CVS-137 §3) |
| `storage_policy`, `stores_raw_payloads` | retention posture. **No connector stores raw payloads in v1** — all MVP connectors are `metric_materialization` with `stores_raw_payloads: false` |
| `normalizer_version`, `rate_limit` | runtime-internal; used by the fetch/normalize runtime, not shown in the UI |
| `streams[]` | the pullable streams (below) |

Each **stream** declares `name`, `display_name`, its `canonical_schema`, an optional
`cursor_field` (drives incremental sync), `supported_sync_modes`
(`full_refresh` / `incremental`), and metric-binding metadata
(`default_dimensions`, `default_metrics`, `freshness`) consumed later by CVS-144.

## MVP connectors (locked Tier order — CVS-137 §6)

**Tier 0:** `csv_manual` (schema-agnostic import, CVS-151).
**Tier 1:** `ga4` → `stripe` → `woocommerce` → `shopify` → `posthog` (CVS-146–150).
**Research placeholder:** `airbyte` (CVS-152 spike).

## Validation

`validateManifest(input)` returns a structured `{ ok, errors }` result (never throws) and
enforces the rules the Zod shape can't:

- every stream's `canonical_schema` is a **known canonical name** (MVP or registered-later);
- `default_history_mode` is one of `history_modes`;
- stream names are unique within a connector;
- `stores_raw_payloads` is false when `storage_policy` is `no_raw_payload`;
- an `mvp` connector declares at least one stream.

Every declared manifest is validated in the test suite, so a bad manifest fails CI.

## Reading the registry

```ts
import {
  listConnectors,     // filter by { category, status, canonicalSchema }
  listStreams,        // flattened stream catalog, each tagged with connector + family
  connectorsForSchema,// which connectors can populate a canonical schema
  streamsForSchema,   // which streams normalize into a canonical schema
  publicCatalog,      // secret-free projection for the Settings UI / DB
} from '@/shared/lib/connectors/manifests';
```

`toPublicManifest` / `publicCatalog` drop runtime-internal fields (cursor field,
rate-limit strategy, normalizer version) so the client only ever sees catalog metadata.
When the Settings UI lands it consumes this projection instead of a hard-coded connector
list (CVS-90 / CVS-141).
