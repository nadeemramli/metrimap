import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StrategyTable } from './StrategyTable';
import { buildGroupStrategy } from '@/features/strategy/utils/groupStrategy';
import type { ImpactSummary } from '@/features/strategy/impact/impactContract';
import type { MetricCard } from '@/shared/types';

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

const summary = (over: Partial<ImpactSummary> = {}): ImpactSummary => ({
  hasTarget: true,
  targetLabel: 'Checkout CVR',
  status: 'measuring',
  deltaText: '+5%',
  confidence: 'medium',
  measureEnd: '2026-08',
  ...over,
});

const noop = vi.fn();
const handlers = {
  onStatusChange: noop,
  onPriorityChange: noop,
  onAssigneesChange: noop,
  onDueDateChange: noop,
  onOpenCard: noop,
  onOpenComments: noop,
  onOpenImpact: noop,
  onCreateItem: noop,
  onDeleteCard: noop,
};

describe('StrategyTable — impact column', () => {
  it('renders the Impact column with a chip for items that have a contract', () => {
    const cards = [card('a1', { title: 'Ship new checkout' }), card('a2', { title: 'Explore upsell' })];
    render(
      <StrategyTable
        board={buildGroupStrategy(cards)}
        groups={[]}
        userMap={{}}
        members={[]}
        commentCounts={{}}
        impactSummaries={{ a1: summary() }}
        canEdit
        {...handlers}
      />
    );
    // Column header (one per rendered status section)
    expect(screen.getAllByText('Impact').length).toBeGreaterThan(0);
    // a1 shows its impact chip (status + target metric)
    expect(screen.getByText('measuring')).toBeInTheDocument();
    expect(screen.getByText('Checkout CVR')).toBeInTheDocument();
    // a2 (no contract) offers to add impact
    expect(screen.getByText('+ Impact')).toBeInTheDocument();
  });
});
