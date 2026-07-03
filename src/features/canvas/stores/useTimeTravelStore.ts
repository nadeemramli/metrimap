import { create } from 'zustand';

// Canvas-wide "time-travel" view state. Separate from the simulation-WRITE
// period (CanvasPage globalPeriod): this only changes what every card DISPLAYS,
// never what's persisted. asOfPeriod null = latest / live. comparePeriod set =>
// cards show the delta vs that period.
interface TimeTravelState {
  asOfPeriod: string | null;
  comparePeriod: string | null;
  setAsOf: (period: string | null) => void;
  setCompare: (period: string | null) => void;
  reset: () => void;
}

export const useTimeTravelStore = create<TimeTravelState>((set) => ({
  asOfPeriod: null,
  comparePeriod: null,
  setAsOf: (period) => set({ asOfPeriod: period }),
  setCompare: (period) => set({ comparePeriod: period }),
  reset: () => set({ asOfPeriod: null, comparePeriod: null }),
}));
