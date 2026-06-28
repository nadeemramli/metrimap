# Feature plan: Data Source architecture (metric values)

> **Status:** Phase 1 (Manual + Generate) **shipped 2026-06-28**; Phases 2–3 still DRAFT. This is the deep one; discuss before implementing the backend phases.
>
> **Phase 1 build log (2026-06-28):**
> - `src/features/canvas/utils/sourceBinding.ts` — the contract + zero-backend engine: `SourceBinding` type, `deriveSeries` (fills `change_percent`/`trend`), `generateSeries` (seeded trend/seasonality/noise model), `parseSeries` (CSV/JSON → `MetricValue[]`), `buildPeriods`. Unit-tested in `sourceBinding.test.ts` (15 tests).
> - Wired into the card **Data tab** (`data-events-tab.tsx`): a **Generate** dialog, **Import (CSV/JSON)** paste, **Clear All**, and manual edits now re-derive change/trend across the whole series via `deriveSeries` (previously hard-coded to `0`/`neutral`).
> - Verified: type-check ✓, build ✓, lint 0 errors.
> - **Note (corrected 2026-06-28):** the v0 panels emit generic `any[]`, not the contract — but they are **NOT dead code**. `canvasConverters.ts` registers `SourceNode` (the `sourceNode` node type), which renders `data-transformation-node.tsx` → all 6 `node-function/source-node/*` panels. Deleting them breaks the live Source Node type and any saved canvases that contain one. **Retiring the v0 Source Node is a separate Architecture A↔B decision** (likely a hybrid that keeps Manual/Generate) and needs a data-migration plan for existing `sourceNode` instances — do not delete piecemeal.
> - **Harness gap found:** the repo's `vitest` config only defines a Storybook browser project, so plain `*.test.ts` files (incl. pre-existing `autoLayout.test.ts`, `worker.test.ts`) don't run under `npm run test`. Tests were verified with a standalone config. Worth adding a `unit` project to `vite.config.ts`.
> **Why it matters:** every Diagnose/Forecast capability (RCA, drift, simulation) is gated on real `MetricValue[]` flowing into cards. This is the prerequisite for [RCA + drift](./rca-drift-engine.md).
> **Prior art in repo:** the v0 source node (`src/features/canvas/components/nodes/source-node/data-transformation-node.tsx` + `node-function/source-node/*`). It "failed badly" because it tried to be everything in one node with no clear data contract.

## North star for this feature

A card's `data: MetricValue[]` (`{ period, value, change_percent, trend }`) gets **populated from a source**, by any of several paths, all resolving to the **same contract**.

## Principle 1 — define the data contract first

Every path (warehouse, file, manual, generated) must produce the same thing:

```
SourceBinding {
  cardId: string
  series: MetricValue[]        // period + value (+ derived change/trend)
  refreshedAt: string
  origin: 'manual' | 'generated' | 'file' | 'warehouse'
}
```

Nail this before any UI. It's the seam everything else plugs into, and it's what RCA reads.

## Principle 2 — separate *connection* from *query* (the count.co lesson)

