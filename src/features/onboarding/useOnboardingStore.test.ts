import { beforeEach, describe, expect, it } from 'vitest';
import { useOnboardingStore } from './useOnboardingStore';

describe('useOnboardingStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useOnboardingStore.setState({
      firstRunSeen: false,
      tourPending: false,
      tourCompletedAt: null,
      tourSkippedAt: null,
      demoCopyProjectId: null,
      checklistDismissed: false,
      visitedDashboard: false,
      dismissedTips: {},
    });
  });

  it('records the welcome as seen exactly once semantics', () => {
    expect(useOnboardingStore.getState().firstRunSeen).toBe(false);
    useOnboardingStore.getState().markFirstRunSeen();
    expect(useOnboardingStore.getState().firstRunSeen).toBe(true);
  });

  it('completing the tour clears the pending flag and stamps completion', () => {
    useOnboardingStore.getState().setTourPending(true);
    useOnboardingStore.getState().markTourCompleted();
    const s = useOnboardingStore.getState();
    expect(s.tourPending).toBe(false);
    expect(s.tourCompletedAt).toBeTruthy();
    expect(s.tourSkippedAt).toBeNull();
  });

  it('skipping the tour clears pending and stamps skip', () => {
    useOnboardingStore.getState().setTourPending(true);
    useOnboardingStore.getState().markTourSkipped();
    const s = useOnboardingStore.getState();
    expect(s.tourPending).toBe(false);
    expect(s.tourSkippedAt).toBeTruthy();
  });

  it('tips dismiss individually and persist in the map', () => {
    useOnboardingStore.getState().dismissTip('layers');
    expect(useOnboardingStore.getState().dismissedTips).toEqual({
      layers: true,
    });
  });
});
