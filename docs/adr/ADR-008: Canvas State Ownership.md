# ADR-008: Canvas State Ownership (React Flow as the view source of truth)

- **Status:** Proposed
- **Date:** 2026-07-05
- **Deciders:** Nadeem + Claude (builder)
- **Revisits:** [ADR-007](./ADR-007:%20Adding%20XState.md) (XState for canvas state)

## Context

The canvas renders with React Flow (`@xyflow/react`) in **controlled mode**: `<ReactFlow nodes={nodes} edges={edges} onNodesChange onSelectionChange onNodeDragStop>`. Today `nodes` is a large `useMemo` **derived every render by merging 4–5 separate sources**:

```
metric_cards          (canvasStore.canvas.nodes)
canvas_nodes          (useCanvasNodesStore — source/chart/operator nodes)
new node types        (newNodes store)
evidence nodes        (useEvidenceStore, filtered to positioned)
extra/temporary nodes (XState canvasMachine — state.extraNodes)
```

Those are merged + converted into React Flow node objects, and React Flow's callbacks (`onNodesChange`, `onSelectionChange`, `onNodeDragStop`) write back into those stores.

This is a **bidirectional derive↔control loop**. Every store change re-derives the whole array with **new object identities**, React Flow re-diffs/re-measures and fires change/selection events, which write back to the stores, which re-derive… The failure mode is **React error #185 "Maximum update depth exceeded"** — a recurring production crash captured in `error_reports` (tracked as **CVS-23 / CVS-65**). It has recurred for weeks because *any* input that isn't reference-stable (e.g. `state.extraNodes || []` producing a fresh `[]` each render) re-arms the loop — it's whack-a-mole.

Related symptoms with the **same root**:
- **Store split-brain** — two `useCanvasStore` instances historically; nodes still come from several stores.
- **Realtime "one step behind"** (CVS-77) — external updates race the derive/control cycle.
- General perf: the full node array is rebuilt on nearly every render.

## Decision

Adopt **React Flow as the source of truth for the canvas _view_ state**, with **one-way persistence** and a **single canonical node model**:

1. **React Flow owns view state.** Use `useNodesState` / `useEdgesState` (React Flow's internal state) as the canvas's live source of truth. Do **not** re-derive a controlled `nodes` array from stores on every render.
2. **Hydrate once.** On canvas load, initialize React Flow state from persisted data one time.
3. **External mutations are imperative.** Realtime edits, "add node" from panels, evidence, and catalog changes push into the canvas via `setNodes` / `setEdges` — not by mutating a store that a render-time memo reads back.
4. **Persistence is one-way + debounced.** Node/edge changes flow view → store/DB (debounced, on `onNodeDragStop` / meaningful change), never store → controlled-array → view on every render.
5. **Single canonical node model.** Consolidate the 4–5 node sources behind **one** node collection (one store/selector), and **retire the XState canvas slice** (already filed as **CVS-69**) so interaction/tool state and node state live in one place. This supersedes ADR-007's canvas-interaction responsibilities.

## Alternatives Considered

- **B — Stay controlled, enforce strict reference stability.** Memoize every input, apply `shallow` equality on all Zustand selectors, guarantee per-node stable identities, guard every write-back. *Rejected as the primary strategy:* it's the current approach and is inherently fragile — the next contributor reintroduces #185. Useful only as interim mitigation.
- **Status quo (do nothing / keep patching churn).** Rejected: #185 keeps recurring; it's a stability tax on every canvas change.
- **Full external state library for the graph (e.g. move all graph state to XState/Zustand and drive RF).** Rejected: doubles down on the derive/control coupling that causes the problem.

## Consequences

**Positive**
- Eliminates the entire #185 loop *class* — RF's internal state isn't reset each render.
- Removes the store split-brain and the "realtime one step behind" race (one write path).
- Big perf win: node array no longer rebuilt every render.
- Simpler mental model: view state in RF, durable state persisted one-way.

**Negative / costs**
- The CanvasPage node/edge pipeline is large and fragile; this is a **real refactor**, not a patch.
- Every feature that currently mutates a node store (evidence autosave, operator tooling, catalog read-share, grouping, realtime) must be rewired to push into RF imperatively.
- Selection, focus-mode dimming, and group scoping currently ride on the derived array; they must move to RF state or decorators.

**Migration sequence (each step shippable + reversible):**
1. This ADR (agree the target).
2. **Consolidate node sources** behind one stable selector/model — *no behavior change* (Option C groundwork).
3. **Flip one node type** (e.g. metric cards) to `useNodesState` + one-way persistence; verify no #185, drag/select/persist still work.
4. Extend to the remaining node types + edges; **retire the XState canvas slice** (CVS-69).

Until step 3 lands, keep the interim reference-stability hardening (e.g. the memoized `temporaryExtraNodes` fix in CVS-65).

## References

- Crashes: `error_reports` sink → React #185; issues **CVS-23**, **CVS-65**.
- Related work: **CVS-69** (retire XState → consolidate canvas state), **CVS-77** (realtime one step behind), canvas store split-brain note.
- Code: `src/features/canvas/pages/CanvasPage.tsx` (the `nodes`/`edges` memos + RF handlers), `src/features/canvas/stores/canvasStore.ts`, `src/features/canvas/stores/useCanvasNodesStore.ts`, `src/lib/machines/canvasMachine.ts`.
- React Flow: controlled vs. `useNodesState` — https://reactflow.dev/api-reference/hooks/use-nodes-state
- Supersedes canvas-interaction responsibilities of [ADR-007](./ADR-007:%20Adding%20XState.md).
