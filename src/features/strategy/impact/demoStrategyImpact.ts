// Strategy impact demo dataset (CVS-177). A canonical "Grow Revenue per Visitor"
// scenario that exercises the whole pipeline in one coherent tree:
//
//   KPI (Revenue per Visitor)
//     └ Revenue
//         └ Checkout CVR  ← target, on a dashboard widget
//   Pillar "Conversion"
//     Hypothesis "Fewer steps lifts conversion"  --supports-->  Action "Ship one-page checkout"
//        Action bet: target Checkout CVR (+5%), leading Add-to-cart rate,
//                    guardrails AOV + Refund rate, window 2026-05 → 2026-07.
//
// Pure data — used by the end-to-end test (demoStrategyImpact.test.ts) and as the
// documented scenario the manual QA suite builds by hand. No I/O.

import type { GroupNode, MetricCard, MetricValue, Relationship } from '@/shared/types';
import type { ImpactContract, MetricLink } from './types';
import type { TraceWidget } from './impactTrace';

const mv = (period: string, value: number): MetricValue => ({
  period,
  value,
  change_percent: 0,
  trend: 'neutral',
});

const card = (id: string, title: string, category: MetricCard['category'], over: Partial<MetricCard> = {}): MetricCard => ({
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

export interface DemoStrategyImpact {
  cards: MetricCard[];
  relationships: Relationship[];
  groups: GroupNode[];
  /** tracked_metric_id → series (as the shared metric_values store would return). */
  trackedValues: Record<string, MetricValue[]>;
  /** Contracts + links as listContractsWithLinksForProject would return. */
  entries: Array<{ contract: ImpactContract; links: MetricLink[] }>;
  widgets: TraceWidget[];
  ids: {
    kpi: string;
    revenue: string;
    checkoutCvr: string;
    addToCart: string;
    aov: string;
    refundRate: string;
    action: string;
    hypothesis: string;
    trackedCheckoutCvr: string;
    widget: string;
  };
}

export function buildDemoStrategyImpact(): DemoStrategyImpact {
  const trackedCheckoutCvr = 'tm_checkout_cvr';
  const trackedAov = 'tm_aov';

  const cards: MetricCard[] = [
    card('kpi', 'Revenue per Visitor', 'Core/Value'),
    card('revenue', 'Revenue', 'Data/Metric'),
    card('checkout_cvr', 'Checkout CVR', 'Data/Metric', { trackedMetricId: trackedCheckoutCvr }),
    card('add_to_cart', 'Add-to-cart rate', 'Data/Metric', { data: [mv('2026-05', 22), mv('2026-07', 24)] }),
    card('aov', 'AOV', 'Data/Metric', { trackedMetricId: trackedAov }),
    card('refund_rate', 'Refund rate', 'Data/Metric', { data: [mv('2026-05', 2.0), mv('2026-07', 2.0)] }),
    card('act_checkout', 'Ship one-page checkout', 'Work/Action', {
      status: 'in_progress',
      owner: 'demo-user',
    }),
    card('hyp_steps', 'Fewer steps lifts conversion', 'Ideas/Hypothesis'),
  ];

  // Metric tree: checkout_cvr → revenue → KPI (the roll-up path).
  const relationships: Relationship[] = [
    edge('checkout_cvr', 'revenue'),
    edge('revenue', 'kpi'),
    // hypothesis supports the action (work-card link, not part of the metric tree)
    edge('hyp_steps', 'act_checkout'),
  ];

  const groups: GroupNode[] = [
    {
      id: 'pillar_conversion',
      name: 'Conversion',
      color: '#6366f1',
      // pillar contains the strategy work cards
      nodeIds: ['act_checkout', 'hyp_steps'],
    } as GroupNode,
  ];

  const trackedValues: Record<string, MetricValue[]> = {
    // +7% over the window (beats the +5% expectation)
    [trackedCheckoutCvr]: [mv('2026-05', 3.0), mv('2026-07', 3.21)],
    // +1.25% — within the 5% guardrail tolerance (pass)
    [trackedAov]: [mv('2026-05', 80), mv('2026-07', 81)],
  };

  const contract: ImpactContract = {
    id: 'contract_checkout',
    workspaceId: 'demo-workspace',
    projectId: 'demo-canvas',
    strategyNodeId: 'act_checkout',
    expectedDirection: 'increase',
    expectedDeltaValue: 5,
    expectedDeltaUnit: 'percent',
    baselineStart: '2026-05',
    baselineEnd: '2026-05',
    measureStart: '2026-07',
    measureEnd: '2026-07',
    baselineIsManual: false,
    confidence: 'medium',
    impactStatus: 'measuring',
    ownerLabel: 'Growth',
    resultNote: null,
    createdBy: 'demo-user',
    createdAt: '',
    updatedAt: '',
  };

  const links: MetricLink[] = [
    { id: 'l_target', contractId: contract.id, role: 'target', refSource: 'tracked', trackedMetricId: trackedCheckoutCvr, cardId: null },
    { id: 'l_leading', contractId: contract.id, role: 'leading', refSource: 'card', trackedMetricId: null, cardId: 'add_to_cart' },
    { id: 'l_guard_aov', contractId: contract.id, role: 'guardrail', refSource: 'tracked', trackedMetricId: trackedAov, cardId: null },
    { id: 'l_guard_refund', contractId: contract.id, role: 'guardrail', refSource: 'card', trackedMetricId: null, cardId: 'refund_rate' },
  ];

  const widgets: TraceWidget[] = [
    { id: 'w_checkout_cvr', title: 'Checkout CVR', config: { source: 'tracked', trackedMetricIds: [trackedCheckoutCvr] } },
  ];

  return {
    cards,
    relationships,
    groups,
    trackedValues,
    entries: [{ contract, links }],
    widgets,
    ids: {
      kpi: 'kpi',
      revenue: 'revenue',
      checkoutCvr: 'checkout_cvr',
      addToCart: 'add_to_cart',
      aov: 'aov',
      refundRate: 'refund_rate',
      action: 'act_checkout',
      hypothesis: 'hyp_steps',
      trackedCheckoutCvr,
      widget: 'w_checkout_cvr',
    },
  };
}
