// Run the operator pipeline and PERSIST the results: compute (pure) then append a
// MetricValue point to each downstream card's history and write it via the
// authenticated client. Pure compute lives in computePipeline.ts; this is the
// thin persist + before→after summary wrapper.
// See docs/backlog/operator-revamp-feature.md (Phase A/F).

import type { MetricCard, MetricValue } from '@/shared/types';
import { useCanvasStore } from '@/features/canvas/stores/useCanvasStore';
import {
  computePipeline,
  type DataFlowEdge,
} from '@/features/canvas/utils/computePipeline';

export type { DataFlowEdge };

export interface CardChange {
  cardId: string;
  title: string;
  before: number | null;
  after: number;
}

export interface RunResult {
  updated: number;
  warnings: string[];
  changes: CardChange[];
}

/**
 * Compute the pipeline and write the results to the cards' MetricValue history.
 * Re-running in the same period replaces that period's point instead of stacking.
 */
export async function runPipeline(
  dataFlowEdges: DataFlowEdge[]
): Promise<RunResult> {
  const canvasStore = useCanvasStore.getState();
  const cards: MetricCard[] = canvasStore.canvas?.nodes || [];
  const cardById = new Map(cards.map((c) => [c.id, c]));

  const { cardValues, warnings } = await computePipeline(dataFlowEdges);

  const period = new Date().toISOString().slice(0, 7); // YYYY-MM
  const changes: CardChange[] = [];
  let updated = 0;

  for (const [cardId, value] of cardValues) {
    const card = cardById.get(cardId);
    if (!card) continue;
    const series: MetricValue[] = Array.isArray(card.data) ? [...card.data] : [];
    const before = series.length ? series[series.length - 1].value : null;
    const change_percent =
      before != null && before !== 0
        ? Number((((value - before) / before) * 100).toFixed(1))
        : 0;
    const trend: MetricValue['trend'] =
      change_percent > 1 ? 'up' : change_percent < -1 ? 'down' : 'neutral';
    const rounded = Number(value.toFixed(Math.abs(value) < 100 ? 2 : 0));
    const point: MetricValue = { period, value: rounded, change_percent, trend };

    if (series.length && series[series.length - 1].period === period) {
      series[series.length - 1] = point;
    } else {
      series.push(point);
    }

    try {
      await canvasStore.persistNodeUpdate(cardId, { data: series });
      updated++;
      changes.push({ cardId, title: card.title, before, after: rounded });
    } catch (err) {
      warnings.push(
        `Failed to write "${card.title}": ${err instanceof Error ? err.message : 'persist failed'}`
      );
    }
  }

  return { updated, warnings, changes };
}

// Back-compat alias used by the current ControlPanel wiring (Phase D swaps it).
export interface SimulationResult {
  updated: number;
  warnings: string[];
}
export async function runSimulation(
  dataFlowEdges: DataFlowEdge[]
): Promise<SimulationResult> {
  const { updated, warnings } = await runPipeline(dataFlowEdges);
  return { updated, warnings };
}
