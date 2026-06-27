// In-memory (unpersisted) live-preview results for the operator pipeline. The
// useLivePreview hook computes the pipeline (no writes) and pushes results here;
// operator nodes + the tooling panel subscribe by id for their live output.
// Kept separate from the canvas stores so display reads never feed back into the
// compute inputs (one-directional, loop-safe). See operator-revamp-feature.md (E).

import { create } from 'zustand';

interface OperatorPreviewState {
  operatorValues: Record<string, number>;
  cardValues: Record<string, number>;
  setPreview: (
    operatorValues: Record<string, number>,
    cardValues: Record<string, number>
  ) => void;
}

export const useOperatorPreviewStore = create<OperatorPreviewState>((set) => ({
  operatorValues: {},
  cardValues: {},
  setPreview: (operatorValues, cardValues) =>
    set({ operatorValues, cardValues }),
}));