count.co works because it splits these:
- **Connection** — configured **once** at project/workspace level (a warehouse). Not a per-node concern.
- **Query / binding node** — a node that pulls **one specific series** for one card from a connection (count.co's SQL node).

The v0 node conflated "configure a data source" with "transform data for this node," which is why it sprawled. Don't repeat that.

## Principle 3 — the hard security constraint

**Warehouse/API credentials cannot live in the browser.** `VITE_`-style exposure ships secrets to every visitor (we just removed exactly this class of risk — see [[service-role-key-audit]]). So:
- Warehouse connections **must** go through a **server-side proxy** (Supabase edge function) that holds the credential and runs the query.
- Only **file** (CSV/Parquet) and **manual/generated** data can be fully client-side.

This single fact dictates the phasing.

## Phasing

| Phase | Mode | Backend needed | Unlocks |
|---|---|---|---|
| **1** | **Manual entry** (spreadsheet/paste/CSV-JSON import) | none | RCA on hand-entered data; fastest path |
| **1** | **Generate sample** (time series) | none | seeds **and** templates (see below) |
| **2** | **File** (CSV/TSV/JSON ✅ shipped 2026-06-28; Parquet deferred) | text formats reuse Phase 1 contract (zero deps); Parquet needs DuckDB-WASM | real data, no infra |
| **3** | **Warehouse / API** (SQL node) — **Postgres scaffolded 2026-06-28, NOT deployed** | server-side proxy + stored connection | BigQuery/Snowflake/Postgres |

### Phase 3 (2026-06-28) — DEPLOYED to live project `iqrclwolhookzzmiedun`

Targets **Postgres first** (simplest, matches stack). Migration applied + edge function deployed (ACTIVE, `verify_jwt: true`) via Supabase MCP. Verified: function returns 401 unauthenticated, CORS preflight 200, security advisor shows no ERROR-level issues. The credential table is locked down by RLS-no-policy **and** `REVOKE ALL FROM anon, authenticated`.

> ⚠️ **Open caveats are documented in [`data-source-caveats.md`](./data-source-caveats.md)** — including the Clerk-JWT-vs-`verify_jwt` gateway 401 (with root cause + fix), the `any`-cast type regen, the migration version mismatch, and the runtime-unverified DuckDB/warehouse paths. Read that before debugging a warehouse failure.

- **Migration** `supabase/migrations/20260628120000_source_connections.sql`: `source_connections` (owner-RLS metadata) + `source_connection_secrets` (RLS enabled, **no policies** → only the service-role edge function can read the password; it never reaches the browser).
- **Edge function** `supabase/functions/warehouse-proxy/index.ts` (Deno): actions `test`/`save`/`query`. Verifies ownership via the caller's JWT + RLS, reads the secret with service-role, runs SQL against the customer Postgres, returns rows.
- **Client service** `src/shared/lib/supabase/services/sourceConnections.ts`: list/save/test/delete + `runWarehouseQuery` → rows → `seriesFromRows` (the contract).
- **UI** `…/tabs/warehouse-source-dialog.tsx`: connection manager + SQL editor, wired into the card **Data tab** ("Query Warehouse (SQL)"). SQL must alias columns `period` and `value`.

**Remaining local step (optional):** run `npm run prisma:types` to regenerate types including `source_connections`, then drop the `any` casts in `sourceConnections.ts`. The feature works without this (casts keep it compiling).

> **Migration version note:** the local file is `20260628120000_source_connections.sql`; the live migration history recorded it as `20260628110840` (MCP assigned its own timestamp). Same content — a future `supabase db push` may see them as distinct; reconcile if needed.

**Deliberately deferred:** credential encryption-at-rest (today the secret is a plaintext column readable only by service-role; consider Supabase Vault / pgsodium); BigQuery/Snowflake drivers; scheduled refresh; per-workspace sharing (currently owner-scoped).

**Recommendation:** don't rebuild the mega-node. Salvage the v0 **Manual + Generate** panels first (zero backend) — they immediately unblock RCA, seeds, and templates. Then add the **warehouse-first SQL node** (count.co style, DuckDB) once the proxy exists. The all-in-one v0 node was the trap; the count.co split is the spine.

## DECISION (2026-06-28): Architecture B — count.co Source Node + DuckDB

Owner chose the **node-based** model: a Source Node on the canvas is the query surface, and it **feeds the metric cards it is wired to** (data-flow edges). DuckDB-WASM approved for files. Built this session:

- **`source-node.tsx`** rebuilt (count.co style): node body shows origin + series preview + Configure; opens **`source-config-sheet.tsx`** with 4 origin tabs (Warehouse / File / Manual / Generate), a Run-preview result grid, and **Save & feed downstream**. Backward-compatible read of the legacy `{sourceType, sample}` shape.
- **`utils/sourceResolver.ts`** — `resolveSource(config, ctx)` dispatches all 4 origins → `MetricValue[]` (one contract). Node `data` shape = `{ title, config, series, refreshedAt }` on `canvas_nodes.data` JSONB.
- **`utils/duckdbEngine.ts`** — lazy-loaded DuckDB-WASM (jsDelivr bundles, dynamic import → separate async chunk). Uploaded CSV/Parquet exposed to SQL as the `data` view.
- **`utils/feedDownstream.ts`** — on Save, writes the node's series into every directly-wired card (series replace) via `persistNodeUpdate`.
- **`computePipeline.ts`** — `sourceNodeValue`/`seriesOf` now read `node.data.series` (latest value / full series), so a Source Node feeding an operator works.
- **v0 retired:** deleted `data-transformation-node.tsx`, `pipeline-canvas.tsx`, and all 6 `node-function/source-node/*` panels (the old 3-in-1). The `sourceNode` type registration stays; only its UI was replaced. Old saved nodes show "Legacy source — reconfigure."
- **Reuse:** warehouse origin reuses `WarehouseSourceDialog` (its `onApply` now also returns `{connectionId, sql}` so the node can persist + re-run).

> **File caveat:** the uploaded File is transient (not persisted on the node) — re-running a `file` origin needs re-upload. Warehouse/manual/generate re-run from persisted config.

## Two architectures, explicitly

- **A — multi-mode source node (v0):** one node with Connect/Manual/Generate tabs. Simple mental model, but couples connection to node and has no clean contract. Keep only its Manual/Generate panels.
- **B — warehouse-first + SQL node (count.co):** set up a connection once, drop SQL nodes that query it, bind results to cards. More setup, but scales and isolates credentials server-side. **Preferred long-term.**

Likely end state is a **hybrid**: B as the spine for connected data; Manual/Generate retained as the zero-setup on-ramp (and the seed/template engine).

## The seed/template tie-in

"Generate sample data" **is** the seed→template feature: a generated time-series is a seedable tree. Build that mode once; it does double duty (testing fixtures *and* user-facing templates). See the templates note in [the methodology doc](../reference/metric-tree-methodology.md) (SOMA).

## Decisions (resolved 2026-06-27)
1. **File path uses browser DuckDB-WASM**; the server proxy is reserved for warehouse/API connections only.
2. **Connections are stored per-workspace** (reusable across projects); visibility/permissions detailed later with the permissions work.
3. **Refresh: manual + on-open first**; scheduled refresh (server cron) is later.
4. **Raw SQL surface first** (count.co style) for power users; a guided query builder comes later.

## Touchpoints (when built)
- `MetricCard.data` is the sink (already exists).
- New: `source_connections` table (server-side creds), edge function query proxy, a binding node type, DuckDB-WASM for files.
- Salvage: `node-function/source-node/{manual-data-entry,data-generator}`.
