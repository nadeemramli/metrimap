import { describe, expect, it } from 'vitest';
import type { MetricCard, Relationship } from '@/shared/types';
import { buildValueJourney } from './valueJourney';

function card(
  id: string,
  category: MetricCard['category'],
  x: number,
  data?: Array<{ value: number; trend: 'up' | 'down' | 'neutral' }>
): MetricCard {
  return {
    id,
    title: id,
    description: '',
    category,
    tags: [],
    causalFactors: [],
    dimensions: [],
    position: { x, y: 0 },
    assignees: [],
    createdAt: '',
    updatedAt: '',
    data: data?.map((d, i) => ({
      period: `2026-0${i + 1}`,
      value: d.value,
      change_percent: 0,
      trend: d.trend,
    })),
  } as MetricCard;
}

function rel(id: string, sourceId: string, targetId: string): Relationship {
  return { id, sourceId, targetId } as Relationship;
}

const signup = card('signup', 'Core/Value', 100);
const activation = card('activation', 'Core/Value', 500);
const mrr = card('mrr', 'Data/Metric', 0, [{ value: 100, trend: 'up' }]);
const churn = card('churn', 'Data/Metric', 0, [{ value: 4, trend: 'down' }]);
const emptyMetric = card('empty', 'Data/Metric', 0);
const experiment = card('experiment', 'Work/Action', 0);
const hypothesis = card('hypothesis', 'Ideas/Hypothesis', 0);

const cards = [
  activation,
  signup,
  mrr,
  churn,
  emptyMetric,
  experiment,
  hypothesis,
];
const relationships = [
  rel('r1', 'signup', 'mrr'),
  rel('r2', 'churn', 'signup'), // direction doesn't matter
  rel('r3', 'signup', 'empty'), // no data → not counted in health
  rel('r4', 'signup', 'experiment'),
  rel('r5', 'hypothesis', 'activation'),
];

describe('buildValueJourney', () => {
  const steps = buildValueJourney(cards, relationships);

  it('orders value cards by canvas x position', () => {
    expect(steps.map((s) => s.card.id)).toEqual(['signup', 'activation']);
  });

  it('rolls up connected metric health, ignoring data-less metrics', () => {
    expect(steps[0].metricHealth).toEqual({ up: 1, down: 1, flat: 0, total: 2 });
    expect(steps[1].metricHealth).toEqual({ up: 0, down: 0, flat: 0, total: 0 });
  });

  it('counts connected work cards', () => {
    expect(steps[0].workCount).toBe(1);
    expect(steps[1].workCount).toBe(1);
  });

  it('returns empty for canvases without value cards', () => {
    expect(buildValueJourney([mrr, experiment], relationships)).toEqual([]);
  });
});
