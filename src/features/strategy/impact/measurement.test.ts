import { describe, expect, it } from 'vitest';
import { buildSeriesByKey, evaluateImpact, measuredByNode } from './measurement';
import type { ImpactContract, MetricLink } from './types';
import type { MetricCard, MetricValue } from '@/shared/types';

const mv = (period: string, value: number): MetricValue => ({
  period,
  value,
  change_percent: 0,
  trend: 'neutral',
});

const contract = (over: Partial<ImpactContract> = {}): ImpactContract => ({
  id: 'c',
  workspaceId: null,
  projectId: null,
  strategyNodeId: 'act',
  expectedDirection: 'increase',
  expectedDeltaValue: 5,
  expectedDeltaUnit: 'percent',
  baselineStart: '2026-05',
  baselineEnd: '2026-05',
  measureStart: '2026-07',
  measureEnd: '2026-07',
  baselineIsManual: false,
  confidence: null,
  impactStatus: 'measuring',
  ownerLabel: null,
  resultNote: null,
  createdBy: 'u',
  createdAt: '',
  updatedAt: '',
  ...over,
});

const tLink: MetricLink = { id: 't', contractId: 'c', role: 'target', refSource: 'tracked', trackedMetricId: 'tm_cvr', cardId: null };
const gLink: MetricLink = { id: 'g', contractId: 'c', role: 'guardrail', refSource: 'tracked', trackedMetricId: 'tm_aov', cardId: null };
const cardTarget: MetricLink = { id: 't2', contractId: 'c', role: 'target', refSource: 'card', trackedMetricId: null, cardId: 'card_cvr' };

describe('evaluateImpact', () => {
  it('expected +5%, actual +7%, guardrail passes → met, won', () => {
    const series = {
      'tracked:tm_cvr': [mv('2026-05', 100), mv('2026-07', 107)], // +7%
      'tracked:tm_aov': [mv('2026-05', 50), mv('2026-07', 51)], // +2% within tolerance
    };
    const e = evaluateImpact(contract(), [tLink, gLink], series);
    expect(e.target?.pctDelta).toBeCloseTo(7);
    expect(e.met).toBe('met');
    expect(e.guardrailStatus).toBe('pass');
    expect(e.suggestedResult).toBe('won');
  });

  it('target improves but a guardrail fails → blocked from won (inconclusive)', () => {
    const series = {
      'tracked:tm_cvr': [mv('2026-05', 100), mv('2026-07', 110)], // +10%
      'tracked:tm_aov': [mv('2026-05', 50), mv('2026-07', 60)], // +20% breach
    };
    const e = evaluateImpact(contract(), [tLink, gLink], series);
    expect(e.met).toBe('met');
    expect(e.guardrails[0].status).toBe('fail');
    expect(e.guardrailStatus).toBe('fail');
    expect(e.suggestedResult).toBe('inconclusive');
  });

  it('no data as of the measurement window → unknown, inconclusive', () => {
    const series = { 'tracked:tm_cvr': [mv('2026-05', 100)] }; // no 2026-07 point
    const e = evaluateImpact(contract(), [tLink], series);
    expect(e.target?.hasData).toBe(false);
    expect(e.met).toBe('unknown');
    expect(e.suggestedResult).toBe('inconclusive');
  });

  it('target misses the expected delta → lost', () => {
    const series = { 'tracked:tm_cvr': [mv('2026-05', 100), mv('2026-07', 102)] }; // +2% < +5%
    const e = evaluateImpact(contract(), [tLink], series);
    expect(e.met).toBe('missed');
    expect(e.suggestedResult).toBe('lost');
  });

  it('manual baseline (card series) is flagged manual', () => {
    const series = { 'card:card_cvr': [mv('2026-05', 10), mv('2026-07', 12)] };
    const e = evaluateImpact(contract(), [cardTarget], series);
    expect(e.target?.manual).toBe(true);
    expect(e.target?.absDelta).toBe(2);
  });

  it('decrease direction: a drop meeting the target is met', () => {
    const series = { 'tracked:tm_cvr': [mv('2026-05', 100), mv('2026-07', 90)] }; // -10%
    const e = evaluateImpact(contract({ expectedDirection: 'decrease', expectedDeltaValue: 5 }), [tLink], series);
    expect(e.met).toBe('met');
  });

  it('stabilize: within tolerance is met', () => {
    const series = { 'tracked:tm_cvr': [mv('2026-05', 100), mv('2026-07', 101)] }; // +1%
    const e = evaluateImpact(contract({ expectedDirection: 'stabilize', expectedDeltaValue: 2 }), [tLink], series);
    expect(e.met).toBe('met');
  });
});

const card = (id: string, over: Partial<MetricCard> = {}): MetricCard => ({
  id, title: id, description: '', category: 'Data/Metric', tags: [], causalFactors: [],
  dimensions: [], position: { x: 0, y: 0 }, assignees: [], createdAt: '', updatedAt: '', ...over,
});

describe('buildSeriesByKey / measuredByNode', () => {
  it('resolves tracked series from the values map and card series from card.data', () => {
    const cards: MetricCard[] = [card('card_x', { data: [mv('2026-05', 4), mv('2026-07', 6)] })];
    const links: MetricLink[] = [
      tLink,
      { id: 'c', contractId: 'c', role: 'leading', refSource: 'card', trackedMetricId: null, cardId: 'card_x' },
    ];
    const map = buildSeriesByKey(links, cards, { tm_cvr: [mv('2026-05', 100)] });
    expect(map['tracked:tm_cvr']).toHaveLength(1);
    expect(map['card:card_x']).toHaveLength(2);
  });

  it('measuredByNode returns a compact measured summary per node', () => {
    const entries = [
      { contract: contract(), links: [tLink] },
    ];
    const measured = measuredByNode(entries, [], { tm_cvr: [mv('2026-05', 100), mv('2026-07', 107)] });
    expect(measured['act'].deltaText).toBe('+7.0%');
    expect(measured['act'].met).toBe('met');
    expect(measured['act'].hasData).toBe(true);
  });
});
