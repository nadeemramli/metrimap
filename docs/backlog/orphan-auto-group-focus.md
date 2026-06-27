# Feature plan: Orphan cards → auto-group + focus

> **Status:** DRAFT (design only — not scheduled, not auto-built). Discuss before implementing.
> **Relates to:** [metric-tree methodology — North-Star-legitimacy](../reference/metric-tree-methodology.md). **Reuses:** existing grouping (`useGroupStore.createGroup`, `canvasStore.addGroup`, `GroupNode`) + focus mode (`focusedGroupId` in `CanvasPage`).

## Problem

Every card exists to be connected — a card with no relationship can't trace up to a North Star, so by the methodology it's "illegitimate" (a vanity/orphan metric). Today nothing surfaces these; they just sit on the canvas. We want to **collect orphans automatically and let the user focus on them** to either wire them in or delete them.

## Approach

We already have grouping + focus. The only new piece is **detection + an auto-managed group**, so this is "add auto-group," not "build grouping."

**Detection (v1 — ship first):** a card is an orphan if no relationship edge references it (`!relationships.some(r => r.sourceId === card.id || r.targetId === card.id)`).
- Exclude utility/source nodes and group nodes — those are legitimately unconnected.
- **Decided (2026-06-27):** only typed relationship edges count as "connected" — a card wired solely by a data-flow / reference edge still isn't in the tree.

**Detection (v2 — later, needs North Stars):** the stricter legitimacy rule — orphan = "no *path* up to a North Star," not just "no edges." Requires the North Star designation that doesn't exist yet (see methodology §North Stars). Hold until we add that concept.

**The auto group.** Render a managed **"Unlinked"** group that the orphan-detector populates.
- **Recommend: computed, not persisted.** Don't write it as a normal DB `GroupNode` — membership changes every time an edge is added/removed, and a persisted group would drift. Instead derive it on the fly and present it through the existing focus UI. This avoids the persistence/membership bugs a real group would create.
- Distinct styling (muted/dashed frame) so it reads as "needs attention," not a normal grouping.
- A card **graduates out automatically** the moment it gets a relationship.

**Focus.** Reuse the existing focus mode (`focusedGroupId`) so "Focus orphans" zooms to just the unlinked set. Add an entry point (e.g. a count badge "3 unlinked → focus") in the canvas toolbar / groups panel.

## Decisions (resolved 2026-06-27)
1. **Connected = typed relationship edges only** — data-flow / reference edges don't count.
2. **Detection runs continuously**, surfaced as a dismissible count badge.
3. **Source/utility & group nodes are never orphans** — only metric cards.
4. **One-click delete** is available from the focused orphan view (triage = connect or cull).

## Touchpoints (when built)
- Detector selector over `canvas.nodes` + `relationships` (likely in `canvasStore` or a derived hook).
- Focus entry point in `TopCanvasToolbar` / `GroupsPanel`.
- No schema change for v1.
