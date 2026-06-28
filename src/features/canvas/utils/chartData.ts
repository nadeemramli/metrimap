import type { ChartConfig } from '@/shared/components/ui/chart';
import type { MetricCard } from '@/shared/types';

// A small, pleasant palette. Series are assigned a colour by their index in the
// chart's `seriesCardIds`, so a given chart stays visually stable as cards load.
export const PALETTE = [
  '#2563eb', // blue
  '#16a34a', // green
  '#f59e0b', // amber
  '#db2777', // pink
  '#7c3aed', // violet
  '#0891b2', // cyan
];

export interface ChartSeriesMeta {
  /** CSS-var-safe key (`s0`, `s1`, …) used as the Recharts dataKey + colour var. */
  key: string;
  label: string;
  color: string;
  cardId: string;
}

export interface ResolvedChart {
  config: ChartConfig;
  series: ChartSeriesMeta[];
  /** One row per period: `{ period, s0?, s1?, … }` (missing values omitted). */
  rows: Array<Record<string, number | string>>;
  /** Latest value per series — used for the pie chart. */
  pie: Array<{ key: string; label: string; value: number; fill: string }>;
  hasData: boolean;
}

/**
 * Resolves the selected metric cards into everything the chart node needs:
 * a `ChartConfig` (drives `ui/chart.tsx` theming + `--color-*` vars), merged
 * `rows` keyed by period, and per-series `pie` slices. Pure + side-effect free.
 *
 * Periods are kept in first-seen order across the selected cards (NOT sorted),
 * so label-style periods like "Week 1".."Week 10" don't get string-misordered.
 */
export function resolveChartSeries(
  cards: MetricCard[],
  seriesCardIds: string[]
): ResolvedChart {
  const byId = new Map(cards.map((c) => [c.id, c]));

  const series: ChartSeriesMeta[] = [];
  seriesCardIds.forEach((id, i) => {
    const card = byId.get(id);
    if (!card) return;
    series.push({
      key: `s${i}`,
      label: card.title || `Series ${i + 1}`,
      color: PALETTE[i % PALETTE.length],
      cardId: id,
    });
  });

  const config: ChartConfig = {};
  series.forEach((s) => {
    config[s.key] = { label: s.label, color: s.color };
  });

  // Union of periods in first-seen order.
  const periods: string[] = [];
  const seen = new Set<string>();
  series.forEach((s) => {
    const card = byId.get(s.cardId);
    (card?.data || []).forEach((v) => {
      if (v && v.period != null && !seen.has(v.period)) {
        seen.add(v.period);
        periods.push(v.period);
      }
    });
  });

  const rows = periods.map((period) => {
    const row: Record<string, number | string> = { period };
    series.forEach((s) => {
      const card = byId.get(s.cardId);
      const pt = (card?.data || []).find((v) => v.period === period);
      if (pt && typeof pt.value === 'number' && !Number.isNaN(pt.value)) {
        row[s.key] = pt.value;
      }
    });
    return row;
  });

  const pie = series.map((s) => {
    const data = byId.get(s.cardId)?.data || [];
    const last = data.length ? data[data.length - 1] : undefined;
    return {
      key: s.key,
      label: s.label,
      value: last && typeof last.value === 'number' ? last.value : 0,
      fill: s.color,
    };
  });

  return {
    config,
    series,
    rows,
    pie,
    hasData: series.length > 0 && rows.length > 0,
  };
}

/** Compact axis/tooltip number formatting (1.2K, 3.4M…). */
export function formatCompact(n: number): string {
  if (n == null || Number.isNaN(n)) return '';
  return new Intl.NumberFormat(undefined, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n);
}
