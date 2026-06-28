import { describe, expect, it } from 'vitest';
import { PALETTE, formatCompact, resolveChartSeries } from './chartData';
import type { MetricCard } from '@/shared/types';

const card = (
  id: string,
  title: string,
  points: Array<[string, number]>
): MetricCard =>
  ({
    id,
    title,
    description: '',
    category: 'Data/Metric',
    tags: [],
    causalFactors: [],
    dimensions: [],
    position: { x: 0, y: 0 },
    assignees: [],
    createdAt: '',
    updatedAt: '',
    data: points.map(([period, value]) => ({
      period,
      value,
      change_percent: 0,
      trend: 'neutral' as const,
    })),
  }) as MetricCard;

describe('resolveChartSeries', () => {
  it('builds one series per selected card with stable keys + palette colours', () => {
    const cards = [
      card('a', 'MRR', [['Jan', 100]]),
      card('b', 'Churn', [['Jan', 5]]),
    ];
    const { series, config } = resolveChartSeries(cards, ['a', 'b']);
    expect(series.map((s) => s.key)).toEqual(['s0', 's1']);
    expect(series.map((s) => s.label)).toEqual(['MRR', 'Churn']);
    expect(series[0].color).toBe(PALETTE[0]);
    expect(series[1].color).toBe(PALETTE[1]);
    expect(config.s0).toEqual({ label: 'MRR', color: PALETTE[0] });
  });

  it('merges periods in first-seen order (no string sort) and gaps missing values', () => {
    const cards = [
      card('a', 'A', [
        ['Week 1', 10],
        ['Week 2', 20],
        ['Week 10', 30],
      ]),
      card('b', 'B', [
        ['Week 2', 200],
        ['Week 3', 300],
      ]),
    ];
    const { rows } = resolveChartSeries(cards, ['a', 'b']);
    // first-seen order: Week 1, Week 2, Week 10 (from A), then Week 3 (new from B)
    expect(rows.map((r) => r.period)).toEqual([
      'Week 1',
      'Week 2',
      'Week 10',
      'Week 3',
    ]);
    // Week 1 has only A's value; B's key is absent (gap), not 0.
    expect(rows[0]).toEqual({ period: 'Week 1', s0: 10 });
    expect(rows[1]).toEqual({ period: 'Week 2', s0: 20, s1: 200 });
    expect(rows[3]).toEqual({ period: 'Week 3', s1: 300 });
  });

  it('pie uses the latest value per series', () => {
    const cards = [
      card('a', 'A', [
        ['Jan', 1],
        ['Feb', 9],
      ]),
      card('b', 'B', [['Jan', 4]]),
    ];
    const { pie } = resolveChartSeries(cards, ['a', 'b']);
    expect(pie).toEqual([
      { key: 's0', label: 'A', value: 9, fill: PALETTE[0] },
      { key: 's1', label: 'B', value: 4, fill: PALETTE[1] },
    ]);
  });

  it('ignores unknown / missing card ids and reports hasData', () => {
    const cards = [card('a', 'A', [['Jan', 1]])];
    const resolved = resolveChartSeries(cards, ['a', 'ghost']);
    expect(resolved.series).toHaveLength(1);
    expect(resolved.hasData).toBe(true);

    const empty = resolveChartSeries(cards, []);
    expect(empty.hasData).toBe(false);
    expect(empty.rows).toEqual([]);
  });
});

describe('formatCompact', () => {
  it('formats large numbers compactly and guards NaN', () => {
    expect(formatCompact(1200)).toMatch(/1\.2K/);
    expect(formatCompact(3_400_000)).toMatch(/3\.4M/);
    expect(formatCompact(NaN)).toBe('');
  });
});
