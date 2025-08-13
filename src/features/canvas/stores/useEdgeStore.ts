import {
  createRelationship,
  deleteRelationship as deleteRelationshipInSupabase,
  updateRelationship as updateRelationshipInSupabase,
} from '@/shared/lib/supabase/services/relationships';
import { useAppStore } from '@/shared/stores/useAppStore';
import type { Relationship } from '@/shared/types';
import { getClientForEnvironment } from '@/shared/utils/authenticatedClient';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface EdgeStoreState {
  // Selection state
  selectedEdgeIds: string[];

  // Async Edge management (Supabase)
  createEdge: (
    edge: Omit<Relationship, 'id' | 'createdAt' | 'updatedAt'>,
    canvasId: string
  ) => Promise<Relationship>;
  persistEdgeUpdate: (
    edgeId: string,
    updates: Partial<Relationship>
  ) => Promise<void>;
  persistEdgeDelete: (edgeId: string) => Promise<void>;

  // Local Edge management (for optimistic updates)
  addEdgeLocal: (edge: Relationship) => Relationship[];
  updateEdgeLocal: (
    edges: Relationship[],
    edgeId: string,
    updates: Partial<Relationship>
  ) => Relationship[];
  deleteEdgeLocal: (edges: Relationship[], edgeId: string) => Relationship[];

  // Edge selection
  selectEdges: (edgeIds: string[]) => void;
  selectEdge: (edgeId: string) => void;
  deselectEdges: () => void;

  // Utility functions
  getEdgeById: (
    edges: Relationship[],
    edgeId: string
  ) => Relationship | undefined;
  getEdgesByNode: (edges: Relationship[], nodeId: string) => Relationship[];
  updateEdgeHistory: (
    edge: Relationship,
    updates: Partial<Relationship>
  ) => Relationship;
}

export const useEdgeStore = create<EdgeStoreState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    selectedEdgeIds: [],

    // Async Edge management (Supabase)
    createEdge: async (
      edgeData: Omit<Relationship, 'id' | 'createdAt' | 'updatedAt'>,
      canvasId: string
    ): Promise<Relationship> => {
      try {
        const { user } = useAppStore.getState();
        if (!user) throw new Error('User not authenticated');

        const client = getClientForEnvironment();
        const newEdge = await createRelationship(
          { ...edgeData, id: '', createdAt: '', updatedAt: '' },
          canvasId,
          user.id,
          client
        );

        console.log('✅ New relationship created and saved:', newEdge.type);
        return newEdge;
      } catch (error) {
        console.error('❌ Error creating edge:', error);
        throw new Error('Failed to create relationship');
      }
    },

    persistEdgeUpdate: async (
      edgeId: string,
      updates: Partial<Relationship>
    ) => {
      try {
        const client = getClientForEnvironment();
        await updateRelationshipInSupabase(edgeId, updates, client);
        console.log('✅ Edge updated successfully:', edgeId);
      } catch (error) {
        console.error('❌ Error updating edge:', error);
        throw new Error('Failed to update relationship');
      }
    },

    persistEdgeDelete: async (edgeId: string) => {
      try {
        const client = getClientForEnvironment();
        await deleteRelationshipInSupabase(edgeId, client);
        console.log('✅ Edge deleted successfully:', edgeId);
      } catch (error) {
        console.error('❌ Error deleting edge:', error);
        throw new Error('Failed to delete relationship');
      }
    },

    // Local Edge management (for optimistic updates)
    addEdgeLocal: (edge: Relationship): Relationship[] => {
      return (currentEdges: Relationship[]) => [...currentEdges, edge];
    },

    updateEdgeLocal: (
      edges: Relationship[],
      edgeId: string,
      updates: Partial<Relationship>
    ): Relationship[] => {
      const state = get();
      return edges.map((edge) => {
        if (edge.id !== edgeId) return edge;

        // Update edge with history tracking
        const updatedEdge = state.updateEdgeHistory(edge, updates);
        return {
          ...updatedEdge,
          updatedAt: new Date().toISOString(),
        };
      });
    },

    deleteEdgeLocal: (
      edges: Relationship[],
      edgeId: string
    ): Relationship[] => {
      const state = get();
      // Update selection when deleting
      if (state.selectedEdgeIds.includes(edgeId)) {
        set({
          selectedEdgeIds: state.selectedEdgeIds.filter((id) => id !== edgeId),
        });
      }
      return edges.filter((edge) => edge.id !== edgeId);
    },

    // Edge selection
    selectEdges: (edgeIds: string[]) => set({ selectedEdgeIds: edgeIds }),
    selectEdge: (edgeId: string) => set({ selectedEdgeIds: [edgeId] }),
    deselectEdges: () => set({ selectedEdgeIds: [] }),

    // Utility functions
    getEdgeById: (edges: Relationship[], edgeId: string) => {
      return edges.find((edge) => edge.id === edgeId);
    },

    getEdgesByNode: (edges: Relationship[], nodeId: string): Relationship[] => {
      return edges.filter(
        (edge) => edge.sourceId === nodeId || edge.targetId === nodeId
      );
    },

    updateEdgeHistory: (
      existingEdge: Relationship,
      updates: Partial<Relationship>
    ): Relationship => {
      // Create history entries for changes
      const historyEntries: any[] = [];
      const timestamp = new Date().toISOString();

      // Track different types of changes
      if (
        updates.weight !== undefined &&
        updates.weight !== existingEdge.weight
      ) {
        historyEntries.push({
          id: `history_${existingEdge.id}_${Date.now()}_weight`,
          timestamp,
          changeType: 'strength',
          oldValue: existingEdge.weight,
          newValue: updates.weight,
          description: `Relationship strength changed from ${existingEdge.weight}% to ${updates.weight}%`,
          userId: useAppStore.getState().user?.id || 'anonymous-user',
        });
      }

      if (
        updates.confidence &&
        updates.confidence !== existingEdge.confidence
      ) {
        historyEntries.push({
          id: `history_${existingEdge.id}_${Date.now()}_confidence`,
          timestamp,
          changeType: 'confidence',
          oldValue: existingEdge.confidence,
          newValue: updates.confidence,
          description: `Confidence level changed from ${existingEdge.confidence} to ${updates.confidence}`,
          userId: useAppStore.getState().user?.id || 'anonymous-user',
        });
      }

      if (updates.type && updates.type !== existingEdge.type) {
        historyEntries.push({
          id: `history_${existingEdge.id}_${Date.now()}_type`,
          timestamp,
          changeType: 'type',
          oldValue: existingEdge.type,
          newValue: updates.type,
          description: `Relationship type changed from ${existingEdge.type} to ${updates.type}`,
          userId: useAppStore.getState().user?.id || 'anonymous-user',
        });
      }

      if (
        updates.evidence &&
        JSON.stringify(updates.evidence) !==
          JSON.stringify(existingEdge.evidence)
      ) {
        const oldCount = existingEdge.evidence?.length || 0;
        const newCount = updates.evidence?.length || 0;
        historyEntries.push({
          id: `history_${existingEdge.id}_${Date.now()}_evidence`,
          timestamp,
          changeType: 'evidence',
          oldValue: oldCount,
          newValue: newCount,
          description: `Evidence updated: ${oldCount} → ${newCount} items`,
          userId: useAppStore.getState().user?.id || 'anonymous-user',
        });
      }

      // Merge new history with existing
      const updatedHistory = [
        ...(existingEdge.history || []),
        ...historyEntries,
      ];

      return {
        ...existingEdge,
        ...updates,
        history: updatedHistory,
        updatedAt: timestamp,
      };
    },
  }))
);
