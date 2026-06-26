// Operator-as-control: Run Simulation compute (Phase C)
//
// Builds a data-flow graph from `input card | source -> operator -> output card`
// edges, topologically orders the operators (data-flow cycles are blocked at
// connect time), and for each ACTIVE operator reads its summed upstream value as
// `x`, applies the operator, and APPENDS the result as a new MetricValue point on
// each downstream card. Chains through multiple operators (including card- and
// source-mediated hops).
//
// Decisions (confirmed 2026-06-26): append a new point; sum upstream as x;
// cards + source nodes are valid inputs.

import { workerManager } from '@/lib/workers/worker-manager';
import type { MetricCard, MetricValue } from '@/shared/types';
import { useCanvasNodesStore } from '@/features/canvas/stores/useCanvasNodesStore';
import { useCanvasStore } from '@/features/canvas/stores/useCanvasStore';

export interface DataFlowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

export interface SimulationResult {
  updated: number;
  warnings: string[];
}

type OperatorData = {
  label?: string;
  operationType?: 'formula' | 'boolean' | 'datePicker';
  isActive?: boolean;
  formula?: string;
  booleanValue?: boolean;
  dateValue?: string;
};

// Best-effort numeric value for a source node. Prefers an explicit numeric
// `data.value`; otherwise coerces a `data.sample` array (numbers -> sum, rows ->
// sum of the first numeric field). Falls back to 0.
function sourceNodeValue(node: any): number {
  const data = node?.data || {};
  if (typeof data.value === 'number' && isFinite(data.value)) return data.value;
  const sample = data.sample;
  if (Array.isArray(sample) && sample.length > 0) {
    if (typeof sample[0] === 'number') {
      return sample.reduce(
        (s: number, n: any) => s + (typeof n === 'number' ? n : 0),
        0
      );
    }
    if (typeof sample[0] === 'object' && sample[0] !== null) {
      return sample.reduce((s: number, row: any) => {
        const num = Object.values(row).find(
          (v) => typeof v === 'number' && isFinite(v as number)
        ) as number | undefined;
        return s + (num ?? 0);
      }, 0);
    }
  }
  return 0;
}

function latestCardValue(card?: MetricCard): number {
  const series = card?.data;
  if (Array.isArray(series) && series.length > 0) {
    const last = series[series.length - 1];
    return typeof last?.value === 'number' ? last.value : 0;
  }
  return 0;
}

/**
 * Run the operator pipeline. Reads operators/sources from useCanvasNodesStore and
 * metric cards from useCanvasStore; persists downstream card writes via
 * useCanvasStore.persistNodeUpdate (authenticated client -> metric_cards).
 */
