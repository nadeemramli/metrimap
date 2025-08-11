/**
 * Auto-save Store Module
 * Handles automatic persistence of canvas changes
 */

import { StateCreator } from 'zustand';
import { updateMetricCard as updateMetricCardInSupabase } from '../../supabase/services/metric-cards';
import type { CanvasProject } from '../../types';
import { getClientForEnvironment } from '../../utils/authenticatedClient';

export interface AutoSaveState {
  // Auto-save state
  pendingChanges: Set<string>;
  isSaving: boolean;
  lastSaved: string | undefined;
}

export interface AutoSaveActions {
  // Auto-save functionality
  addPendingChange: (nodeId: string) => void;
  removePendingChange: (nodeId: string) => void;
  saveAllPendingChanges: () => Promise<void>;
  setSaving: (saving: boolean) => void;
}

export interface AutoSaveSlice extends AutoSaveState, AutoSaveActions {}

// Type for the full store (to be used when accessing canvas)
interface FullStore {
  canvas: CanvasProject | undefined;
  error: string | undefined;
}

export const createAutoSaveSlice: StateCreator<
  FullStore & AutoSaveSlice,
  [],
  [],
  AutoSaveSlice
> = (set, get) => ({
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

  saveAllPendingChanges: async () => {
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
        const node = state.canvas?.nodes.find((n) => n.id === nodeId);
        if (node) {
          // Validate that this is a proper UUID (database-backed node)
          const isValidId =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
              nodeId
            );

          if (!isValidId) {
            console.warn(
              `⚠️ Skipping save for node ${nodeId} - appears to be a temporary node`
            );
            continue;
          }

          try {
            const client = getClientForEnvironment();
            await updateMetricCardInSupabase(
              nodeId,
              {
                position_x: node.position.x,
                position_y: node.position.y,
                title: node.title,
                description: node.description,
                category: node.category,
                sub_category: node.subCategory,
                data: node.data,
                formula: node.formula,
                dimensions: node.dimensions,
                causal_factors: node.causalFactors,
                source_type: node.sourceType,
                owner_id: node.owner,
                assignees: node.assignees,
              },
              client
            );

            console.log(`✅ Successfully saved node: ${node.title}`);
          } catch (nodeError) {
            console.error(`❌ Failed to save node ${nodeId}:`, nodeError);
            failedNodes.push(nodeId);
          }
        } else {
          console.warn(
            `⚠️ Node ${nodeId} not found in canvas, removing from pending changes`
          );
        }
      }

      // Update state: remove successful saves, keep failed ones for retry
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
        error:
          failedNodes.length > 0
            ? `Failed to save ${failedNodes.length} items`
            : undefined,
      });

      if (successfulSaves.length > 0) {
        console.log(
          `✅ Bulletproof save completed: ${successfulSaves.length} items saved`
        );
      }

      if (failedNodes.length > 0) {
        console.warn(
          `⚠️ ${failedNodes.length} items failed to save and will retry`
        );
      }

      // Auto-retry mechanism: restart the save timer if there are remaining changes
      if (remainingPendingChanges.size > 0) {
        setTimeout(() => {
          const currentState = get();
          if (currentState.pendingChanges.size > 0 && !currentState.isSaving) {
            currentState.saveAllPendingChanges();
          }
        }, 5000);
      }
    } catch (error) {
      console.error('❌ Bulletproof save system failed:', error);
      set({ isSaving: false, error: 'Critical save failure' });
    }
  },
});
