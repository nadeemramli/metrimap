# Programmatic API / service layer (`src/shared/lib/api`)

The RLS-scoped, versioned programmatic surface for building and populating metric
trees (CVS-98). It's the **foundation the MCP server wraps** (CVS-100/101) and is
reusable in-app. Design authority: the MCP design doc in the product vault
(`PRD/4. Product/3. MCP and Programmatic Building`, the CVS-97 spike).

## Model

Built on the **canonical** model — `metric_cards` + `relationships` + `projects`
(canvases) + tracked-metric value series — by wrapping the existing services in
`src/shared/lib/supabase/services/*`. It does **not** touch the parallel
`@ts-nocheck` `value_nodes`/`metric_nodes` model.

## RLS-scoping guarantee

```ts
import { createMetrimapApi } from '@/shared/lib/api';

const api = createMetrimapApi(client, userId); // client = createClerkSupabaseClient(getToken)
```

The factory **requires** a Clerk-authenticated Supabase client and the
authenticated `userId`, and throws otherwise. Every call runs under that user's
RLS — the **service-role key must never be passed here**. `userId` is used for
`created_by` attribution.

## Surface (v1)

| Group | Methods |
|---|---|
| `canvases` | `list()`, `get(id)`, `create({name, description?, isPublic?})`, `update(id, patch)`, `delete(id)` |
| `nodes` | `create({projectId, title, category, subCategory?, …})`, `createMetric` / `createValue` / `createAction` / `createHypothesis` / `createDriver` (category/subcategory preset), `update(id, patch)`, `delete(id)`, `list(projectId)` |
| `relationships` | `create({projectId, sourceId, targetId, type, confidence?, weight?, notes?})`, `delete(id)`, `list(projectId)` |
| `tree` | `get(projectId)` → `{ cards, relationships }` (context so agents extend, not duplicate); `layout(projectId, direction?)` — Dagre auto-layout, persists positions |
| `values` | `push({trackedMetricId, series, source?})` — upsert a tracked-metric series (two-tier value store) |
| `ingest` | `stageSeries` / `uploadCsv` → TTL staging (`import_batches`/`import_rows`); `materialize({batchId, mapping})` → writes the card's `data` (canvas shows it) + syncs catalogued cards to `metric_values`. Idempotent; staging auto-expires (CVS-102). |

- **Categories:** `Core/Value`, `Data/Metric`, `Work/Action`, `Ideas/Hypothesis`, `Metadata`.
- **Relationship types:** `Deterministic`, `Probabilistic`, `Causal`, `Compositional`.
- Inputs are validated with **Zod** (`src/shared/lib/api/schemas.ts`); invalid input throws a `ZodError` with a clear message.

## Data ingest (CVS-102)

`stage → map → materialize`, all RLS-scoped:
1. `ingest.stageSeries({projectId, series})` or `ingest.uploadCsv({projectId, csv})`
   → a row lands in `import_batches` + `import_rows` (per-user RLS, `expires_at`
   TTL, daily GC cron). CSV is parsed into columns for a mapping step.
2. `ingest.materialize({batchId, mapping:{cardId, periodColumn?, valueColumn?}})`
   → maps rows to a `MetricValue[]`, writes the **card's `data`** (the canvas
   visualizes it), and — if the card is catalogued — upserts the shared
   `metric_values` store. Returns an ingest report (`materialized` / `skipped` /
   `errors`). Idempotent (replaces the card's series); expired batches are
   invisible to reads and GC'd.

## Scope boundaries

- **Auth** (OAuth Connect + personal API keys) is CVS-99; the MCP **server**
  scaffold is CVS-100. This layer is what they call.
