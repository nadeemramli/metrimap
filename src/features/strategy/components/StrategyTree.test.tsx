import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StrategyTree } from './StrategyTree';
import type { MetricCard, Relationship } from '@/shared/types';
import type { ImpactContract, MetricLink } from '@/features/strategy/impact/types';

const card = (id: string, over: Partial<MetricCard> = {}): MetricCard => ({
  id,
  title: id,
  description: '',
  category: 'Work/Action',
  tags: [],
  causalFactors: [],
  dimensions: [],
  position: { x: 0, y: 0 },
  assignees: [],
  createdAt: '',
  updatedAt: '',
  ...over,
});

const contract = (nodeId: string): ImpactContract => ({
  id: `c_${nodeId}`,
  workspaceId: null,
  projectId: null,
  strategyNodeId: nodeId,
  expectedDirection: 'increase',
  expectedDeltaValue: 5,
  expectedDeltaUnit: 'percent',
  baselineStart: null,
  baselineEnd: null,
  measureStart: null,
  measureEnd: null,
  baselineIsManual: false,
  confidence: 'medium',
  impactStatus: 'measuring',
  ownerLabel: null,
  resultNote: null,
  createdBy: 'u',
  createdAt: '',
  updatedAt: '',
});

const link = (contractId: string, cardId: string): MetricLink => ({
  id: `l_${cardId}`,
  contractId,
  role: 'target',
  refSource: 'card',
  trackedMetricId: null,
  cardId,
});

describe('StrategyTree', () => {
  const cards: MetricCard[] = [
    card('kpi', { title: 'North Star', category: 'Core/Value' }),
    card('cvr', { title: 'Checkout CVR', category: 'Data/Metric' }),
    card('act_with', { title: 'Ship new checkout' }),
    card('act_without', { title: 'Explore upsell' }),
  ];
  // act_with targets cvr, which rolls up to the KPI.
  const relationships: Relationship[] = [
    {
      id: 'e1',
      sourceId: 'cvr',
      targetId: 'kpi',
      type: 'Deterministic',
      confidence: 'High',
      evidence: [],
      createdAt: '',
      updatedAt: '',
    },
  ];
  const impactByNode = {
    act_with: { contract: contract('act_with'), links: [link('c_act_with', 'cvr')] },
  };

  it('renders KPI header, work items, target path, and empty state', () => {
    render(
      <StrategyTree
        cards={cards}
        groups={[]}
        relationships={relationships}
        impactByNode={impactByNode}
        onOpenImpact={vi.fn()}
      />
    );
    // KPI header
    expect(screen.getByText('North Star')).toBeInTheDocument();
    // Both work items present (grouped under "Ungrouped")
    expect(screen.getByText('Ship new checkout')).toBeInTheDocument();
    expect(screen.getByText('Explore upsell')).toBeInTheDocument();
    // Item with a target shows the roll-up path to the KPI
    expect(screen.getByText('Checkout CVR → North Star')).toBeInTheDocument();
    // Item without a contract shows the actionable empty state
    expect(
      screen.getByText('+ Add a target metric to measure impact')
    ).toBeInTheDocument();
  });
});
