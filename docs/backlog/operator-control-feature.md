# Backlog: Operator-as-control (data-flow pipeline)

_Status: planned (not implemented). Created 2026-06-26._

## Goal
Operators placed in a data-flow pipeline (`source/card → operator → card`) are
driven by the left tool panel (`ControlPanel`). Hitting **Run Simulation**
computes downstream card values: edit one formula in the tool, re-run, and every
connected card updates — "manipulate cards by moving a few parts."

**Compute model (confirmed):** `input card → operator → output card`. The
operator reads its upstream node's value as `x`, applies its op, and writes the
result to the downstream card; chains through multiple operators.

## Current state (audited)
- ✅ **Relationships (card ↔ card)** work and persist (`relationships` table),
  editable in the Relationship sheet (type/weight/confidence), cycle-checked.
- ✅ **Tool UI** (`ControlPanel.tsx`) is fully built: Simulate / Date Picker /
  Toggle / Formula / If / Operator type / Dynamic Text + per-node toggles.
- ⚠️ **Tool → operators is broken.** `onUpdateNode`/`onBulkUpdate` write
  `state.extraNodes`, but operators live in `useCanvasNodesStore`, so changes
  never reach them. `[CanvasPage.tsx:944-962]`
- ❌ **Run Simulation is a stub** — `onSimulate` is `console.log(...)`. No
  compute, so cards never change. `[CanvasPage.tsx:963-965]`
- ❌ **Data-flow / operative edges aren't persisted** — created only in local
  `state.extraEdges`, lost on reload. `[edgeConnectionHandler.ts:171-202]`

## Building blocks that already exist
- `useCanvasNodesStore.updateNode(id, { data })` — persists operator settings to
  `canvas_nodes` (+ localStorage). `[useCanvasNodesStore.ts:22,95]`
- `workerManager.evaluateFormula(formula, vars)` — mathjs in a web worker.
  `[src/lib/workers/compute.worker.ts:84]`
- `projects.settings` (jsonb) — a no-migration home for persisted edges.

## Plan

### Phase A — Make the tool actually control operators (S–M)
Replace the `onUpdateNode`/`onBulkUpdate` handlers so they call
`useCanvasNodesStore.getState().updateNode(operatorId, { data: {…} })` for each
real operator (`getNodesByType('operatorNode')`). Pass `operatorNodes` from the
real store and a real `isSimulating`. → settings stick + persist + reflect on
the node. **Quickest visible win.**

### Phase B — Persist the pipeline edges (M)
Store `source→operator→card` edges in `projects.settings.dataFlowEdges`; hydrate
on canvas load; write on connect/delete. (Cleaner alt: a `data_flow_edges`
table — more work + RLS.)

### Phase C — Run Simulation compute (M–L)
New `runSimulation.ts`:
1. Build the graph from data-flow edges (cards + operators).
2. Topologically order operators (cycles already blocked for data-flow).
3. For each **active** operator in order: read upstream value as `x`; apply op
   — formula → `evaluateFormula(data.formula, { x })`; boolean → gate
   (`booleanValue ? x : 0`); datePicker → date-stamp/passthrough — and write the
   result to each downstream **card's value**.
4. Replace the `onSimulate` stub; toggle `isSimulating`; toast on error.

## Decisions to confirm at build time
1. **Card value field** — a card's value is `metric_cards.data` (jsonb,
   time-series). Does simulate **append a new point** or **set the latest**?
2. **Multiple inputs** into one operator — bind first as `x`, or named/sum?
   (Default: first as `x`.)
3. **Source-node input** — confirm a `sourceNode`'s value (data-generator/manual)
   is the pipeline input.

## Sequencing
A → B → C. Land A first (visible control), then B (survives reload), then C
(the compute loop). Verify on the live deploy after each (canvas can't be
runtime-tested locally).
