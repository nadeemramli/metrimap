import type { MetricValue } from '@/shared/types';

// Read-only projections over a card's existing per-period series for the
// "as of period" / compare views. No I/O, no mutation — purely display.

/**
 * The series as viewed AT a given period: every point whose period is <= the
 * cutoff. Null cutoff = the full (live) series. Periods are compared as strings,
 * which is correct for the canonical 'YYYY-MM' format; other label formats
 * (e.g. "Week 1") degrade gracefully to the full series when they don't match.
 */
export function seriesAsOf(
  data: MetricValue[] | undefined,
  period: string | null
): MetricValue[] {
  if (!Array.isArray(data) || data.length === 0) return [];
  if (!period) return data;
  const viewed = data.filter((d) => d.period <= period);
  // If the cutoff predates the whole series, there's nothing to show yet.
  return viewed;
}

/** The single value AS OF a period: the last point at or before it (else undefined). */
export function valueAsOf(
  data: MetricValue[] | undefined,
  period: string | null
): MetricValue | undefined {
  const viewed = seriesAsOf(data, period);
  return viewed.length ? viewed[viewed.length - 1] : undefined;
}

/** Union of all periods across cards' series, ascending. */
export function availablePeriods(
  seriesList: Array<MetricValue[] | undefined>
): string[] {
  const set = new Set<string>();
  for (const s of seriesList) {
    if (Array.isArray(s)) for (const d of s) set.add(d.period);
  }
  return Array.from(set).sort();
}

/** Signed delta of a card's value between two periods (as-of vs compare). */
export function deltaBetween(
  data: MetricValue[] | undefined,
  asOf: string | null,
  compare: string | null
): { abs: number; pct: number | null } | null {
  if (!compare) return null;
  const now = valueAsOf(data, asOf);
  const then = valueAsOf(data, compare);
  if (!now || !then) return null;
  const abs = now.value - then.value;
  const pct = then.value === 0 ? null : (abs / then.value) * 100;
  return { abs, pct };
}
