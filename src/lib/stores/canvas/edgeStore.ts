/**
 * Edge Store Module
 * Handles all edge-related operations (Relationships) for the canvas
 */

import { StateCreator } from 'zustand';
import {
  createRelationship,
  deleteRelationship as deleteRelationshipInSupabase,
  updateRelationship as updateRelationshipInSupabase,
} from '../../supabase/services/relationships';
import type { CanvasProject, Relationship } from '../../types';
import { getClientForEnvironment } from '../../utils/authenticatedClient';
import { useAppStore } from '../appStore';

export interface EdgeState {
  // Edge data
  edges: Relationship[];
  selectedEdgeIds: string[];

  // Loading state
  isLoading: boolean;
  error: string | undefined;
}

export interface EdgeActions {
  // Async Edge management (Supabase)
  createEdge: (
    edge: Omit<Relationship, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
  persistEdgeUpdate: (
    edgeId: string,
    updates: Partial<Relationship>
  ) => Promise<void>;
  persistEdgeDelete: (edgeId: string) => Promise<void>;

  // Local Edge management
  addEdge: (edge: Relationship) => void;
  updateEdge: (edgeId: string, updates: Partial<Relationship>) => void;
  deleteEdge: (edgeId: string) => void;

  // Selection management
  selectEdges: (edgeIds: string[]) => void;
  selectEdge: (edgeId: string) => void;
  deselectEdges: () => void;

  // Getters
  getEdgeById: (edgeId: string) => Relationship | undefined;
  getSelectedEdges: () => Relationship[];
  getEdgesBetweenNodes: (sourceId: string, targetId: string) => Relationship[];
}

export interface EdgeSlice extends EdgeState, EdgeActions {}

// Type for the full store (to be used when accessing canvas)
interface FullStore {
  canvas: CanvasProject | undefined;
}

export const createEdgeSlice: StateCreator<
  FullStore & EdgeSlice,
  [],
  [],
  EdgeSlice
> = (set, get) => ({
  // Initial state
  edges: [],
  selectedEdgeIds: [],
  isLoading: false,
  error: undefined,

  // Async Edge management (Supabase)
  createEdge: async (
    edgeData: Omit<Relationship, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const state = get();
    if (!state.canvas) return;

    set({ isLoading: true, error: undefined });
    try {
      const { user } = useAppStore.getState();
      if (!user) throw new Error('User not authenticated');

      const client = getClientForEnvironment();
      const newEdge = await createRelationship(
        { ...edgeData, id: '', createdAt: '', updatedAt: '' },
        state.canvas.id,
        user.id,
        client
      );

      set((state) => ({
        canvas: state.canvas
          ? {
              ...state.canvas,
              edges: [...state.canvas.edges, newEdge],
              updatedAt: new Date().toISOString(),
            }
          : undefined,
        isLoading: false,
      }));

      console.log('✅ New relationship created and saved:', newEdge.type);
    } catch (error) {
      console.error('Error creating edge:', error);
      set({ error: 'Failed to create relationship', isLoading: false });
    }
  },

  persistEdgeUpdate: async (edgeId: string, updates: Partial<Relationship>) => {
    set({ isLoading: true, error: undefined });
    try {
      const client = getClientForEnvironment();
      await updateRelationshipInSupabase(edgeId, updates, client);

      // Update local state
      set((state) => ({
        canvas: state.canvas
          ? {
              ...state.canvas,
              edges: state.canvas.edges.map((edge) =>
                edge.id === edgeId
                  ? {
                      ...edge,
                      ...updates,
                      updatedAt: new Date().toISOString(),
                    }
                  : edge
              ),
              updatedAt: new Date().toISOString(),
            }
          : undefined,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error updating edge:', error);
      set({ error: 'Failed to update relationship', isLoading: false });
    }
  },

  persistEdgeDelete: async (edgeId: string) => {
    set({ isLoading: true, error: undefined });
    try {
      const client = getClientForEnvironment();
      await deleteRelationshipInSupabase(edgeId, client);

      // Update local state
      set((state) => ({
        canvas: state.canvas
          ? {
              ...state.canvas,
              edges: state.canvas.edges.filter((edge) => edge.id !== edgeId),
              updatedAt: new Date().toISOString(),
            }
          : undefined,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error deleting edge:', error);
      set({ error: 'Failed to delete relationship', isLoading: false });
    }
  },

  // Local Edge management
  addEdge: (edge: Relationship) =>
    set((state) => ({
      canvas: state.canvas
        ? {
            ...state.canvas,
            edges: [...state.canvas.edges, edge],
            updatedAt: new Date().toISOString(),
          }
        : undefined,
    })),

  updateEdge: (edgeId: string, updates: Partial<Relationship>) =>
    set((state) => {
      if (!state.canvas) return state;

      const existingEdge = state.canvas.edges.find(
        (edge) => edge.id === edgeId
      );
      if (!existingEdge) return state;

      // Create history entries for changes
      const historyEntries: any[] = [];
      const timestamp = new Date().toISOString();

      // Track different types of changes
      if (
        updates.weight !== undefined &&
        updates.weight !== existingEdge.weight
      ) {
        historyEntries.push({
          id: `history_${edgeId}_${Date.now()}_weight`,
          timestamp,
          changeType: 'strength',
          oldValue: existingEdge.weight,
          newValue: updates.weight,
          description: `Relationship strength changed from ${existingEdge.weight}% to ${updates.weight}%`,
          userId: useAppStore.getState().user?.id || 'anonymous-user',
        });
      }

      if (
        updates.confidence !== undefined &&
        updates.confidence !== existingEdge.confidence
      ) {
        historyEntries.push({
          id: `history_${edgeId}_${Date.now()}_confidence`,
          timestamp,
          changeType: 'confidence',
          oldValue: existingEdge.confidence,
          newValue: updates.confidence,
          description: `Relationship confidence changed from ${existingEdge.confidence} to ${updates.confidence}`,
          userId: useAppStore.getState().user?.id || 'anonymous-user',
        });
      }

      if (updates.type !== undefined && updates.type !== existingEdge.type) {
        historyEntries.push({
          id: `history_${edgeId}_${Date.now()}_type`,
          timestamp,
          changeType: 'type',
          oldValue: existingEdge.type,
          newValue: updates.type,
          description: `Relationship type changed from ${existingEdge.type} to ${updates.type}`,
          userId: useAppStore.getState().user?.id || 'anonymous-user',
        });
      }

      // Update the edge with new history
      const updatedEdge = {
        ...existingEdge,
        ...updates,
        updatedAt: new Date().toISOString(),
        history: [...(existingEdge.history || []), ...historyEntries],
      };

      return {
        canvas: {
          ...state.canvas,
          edges: state.canvas.edges.map((edge) =>
            edge.id === edgeId ? updatedEdge : edge
          ),
          updatedAt: new Date().toISOString(),
        },
      };
    }),

  deleteEdge: (edgeId: string) =>
    set((state) => ({
      canvas: state.canvas
        ? {
            ...state.canvas,
            edges: state.canvas.edges.filter((edge) => edge.id !== edgeId),
            updatedAt: new Date().toISOString(),
          }
        : undefined,
    })),

  // Selection management
  selectEdges: (edgeIds: string[]) => set({ selectedEdgeIds: edgeIds }),
  selectEdge: (edgeId: string) =>
    set((state) => ({
      selectedEdgeIds: state.selectedEdgeIds.includes(edgeId)
        ? state.selectedEdgeIds
        : [...state.selectedEdgeIds, edgeId],
    })),
  deselectEdges: () => set({ selectedEdgeIds: [] }),

  // Getters
  getEdgeById: (edgeId: string) => {
    const state = get();
    return state.canvas?.edges.find((edge) => edge.id === edgeId);
  },

  getSelectedEdges: () => {
    const state = get();
    return (
      state.canvas?.edges.filter((edge) =>
        state.selectedEdgeIds.includes(edge.id)
      ) || []
    );
  },

  getEdgesBetweenNodes: (sourceId: string, targetId: string) => {
    const state = get();
    return (
      state.canvas?.edges.filter(
        (edge) =>
          (edge.sourceId === sourceId && edge.targetId === targetId) ||
          (edge.sourceId === targetId && edge.targetId === sourceId)
      ) || []
    );
  },
});
