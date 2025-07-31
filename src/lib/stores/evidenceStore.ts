import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EvidenceItem } from '../types';

interface EvidenceState {
  evidence: EvidenceItem[];
  
  // Actions
  addEvidence: (evidence: EvidenceItem) => void;
  updateEvidence: (id: string, updates: Partial<EvidenceItem>) => void;
  deleteEvidence: (id: string) => void;
  getEvidenceById: (id: string) => EvidenceItem | undefined;
  getEvidenceByType: (type: string) => EvidenceItem[];
  getEvidenceByOwner: (owner: string) => EvidenceItem[];
  searchEvidence: (query: string) => EvidenceItem[];
  duplicateEvidence: (id: string) => EvidenceItem | null;
}

export const useEvidenceStore = create<EvidenceState>()(
  persist(
    (set, get) => ({
      evidence: [],

      addEvidence: (evidence: EvidenceItem) =>
        set((state) => ({
          evidence: [...state.evidence, evidence],
        })),

      updateEvidence: (id: string, updates: Partial<EvidenceItem>) =>
        set((state) => ({
          evidence: state.evidence.map((item) =>
            item.id === id
              ? { ...item, ...updates, updatedAt: new Date().toISOString() }
              : item
          ),
        })),

      deleteEvidence: (id: string) =>
        set((state) => ({
          evidence: state.evidence.filter((item) => item.id !== id),
        })),

      getEvidenceById: (id: string) => {
        const state = get();
        return state.evidence.find((item) => item.id === id);
      },

      getEvidenceByType: (type: string) => {
        const state = get();
        return state.evidence.filter((item) => item.type === type);
      },

      getEvidenceByOwner: (owner: string) => {
        const state = get();
        return state.evidence.filter((item) => item.owner === owner);
      },

      searchEvidence: (query: string) => {
        const state = get();
        const lowercaseQuery = query.toLowerCase();
        return state.evidence.filter(
          (item) =>
            item.title.toLowerCase().includes(lowercaseQuery) ||
            item.summary.toLowerCase().includes(lowercaseQuery) ||
            item.owner.toLowerCase().includes(lowercaseQuery) ||
            (item.hypothesis && item.hypothesis.toLowerCase().includes(lowercaseQuery)) ||
            (item.tags && item.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)))
        );
      },

      duplicateEvidence: (id: string) => {
        const state = get();
        const original = state.evidence.find((item) => item.id === id);
        if (!original) return null;

        const duplicate: EvidenceItem = {
          ...original,
          id: `evidence_${Date.now()}`,
          title: `${original.title} (Copy)`,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          evidence: [...state.evidence, duplicate],
        }));

        return duplicate;
      },
    }),
    {
      name: 'metrimap-evidence-store',
    }
  )
);