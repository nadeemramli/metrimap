// Single source of the canvas's node inputs (ADR-008 / CVS-230, step 2 of the
// canvas state-ownership migration). Today CanvasPage merges 4-5 node sources
// inline in a big `nodes` memo; this hook gathers the STORE-backed sources in one
// reference-stable place so:
//   1. there's one selector to consume (fewer churny inputs → less React #185),
//   2. step 3 can swap the source (→ React Flow `useNodesState`) in ONE place.
// Behaviour-preserving: it reads exactly the same store fields the memo used.
// (The XState transient `extraNodes` stays in the component for now — it's on the
// way out; see ADR-008.)
import { useMemo } from 'react';
import { useCanvasStore, useEvidenceStore } from '@/lib/stores';
import { useCanvasNodesStore } from '@/features/canvas/stores/useCanvasNodesStore';
import { useNewNodeTypesStore } from '@/features/canvas/stores/useNewNodeTypesStore';
import type { EvidenceItem, MetricCard } from '@/shared/types';

const EMPTY: readonly never[] = [];

export interface CanvasNodeSources {
  /** Metric-tree cards (canvasStore.canvas.nodes). */
  metricCards: MetricCard[];
  /** Source / chart / operator / comment / whiteboard nodes (canvas_nodes). */
  canvasNodes: any[];
  /** PRD node types: value / action / hypothesis / metric. */
  newNodes: any[];
  /** Evidence items that carry a canvas position (rendered as nodes). */
  positionedEvidence: EvidenceItem[];
}

export function useCanvasNodeSources(): CanvasNodeSources {
  const metricCards = (useCanvasStore((s) => s.canvas?.nodes) ??
    EMPTY) as MetricCard[];
  const canvasNodes = (useCanvasNodesStore((s) => s.canvasNodes) ??
    EMPTY) as any[];
  const newNodes = (useNewNodeTypesStore((s) => s.newNodes) ?? EMPTY) as any[];
  const evidence = (useEvidenceStore((s) => s.evidence) ??
    EMPTY) as EvidenceItem[];

  const positionedEvidence = useMemo(
    () => evidence.filter((e) => e.position),
    [evidence]
  );

  return useMemo(
    () => ({ metricCards, canvasNodes, newNodes, positionedEvidence }),
    [metricCards, canvasNodes, newNodes, positionedEvidence]
  );
}
