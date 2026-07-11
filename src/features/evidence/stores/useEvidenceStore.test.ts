import { beforeEach, describe, expect, it } from 'vitest';
import type { EvidenceItem } from '@/shared/types';
import { useEvidenceStore } from './useEvidenceStore';

function makeEvidence(overrides: Partial<EvidenceItem> = {}): EvidenceItem {
  return {
    id: 'ev-1',
    title: 'Churn experiment',
    type: 'Experiment',
    date: '2026-07-10',
    owner: 'Nadeem',
    summary: 'Cohort B churned 12% less',
    hypothesis: '',
    impactOnConfidence: '',
    createdBy: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  } as EvidenceItem;
}

describe('useEvidenceStore.addEvidence', () => {
  beforeEach(() => {
    useEvidenceStore.setState({ evidence: [] });
  });

  it('appends a new item', () => {
    useEvidenceStore.getState().addEvidence(makeEvidence());
    expect(useEvidenceStore.getState().evidence).toHaveLength(1);
  });

  it('replaces by id instead of appending a duplicate (auto-save re-create)', () => {
    const { addEvidence } = useEvidenceStore.getState();
    addEvidence(makeEvidence({ title: 'v1' }));
    addEvidence(makeEvidence({ title: 'v2' }));
    const items = useEvidenceStore.getState().evidence;
    expect(items).toHaveLength(1);
    expect(items[0].title).toBe('v2');
  });

  it('keeps other items untouched when replacing', () => {
    const { addEvidence } = useEvidenceStore.getState();
    addEvidence(makeEvidence({ id: 'ev-1', title: 'first' }));
    addEvidence(makeEvidence({ id: 'ev-2', title: 'second' }));
    addEvidence(makeEvidence({ id: 'ev-1', title: 'first-updated' }));
    const items = useEvidenceStore.getState().evidence;
    expect(items).toHaveLength(2);
    expect(items.find((i) => i.id === 'ev-1')?.title).toBe('first-updated');
    expect(items.find((i) => i.id === 'ev-2')?.title).toBe('second');
  });
});
