import type { EvidenceComment, EvidenceItem } from '@/shared/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface EvidenceState {
  evidence: EvidenceItem[];

  // Actions
  addEvidence: (evidence: EvidenceItem) => void;
  updateEvidence: (id: string, updates: Partial<EvidenceItem>) => void;
  deleteEvidence: (id: string) => void;
  getEvidenceById: (id: string) => EvidenceItem | undefined;
  getEvidenceByType: (type: string) => EvidenceItem[];
  getEvidenceByOwner: (owner: string) => EvidenceItem[];

  // Context-based evidence retrieval
  getEvidenceByContext: (
    contextType: 'relationship' | 'card' | 'general',
    targetId?: string
  ) => EvidenceItem[];
  getEvidenceForRelationship: (relationshipId: string) => EvidenceItem[];
  getEvidenceForCard: (cardId: string) => EvidenceItem[];
  getGeneralEvidence: () => EvidenceItem[];

  // Comments management
  addComment: (
    evidenceId: string,
    comment: Omit<EvidenceComment, 'id' | 'evidenceId' | 'createdAt'>
  ) => void;
  updateComment: (
    evidenceId: string,
    commentId: string,
    content: string
  ) => void;
  deleteComment: (evidenceId: string, commentId: string) => void;

  // Canvas evidence positioning
  updateEvidencePosition: (
    id: string,
    position: { x: number; y: number }
  ) => void;
  toggleEvidenceVisibility: (id: string) => void;
  toggleEvidenceExpansion: (id: string) => void;

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
            (item.hypothesis &&
              item.hypothesis.toLowerCase().includes(lowercaseQuery)) ||
            (item.tags &&
              item.tags.some((tag: string) =>
                tag.toLowerCase().includes(lowercaseQuery)
              ))
        );
      },

      // Context-based evidence retrieval
      getEvidenceByContext: (
        contextType: 'relationship' | 'card' | 'general',
        targetId?: string
      ) => {
        const state = get();
        return state.evidence.filter((item) => {
          if (!item.context) return contextType === 'general';
          return (
            item.context.type === contextType &&
            (contextType === 'general' || item.context.targetId === targetId)
          );
        });
      },

      getEvidenceForRelationship: (relationshipId: string) => {
        const state = get();
        return state.evidence.filter(
          (item) =>
            item.context?.type === 'relationship' &&
            item.context.targetId === relationshipId
        );
      },

      getEvidenceForCard: (cardId: string) => {
        const state = get();
        return state.evidence.filter(
          (item) =>
            item.context?.type === 'card' && item.context.targetId === cardId
        );
      },

      getGeneralEvidence: () => {
        const state = get();
        return state.evidence.filter(
          (item) => !item.context || item.context.type === 'general'
        );
      },

      // Comments management
      addComment: (
        evidenceId: string,
        comment: Omit<EvidenceComment, 'id' | 'evidenceId' | 'createdAt'>
      ) => {
        set((state) => ({
          evidence: state.evidence.map((item) =>
            item.id === evidenceId
              ? {
                  ...item,
                  comments: [
                    ...(item.comments || []),
                    {
                      id: `comment_${Date.now()}`,
                      evidenceId,
                      createdAt: new Date().toISOString(),
                      ...comment,
                    } as EvidenceComment,
                  ],
                }
              : item
          ),
        }));
      },

      updateComment: (
        evidenceId: string,
        commentId: string,
        content: string
      ) => {
        set((state) => ({
          evidence: state.evidence.map((item) =>
            item.id === evidenceId
              ? {
                  ...item,
                  comments: item.comments?.map((comment: EvidenceComment) =>
                    comment.id === commentId
                      ? {
                          ...comment,
                          content,
                          updatedAt: new Date().toISOString(),
                        }
                      : comment
                  ),
                }
              : item
          ),
        }));
      },

      deleteComment: (evidenceId: string, commentId: string) => {
        set((state) => ({
          evidence: state.evidence.map((item) =>
            item.id === evidenceId
              ? {
                  ...item,
                  comments: item.comments?.filter(
                    (comment: EvidenceComment) => comment.id !== commentId
                  ),
                }
              : item
          ),
        }));
      },

      // Canvas evidence positioning
      updateEvidencePosition: (
        id: string,
        position: { x: number; y: number }
      ) => {
        set((state) => ({
          evidence: state.evidence.map((item) =>
            item.id === id ? { ...item, position } : item
          ),
        }));
      },

      toggleEvidenceVisibility: (id: string) => {
        set((state) => ({
          evidence: state.evidence.map((item) =>
            item.id === id ? { ...item, isVisible: !item.isVisible } : item
          ),
        }));
      },

      toggleEvidenceExpansion: (id: string) => {
        set((state) => ({
          evidence: state.evidence.map((item) =>
            item.id === id ? { ...item, isExpanded: !item.isExpanded } : item
          ),
        }));
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
          // Reset canvas-specific properties
          position: original.position
            ? {
                x: original.position.x + 20,
                y: original.position.y + 20,
              }
            : undefined,
          isVisible: true,
          isExpanded: false,
          comments: [], // Don't duplicate comments
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
