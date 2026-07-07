import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// First-run onboarding state (CVS-114). localStorage-persisted per browser —
// deliberately no DB schema in v1 (cross-device sync is a later jsonb column
// on users if ever needed). Everything here is additive and optional.

interface OnboardingState {
  /** The welcome dialog was shown and answered (either path). */
  firstRunSeen: boolean;
  /** A tour should start on the next canvas open (set when the demo is copied). */
  tourPending: boolean;
  tourCompletedAt: string | null;
  tourSkippedAt: string | null;
  /** The user's own copy of the demo canvas, for replaying the tour. */
  demoCopyProjectId: string | null;
  checklistDismissed: boolean;
  visitedDashboard: boolean;
  /** One-shot feature-discovery tips that have been shown (slice 4). */
  dismissedTips: Record<string, boolean>;

  markFirstRunSeen: () => void;
  setTourPending: (pending: boolean) => void;
  setDemoCopyProjectId: (id: string | null) => void;
  markTourCompleted: () => void;
  markTourSkipped: () => void;
  dismissChecklist: () => void;
  markVisitedDashboard: () => void;
  dismissTip: (id: string) => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      firstRunSeen: false,
      tourPending: false,
      tourCompletedAt: null,
      tourSkippedAt: null,
      demoCopyProjectId: null,
      checklistDismissed: false,
      visitedDashboard: false,
      dismissedTips: {},

      markFirstRunSeen: () => set({ firstRunSeen: true }),
      setTourPending: (tourPending) => set({ tourPending }),
      setDemoCopyProjectId: (demoCopyProjectId) => set({ demoCopyProjectId }),
      markTourCompleted: () =>
        set({ tourCompletedAt: new Date().toISOString(), tourPending: false }),
      markTourSkipped: () =>
        set({ tourSkippedAt: new Date().toISOString(), tourPending: false }),
      dismissChecklist: () => set({ checklistDismissed: true }),
      markVisitedDashboard: () => set({ visitedDashboard: true }),
      dismissTip: (id) =>
        set((s) => ({ dismissedTips: { ...s.dismissedTips, [id]: true } })),
    }),
    { name: 'metrimap-onboarding' }
  )
);
