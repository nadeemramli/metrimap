import { describe, expect, it } from 'vitest';
import { resolveImpactTrace, type TraceWidget } from './impactTrace';
import type { MetricLink } from './types';
import type { MetricCard, Relationship } from '@/shared/types';

// --- fixture builders --------------------------------------------------------
const card = (id: string, over: Partial<MetricCard> = {}): MetricCard => ({
  id,
  title: id,
  description: '',
  category: 'Data/Metric',
  tags: [],
  causalFactors: [],
  dimensions: [],
  position: { x: 0, y: 0 },
  assignees: [],
  createdAt: '',
  updatedAt: '',
  ...over,
});

const edge = (sourceId: string, targetId: string): Relationship => ({
  id: `${sourceId}->${targetId}`,
  sourceId,
  targetId,
  type: 'Deterministic',
  confidence: 'High',
  evidence: [],
  createdAt: '',
  updatedAt: '',
});

const link = (over: Partial<MetricLink>): MetricLink => ({
  id: Math.random().toString(36).slice(2),
  contractId: 'c',
  role: 'target',
  refSource: 'card',
  trackedMetricId: null,
  cardId: null,
  ...over,
});

const widget = (id: string, config: TraceWidget['config']): TraceWidget => ({
  id,
  title: id,
  config,
});

// Tree: checkout_cvr --> revenue --> north_star (KPI, terminal)
const tree = [
  card('checkout_cvr', { trackedMetricId: 'tm_cvr' }),
  card('revenue'),
  card('north_star', { category: 'Core/Value' }),
  card('aov', { trackedMetricId: 'tm_aov' }),
];
const treeEdges = [edge('checkout_cvr', 'revenue'), edge('revenue', 'north_star')];

describe('resolveImpactTrace — full path', () => {
  it('resolves target, KPI roll-up path, and dashboard widget', () => {
    const links = [
      link({ role: 'target', refSource: 'tracked', trackedMetricId: 'tm_cvr' }),
      link({ role: 'leading', refSource: 'card', cardId: 'revenue' }),
      link({ role: 'guardrail', refSource: 'tracked', trackedMetricId: 'tm_aov' }),
    ];
    const widgets = [
      widget('w1', { source: 'tracked', trackedMetricIds: ['tm_cvr'] }),
      widget('w2', { source: 'card', cardIds: ['aov'] }),
    ];
    const trace = resolveImpactTrace({
      strategyNodeId: 'action_1',
      links,
      cards: tree,
      relationships: treeEdges,
      widgets,
    });

    expect(trace.target?.card?.id).toBe('checkout_cvr');
    expect(trace.target?.onCanvas).toBe(true);
    expect(trace.kpiPath.map((c) => c.id)).toEqual(['checkout_cvr', 'revenue', 'north_star']);
    expect(trace.kpi?.id).toBe('north_star');
    expect(trace.target?.widgets.map((w) => w.id)).toEqual(['w1']);
    // guardrail aov is shown on w2 (card-bound to a placement of tm_aov)
    expect(trace.guardrails[0].widgets.map((w) => w.id)).toEqual(['w2']);
    expect(trace.leading.map((l) => l.card?.id)).toEqual(['revenue']);
    expect(trace.missing).toEqual({
      noTarget: false,
      targetNotOnCanvas: false,
      noKpiPath: false,
      noDashboard: false,
    });
  });
});

describe('resolveImpactTrace — partial path', () => {
  it('target on canvas but no dashboard widget → noDashboard', () => {
    const trace = resolveImpactTrace({
      strategyNodeId: 'a',
      links: [link({ role: 'target', refSource: 'card', cardId: 'checkout_cvr' })],
      cards: tree,
      relationships: treeEdges,
      widgets: [],
    });
    expect(trace.kpi?.id).toBe('north_star');
    expect(trace.missing.noDashboard).toBe(true);
    expect(trace.missing.noKpiPath).toBe(false);
  });

  it('target is terminal (top-level) → noKpiPath true, kpi = target', () => {
    const trace = resolveImpactTrace({
      strategyNodeId: 'a',
      links: [link({ role: 'target', refSource: 'card', cardId: 'north_star' })],
      cards: tree,
      relationships: treeEdges,
    });
    expect(trace.kpiPath.map((c) => c.id)).toEqual(['north_star']);
    expect(trace.kpi?.id).toBe('north_star');
    expect(trace.missing.noKpiPath).toBe(true);
  });

  it('picks the longest roll-up branch deterministically', () => {
    // m0 --> m1 (terminal) and m0 --> m2 --> m3 (longer); expect the longer chain
    const cards = [card('m0'), card('m1'), card('m2'), card('m3')];
    const edges = [edge('m0', 'm1'), edge('m0', 'm2'), edge('m2', 'm3')];
    const trace = resolveImpactTrace({
      strategyNodeId: 'a',
      links: [link({ role: 'target', refSource: 'card', cardId: 'm0' })],
      cards,
      relationships: edges,
    });
    expect(trace.kpiPath.map((c) => c.id)).toEqual(['m0', 'm2', 'm3']);
  });

  it('survives a cycle in the tree', () => {
    const cards = [card('x'), card('y')];
    const edges = [edge('x', 'y'), edge('y', 'x')];
    const trace = resolveImpactTrace({
      strategyNodeId: 'a',
      links: [link({ role: 'target', refSource: 'card', cardId: 'x' })],
      cards,
      relationships: edges,
    });
    expect(trace.kpiPath.map((c) => c.id)).toEqual(['x', 'y']);
  });
});

describe('resolveImpactTrace — missing path', () => {
  it('no target link → noTarget', () => {
    const trace = resolveImpactTrace({
      strategyNodeId: 'a',
      links: [link({ role: 'guardrail', refSource: 'card', cardId: 'aov' })],
      cards: tree,
      relationships: treeEdges,
    });
    expect(trace.target).toBeNull();
    expect(trace.missing.noTarget).toBe(true);
    expect(trace.kpiPath).toEqual([]);
    expect(trace.kpi).toBeNull();
  });

  it('target tracked metric not placed on the canvas → targetNotOnCanvas', () => {
    const trace = resolveImpactTrace({
      strategyNodeId: 'a',
      links: [link({ role: 'target', refSource: 'tracked', trackedMetricId: 'tm_not_here' })],
      cards: tree,
      relationships: treeEdges,
    });
    expect(trace.target?.onCanvas).toBe(false);
    expect(trace.missing.targetNotOnCanvas).toBe(true);
    expect(trace.missing.noKpiPath).toBe(true);
    expect(trace.kpiPath).toEqual([]);
  });
});
