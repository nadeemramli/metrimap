import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { useCanvasPanelStore } from '@/features/canvas/stores/useCanvasPanelStore';
import type { MetricCard } from '@/shared/types';

// No Clerk client in the test → the load effect early-returns and no network runs.
vi.mock('@/shared/hooks/useClerkSupabase', () => ({ useClerkSupabase: () => null }));
vi.mock('@/shared/lib/supabase/services/strategyImpact', () => ({
  getContractForNode: vi.fn(),
  getMetricLinks: vi.fn(),
  upsertContract: vi.fn(),
  setMetricLinks: vi.fn(),
  deleteContract: vi.fn(),
}));
vi.mock('@/shared/lib/supabase/services/trackedMetrics', () => ({
  listTrackedMetrics: vi.fn(async () => []),
}));

import { StrategyImpactSheet } from './StrategyImpactSheet';

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

const baseProps = {
  cardId: 'action_1',
  cardTitle: 'Reduce checkout friction',
  projectId: 'canvas_1',
  cards: [card('action_1'), card('m_cvr', { title: 'Checkout CVR', category: 'Data/Metric' })],
  relationships: [],
  open: true,
  onOpenChange: () => {},
};

describe('StrategyImpactSheet', () => {
  // The panel portals into the dock host CanvasLayout registers; give the
  // store a host element so DockPanel renders in this isolated tree.
  beforeEach(() => {
    document.body.innerHTML = '';
    const host = document.createElement('div');
    document.body.appendChild(host);
    useCanvasPanelStore.setState({ rightHostEl: host });
  });

  it('shows the empty state and the contract fields when no target is set', () => {
    render(<StrategyImpactSheet {...baseProps} canEdit />);
    expect(screen.getByText('Add a target metric to measure impact.')).toBeInTheDocument();
    expect(screen.getByText('Target metric')).toBeInTheDocument();
    expect(screen.getByText('Direction')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save impact/i })).toBeInTheDocument();
  });

  it('edits a plain field (result note)', () => {
    render(<StrategyImpactSheet {...baseProps} canEdit />);
    const note = screen.getByPlaceholderText(/what happened/i) as HTMLTextAreaElement;
    fireEvent.change(note, { target: { value: 'Won: +6% conversion' } });
    expect(note.value).toBe('Won: +6% conversion');
  });

  it('hides the save/remove controls when the user cannot edit', () => {
    render(<StrategyImpactSheet {...baseProps} canEdit={false} />);
    expect(screen.queryByRole('button', { name: /save impact/i })).not.toBeInTheDocument();
  });
});
