# Feature plan: Data Source architecture (metric values)

> **Status:** DRAFT (design only — not scheduled, not auto-built). This is the deep one; discuss before implementing.
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
| **2** | **File** (CSV/Parquet) | DuckDB-WASM in browser (count.co uses DuckDB) | real data, no infra |
| **3** | **Warehouse / API** (SQL node) | server-side proxy + stored connection | BigQuery/Snowflake/Postgres |

**Recommendation:** don't rebuild the mega-node. Salvage the v0 **Manual + Generate** panels first (zero backend) — they immediately unblock RCA, seeds, and templates. Then add the **warehouse-first SQL node** (count.co style, DuckDB) once the proxy exists. The all-in-one v0 node was the trap; the count.co split is the spine.

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
