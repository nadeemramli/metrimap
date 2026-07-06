import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Fixtures are inlined inside each factory — vi.mock is hoisted above module consts.
vi.mock('@/shared/hooks/useClerkSupabase', () => {
  const client = {};
  return { useClerkSupabase: () => client };
});
vi.mock('@/shared/lib/supabase/services/projects', () => ({
  getProjectById: async () => ({
    nodes: [
      { id: 'act1', title: 'Ship checkout', description: '', category: 'Work/Action', tags: [], causalFactors: [], dimensions: [], position: { x: 0, y: 0 }, assignees: [], createdAt: '', updatedAt: '' },
      { id: 'cvr', title: 'Checkout CVR', description: '', category: 'Data/Metric', tags: [], causalFactors: [], dimensions: [], position: { x: 0, y: 0 }, assignees: [], createdAt: '', updatedAt: '', trackedMetricId: 'tm_cvr' },
      { id: 'kpi', title: 'North Star', description: '', category: 'Core/Value', tags: [], causalFactors: [], dimensions: [], position: { x: 0, y: 0 }, assignees: [], createdAt: '', updatedAt: '' },
    ],
    edges: [
      { id: 'e', sourceId: 'cvr', targetId: 'kpi', type: 'Deterministic', confidence: 'High', evidence: [], createdAt: '', updatedAt: '' },
    ],
  }),
}));
vi.mock('@/shared/lib/supabase/services/dashboards', () => ({
  listWidgets: async () => [
    { id: 'w1', title: 'CVR chart', config: { source: 'tracked', trackedMetricIds: ['tm_cvr'] } },
  ],
}));
vi.mock('@/shared/lib/supabase/services/trackedMetrics', () => ({
  listTrackedMetrics: async () => [{ id: 'tm_cvr', name: 'Checkout CVR' }],
}));
vi.mock('@/shared/lib/supabase/services/strategyImpact', () => ({
  getContractForNode: async () => ({ id: 'c1', strategyNodeId: 'act1' }),
  getMetricLinks: async () => [
    { id: 'l1', contractId: 'c1', role: 'target', refSource: 'card', trackedMetricId: null, cardId: 'cvr' },
  ],
}));

import { ImpactTraceDialog } from './ImpactTraceDialog';

describe('ImpactTraceDialog', () => {
  it('renders the full trace: item → target → KPI, shown_on a widget', async () => {
    render(
      <MemoryRouter>
        <ImpactTraceDialog nodeId="act1" projectId="canvas1" open onOpenChange={() => {}} />
      </MemoryRouter>
    );
    expect(await screen.findByText('North Star')).toBeInTheDocument();
    expect(screen.getByText('Ship checkout')).toBeInTheDocument();
    expect(screen.getByText('Checkout CVR')).toBeInTheDocument();
    expect(screen.getByText('targets')).toBeInTheDocument();
    expect(screen.getByText('rolls_up_to')).toBeInTheDocument();
    expect(screen.getByText('CVR chart')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open dashboard/i })).toBeInTheDocument();
  });
});
