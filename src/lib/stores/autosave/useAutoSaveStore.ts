import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { updateMetricCard as updateMetricCardInSupabase } from '../../supabase/services/metric-cards';
import type { MetricCard } from '../../types';

export interface AutoSaveStoreState {
  // Auto-save state
  pendingChanges: Set<string>;
  isSaving: boolean;
  lastSaved: string | undefined;

  // Auto-save functionality
  addPendingChange: (nodeId: string) => void;
  removePendingChange: (nodeId: string) => void;
  saveAllPendingChanges: (nodes: MetricCard[]) => Promise<void>;
  setSaving: (saving: boolean) => void;

  // Utility functions
  isPendingChange: (nodeId: string) => boolean;
  getPendingChangesCount: () => number;
  clearAllPendingChanges: () => void;
}

export const useAutoSaveStore = create<AutoSaveStoreState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    pendingChanges: new Set<string>(),
    isSaving: false,
    lastSaved: undefined as string | undefined,

    // Auto-save functionality
    addPendingChange: (nodeId: string) =>
      set((state) => ({
        pendingChanges: new Set([...state.pendingChanges, nodeId]),
      })),

    removePendingChange: (nodeId: string) =>
      set((state) => {
        const newSet = new Set(state.pendingChanges);
        newSet.delete(nodeId);
        return { pendingChanges: newSet };
      }),

    setSaving: (saving: boolean) => set({ isSaving: saving }),

    saveAllPendingChanges: async (nodes: MetricCard[]) => {
      const state = get();
      if (state.pendingChanges.size === 0 || state.isSaving) return;

      set({ isSaving: true });

      try {
        const failedNodes: string[] = [];

        console.log(
          `🔄 Starting bulletproof save for ${state.pendingChanges.size} changes...`
        );

        // BULLETPROOF SAVING: Save each node individually with error handling
        for (const nodeId of state.pendingChanges) {
          const node = nodes.find((n) => n.id === nodeId);
          if (node) {
            // Validate that this is a proper UUID (database-backed node)
            const isValidId =
              /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
                nodeId
              );

            if (!isValidId) {
              console.warn(
                `⚠️ Skipping node ${nodeId} - invalid UUID format, likely a temporary local node`
              );
              failedNodes.push(nodeId); // Remove from pending changes
              continue;
            }

            try {
              console.log(`💾 Saving node ${nodeId}:`, {
                position: node.position,
                title: node.title?.substring(0, 20) + '...',
              });

              await updateMetricCardInSupabase(nodeId, {
                position: node.position,
                title: node.title,
                description: node.description,
                tags: node.tags,
                category: node.category,
                subCategory: node.subCategory,
                causalFactors: node.causalFactors,
                dimensions: node.dimensions,
                data: node.data,
                sourceType: node.sourceType,
                formula: node.formula,
                assignees: node.assignees,
              });

              console.log(`✅ Successfully saved node ${nodeId}`);
            } catch (nodeError) {
              console.error(`❌ Failed to save node ${nodeId}:`, nodeError);
              failedNodes.push(nodeId);
            }
          } else {
            console.warn(`⚠️ Node ${nodeId} not found in canvas state`);
            failedNodes.push(nodeId);
          }
        }

        // Update state: remove successfully saved nodes, keep failed ones for retry
        const successfulSaves = Array.from(state.pendingChanges).filter(
          (id) => !failedNodes.includes(id)
        );
        const remainingPendingChanges = new Set(failedNodes);

        set({
          pendingChanges: remainingPendingChanges,
          lastSaved:
            successfulSaves.length > 0
              ? new Date().toISOString()
              : state.lastSaved,
          isSaving: false,
        });

        console.log(
          `✅ Bulletproof save completed: ${successfulSaves.length} saved, ${failedNodes.length} failed`
        );

        // Schedule retry for failed nodes
        if (failedNodes.length > 0) {
          console.log(
            `🔄 Scheduling retry for ${failedNodes.length} failed saves in 5 seconds...`
          );
          setTimeout(() => {
            const currentState = get();
            if (
              currentState.pendingChanges.size > 0 &&
              !currentState.isSaving
            ) {
              currentState.saveAllPendingChanges(nodes);
            }
          }, 5000);
        }

        // Return error info for the caller
        if (failedNodes.length > 0) {
          throw new Error(`Failed to save ${failedNodes.length} items`);
        }
      } catch (error) {
        console.error('❌ Bulletproof save system failed:', error);
        set({ isSaving: false });
        throw new Error('Critical save failure');
      }
    },

    // Utility functions
    isPendingChange: (nodeId: string) => {
      const state = get();
      return state.pendingChanges.has(nodeId);
    },

    getPendingChangesCount: () => {
      const state = get();
      return state.pendingChanges.size;
    },

    clearAllPendingChanges: () =>
      set({
        pendingChanges: new Set<string>(),
      }),
  }))
);
