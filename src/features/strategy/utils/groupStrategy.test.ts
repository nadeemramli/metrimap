import { describe, expect, it } from 'vitest';
import type { MetricCard } from '@/shared/types';
import { buildGroupStrategy, isWorkCard } from './groupStrategy';

function card(
  id: string,
  category: MetricCard['category'],
  status?: MetricCard['status'],
  priority?: 'High' | 'Medium' | 'Low'
): MetricCard {
  return {
    id,
    title: id,
    description: '',
    category,
    tags: [],
    causalFactors: [],
    dimensions: [],
    position: { x: 0, y: 0 },
    assignees: [],
    createdAt: '',
    updatedAt: '',
    status: status ?? null,
    workflow: priority ? { priority } : {},
  } as MetricCard;
}

const experiment = card('experiment', 'Work/Action', 'in_progress', 'High');
const initiative = card('initiative', 'Work/Action', 'in_progress', 'Low');
const hypothesis = card('hypothesis', 'Ideas/Hypothesis'); // no status → backlog
const shipped = card('shipped', 'Work/Action', 'done');
const metric = card('metric', 'Data/Metric', 'in_progress'); // filtered out

describe('isWorkCard', () => {
  it('accepts only Work/Action and Ideas/Hypothesis', () => {
    expect(isWorkCard(experiment)).toBe(true);
    expect(isWorkCard(hypothesis)).toBe(true);
    expect(isWorkCard(metric)).toBe(false);
  });
});

describe('buildGroupStrategy', () => {
  const board = buildGroupStrategy([
    initiative,
    experiment,
    hypothesis,
    shipped,
    metric,
  ]);

  it('produces the five lifecycle columns in order', () => {
    expect(board.columns.map((c) => c.status)).toEqual([
      'backlog',
      'planning',
      'in_progress',
      'done',
      'on_hold',
    ]);
  });

  it('buckets by status with NULL rendering as backlog, excluding non-work cards', () => {
    const byStatus = Object.fromEntries(
      board.columns.map((c) => [c.status, c.cards.map((x) => x.id)])
    );
    expect(byStatus.backlog).toEqual(['hypothesis']);
    expect(byStatus.in_progress).toEqual(['experiment', 'initiative']); // High before Low
    expect(byStatus.done).toEqual(['shipped']);
    expect(byStatus.planning).toEqual([]);
    expect(byStatus.on_hold).toEqual([]);
  });

  it('counts actions, hypotheses and done', () => {
    expect(board.counts).toEqual({
      actions: 3,
      hypotheses: 1,
      total: 4,
      done: 1,
    });
  });
});
