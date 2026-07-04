import { describe, expect, it } from 'vitest';
import {
  describeExpectedDelta,
  groupLinksByRole,
  isMeasurable,
  isValidLinkInput,
  metricRefKey,
  targetLink,
} from './impactContract';
import type { ImpactContract, MetricLink } from './types';

const link = (over: Partial<MetricLink>): MetricLink => ({
  id: 'l',
  contractId: 'c',
  role: 'target',
  refSource: 'tracked',
  trackedMetricId: 'tm-1',
  cardId: null,
  ...over,
});

const contract = (over: Partial<ImpactContract> = {}): ImpactContract => ({
  id: 'c',
  workspaceId: 'org-1',
  projectId: 'p-1',
  strategyNodeId: 'node-1',
  expectedDirection: null,
  expectedDeltaValue: null,
  expectedDeltaUnit: null,
  baselineStart: null,
  baselineEnd: null,
  measureStart: null,
  measureEnd: null,
  baselineIsManual: false,
  confidence: null,
  impactStatus: 'draft',
  ownerLabel: null,
  resultNote: null,
  createdBy: 'u',
  createdAt: '2026-07-04T00:00:00Z',
  updatedAt: '2026-07-04T00:00:00Z',
  ...over,
});

describe('metricRefKey', () => {
  it('keys tracked and card refs distinctly', () => {
    expect(metricRefKey({ refSource: 'tracked', trackedMetricId: 'a' })).toBe('tracked:a');
    expect(metricRefKey({ refSource: 'card', cardId: 'a' })).toBe('card:a');
  });
  it('returns null when the matching ref is missing', () => {
    expect(metricRefKey({ refSource: 'tracked', cardId: 'a' })).toBeNull();
    expect(metricRefKey({ refSource: 'card', trackedMetricId: 'a' })).toBeNull();
  });
});

describe('isValidLinkInput', () => {
  it('accepts exactly one ref matching refSource', () => {
    expect(isValidLinkInput({ role: 'target', refSource: 'tracked', trackedMetricId: 't' })).toBe(true);
    expect(isValidLinkInput({ role: 'leading', refSource: 'card', cardId: 'c' })).toBe(true);
  });
  it('rejects mismatched, both, or empty refs', () => {
    expect(isValidLinkInput({ role: 'target', refSource: 'tracked', cardId: 'c' })).toBe(false);
    expect(isValidLinkInput({ role: 'target', refSource: 'card', cardId: 'c', trackedMetricId: 't' })).toBe(false);
    expect(isValidLinkInput({ role: 'target', refSource: 'tracked' })).toBe(false);
  });
});

describe('groupLinksByRole / targetLink', () => {
  it('buckets by role and finds the target', () => {
    const links = [
      link({ id: '1', role: 'target' }),
      link({ id: '2', role: 'leading', refSource: 'card', trackedMetricId: null, cardId: 'x' }),
      link({ id: '3', role: 'guardrail' }),
      link({ id: '4', role: 'leading', refSource: 'card', trackedMetricId: null, cardId: 'y' }),
    ];
    const grouped = groupLinksByRole(links);
    expect(grouped.target).toHaveLength(1);
    expect(grouped.leading.map((l) => l.id)).toEqual(['2', '4']);
    expect(grouped.guardrail).toHaveLength(1);
    expect(targetLink(links)?.id).toBe('1');
  });
  it('returns null target when none present', () => {
    expect(targetLink([link({ role: 'guardrail' })])).toBeNull();
  });
});

describe('describeExpectedDelta', () => {
  it('formats percent, absolute, stabilize, and bare direction', () => {
    expect(describeExpectedDelta(contract({ expectedDirection: 'increase', expectedDeltaValue: 5, expectedDeltaUnit: 'percent' }))).toBe('+5%');
    expect(describeExpectedDelta(contract({ expectedDirection: 'decrease', expectedDeltaValue: 3, expectedDeltaUnit: 'absolute' }))).toBe('-3 absolute');
    expect(describeExpectedDelta(contract({ expectedDirection: 'stabilize' }))).toBe('stabilize');
    expect(describeExpectedDelta(contract({ expectedDirection: 'increase' }))).toBe('increase');
    expect(describeExpectedDelta(contract())).toBeNull();
  });
});

describe('isMeasurable', () => {
  it('requires a target, a baseline, and a measurement window', () => {
    const links = [link({ role: 'target' })];
    expect(isMeasurable(contract({ baselineStart: '2026-06', measureStart: '2026-07' }), links)).toBe(true);
    expect(isMeasurable(contract({ baselineIsManual: true, measureStart: '2026-07' }), links)).toBe(true);
    expect(isMeasurable(contract({ measureStart: '2026-07' }), links)).toBe(false); // no baseline
    expect(isMeasurable(contract({ baselineStart: '2026-06' }), links)).toBe(false); // no window
    expect(isMeasurable(contract({ baselineStart: '2026-06', measureStart: '2026-07' }), [])).toBe(false); // no target
  });
});
