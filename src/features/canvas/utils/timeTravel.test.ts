import { describe, expect, it } from 'vitest';
import {
  availablePeriods,
  deltaBetween,
  seriesAsOf,
  valueAsOf,
} from './timeTravel';
import type { MetricValue } from '@/shared/types';

const mv = (period: string, value: number): MetricValue => ({
  period,
  value,
  change_percent: 0,
  trend: 'neutral',
});

const series = [mv('2026-01', 10), mv('2026-02', 20), mv('2026-03', 30)];

describe('seriesAsOf', () => {
  it('returns the full series when no cutoff', () => {
    expect(seriesAsOf(series, null)).toHaveLength(3);
  });
  it('truncates to points at or before the cutoff', () => {
    expect(seriesAsOf(series, '2026-02').map((d) => d.value)).toEqual([10, 20]);
  });
  it('is empty when the cutoff predates the series', () => {
    expect(seriesAsOf(series, '2025-12')).toHaveLength(0);
  });
});

describe('valueAsOf', () => {
  it('picks the last point at/before the period', () => {
    expect(valueAsOf(series, '2026-02')?.value).toBe(20);
  });
  it('latest when no cutoff', () => {
    expect(valueAsOf(series, null)?.value).toBe(30);
  });
  it('undefined before the series starts', () => {
    expect(valueAsOf(series, '2025-01')).toBeUndefined();
  });
});

describe('availablePeriods', () => {
  it('unions and sorts periods across cards', () => {
    expect(
      availablePeriods([series, [mv('2026-02', 5), mv('2026-04', 9)]])
    ).toEqual(['2026-01', '2026-02', '2026-03', '2026-04']);
  });
});

describe('deltaBetween', () => {
  it('computes abs + pct delta between two periods', () => {
    expect(deltaBetween(series, '2026-03', '2026-01')).toEqual({
      abs: 20,
      pct: 200,
    });
  });
  it('null when no compare period', () => {
    expect(deltaBetween(series, '2026-03', null)).toBeNull();
  });
});
