import {
  resolveChartSeries,
  type ResolvedChart,
} from '@/features/canvas/utils/chartData';
import type { MetricCard, MetricValue } from '@/shared/types';
import type { WidgetConfig } from '@/features/dashboard/types';

export interface WidgetDataSources {
  /** Live in-canvas cards (for source === 'card'). */
  cards: MetricCard[];
  /** Tracked-metric series keyed by tracked_metric_id (for source === 'tracked'). */
  trackedValues: Record<string, MetricValue[]>;
  /** Tracked-metric display names keyed by id. */
  trackedNames: Record<string, string>;
}

/**
 * Resolve a widget's config into the chart-ready shape, regardless of source.
 * For tracked metrics we synthesize pseudo-cards `{ id, title, data }` so the
 * exact same `resolveChartSeries` path (used by the canvas Chart node) applies.
 */
export function resolveWidget(
  config: WidgetConfig,
  sources: WidgetDataSources
): ResolvedChart {
  if (config.source === 'tracked') {
    const ids = config.trackedMetricIds ?? [];
    const pseudoCards = ids.map(
      (id) =>
        ({
          id,
          title: sources.trackedNames[id] ?? 'Metric',
          data: sources.trackedValues[id] ?? [],
        }) as unknown as MetricCard
    );
    return resolveChartSeries(pseudoCards, ids);
  }
  // source === 'card'
  return resolveChartSeries(sources.cards, config.cardIds ?? []);
}

export interface KpiSummary {
  label: string;
  value: number | null;
  changePercent: number | null;
  trend: MetricValue['trend'];
}

/** First series' latest point — drives the KPI widget. */
export function resolveKpi(
  config: WidgetConfig,
  sources: WidgetDataSources
): KpiSummary {
  const resolved = resolveWidget(config, sources);
  const first = resolved.series[0];
  if (!first) {
    return { label: '—', value: null, changePercent: null, trend: 'neutral' };
  }
  // Pull the underlying series for the first card to read change/trend.
  const series =
    config.source === 'tracked'
      ? (sources.trackedValues[first.cardId] ?? [])
      : (sources.cards.find((c) => c.id === first.cardId)?.data ?? []);
  const latest = series.length ? series[series.length - 1] : undefined;
  return {
    label: first.label,
    value: latest && typeof latest.value === 'number' ? latest.value : null,
    changePercent: latest?.change_percent ?? null,
    trend: latest?.trend ?? 'neutral',
  };
}
