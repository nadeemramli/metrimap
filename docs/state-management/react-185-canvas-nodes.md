# React #185 on the canvas — root cause, the fix, and how to keep it fixed

- **Status:** Implemented (2026-07-07)
- **Applies to:** `src/features/canvas/pages/CanvasPage.tsx` (the main canvas)
- **Decision record:** [ADR-008: Canvas State Ownership](../adr/ADR-008:%20Canvas%20State%20Ownership.md)
- **Issues:** CVS-23, CVS-65 · **Commits:** `18f1ca8` (fix), `29f9c5f` (drop per-frame drag writes)

This is a **recurring** crash — it came back for weeks under different triggers. If
it shows up again, read this first: it explains why it happens, what we changed,
the invariants that must hold, and a debug checklist.

## Symptom

- Console: `Minified React error #185` → "**Maximum update depth exceeded**".
- The ErrorBoundary fallback (**"Something went wrong"**) replaces the canvas.
- Lands in Supabase `error_reports` (and the System-Health → Linear intake).
- Stack signature: the loop is inside React Flow's internal store updater —
  `…vendor-flow… setNodes ← (StoreUpdater) ← react (flush)` — usually **triggered
  by moving/dragging nodes** or opening a portal (dropdown/dialog) over the canvas.

## Root cause (the loop)

The canvas ran React Flow **controlled**: `<ReactFlow nodes={nodes} …>` where
`nodes` was a render-time `useMemo` **re-derived every render** by merging 4–5
Zustand sources (metric cards, `canvas_nodes`, PRD nodes, evidence) + converters.

That created a **bidirectional derive↔control loop**:

```
store write ─► nodes memo re-derives (NEW object identities every render)
   ▲                       │
   │                       ▼
write stores ◄─ RF re-diffs / re-measures ─► fires change/selection/dimension events
```

Any input that wasn't reference-stable (e.g. `state.extraNodes || []` producing a
fresh `[]` each render, or converters rebuilding `data` objects) re-armed the loop.
It was **whack-a-mole** — every "stabilize this one input" fix held until the next
contributor reintroduced churn. See ADR-008 for the full history (step 2 added
`useCanvasNodeSources`; this is **step 3**, the real cure).

## The fix — React Flow owns node view-state

React Flow now **owns** the node array via `useNodesState`; the stores feed it
**one-way**. Concretely, in `CanvasPage.tsx`:

1. **`const [rfNodes, setRfNodes] = useNodesState([])`** — this is the `nodes`
   prop. We no longer pass a freshly-derived array.
2. **A one-way reconcile effect** (store → RF). It builds the "desired" nodes from
   `useCanvasNodeSources()` + the converters and **merges by id** into `rfNodes`:
   - Identity is keyed on the **source store object** (`__src`) plus a context key
     (`__ctx`, for global build inputs like the settings-sheet/focus state). If the
     source object and ctx are unchanged, it **returns the exact same node object**
     — so React Flow never re-measures it. This identity stability is what actually
     kills the loop (the converters build fresh `data` every call, so you cannot
     compare by value — you compare the source reference).
   - It **preserves RF-owned fields** (`selected`, `dragging`, `measured`,
     `width`, `height`) from the current node on a rebuild.
   - If nothing changed across the whole array, it returns the previous array
     (a `setRfNodes` no-op — React bails, no re-render).
3. **`handleNodesChange`** applies *all* of RF's change events (select / position /
   dimensions) into `rfNodes` via `applyNodeChanges`, **except `remove`** — deletes
   flow through `onNodesDelete → store delete → reconcile` so RF and the store can't
   race (applying `remove` here lets the reconcile re-add the node before the async
   store delete lands).
4. **A `draggingIds` ref** (set on drag-start, cleared on drag-stop) makes the
   reconcile leave in-flight nodes untouched.
5. **No per-frame drag store writes** (`29f9c5f`): `onNodeDrag` only does the
   drop-target highlight; RF moves the node via `onNodesChange`; the final position
   persists **once on drag-stop** (`handleNodeDragStop` / `handleSelectionDragStop`),
   which also broadcasts the realtime `node:move` and records undo.
