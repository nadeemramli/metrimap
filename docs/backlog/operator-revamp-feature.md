# Backlog: Operative-node + tooling TOTAL REVAMP

_Status: planned 2026-06-27. Supersedes the v1 in `operator-control-feature.md`
(Phases A/B/C of that doc are DONE and shipped)._

## Why

The operative-node feature is underdeveloped and the tooling doesn't serve its
purpose:

- **ControlPanel is 100% "Apply to All" bulk** — 7 sections, each mutates *every*
  operator at once. Wrong model: control should be **contextual / per-operator**.
- **"Run Simulation" is vague** — no indication of what runs or what the output is.
- **Date Picker is a per-operator op-type but applied to all** — it isn't
  operator-specific; belongs in a global tab.
- **Operators can only SUM inputs into one `x`** — no way to "combine two cards"
  as `a + b` / `a − b`. (The mathjs worker already accepts named vars, so the
  engine supports it; only wiring/UI is missing.)

## Mental model (confirmed)

- **Metric card = placeholder slot.** A labelled box with a value
  (`MetricCard.data: MetricValue[]`, latest point = current value).
- **Source / operative nodes make cards functional.** Source feeds data in;
  operative nodes transform/combine.
- **Operative node = combiner.** Takes named inputs (a, b, …) → outputs one value
  → **chains** into the next card (card → op → card → op → …).
- **Tooling = a contextual control panel** for the selected operative node.

## Confirmed decisions

1. **Named inputs** (`a`, `b`, `c`…) bound by connection order, renameable per
   operator. Formula uses `a`,`b`. Keep `x` = SUM(all inputs) as a back-compat
   alias (so `x * 1.1` and existing formulas keep working).
2. **Operation catalog** (each with contextual controls): `formula` (mathjs over
   named inputs), `aggregate` (sum/avg/min/max/product/count), `gate` (threshold
   pass/block), `toggle` (boolean on/off pass-through — migrates legacy
   `boolean`), `statistical` (correlation/regression/movingAverage via worker).
   **Drop** `datePicker` as an operator op-type.
3. **Tooling = tabbed contextual panel**: ▸ **Operator** (selected operator's
   type + fields + named-input editor + LIVE output), ▸ **Pipeline** (Run +
   results table), ▸ **Global** (simulation period, run-all, bulk actions moved
   into tooltips).
4. **Live preview + explicit Run**: operators show their computed output live as
   you edit; **Run pipeline** commits to card history and shows a summary
   (cards changed, before → after) + warnings.

## Building blocks to reuse

- `workerManager.evaluateFormula(formula, variables)` already takes a named scope
  (`src/lib/workers/worker-manager.ts`); plus `calculateCorrelation`,
  `calculateRegression`, `calculateMovingAverage`.
- Topo-sort + `cardProducer` card-mediated deps + MetricValue append/replace logic
  in `src/features/canvas/utils/runSimulation.ts` (extract, don't rewrite).
- `useCanvasNodesStore.updateNode(id,{data})` (authenticated → `canvas_nodes`).
- Data-flow edges in `projects.settings.dataFlowEdges` + `state.extraEdges` +
  `persistDataFlowEdges` / `handleEdgesDelete` (CanvasPage).
- shadcn `Tabs` / `Tooltip` / `Table` in `src/shared/components/ui`.

## Phases (each independently shippable; legacy `runSimulation` alias keeps the
app working until Phase D swaps the panel)

### Phase 0 — Types + lazy migration (no behavior change)
- New `src/features/canvas/types/operator.ts`: `OperatorOperationType`,
  `OperatorInput {key,sourceId,label}`, new `OperatorNodeData` (per-type config +
  `inputs[]`), keep legacy optional fields.
- New `src/features/canvas/utils/operatorMigration.ts`:
  `normalizeOperatorData(raw)` — pure, read-time: `boolean→toggle`,
  `datePicker→formula 'x'`, defaults. No DB writes.

### Phase A — Pure `computePipeline` + thin persist
- New `src/features/canvas/utils/computePipeline.ts`:
  `computePipeline(edges) → { operatorValues, cardValues, warnings }` (NO writes).
  Move `sourceNodeValue`/`latestCardValue`/`cardProducer`/Kahn topo from
  runSimulation. Build per-operator scope `{a,b,…, x:sum}`; dispatch by op type
  (formula→worker, aggregate→fold, gate→compare, toggle→`v?x:0`,
  statistical→series→worker scalar). Sequential `await` (chains depend on order).
