import {
  PALETTE,
  resolveChartSeries,
  type ResolvedChart,
} from '@/features/canvas/utils/chartData';
import type { GroupNode, MetricCard, MetricValue } from '@/shared/types';

// Auto-generated dashboards from canvas groups: a group's member cards become a
// read-only dashboard (KPI tiles + Recharts). This is the restored "grouping →
// dashboard" linkage, rebuilt on the current Recharts/shadcn stack.

/** Max series drawn on the combined trend/bar charts (palette has 6 colours). */
const MAX_CHART_SERIES = 6;

export interface GroupKpi {
  cardId: string;
  label: string;
  category: string;
  value: number | null;
  changePercent: number | null;
  trend: MetricValue['trend'];
  /** Latest-N values for the sparkline. */
  spark: number[];
}

export interface GroupDashboardData {
  members: MetricCard[];
  /** Data-bearing metric cards summarised as KPI tiles. */
  kpis: GroupKpi[];
  /** Count of member cards per category (for the summary header). */
  categoryCounts: Record<string, number>;
  /** Members trending up / down / flat (among data-bearing cards). */
  health: { up: number; down: number; flat: number; total: number };
  /** Combined series for the trend + bar charts (capped, first-N with data). */
  chart: ResolvedChart;
  /** Cards contributing series to `chart`, in the same colour order. */
  chartCards: MetricCard[];
  /** Latest value per charted card (for the bar/composition charts). */
  latest: Array<{ key: string; label: string; value: number; fill: string }>;
}

/** Resolve a group's persisted member ids into live cards (nodeIds is source of truth). */
export function resolveGroupMembers(
  group: GroupNode,
  cards: MetricCard[]
): MetricCard[] {
  const memberIds = new Set(group.nodeIds || []);
  return cards.filter(
    (c) => memberIds.has(c.id) || c.parentId === group.id
  );
}

function hasData(card: MetricCard): boolean {
  return Array.isArray(card.data) && card.data.length > 0;
}

/**
 * Build everything a `GroupDashboard` needs from a group and the canvas cards.
 * Pure + side-effect free — safe to call in render/memo.
 */
export function buildGroupDashboard(
  group: GroupNode,
  cards: MetricCard[]
): GroupDashboardData {
  const members = resolveGroupMembers(group, cards);

  const categoryCounts: Record<string, number> = {};
  members.forEach((c) => {
    categoryCounts[c.category] = (categoryCounts[c.category] ?? 0) + 1;
  });

  const dataCards = members.filter(hasData);

  const kpis: GroupKpi[] = dataCards.map((card) => {
    const series = card.data ?? [];
    const latest = series[series.length - 1];
    return {
      cardId: card.id,
      label: card.title || 'Metric',
      category: card.category,
      value: latest && typeof latest.value === 'number' ? latest.value : null,
      changePercent: latest?.change_percent ?? null,
      trend: latest?.trend ?? 'neutral',
      spark: series
        .map((v) => v.value)
        .filter((v): v is number => typeof v === 'number'),
    };
  });

  const health = kpis.reduce(
    (acc, k) => {
      if (k.trend === 'up') acc.up += 1;
      else if (k.trend === 'down') acc.down += 1;
      else acc.flat += 1;
      acc.total += 1;
      return acc;
    },
    { up: 0, down: 0, flat: 0, total: 0 }
  );

  // Cap the multi-series charts to the palette size, preferring larger metrics
  // so the trend chart reads clearly rather than crowding thin lines.
  const chartCards = [...dataCards]
    .sort((a, b) => latestValue(b) - latestValue(a))
    .slice(0, MAX_CHART_SERIES);

  const chart = resolveChartSeries(
    chartCards,
    chartCards.map((c) => c.id)
  );

  const latest = chart.series.map((s, i) => {
    const card = chartCards.find((c) => c.id === s.cardId);
    return {
      key: s.key,
      label: s.label,
      value: card ? latestValue(card) : 0,
      fill: PALETTE[i % PALETTE.length],
    };
  });

  return {
    members,
    kpis,
    categoryCounts,
    health,
    chart,
    chartCards,
    latest,
  };
}

function latestValue(card: MetricCard): number {
  const series = card.data ?? [];
  const last = series[series.length - 1];
  return last && typeof last.value === 'number' ? last.value : 0;
}
