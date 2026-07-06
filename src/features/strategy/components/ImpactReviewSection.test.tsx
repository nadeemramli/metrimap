import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import type { ImpactContract, MetricLink } from '@/features/strategy/impact/types';
import type { MetricCard } from '@/shared/types';

vi.mock('@/shared/hooks/useClerkSupabase', () => {
  const client = {};
  return { useClerkSupabase: () => client };
});
vi.mock('@/lib/stores', () => ({
  useAppStore: (sel: (s: { user: { id: string } }) => unknown) => sel({ user: { id: 'u1' } }),
}));
vi.mock('@/shared/lib/supabase/services/trackedMetrics', () => ({
  getMetricValuesByMetricIds: async () => ({
    tm_cvr: [
      { period: '2026-05', value: 100, change_percent: 0, trend: 'neutral' },
      { period: '2026-07', value: 107, change_percent: 7, trend: 'up' },
    ],
    tm_aov: [
      { period: '2026-05', value: 50, change_percent: 0, trend: 'neutral' },
      { period: '2026-07', value: 51, change_percent: 2, trend: 'up' },
    ],
  }),
}));
vi.mock('@/shared/lib/supabase/services/evidence', () => ({ createCardEvidence: vi.fn(async () => ({})) }));

import { ImpactReviewSection } from './ImpactReviewSection';

const contract: ImpactContract = {
  id: 'c', workspaceId: null, projectId: 'p', strategyNodeId: 'act',
  expectedDirection: 'increase', expectedDeltaValue: 5, expectedDeltaUnit: 'percent',
  baselineStart: '2026-05', baselineEnd: '2026-05', measureStart: '2026-07', measureEnd: '2026-07',
  baselineIsManual: false, confidence: null, impactStatus: 'measuring',
  ownerLabel: null, resultNote: null, createdBy: 'u', createdAt: '', updatedAt: '',
};
const links: MetricLink[] = [
  { id: 't', contractId: 'c', role: 'target', refSource: 'tracked', trackedMetricId: 'tm_cvr', cardId: null },
  { id: 'g', contractId: 'c', role: 'guardrail', refSource: 'tracked', trackedMetricId: 'tm_aov', cardId: null },
];
const cards: MetricCard[] = [
  { id: 'cvr', title: 'Checkout CVR', description: '', category: 'Data/Metric', tags: [], causalFactors: [], dimensions: [], position: { x: 0, y: 0 }, assignees: [], createdAt: '', updatedAt: '', trackedMetricId: 'tm_cvr' },
];

describe('ImpactReviewSection', () => {
  it('shows the measured outcome and marks a result', async () => {
    const onMark = vi.fn();
    render(
      <ImpactReviewSection
        contract={contract}
        links={links}
        cards={cards}
        cardId="act"
        cardTitle="Ship checkout"
        projectId="p"
        canEdit
        resultNote="Rollout went smoothly"
        onMarkResult={onMark}
      />
    );
    // measured target delta + suggestion appear after series load
    expect(await screen.findByText(/\+7\.0%/)).toBeInTheDocument();
    expect(screen.getByText('won')).toBeInTheDocument(); // suggests won
    // mark the outcome
    fireEvent.click(screen.getByRole('button', { name: 'Won' }));
    expect(onMark).toHaveBeenCalledWith('won');
  });
});
