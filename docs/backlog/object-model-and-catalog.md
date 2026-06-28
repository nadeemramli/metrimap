# Object Model & Metric Catalog — LOCKED decisions

> **Status: LOCKED (2026-06-28)** — not a draft. Decided with the owner. These are the foundation the homepage IA, semantic layer, value lifecycle, and permissions all build on. Do not re-litigate; supersede explicitly if changing. Companion to [`data-source-architecture.md`](./data-source-architecture.md).

## The frame: two canvas use cases

1. **Exploration** — build cards freely, create proxy metrics, no data. Must stay frictionless; lives per-canvas.
2. **Operationalization** — wire **Source Node → Metric Card** (the two-step). This is what makes a metric "real" and is the only thing that earns a place in the shared semantic layer.

## Fork 1 — Object model nests: Workspace → Space → Canvas → Node

Today `project` **is** the canvas (1:1, flat list, no nesting). Target: rename `project`→**Canvas**; introduce **Space** (folder) and **Workspace** tiers. The homepage "consolidate the list + nest" work is *this one migration*.

## Fork 2 — Workspace = Clerk Organization

A Workspace is backed by a **Clerk org**. Members, invites, and roles are inherited from Clerk → collapses most of "Collaboration & Permissions" from build-it into wire-it-up. The **Catalog and value store are workspace-scoped** (per Clerk org).

## Fork 3 — Promotion-based Metric Catalog (Tracked Metrics)

The catalog is **earned by operationalization**, not applied to every card.

- A **Tracked Metric** = `(Source Node + Metric Card)` operationalized with real data. Only these become catalog entries.
- **Three states:**
  1. **Exploratory / proxy** — no source binding; per-canvas only; stays cheap.
  2. **Tracked candidate** — fed by a Source Node and has real data; **auto-listed** in a "Candidates / Unconfirmed" tab.
  3. **Catalogued Tracked Metric** — **explicitly promoted** ("Catalog this metric"); workspace-scoped, referenceable across canvases.
- **Promotion is explicit** (button); candidacy is automatic on binding. (Auto-promote would re-pollute the catalog.)
- **Referencing** a catalogued metric on another canvas shares **definition AND values** — one MRR, one number, one source; a placement is a *view onto the same series* (not a copy).
- **Migration is light:** no force-migrate of the ~142 existing cards. The catalog fills by promotion; existing cards that already have a source binding can be auto-flagged as candidates.
- **Birth moment** = the Source Node's **"Save & feed downstream"** action (already shipped in `feedDownstream.ts`).

## Fork 4 — Two-tier value storage

- **Exploratory cards:** inline `metric_cards.data` jsonb (status quo — no snapshot cost for a doodle).
- **Tracked Metrics:** a dedicated **snapshot/value store** — `{ period, value, snapshot_at, source, version }` — **keyed by Tracked Metric** (catalog id). Enables freshness, stale/orphaned-binding state, time-travel, scenario comparison.
- **Supplement, not replace:** keep inline `data` as a read-cache and write-through to the store during migration, so nothing breaks.
- An operator/source **Run writes a new snapshot row** (not just "update latest"), so history accrues.

## Pipeline Templates

Select multiple wired nodes → **"Catalog as pipeline template."** Captures **structure + source config, NOT data** — a reusable recipe (finer grain than "save canvas as template").

## The "removed connection" answer (was an open question)

When a source/connection is removed or breaks, the bound node **keeps its last-known snapshot** and flips to a visible **stale / orphaned-binding** state. Never a silent zero or delete. This falls out of Fork 4's snapshot store.

## Target object model

```
  Workspace  ( = Clerk Organization )      ── members · roles · billing · data-source connections
     │
     ├─ Space / Folder                      ── homepage folders + filter-chips surface
     │    └─ Canvas  (today's "project")
     │         └─ Node ── placement of ──►  Metric
     │                                        ▲
  ══ SEMANTIC LAYER (promotion-based) ═══════╪══  ONLY operationalized (Source+Card) metrics
     Metric Catalog:  id · name · formula · unit · owner · source-binding · state(candidate|tracked)
                                              │
  ══ DATA LIFECYCLE (tracked metrics only) ══▼══
     Value store:  tracked_metric_id → [{ period, value, snapshot_at, source, version }]
                   freshness · stale/orphaned state · time-travel · scenarios
  ══ PERMISSION SPINE (via Clerk) ══════════════
     roles (Viewer/Commenter/Editor/Admin) · invites · link-share · public read
  ══ EVENT PRODUCERS ═══════════════════════════
     people-events ─┐
     data-events  ──┴─►  one inbox  (feed + notifications)
```

## Migration implications (ordered, Platform-Epic backlog)

1. **Hierarchy:** add Space + Workspace (Workspace = Clerk org id); rename project→Canvas in terminology, table rename optional/later.
2. **Catalog:** new workspace-scoped `metric_catalog` table; card gains optional `tracked_metric_id`; explicit promote flow + Candidates tab.
3. **Value store:** new `metric_values`/snapshots table keyed by `tracked_metric_id`; write-through from source/operator runs.
4. **Stale-binding state** on cards when a source/connection is removed.

## Two backlogs (meta)

- **(A) Homepage & Account** — ships against the *current* model; not blocked by the epics above.
- **(B) Platform Epics** — the four migrations above. Keep out of A's column.
