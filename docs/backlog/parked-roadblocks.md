# Parked roadblocks (resume context)

Two items intentionally parked 2026-06-30 — not blocked technically, but each
needs a deliberate input (owner content / a prerequisite feature) rather than
auto-generation. Pick up naturally from here.

---

## Roadblock A — The 6 curated starter templates (CONTENT)

**Why parked:** authoring metric trees is product/domain design, not engineering.
`CLAUDE.md` / `AGENTS.md` are explicit: *don't auto-generate features from the
metric-tree methodology — align with the owner first.* So these should be built
**with the owner**, structured per `docs/reference/metric-tree-methodology.md`,
not churned out generically.

**The 6:** Web Analytics · Company KPIs · Marketing KPIs · Feature Launch ·
Lifecycle Cohort Analysis · Ecommerce.

**The mechanism is already DONE — this is pure fill-in:**
- `TemplatePicker` (homepage "From template") shows two groups: *Your templates*
  (`tags @> {template}`) and *Starter examples* (`getShowcaseProjects` =
  `is_public` + `tags @> {example}`). Picking one deep-copies it in.
- So: seed each starter tree as a project with **`is_public = true`** and
  **`tags = ['example']`** (or a new 'starter' tag if we want a 3rd group) and it
  appears in the picker for **everyone**, instantiable into any workspace.

**How to seed (when ready):** extend `scripts/seed/seed-example-trees.mjs` (it
already builds 3 example trees with cards + relationships + groups), or insert via
service-role SQL. Each tree should exercise the full feature set — source →
metric cards → operator → chart, simulation-ready — so the templates double as
product docs (PRD intent).

**Resume:** owner picks a domain + its 4–6 top-line metrics; agent builds the
tree (drivers, relationships, operators, sample data) and seeds it public.

---

## Roadblock B — Assigned-notifications & notification preferences (PREREQS)

Both surfaces already exist; each is blocked on one upstream piece.

**B1. "Assigned to me" notifications** — the inbox + feed already filter
`type: 'assigned'`, but nothing PRODUCES those notifications. The blocker is that
there's **no "assign a teammate to a card" UX** yet: `MetricCard.assignees` exists
but is only read as the card's "owner" (`CardSettingsSheet`), never set to other
members. **Resume:** build an assignee picker (workspace members → card.assignees),
then on assignee-add call `createNotification({ userId, type: 'assigned',
metadata: { projectId, cardId } })`. Full wiring notes:
`docs/backlog/canvas-system-followups.md` §1.

**B2. Notification preferences backend** — Workspace Settings has the pref toggles
(mention / assigned / data-alert) but they persist to **localStorage** only, and
nothing reads them because there's **no email/notification-sending pipeline**.
**Resume:** add a `user_preferences` (or `notification_prefs`) table; build the
send pipeline (edge function / cron that emits emails or in-app notifications
honoring the prefs); point the toggles at the table. Until a sender exists, a
prefs table is inert — do the sender first.

---

*Other parked (separate): power (Cmd+K, cross-canvas search) and intelligence
(time-travel, alerting, scenario-compare) pipelines — dropped by owner
2026-06-30. See `docs/backlog/ui-ux-audit-2026-06-29.md`.*
