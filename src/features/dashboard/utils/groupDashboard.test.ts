import { describe, expect, it } from 'vitest';
import type { GroupNode, MetricCard } from '@/shared/types';
import { buildGroupDashboard, resolveGroupMembers } from './groupDashboard';

// Fixtures mirror the seed shape (scripts/seed/example-metric-trees.sql):
// a "Revenue & MRR" group whose node_ids reference metric_cards carrying a
// monthly time-series in `data`.
type Trend = 'up' | 'down' | 'neutral';
function card(
  id: string,
  title: string,
  category: MetricCard['category'],
  series: Array<[string, number, number, Trend]>
): MetricCard {
  return {
    id,
    title,
    description: '',
    category,
    tags: [],
    causalFactors: [],
    dimensions: [],
    position: { x: 0, y: 0 },
    assignees: [],
    createdAt: '',
    updatedAt: '',
    data: series.map(([period, value, change_percent, trend]) => ({
      period,
      value,
      change_percent,
      trend,
    })),
  } as MetricCard;
}

const revenue = card('c-arr', 'Revenue (ARR)', 'Data/Metric', [
  ['2026-05', 234819, 3.3, 'up'],
  ['2026-06', 248833, 6, 'up'],
]);
const mrr = card('c-mrr', 'MRR', 'Data/Metric', [
  ['2026-05', 78541, 2.2, 'up'],
  ['2026-06', 79585, 1.3, 'up'],
]);
const churn = card('c-churn', 'Churn', 'Data/Metric', [
  ['2026-05', 4.1, -0.2, 'down'],
  ['2026-06', 3.8, -0.3, 'down'],
]);
const emptyCard = card('c-empty', 'Placeholder', 'Work/Action', []);

const allCards = [revenue, mrr, churn, emptyCard];

const group: GroupNode = {
  id: 'g-rev',
  name: 'Revenue & MRR',
  color: '#22c55e',
  nodeIds: ['c-arr', 'c-mrr', 'c-churn', 'c-empty'],
  position: { x: 0, y: 0 },
  size: { width: 100, height: 100 },
};

describe('resolveGroupMembers', () => {
  it('resolves persisted nodeIds to cards', () => {
    const members = resolveGroupMembers(group, allCards);
    expect(members.map((c) => c.id).sort()).toEqual([
      'c-arr',
      'c-churn',
      'c-empty',
      'c-mrr',
    ]);
  });

  it('falls back to parentId for in-session (unsaved) membership', () => {
    const orphan = { ...emptyCard, id: 'c-orphan', parentId: 'g-rev' };
    const members = resolveGroupMembers(
      { ...group, nodeIds: [] },
      [...allCards, orphan as MetricCard]
    );
    expect(members.map((c) => c.id)).toContain('c-orphan');
  });
});

describe('buildGroupDashboard', () => {
  const data = buildGroupDashboard(group, allCards);

  it('summarises only data-bearing cards as KPIs', () => {
    expect(data.kpis.map((k) => k.cardId).sort()).toEqual([
      'c-arr',
      'c-churn',
      'c-mrr',
    ]);
    const arr = data.kpis.find((k) => k.cardId === 'c-arr')!;
    expect(arr.value).toBe(248833);
    expect(arr.changePercent).toBe(6);
    expect(arr.trend).toBe('up');
    expect(arr.spark).toEqual([234819, 248833]);
  });

  it('counts members per category', () => {
    expect(data.categoryCounts).toEqual({
      'Data/Metric': 3,
      'Work/Action': 1,
    });
  });

  it('computes trend health across data cards', () => {
    expect(data.health).toEqual({ up: 2, down: 1, flat: 0, total: 3 });
  });

  it('produces chart series ordered by latest value (largest first)', () => {
    // ARR (248833) > MRR (79585) > Churn (3.8)
    expect(data.chartCards.map((c) => c.id)).toEqual([
      'c-arr',
      'c-mrr',
      'c-churn',
    ]);
    expect(data.chart.hasData).toBe(true);
    expect(data.latest[0]).toMatchObject({ label: 'Revenue (ARR)', value: 248833 });
  });

  it('is empty-safe when a group has no data-bearing cards', () => {
    const empty = buildGroupDashboard(
      { ...group, nodeIds: ['c-empty'] },
      allCards
    );
    expect(empty.kpis).toHaveLength(0);
    expect(empty.chart.hasData).toBe(false);
    expect(empty.health.total).toBe(0);
  });
});
