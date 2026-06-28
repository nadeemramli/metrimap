// Push a Source Node's resolved series into the metric cards it is directly
// wired to. This is a *series replace* (the whole MetricValue[] becomes the
// card's data) — distinct from the operator pipeline in runSimulation.ts, which
// appends a single computed point per run.

import type { MetricValue } from '@/shared/types';
import { useCanvasStore } from '@/features/canvas/stores/useCanvasStore';
import type { DataFlowEdge } from './computePipeline';

export interface FeedResult {
  updated: number;
  warnings: string[];
  targets: string[];
}

export async function feedDownstream(
  sourceNodeId: string,
  series: MetricValue[],
  edges: DataFlowEdge[]
): Promise<FeedResult> {
  const canvasStore = useCanvasStore.getState();
  const cards = canvasStore.canvas?.nodes || [];
  const cardIds = new Set(cards.map((c) => c.id));

  const targets = [
    ...new Set(
      (edges || [])
        .filter((e) => e && e.source === sourceNodeId && cardIds.has(e.target))
        .map((e) => e.target)
    ),
  ];

  const warnings: string[] = [];
  let updated = 0;
  for (const cardId of targets) {
    try {
      await canvasStore.persistNodeUpdate(cardId, { data: series });
      updated++;
    } catch (err) {
      const card = cards.find((c) => c.id === cardId);
      warnings.push(
        `Failed to write "${card?.title ?? cardId}": ${
          err instanceof Error ? err.message : 'persist failed'
        }`
      );
    }
  }
  return { updated, warnings, targets };
}
