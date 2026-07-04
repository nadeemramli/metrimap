import { describe, expect, it } from 'vitest';
import {
  dominantStatus,
  effectiveStatus,
  linkedStrategyForWidget,
  type WidgetLike,
} from './widgetLinks';
import type { ImpactContract, MetricLink } from './types';
import type { MetricCard } from '@/shared/types';

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

const contract = (nodeId: string, over: Partial<ImpactContract> = {}): ImpactContract => ({
  id: `c_${nodeId}`,
  workspaceId: null,
  projectId: null,
  strategyNodeId: nodeId,
  expectedDirection: null,
  expectedDeltaValue: null,
  expectedDeltaUnit: null,
  baselineStart: null,
  baselineEnd: null,
  measureStart: null,
  measureEnd: null,
  baselineIsManual: false,
  confidence: null,
  impactStatus: 'planned',
  ownerLabel: null,
  resultNote: null,
  createdBy: 'u',
  createdAt: '',
  updatedAt: '',
  ...over,
});

const link = (contractId: string, over: Partial<MetricLink>): MetricLink => ({
  id: Math.random().toString(36).slice(2),
  contractId,
  role: 'target',
  refSource: 'card',
  trackedMetricId: null,
  cardId: null,
  ...over,
});

const widget = (config: WidgetLike['config']): WidgetLike => ({ id: 'w', title: 'W', config });

const cards = [
  card('act1', { title: 'Ship checkout', category: 'Work/Action', owner: 'u1' }),
  card('act2', { title: 'Upsell test', category: 'Ideas/Hypothesis' }),
  card('cvr', { title: 'Checkout CVR', trackedMetricId: 'tm_cvr' }),
  card('aov', { title: 'AOV' }),
];

describe('linkedStrategyForWidget', () => {
  const entries = [
    { contract: contract('act1'), links: [link('c_act1', { role: 'target', refSource: 'card', cardId: 'cvr' })] },
    { contract: contract('act2'), links: [link('c_act2', { role: 'guardrail', refSource: 'card', cardId: 'aov' })] },
  ];

  it('matches a card-bound widget to a card-ref contract, with the role', () => {
    const links = linkedStrategyForWidget(widget({ cardIds: ['cvr'] }), entries, cards);
    expect(links).toHaveLength(1);
    expect(links[0].node?.id).toBe('act1');
    expect(links[0].roles).toEqual(['target']);
  });

  it('cross-maps: a tracked-bound widget matches a card-ref contract via placement', () => {
    // widget shows tracked tm_cvr; contract targets card cvr (placement of tm_cvr)
    const links = linkedStrategyForWidget(widget({ trackedMetricIds: ['tm_cvr'] }), entries, cards);
    expect(links.map((l) => l.node?.id)).toEqual(['act1']);
  });

  it('returns [] when no metric matches', () => {
    expect(linkedStrategyForWidget(widget({ cardIds: ['nope'] }), entries, cards)).toEqual([]);
  });

  it('collects multiple roles when several links hit the same widget', () => {
    const multi = [
      {
        contract: contract('act1'),
        links: [
          link('c_act1', { role: 'target', refSource: 'card', cardId: 'cvr' }),
          link('c_act1', { role: 'guardrail', refSource: 'tracked', trackedMetricId: 'tm_cvr' }),
        ],
      },
    ];
    const links = linkedStrategyForWidget(widget({ cardIds: ['cvr'] }), multi, cards);
    expect(links[0].roles.sort()).toEqual(['guardrail', 'target']);
  });
});

describe('effectiveStatus / dominantStatus', () => {
  it('derives review_ready when measuring past the window', () => {
    expect(effectiveStatus(contract('a', { impactStatus: 'measuring', measureEnd: '2026-06' }), '2026-07')).toBe('review_ready');
    expect(effectiveStatus(contract('a', { impactStatus: 'measuring', measureEnd: '2026-08' }), '2026-07')).toBe('measuring');
    expect(effectiveStatus(contract('a', { impactStatus: 'won' }), '2026-07')).toBe('won');
  });

  it('dominant status picks the most attention-worthy', () => {
    const links = [
      { contract: contract('a', { impactStatus: 'won' }), node: null, roles: ['target' as const] },
      { contract: contract('b', { impactStatus: 'measuring', measureEnd: '2026-06' }), node: null, roles: ['target' as const] },
    ];
    expect(dominantStatus(links, '2026-07')).toBe('review_ready');
    expect(dominantStatus([], '2026-07')).toBeNull();
  });
});
