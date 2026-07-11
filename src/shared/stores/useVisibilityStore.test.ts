import { beforeEach, describe, expect, it, vi } from 'vitest';

const getMyRestrictedCards = vi.fn();
vi.mock('@/shared/lib/supabase/services/accessTags', () => ({
  getMyRestrictedCards: (...args: unknown[]) => getMyRestrictedCards(...args),
}));

import { useVisibilityStore } from './useVisibilityStore';

const client = {} as never;

describe('useVisibilityStore', () => {
  beforeEach(() => {
    useVisibilityStore.setState({
      restrictedByProject: {},
      loading: {},
      failed: {},
    });
    getMyRestrictedCards.mockReset();
  });

  it('marks cards from a successful load as restricted', async () => {
    getMyRestrictedCards.mockResolvedValue(['card-a']);
    await useVisibilityStore.getState().reload('p1', client);

    expect(useVisibilityStore.getState().isRestricted('p1', 'card-a')).toBe(true);
    expect(useVisibilityStore.getState().isRestricted('p1', 'card-b')).toBe(false);
  });

  it('fails CLOSED: masks every card when the restricted-set load fails', async () => {
    vi.useFakeTimers();
    getMyRestrictedCards.mockRejectedValue(new Error('network down'));
    await useVisibilityStore.getState().reload('p1', client);

    // No known set + a failed load => mask everything (do not leak values).
    expect(useVisibilityStore.getState().isRestricted('p1', 'anything')).toBe(true);
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('does not mask while a load is still pending (only after a definite failure)', () => {
    // Nothing attempted yet: no set, not failed => not masked.
    expect(useVisibilityStore.getState().isRestricted('p1', 'card-a')).toBe(false);
  });

  it('keeps a prior successful set if a later reload fails', async () => {
    getMyRestrictedCards.mockResolvedValueOnce(['card-a']);
    await useVisibilityStore.getState().reload('p1', client);

    vi.useFakeTimers();
    getMyRestrictedCards.mockRejectedValueOnce(new Error('blip'));
    await useVisibilityStore.getState().reload('p1', client);

    // The known set still answers precisely rather than masking everything.
    expect(useVisibilityStore.getState().isRestricted('p1', 'card-a')).toBe(true);
    expect(useVisibilityStore.getState().isRestricted('p1', 'card-b')).toBe(false);
    vi.clearAllTimers();
    vi.useRealTimers();
  });
});
