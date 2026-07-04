import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { WidgetImpactBadge } from './WidgetImpactBadge';
import type { WidgetStrategyLink } from '@/features/strategy/impact/widgetLinks';
import type { ImpactContract } from '@/features/strategy/impact/types';
import type { MetricCard } from '@/shared/types';

const node = (id: string, title: string): MetricCard => ({
  id,
  title,
  description: '',
  category: 'Work/Action',
  tags: [],
  causalFactors: [],
  dimensions: [],
  position: { x: 0, y: 0 },
  assignees: [],
  createdAt: '',
  updatedAt: '',
});

const contract = (id: string, over: Partial<ImpactContract> = {}): ImpactContract => ({
  id,
  workspaceId: null,
  projectId: null,
  strategyNodeId: id,
  expectedDirection: 'increase',
  expectedDeltaValue: 5,
  expectedDeltaUnit: 'percent',
  baselineStart: null,
  baselineEnd: null,
  measureStart: '2026-07',
  measureEnd: '2026-08',
  baselineIsManual: false,
  confidence: 'medium',
  impactStatus: 'measuring',
  ownerLabel: null,
  resultNote: null,
  createdBy: 'u',
  createdAt: '',
  updatedAt: '',
  ...over,
});

const link = (id: string, title: string, over: Partial<ImpactContract> = {}): WidgetStrategyLink => ({
  contract: contract(id, over),
  node: node(id, title),
  roles: ['target'],
});

describe('WidgetImpactBadge', () => {
  it('renders nothing when there are no linked bets', () => {
    const { container } = render(
      <WidgetImpactBadge links={[]} currentPeriod="2026-07" onOpenStrategy={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the count and opens an overlay listing linked items', () => {
    const onOpen = vi.fn();
    render(
      <WidgetImpactBadge
        links={[link('a', 'Ship checkout'), link('b', 'Upsell test', { impactStatus: 'won' })]}
        currentPeriod="2026-07"
        onOpenStrategy={onOpen}
      />
    );
    // count badge
    const trigger = screen.getByRole('button', { name: /2 strategy bets/i });
    expect(trigger).toHaveTextContent('2');
    // open overlay
    fireEvent.click(trigger);
    expect(screen.getByText('Ship checkout')).toBeInTheDocument();
    expect(screen.getByText('Upsell test')).toBeInTheDocument();
    // jump-out
    fireEvent.click(screen.getAllByText('Open in Strategy')[0]);
    expect(onOpen).toHaveBeenCalledWith('a');
  });
});