- Refactor `runSimulation.ts` → `runPipeline(edges) → {updated, warnings,
  changes: CardChange[]}` (calls computePipeline, appends MetricValue, captures
  before→after). Keep `runSimulation` export alias.

### Phase B — Operator input-binding lifecycle
- New `src/features/canvas/utils/operatorInputs.ts` (typed): `nextInputKey`,
  `addInput`, `removeInputBySource`, `deriveInputsFromEdges` (shared with
  computePipeline fallback), `nodeTitleOf`.
- CanvasPage `onCreateDataFlow`: if target is operator → assign next free key,
  default label = source title, `void updateCanvasNode(opId,{data:{...inputs}})`.
- CanvasPage `handleEdgesDelete`: drop the input entry by `sourceId` (do NOT
  re-key remaining inputs). Update deps arrays (exhaustive-deps).

### Phase C — Model migration + node render
- `convertToCanvasNode` operator branch → spread `normalizeOperatorData(...)`.
- `handleAddCustomNode` operator default → `{label,operationType:'formula',
  isActive:true, formula:'x', inputs:[]}`.
- Rewrite `operator-node.tsx` presentational: type badge, input chips
  (`a: Revenue`), **live output readout**; remove the dead local-edit `useState`
  (editing now lives in the panel). Keep handles + drag handle (ELK relies on them).

### Phase D — Tabbed contextual ControlPanel
- Rewrite `ControlPanel.tsx` with shadcn `Tabs`: Operator / Pipeline / Global as
  above. New props (`selectedOperator`, `previewOperatorValues`,
  `onUpdateOperator`, `onRun`, `lastRun`, `isRunning`, `globalPeriod`, …).
- CanvasPage: derive `selectedOperator` from `selectedNodeIds ∩ operatorNode`;
  wire `onRun`→`runPipeline`, `onUpdateOperator`→`updateCanvasNode`. Debounce
  text edits (local mirror, flush on blur) to avoid a write per keystroke.

### Phase E — Live preview threading (loop-safe)
- New `src/features/canvas/stores/useOperatorPreviewStore.ts` (tiny, unpersisted).
- New `src/features/canvas/hooks/useLivePreview.ts`: debounced (~250ms) effect →
  `computePipeline(edges)` → `setPreview`. Effect deps = a **primitive digest**
  of operator config + card latest values + edge ids (NOT array identities).
  One-directional: compute reads inputs, writes preview store; nodes read preview
  store for display only. operator-node + (optional) metric card subscribe to the
  store **directly by id** so the `nodes` memo doesn't depend on preview (avoids
  render→compute→set→render loop and ELK re-layout).

### Phase F — Run output summary
- `runPipeline` returns `changes` (before→after); CanvasPage `onRun` stores
  `lastRun`, toasts, Pipeline tab renders a `Table`. Reuse same-period replace so
  re-runs don't stack points.

## New files
`types/operator.ts`, `utils/operatorMigration.ts`, `utils/operatorInputs.ts`,
`utils/computePipeline.ts`, `stores/useOperatorPreviewStore.ts`,
`hooks/useLivePreview.ts`. Rewrites: `ControlPanel.tsx`, `operator-node.tsx`,
`runSimulation.ts`; edits: `CanvasPage.tsx`, `canvasConverters.ts`.

## Cross-cutting gotchas
- **RLS**: all writes via `updateCanvasNode` / `persistNodeUpdate` (authenticated
  client); never construct a raw client.
- **Don't push preview through the `nodes` memo** — components subscribe to the
  preview store directly, or ELK routing re-runs and a render loop forms.
- **`x` alias must stay** (sum of inputs) for back-compat.
- **`@ts-nocheck` files** (`edgeConnectionHandler.ts`): keep new typed logic in
  the new util files, not there.
- **Sequential `await`** in the operator compute loop (no `Promise.all`).

## Verification
- `npm run type-check`, `npm run build`, `npm run lint`, `npm run test` per phase.
- Canvas can't be runtime-tested locally → verify on the live deploy: connect two
  cards → operator → card; in the Operator tab set type=formula, formula `a+b`;
  watch the operator's live output; Run pipeline → target card gains a new point;
  reload → inputs/edges persist.
