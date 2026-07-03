import type { ChartNodeData } from '@/features/canvas/components/nodes/chart-node';
import type { CreateWidgetInput } from '@/shared/lib/supabase/services/dashboards';
import { DEFAULT_WIDGET_LAYOUT } from '@/features/dashboard/types';

// A canvas chart node maps 1:1 onto a dashboard widget: same chart types, and
// its series binding (seriesCardIds) is exactly the widget's `card` source.
// Import copies the config — the data stays live either way, since both
// resolve series from the canvas cards at render time.

/** Minimal shape shared by CanvasNode rows and the in-canvas settings sheet. */
export interface ChartNodeLike {
  id: string;
  projectId: string;
  title?: string | null;
  data?: unknown;
}

export function chartNodeToWidgetInput(
  node: ChartNodeLike,
  opts: { sortIndex?: number; y?: number } = {}
): CreateWidgetInput {
  const data = (node.data ?? {}) as ChartNodeData;
  return {
    projectId: node.projectId,
    title: data.title ?? node.title ?? 'Chart',
    widgetType: data.chartType ?? 'area',
    config: {
      source: 'card',
      cardIds: data.seriesCardIds ?? [],
      display: { showLegend: data.showLegend ?? true },
      importedFromNodeId: node.id,
    },
    layout: { ...DEFAULT_WIDGET_LAYOUT, y: opts.y ?? 0 },
    sortIndex: opts.sortIndex ?? 0,
  };
}