export async function runSimulation(
  dataFlowEdges: DataFlowEdge[]
): Promise<SimulationResult> {
  const canvasStore = useCanvasStore.getState();
  const nodesStore = useCanvasNodesStore.getState();

  const cards: MetricCard[] = canvasStore.canvas?.nodes || [];
  const operators = nodesStore.getNodesByType('operatorNode' as any);
  const sources = nodesStore.getNodesByType('sourceNode' as any);

  const cardById = new Map(cards.map((c) => [c.id, c]));
  const opById = new Map(operators.map((o) => [o.id, o]));
  const srcById = new Map(sources.map((s) => [s.id, s]));
  const opIds = new Set(operators.map((o) => o.id));

  const edges = (dataFlowEdges || []).filter((e) => e && e.source && e.target);

  // Values produced during this run: operatorId/cardId -> computed value. Read
  // by downstream operators so chains see fresh upstream results.
  const computed = new Map<string, number>();

  const getValue = (id: string): number => {
    if (computed.has(id)) return computed.get(id)!;
    if (cardById.has(id)) return latestCardValue(cardById.get(id));
    if (srcById.has(id)) return sourceNodeValue(srcById.get(id));
    return 0; // uncomputed operator or unknown node
  };

  const incoming = (nodeId: string) => edges.filter((e) => e.target === nodeId);
  const outgoing = (nodeId: string) => edges.filter((e) => e.source === nodeId);

  // Map each card to the operator that produces it (operator -> card edge), so
  // operator dependencies through cards are honored in the topo sort.
  const cardProducer = new Map<string, string>();
  for (const e of edges) {
    if (opIds.has(e.source) && cardById.has(e.target)) {
      cardProducer.set(e.target, e.source);
    }
  }

  // Build operator dependency graph (B depends on A if A feeds B directly or via
  // a card A produces) and Kahn-topo-sort it.
  const deps = new Map<string, Set<string>>();
  for (const op of operators) {
    const set = new Set<string>();
    for (const e of incoming(op.id)) {
      if (opIds.has(e.source)) set.add(e.source);
      else if (cardProducer.has(e.source)) set.add(cardProducer.get(e.source)!);
    }
    set.delete(op.id);
    deps.set(op.id, set);
  }

  const indeg = new Map<string, number>(
    [...deps].map(([k, v]) => [k, v.size])
  );
  const queue = [...indeg].filter(([, d]) => d === 0).map(([k]) => k);
  const order: string[] = [];
  while (queue.length) {
    const n = queue.shift()!;
    order.push(n);
    for (const op of operators) {
      if (deps.get(op.id)!.has(n)) {
        const d = (indeg.get(op.id) || 0) - 1;
        indeg.set(op.id, d);
        if (d === 0) queue.push(op.id);
      }
    }
  }
  // Append any operators left out by a residual cycle so they still run.
  for (const op of operators) if (!order.includes(op.id)) order.push(op.id);

  const warnings: string[] = [];
  const cardWrites = new Map<string, number>();

  for (const opId of order) {
    const op = opById.get(opId);
    const data = (op?.data || {}) as OperatorData;
    const label = data.label || opId.slice(0, 8);

    if (data.isActive === false) continue;

    const ins = incoming(opId);
    if (ins.length === 0) {
      warnings.push(`Operator "${label}" has no input — skipped`);
      continue;
    }

    // Sum upstream values as x (decision: sum).
    const x = ins.reduce((sum, e) => sum + getValue(e.source), 0);

    let result: number;
    try {
      switch (data.operationType) {
        case 'boolean':
          result = data.booleanValue ? x : 0;
          break;
        case 'datePicker':
          result = x; // passthrough (date-stamp handled by appended point period)
          break;
        case 'formula':
        default:
          if (!data.formula) {
            warnings.push(`Operator "${label}" has no formula — skipped`);
            continue;
          }
          result = await workerManager.evaluateFormula(data.formula, { x });
          break;
      }
    } catch (err) {
      warnings.push(
        `Operator "${label}": ${err instanceof Error ? err.message : 'compute failed'}`
      );
      continue;
    }

    if (typeof result !== 'number' || !isFinite(result)) {
      warnings.push(`Operator "${label}" produced a non-numeric result — skipped`);
      continue;
    }

    computed.set(opId, result);
    for (const e of outgoing(opId)) {
      if (cardById.has(e.target)) {
        cardWrites.set(e.target, result);
        computed.set(e.target, result); // let downstream operators read it
      }
    }
  }

  // Apply card writes: append a MetricValue point stamped this run.
  const period = new Date().toISOString().slice(0, 7); // YYYY-MM
  let updated = 0;
  for (const [cardId, value] of cardWrites) {
    const card = cardById.get(cardId);
    if (!card) continue;
    const series: MetricValue[] = Array.isArray(card.data) ? [...card.data] : [];
    const prev = series.length ? series[series.length - 1].value : null;
    const change_percent =
      prev != null && prev !== 0
        ? Number((((value - prev) / prev) * 100).toFixed(1))
        : 0;
    const trend: MetricValue['trend'] =
      change_percent > 1 ? 'up' : change_percent < -1 ? 'down' : 'neutral';
    const rounded = Number(value.toFixed(Math.abs(value) < 100 ? 2 : 0));
    const point: MetricValue = { period, value: rounded, change_percent, trend };

    // Re-running in the same month replaces that month's point instead of
    // stacking duplicates.
    if (series.length && series[series.length - 1].period === period) {
      series[series.length - 1] = point;
    } else {
      series.push(point);
    }

    try {
      await canvasStore.persistNodeUpdate(cardId, { data: series });
      updated++;
    } catch (err) {
      warnings.push(
        `Failed to write "${card.title}": ${err instanceof Error ? err.message : 'persist failed'}`
      );
    }
  }

  return { updated, warnings };
}
