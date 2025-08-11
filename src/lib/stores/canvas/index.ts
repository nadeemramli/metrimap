/**
 * Composed Canvas Store
 * Main store that combines all canvas-related modules
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { CanvasProject, CanvasSettings } from '../../types';
import { createAutoSaveSlice, type AutoSaveSlice } from './autoSaveStore';
import { createEdgeSlice, type EdgeSlice } from './edgeStore';
import { createGroupSlice, type GroupSlice } from './groupStore';
import { createNodeSlice, type NodeSlice } from './nodeStore';

// Main canvas state (core canvas data and settings)
interface CanvasBaseState {
  // Core canvas data
  canvas: CanvasProject | undefined;

  // UI state
  isLoading: boolean;
  error: string | undefined;

  // Canvas management
  loadCanvas: (canvas: CanvasProject) => void;
  clearCanvas: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | undefined) => void;

  // Canvas settings
  updateCanvasSettings: (settings: Partial<CanvasSettings>) => void;

  // Legacy getters (for backward compatibility)
  getConnectedNodes: (nodeId: string) => any[];
  getNodesByCategory: (category: string) => any[];

  // Dimension slice (kept here as it's canvas-specific business logic)
  sliceMetricByDimensions: (
    parentCardId: string,
    dimensions: string[],
    historyOption: 'manual' | 'proportional' | 'forfeit',
    percentages?: number[]
  ) => Promise<string[]>;
}

// Combined store type
interface CanvasStoreState
  extends CanvasBaseState,
    NodeSlice,
    EdgeSlice,
    GroupSlice,
    AutoSaveSlice {}

export const useCanvasStore = create<CanvasStoreState>()(
  subscribeWithSelector((...a) => ({
    // Core canvas state
    canvas: undefined,
    isLoading: false,
    error: undefined,

    // Canvas management
    loadCanvas: (canvas: CanvasProject) => {
      console.log('🎨 Canvas loaded with:', {
        nodes: canvas.nodes.length,
        edges: canvas.edges.length,
        groups: canvas.groups?.length || 0,
      });

      const [set] = a;
      set((state) => ({
        canvas,
        error: undefined,
        // Clear any stale state
        pendingChanges: new Set<string>(),
        selectedNodeIds: [],
        selectedEdgeIds: [],
      }));
    },

    clearCanvas: () => {
      const [set] = a;
      set({
        canvas: undefined,
        isLoading: false,
        error: undefined,
        pendingChanges: new Set<string>(),
        selectedNodeIds: [],
        selectedEdgeIds: [],
      });
    },

    setLoading: (loading: boolean) => {
      const [set] = a;
      set({ isLoading: loading });
    },

    setError: (error: string | undefined) => {
      const [set] = a;
      set({ error });
    },

    // Canvas settings
    updateCanvasSettings: (settings: Partial<CanvasSettings>) => {
      const [set] = a;
      set((state) => ({
        canvas: state.canvas
          ? {
              ...state.canvas,
              settings: { ...state.canvas.settings, ...settings },
              updatedAt: new Date().toISOString(),
            }
          : undefined,
      }));
    },

    // Legacy getters (for backward compatibility)
    getConnectedNodes: (nodeId: string) => {
      const [, get] = a;
      const state = get();
      const connectedEdges =
        state.canvas?.edges.filter(
          (edge) => edge.sourceId === nodeId || edge.targetId === nodeId
        ) || [];

      const connectedNodeIds = connectedEdges.flatMap((edge) => [
        edge.sourceId === nodeId ? edge.targetId : edge.sourceId,
      ]);

      return (
        state.canvas?.nodes.filter((node) =>
          connectedNodeIds.includes(node.id)
        ) || []
      );
    },

    getNodesByCategory: (category: string) => {
      const [, get] = a;
      const state = get();
      return (
        state.canvas?.nodes.filter((node) => node.category === category) || []
      );
    },

    // Dimension slice (business logic specific to canvas)
    sliceMetricByDimensions: async (
      parentCardId: string,
      dimensions: string[],
      historyOption: 'manual' | 'proportional' | 'forfeit',
      percentages?: number[]
    ) => {
      // TODO: Implement dimension slicing logic
      // This is complex business logic that should stay in the main store
      console.log('sliceMetricByDimensions called:', {
        parentCardId,
        dimensions,
        historyOption,
        percentages,
      });
      return [];
    },

    // Combine all the slices
    ...createNodeSlice(...a),
    ...createEdgeSlice(...a),
    ...createGroupSlice(...a),
    ...createAutoSaveSlice(...a),
  }))
);

// Re-export types for convenience
export type { AutoSaveSlice, EdgeSlice, GroupSlice, NodeSlice };
export type CanvasStore = typeof useCanvasStore;
