# Feature plan: Accountability (typed owner)

> **Status:** DRAFT (design only — not scheduled, not auto-built). Discuss before implementing.
> **Methodology tie:** data is a tool for whoever is accountable for a function; levers need owners ("turn dashed lines solid" is someone's job). See [governance discussion](../reference/metric-tree-methodology.md#6-applications-why-its-transformational).

## Problem

Today `MetricCard` has `owner?: string` + `assignees: string[]` — a person, by name. But accountability in a value chain often isn't a single person: it's a **department**, a **group/limb** of the tree, or a **KPI/OKR** the metric rolls up to. We want to generalize "owner" into a typed accountable entity without throwing away the existing person-owner.

## Approach — a typed accountable entity

```
AccountableEntity {
  type: 'person' | 'department' | 'group' | 'kpi' | 'okr'
  ref: string        // user id | department id | group id | kpi/okr id
  label?: string     // denormalized display name
}
```

Attach an `accountable?: AccountableEntity` to:
- a **metric** (`MetricCard`) — who owns this number,
- a **group** (`GroupNode`) — who owns this limb/function,
- a **KPI/OKR** — the existing OKR feature becomes a valid accountability target (a metric can be "accountable to" an objective).

Keep `owner`/`assignees` as-is for backward compat; `accountable` is the richer, optional layer. `type: 'person'` with `ref = userId` is the migration of today's `owner`.

## Why typed (not just a string)
- A **department** placeholder lets you assign accountability before individuals are named (the user's example).
- A **group** owner answers "who owns this whole branch" in one place instead of per-card.
- A **KPI/OKR** target connects the tree to goal-setting you already have.

## Phasing
1. Add the `AccountableEntity` type + optional `accountable` field on `MetricCard` (and `GroupNode`). Render/edit in card & group settings. Person + department first (no new dependencies).
2. Wire `group` and `kpi`/`okr` refs (depends on the OKR feature's ids).
3. Roll-up view: "everything <department/person/OKR> is accountable for" — a filter over the tree (feeds the governance Ownership lens).

## Decisions (resolved 2026-06-27)
1. **One `accountable` (DRI) per card**, with `assignees` kept as contributors.
2. **Departments start as a lightweight list/tag**, formalized into a table later.
3. **Group accountability cascades to child cards by default**, overridable per card.
4. **North Star designation added alongside this work** (cross-cutting): when extending the card type, also add `isNorthStar` + North Star `type: 'customer' | 'financial' | 'strategic'`. Cheap to do together; unblocks orphan-v2 legitimacy + governance "reds". See [methodology §North Stars](../reference/metric-tree-methodology.md#anatomy-of-a-tree).

## Touchpoints (when built)
- `src/shared/types/index.ts`: add `AccountableEntity`, extend `MetricCard` / `GroupNode`.
- Card settings + group settings UI for picking the entity.
- Migration: backfill `accountable` from existing `owner` as `{ type: 'person', ref: owner }`.
