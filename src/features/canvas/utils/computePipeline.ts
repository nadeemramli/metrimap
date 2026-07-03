// Pure operative-node compute (no persistence). Builds the data-flow graph,
// topo-orders operators (honouring card-mediated deps), resolves each operator's
// NAMED inputs (a, b, … + `x` = sum alias), applies its operation, and returns the
// computed value per operator and the proposed new latest value per downstream
// card. Used for BOTH live preview (no write) and Run (the persist wrapper in
// runSimulation.ts). See the product vault (Phase A).

import { workerManager } from '@/lib/workers/worker-manager';
import type { MetricCard } from '@/shared/types';
import { useCanvasNodesStore } from '@/features/canvas/stores/useCanvasNodesStore';
import { useCanvasStore } from '@/features/canvas/stores/useCanvasStore';
import { normalizeOperatorData } from '@/features/canvas/utils/operatorMigration';
import { deriveInputsFromEdges } from '@/features/canvas/utils/operatorInputs';
import type {
  OperatorInput,
  OperatorNodeData,
} from '@/features/canvas/types/operator';

export interface DataFlowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

export interface PipelineResult {
  operatorValues: Map<string, number>;
  cardValues: Map<string, number>; // proposed new latest value per target card
  warnings: string[];
}

// Best-effort numeric value for a source node: latest point of its resolved
// `series` (new Source Node shape), else explicit numeric data.value, else
// coerce the legacy data.sample, else 0.
function sourceNodeValue(node: any): number {
  const data = node?.data || {};
  if (Array.isArray(data.series) && data.series.length > 0) {
    const last = data.series[data.series.length - 1];
    if (typeof last?.value === 'number' && isFinite(last.value)) return last.value;
  }
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

function aggregate(op: string, values: number[]): number {
  if (values.length === 0) return 0;
  switch (op) {
    case 'avg':
      return values.reduce((s, v) => s + v, 0) / values.length;
    case 'min':
      return Math.min(...values);
    case 'max':
      return Math.max(...values);
    case 'product':
      return values.reduce((s, v) => s * v, 1);
    case 'count':
      return values.length;
    case 'sum':
    default:
      return values.reduce((s, v) => s + v, 0);
  }
}

function compare(op: string, a: number, b: number): boolean {
  switch (op) {
    case '>':
      return a > b;
    case '>=':
      return a >= b;
    case '<':
      return a < b;
    case '<=':
      return a <= b;
    case '==':
      return a === b;
    case '!=':
      return a !== b;
    default:
      return false;
  }
}

export async function computePipeline(
  dataFlowEdges: DataFlowEdge[]
): Promise<PipelineResult> {
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

  const computed = new Map<string, number>();
  const getValue = (id: string): number => {
    if (computed.has(id)) return computed.get(id)!;
    if (cardById.has(id)) return latestCardValue(cardById.get(id));
    if (srcById.has(id)) return sourceNodeValue(srcById.get(id));
    return 0;
  };
  // Series for statistical ops: a card's history, a source's single value, or an
  // operator's computed scalar.
  const seriesOf = (id: string): number[] => {
    const card = cardById.get(id);
    if (card && Array.isArray(card.data)) return card.data.map((d) => d.value);
    if (computed.has(id)) return [computed.get(id)!];
    if (srcById.has(id)) {
      const sd: any = srcById.get(id)?.data;
      if (Array.isArray(sd?.series) && sd.series.length > 0) {
        return sd.series.map((d: any) => d.value);
      }
      return [sourceNodeValue(srcById.get(id))];
    }
    return [];
  };

  const titleOf = (id: string): string => {
    const card = cardById.get(id);
    if (card) return card.title;
    const op = opById.get(id);
    if (op) return (op.data as any)?.label || 'Operator';
    const src = srcById.get(id);
    if (src) return (src.data as any)?.title || src.title || 'Source';
    return id.slice(0, 8);
  };

  const incoming = (nodeId: string) => edges.filter((e) => e.target === nodeId);
  const outgoing = (nodeId: string) => edges.filter((e) => e.source === nodeId);

  const cardProducer = new Map<string, string>();
  for (const e of edges) {
    if (opIds.has(e.source) && cardById.has(e.target)) {
      cardProducer.set(e.target, e.source);
    }
  }

  // Operator dependency graph + Kahn topo-sort (card-mediated deps included).
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
  const indeg = new Map<string, number>([...deps].map(([k, v]) => [k, v.size]));
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
  for (const op of operators) if (!order.includes(op.id)) order.push(op.id);

  const warnings: string[] = [];
  const cardValues = new Map<string, number>();

  for (const opId of order) {
    const op = opById.get(opId);
    const data = normalizeOperatorData(op?.data as any) as OperatorNodeData;
    const label = data.label || opId.slice(0, 8);
    if (data.isActive === false) continue;

    const ins = incoming(opId);
    if (ins.length === 0) {
      warnings.push(`Operator "${label}" has no input — skipped`);
      continue;
    }

    // Resolve named inputs: persisted bindings, else derive from edges.
    const inputs: OperatorInput[] =
      data.inputs && data.inputs.length
        ? data.inputs
        : deriveInputsFromEdges(edges, opId, titleOf);

    // Build the formula scope: {a, b, …} + x = sum of all input values.
    const vars: Record<string, number> = {};
    for (const inp of inputs) vars[inp.key] = getValue(inp.sourceId);
    const inputValues = inputs.map((i) => getValue(i.sourceId));
    const x = inputValues.reduce((s, v) => s + v, 0);
    vars.x = x;

    let result: number;
    try {
      switch (data.operationType) {
        case 'aggregate':
          result = aggregate(data.aggregateOp || 'sum', inputValues);
          break;
        case 'toggle':
          result = data.toggleValue ? x : 0;
          break;
        case 'gate': {
          const g = data.gate;
          const gated = g?.inputKey != null ? (vars[g.inputKey] ?? x) : x;
          const pass = g ? compare(g.compare, gated, g.threshold) : true;
          result = pass ? gated : 0;
          break;
        }
        case 'statistical': {
          const st = data.statistic;
          if (!st) {
            warnings.push(`Operator "${label}" has no statistic config — skipped`);
            continue;
          }
          if (st.method === 'movingAverage') {
            const key = st.xKey || inputs[0]?.key;
            const srcId = inputs.find((i) => i.key === key)?.sourceId;
            const series = srcId ? seriesOf(srcId) : [];
            const w = Math.max(1, st.window || 3);
            const avg = await workerManager.calculateMovingAverage(
              series.length >= w ? series : series.length ? series : [x],
              Math.min(w, Math.max(1, series.length || 1))
            );
            result = avg.length ? avg[avg.length - 1] : x;
          } else {
            const sx = inputs.find((i) => i.key === (st.xKey || inputs[0]?.key))
              ?.sourceId;
            const sy = inputs.find((i) => i.key === (st.yKey || inputs[1]?.key))
              ?.sourceId;
            const a = sx ? seriesOf(sx) : [];
            const b = sy ? seriesOf(sy) : [];
            const n = Math.min(a.length, b.length);
            if (n < 2) {
              warnings.push(
                `Operator "${label}" needs two ≥2-point series — skipped`
              );
              continue;
            }
            if (st.method === 'correlation') {
              result = await workerManager.calculateCorrelation(
                a.slice(0, n),
                b.slice(0, n)
              );
            } else {
              const reg = await workerManager.calculateRegression(
                a.slice(0, n).map((v, i) => [v, b[i]] as [number, number])
              );
              result = reg.slope;
            }
          }
          break;
        }
        case 'formula':
        default:
          result = await workerManager.evaluateFormula(
            data.formula || 'x',
            vars
          );
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
        cardValues.set(e.target, result);
        computed.set(e.target, result); // feed-forward to downstream operators
      }
    }
  }

  return { operatorValues: computed, cardValues, warnings };
}
