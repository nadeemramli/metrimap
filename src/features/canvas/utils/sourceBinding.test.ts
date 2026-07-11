import { describe, it, expect } from 'vitest';
import {
  deriveSeries,
  generateSeries,
  parseSeries,
  seriesFromRows,
  buildPeriods,
} from './sourceBinding';

const anchor = new Date(Date.UTC(2026, 0, 1)); // fixed so labels are deterministic

describe('deriveSeries', () => {
  it('derives change_percent and trend from neighbouring values', () => {
    const out = deriveSeries([
      { period: 'p1', value: 100 },
      { period: 'p2', value: 110 },
      { period: 'p3', value: 99 },
      { period: 'p4', value: 99 },
    ]);
    expect(out[0]).toMatchObject({ change_percent: 0, trend: 'neutral' });
    expect(out[1]).toMatchObject({ change_percent: 10, trend: 'up' });
    expect(out[2]).toMatchObject({ change_percent: -10, trend: 'down' });
    expect(out[3]).toMatchObject({ change_percent: 0, trend: 'neutral' });
  });

  it('handles growth from zero without dividing by zero', () => {
    const out = deriveSeries([
      { period: 'p1', value: 0 },
      { period: 'p2', value: 50 },
    ]);
    expect(out[1]).toMatchObject({ change_percent: 100, trend: 'up' });
    expect(Number.isFinite(out[1].change_percent)).toBe(true);
  });

  it('returns an empty array for no points', () => {
    expect(deriveSeries([])).toEqual([]);
  });
});

describe('buildPeriods', () => {
  it('returns count labels oldest-first ending at the anchor', () => {
    const periods = buildPeriods(3, 'Monthly', anchor);
    expect(periods).toEqual(['2025-11-01', '2025-12-01', '2026-01-01']);
  });

  it('steps weekly', () => {
    const periods = buildPeriods(2, 'Weekly', anchor);
    expect(periods).toEqual(['2025-12-25', '2026-01-01']);
  });

  it('clamps monthly steps anchored on day 31 (no duplicate or skipped months)', () => {
    const periods = buildPeriods(6, 'Monthly', new Date(Date.UTC(2026, 4, 31)));
    expect(periods).toEqual([
      '2025-12-31',
      '2026-01-31',
      '2026-02-28',
      '2026-03-31',
      '2026-04-30',
      '2026-05-31',
    ]);
  });

  it('clamps quarterly steps anchored on day 31', () => {
    const periods = buildPeriods(
      4,
      'Quarterly',
      new Date(Date.UTC(2026, 7, 31))
    );
    expect(periods).toEqual([
      '2025-11-30',
      '2026-02-28',
      '2026-05-31',
      '2026-08-31',
    ]);
  });
});

describe('generateSeries', () => {
  it('is deterministic for a fixed seed', () => {
    const opts = {
      periods: 6,
      granularity: 'Monthly' as const,
      start: 100,
      growth: 0.1,
      seasonality: 0.2,
      noise: 0.1,
      seed: 42,
      anchor,
    };
    expect(generateSeries(opts)).toEqual(generateSeries(opts));
  });

  it('produces the requested length and a valid contract', () => {
    const series = generateSeries({
      periods: 12,
      granularity: 'Monthly',
      start: 1000,
      growth: 0.05,
      seasonality: 0.15,
      noise: 0.05,
      seed: 7,
      anchor,
    });
    expect(series).toHaveLength(12);
    for (const point of series) {
      expect(point.value).toBeGreaterThanOrEqual(0);
      expect(['up', 'down', 'neutral']).toContain(point.trend);
      expect(typeof point.change_percent).toBe('number');
    }
  });

  it('trends upward on average with positive growth and no noise', () => {
    const series = generateSeries({
      periods: 10,
      granularity: 'Monthly',
      start: 100,
      growth: 0.1,
      seasonality: 0,
      noise: 0,
      anchor,
    });
    expect(series[series.length - 1].value).toBeGreaterThan(series[0].value);
  });
});

describe('parseSeries', () => {
  it('parses CSV with a header row', () => {
    const out = parseSeries('period,value\n2026-01,100\n2026-02,120');
    expect(out).toHaveLength(2);
    expect(out[0].period).toBe('2026-01');
    expect(out[1]).toMatchObject({ value: 120, change_percent: 20, trend: 'up' });
  });

  it('parses CSV without a header row', () => {
    const out = parseSeries('2026-01,100\n2026-02,90');
    expect(out).toHaveLength(2);
    expect(out[1]).toMatchObject({ trend: 'down' });
  });

  it('parses JSON objects', () => {
    const out = parseSeries('[{"period":"q1","value":5},{"period":"q2","value":10}]');
    expect(out[1]).toMatchObject({ value: 10, change_percent: 100, trend: 'up' });
  });

  it('parses JSON tuples', () => {
    const out = parseSeries('[["a",1],["b",2]]');
    expect(out).toHaveLength(2);
  });

  it('throws on empty input', () => {
    expect(() => parseSeries('   ')).toThrow();
  });

  it('throws on a non-numeric value', () => {
    expect(() => parseSeries('2026-01,abc')).toThrow();
  });

  it('throws on malformed JSON', () => {
    expect(() => parseSeries('[{bad}]')).toThrow();
  });
});

describe('seriesFromRows', () => {
  it('maps period/value rows through the contract', () => {
    const out = seriesFromRows([
      { period: '2026-01', value: 10 },
      { period: '2026-02', value: 15 },
    ]);
    expect(out[1]).toMatchObject({ value: 15, change_percent: 50, trend: 'up' });
  });

  it('accepts date/y aliases', () => {
    const out = seriesFromRows([
      { date: '2026-01', y: 10 },
      { date: '2026-02', y: 5 },
    ]);
    expect(out[1]).toMatchObject({ value: 5, trend: 'down' });
  });

  it('throws when a column is missing', () => {
    expect(() => seriesFromRows([{ foo: 1 } as any])).toThrow();
  });
});
