import type { ChartNodeData } from '@/features/canvas/components/nodes/chart-node';
import type { CreateWidgetInput } from '@/shared/lib/supabase/services/dashboards';
import { DEFAULT_WIDGET_LAYOUT } from '@/features/dashboard/types';
import type { GroupNode, MetricCard } from '@/shared/types';

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
  updatedAt?: string;
}

export function chartNodeToWidgetInput(
  node: ChartNodeLike,
  opts: { sortIndex?: number; y?: number; groupId?: string | null } = {}
): CreateWidgetInput {
  const data = (node.data ?? {}) as ChartNodeData;
  return {
    projectId: node.projectId,
    groupId: opts.groupId ?? null,
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

export interface ChartNodeMeta {
  title: string;
  chartType: string;
  seriesCount: number;
  /** Titles of the bound series cards (for tooltips / previews). */
  seriesTitles: string[];
  /** Names of the canvas groups the bound cards belong to. */
  groupNames: string[];
  /** Last-touched timestamp of the chart node, if known. */
  updatedAt?: string;
}

/**
 * Human-readable metadata for a canvas chart node — what the richer
 * import dropdown and the On Canvas gallery show. Group provenance is
 * derived from the bound series cards (chart nodes themselves aren't
 * group members; their cards are).
 */
export function describeChartNode(
  node: ChartNodeLike,
  cards: MetricCard[],
  groups: GroupNode[]
): ChartNodeMeta {
  const data = (node.data ?? {}) as ChartNodeData;
  const seriesIds = data.seriesCardIds ?? [];
  const cardById = new Map(cards.map((c) => [c.id, c]));
  const seriesTitles = seriesIds
    .map((id) => cardById.get(id)?.title)
    .filter((t): t is string => Boolean(t));

  const groupNames: string[] = [];
  for (const group of groups) {
    const members = new Set(group.nodeIds ?? []);
    if (seriesIds.some((id) => members.has(id))) groupNames.push(group.name);
  }

  return {
    title: data.title ?? node.title ?? 'Chart',
    chartType: data.chartType ?? 'area',
    seriesCount: seriesIds.length,
    seriesTitles,
    groupNames,
    updatedAt: node.updatedAt,
  };
}