6. **Selection is RF-owned**: converters are passed an **empty selection** (they no
   longer stamp `selected`); `onSelectionChange` still writes
   `useCanvasStore.selectedNodeIds` **one-way** for downstream consumers
   (SelectionPanel, GroupsPanel, group add/remove, copy/duplicate/delete, Esc).
7. `isValidConnection` / `handleConnect` read `getNodes()` (RF's live store), not a
   derived array.

**Edges are still a `useMemo`** (relationships + `state.extraEdges`) — they are far
lower-risk (single store field + plain React state, no `selected` stamping). If
edges ever start #185-ing, apply the same `useEdgesState` migration.

## Invariants — do NOT break these (this is how it stays fixed)

1. **RF owns the node array.** Never pass a per-render-derived array as the
   controlled `nodes` prop. Mutations go through `setRfNodes` / `applyNodeChanges` /
   the reconcile — never a memo feeding `nodes={…}`.
2. **Reconcile must be identity-stable.** Return the *same* node object when the
   source is unchanged. Key on the **source object reference** (`__src`), not on the
   rebuilt node/`data` (converters produce fresh objects every call).
3. **Never strip `measured` / `width` / `height`** from an existing node. React Flow
   v12 will re-measure forever → loop. (Whiteboard nodes' `style.width/height` is a
   *separate* thing that comes from the source — keep both.)
4. **Do not stamp `selected` from the store** onto nodes. RF owns selection; feed the
   store one-way from `onSelectionChange`.
5. **Do not apply `remove` changes in `onNodesChange`.** Route deletes through the
   stores so the reconcile removes them (avoids the re-add race).
6. **Do not write node positions to a store on every drag frame.** Persist on
   drag-stop only.
7. **Keep every Zustand selector / node-source reference-stable.** No `|| []` or
   fresh object/array literals feeding the node pipeline each render (use a shared
   `EMPTY` constant — see `useCanvasNodeSources.ts` and `EMPTY_SELECTION`).

## Regression tests (run these to prove it's fixed)

- **`e2e/canvas-stability.spec.ts`** — #185 soak: portal menus/dialogs + panning +
  all node types render, ErrorBoundary never appears.
- **`e2e/node-drag-185.spec.ts`** — opens the user's *editable* canvas, **drags a
  node and asserts it actually moves** + zero #185. (Example canvases are
  public/read-only → `nodesDraggable=false` → no real drag; use an owned canvas.)
- Both use `collectConsoleErrors(page).react185()` (`e2e/helpers.ts`), which filters
  console/pageerror output for `Minified React error #185 | Maximum update depth`.
- ⚠️ Running Playwright signs the shared prod Clerk test user in each run — **don't
  run it many times back-to-back**, or Clerk rate-limits and sign-in hangs post-auth.

## If it recurs — debug checklist

1. **Get the non-minified error.** Reproduce on a `npm run dev` build (or a
   sourcemap'd build); the full React #185 message names the component whose
   `setState` is looping.
2. **Bisect recent canvas changes** for any of these anti-patterns (they re-arm the
   loop): a new derived `nodes`/`edges` array passed to `<ReactFlow>`; a store write
   during render or on every drag frame; a new Zustand selector returning a fresh
   `[]`/object each render; code that strips `measured` or re-stamps `selected`;
   applying `remove` in `onNodesChange`.
3. **Reproduce with `e2e/node-drag-185.spec.ts`** (or add a spec for the new
   trigger) so the fix is proven and stays covered.
4. Confirm the reconcile still returns `prev` when nothing changed (identity
   stability) — a `console.count` in the reconcile that fires unboundedly is the
   tell.

## Files

- `src/features/canvas/pages/CanvasPage.tsx` — `rfNodes` (`useNodesState`), the
  reconcile effect, `handleNodesChange`, `draggingIds`, the drag handlers.
- `src/features/canvas/hooks/useCanvasNodeSources.ts` — the one reference-stable
  node-source selector (the migration seam).
- `src/shared/utils/canvasConverters.ts` — `convertToNode` / `convertToCanvasNode` /
  `convertToEvidenceNode` (build the desired nodes; `selected` param is now unused).
