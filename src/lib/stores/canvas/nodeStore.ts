/**
 * Node Store Module
 * Handles all node-related operations (MetricCards) for the canvas
 */

import { StateCreator } from 'zustand';
import {
  createMetricCard,
  deleteMetricCard as deleteMetricCardInSupabase,
  updateMetricCard as updateMetricCardInSupabase,
} from '../../supabase/services/metric-cards';
import type { CanvasProject, MetricCard } from '../../types';
import { getClientForEnvironment } from '../../utils/authenticatedClient';
import { generateUUID } from '../../utils/validation';
import { useAppStore } from '../appStore';

export interface NodeState {
  // Node data
  nodes: MetricCard[];
  selectedNodeIds: string[];

  // Loading state
  isLoading: boolean;
  error: string | undefined;
}

export interface NodeActions {
  // Async Node management (Supabase)
  createNode: (
    node: Omit<MetricCard, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
  persistNodeUpdate: (
    nodeId: string,
    updates: Partial<MetricCard>
  ) => Promise<void>;
  persistNodeDelete: (nodeId: string) => Promise<void>;

  // Local Node management
  addNode: (node: MetricCard) => void;
  updateNode: (nodeId: string, updates: Partial<MetricCard>) => void;
  updateNodePosition: (
    nodeId: string,
    position: { x: number; y: number }
  ) => Promise<void>;
  deleteNode: (nodeId: string) => void;
  duplicateNode: (nodeId: string) => void;

  // Selection management
  selectNodes: (nodeIds: string[]) => void;
  selectNode: (nodeId: string) => void;
  deselectNode: (nodeId: string) => void;
  deselectNodes: () => void;
  clearSelection: () => void;

  // Getters
  getNodeById: (nodeId: string) => MetricCard | undefined;
  getSelectedNodes: () => MetricCard[];
}

export interface NodeSlice extends NodeState, NodeActions {}

// Type for the full store (to be used when accessing canvas)
interface FullStore {
  canvas: CanvasProject | undefined;
  pendingChanges: Set<string>;
  addPendingChange: (nodeId: string) => void;
}

export const createNodeSlice: StateCreator<
  FullStore & NodeSlice,
  [],
  [],
  NodeSlice
> = (set, get) => ({
  // Initial state
  nodes: [],
  selectedNodeIds: [],
  isLoading: false,
  error: undefined,

  // Async Node management (Supabase)
  createNode: async (
    nodeData: Omit<MetricCard, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const state = get();
    if (!state.canvas) {
      console.error('❌ No canvas loaded');
      return;
    }

    console.log('🔍 createNode called with:', {
      canvasId: state.canvas.id,
      nodeData: nodeData.title,
      user: useAppStore.getState().user?.id,
    });

    set({ isLoading: true, error: undefined });
    try {
      const { user } = useAppStore.getState();
      if (!user) throw new Error('User not authenticated');

      const client = getClientForEnvironment();
      console.log('🔍 Using client:', client ? 'authenticated' : 'default');

      const newNode = await createMetricCard(
        { ...nodeData, owner: user.id, id: '', createdAt: '', updatedAt: '' },
        state.canvas.id,
        user.id,
        client
      );

      set((state) => ({
        canvas: state.canvas
          ? {
              ...state.canvas,
              nodes: [...state.canvas.nodes, newNode as MetricCard],
              updatedAt: new Date().toISOString(),
            }
          : undefined,
        isLoading: false,
      }));

      console.log('✅ New metric card created and saved:', newNode.title);
    } catch (error) {
      console.error('❌ Error creating node:', error);
      set({ error: 'Failed to create node', isLoading: false });
    }
  },

  persistNodeUpdate: async (nodeId: string, updates: Partial<MetricCard>) => {
    set({ isLoading: true, error: undefined });
    try {
      const client = getClientForEnvironment();
      await updateMetricCardInSupabase(nodeId, updates, client);

      // Update local state
      set((state) => ({
        canvas: state.canvas
          ? {
              ...state.canvas,
              nodes: state.canvas.nodes.map((node) =>
                node.id === nodeId
                  ? {
                      ...node,
                      ...updates,
                      updatedAt: new Date().toISOString(),
                    }
                  : node
              ),
              updatedAt: new Date().toISOString(),
            }
          : undefined,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error updating node:', error);
      set({ error: 'Failed to update node', isLoading: false });
    }
  },

  persistNodeDelete: async (nodeId: string) => {
    set({ isLoading: true, error: undefined });
    try {
      const client = getClientForEnvironment();
      await deleteMetricCardInSupabase(nodeId, client);

      // Update local state
      set((state) => ({
        canvas: state.canvas
          ? {
              ...state.canvas,
              nodes: state.canvas.nodes.filter((node) => node.id !== nodeId),
              updatedAt: new Date().toISOString(),
            }
          : undefined,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error deleting node:', error);
      set({ error: 'Failed to delete node', isLoading: false });
    }
  },

  // Local Node management
  addNode: (node: MetricCard) =>
    set((state) => ({
      canvas: state.canvas
        ? {
            ...state.canvas,
            nodes: [...state.canvas.nodes, node],
            updatedAt: new Date().toISOString(),
          }
        : undefined,
    })),

  updateNode: (nodeId: string, updates: Partial<MetricCard>) =>
    set((state) => ({
      canvas: state.canvas
        ? {
            ...state.canvas,
            nodes: state.canvas.nodes.map((node) =>
              node.id === nodeId
                ? { ...node, ...updates, updatedAt: new Date().toISOString() }
                : node
            ),
            updatedAt: new Date().toISOString(),
          }
        : undefined,
    })),

  // Position-specific update that triggers auto-save
  updateNodePosition: async (
    nodeId: string,
    position: { x: number; y: number }
  ) => {
    // Update local state immediately for smooth UX
    set((state) => ({
      canvas: state.canvas
        ? {
            ...state.canvas,
            nodes: state.canvas.nodes.map((node) =>
              node.id === nodeId
                ? { ...node, position, updatedAt: new Date().toISOString() }
                : node
            ),
            updatedAt: new Date().toISOString(),
          }
        : undefined,
    }));

    // Add to pending changes for auto-save
    const state = get();
    if (state.addPendingChange) {
      state.addPendingChange(nodeId);
    }
  },

  deleteNode: (nodeId: string) =>
    set((state) => ({
      canvas: state.canvas
        ? {
            ...state.canvas,
            nodes: state.canvas.nodes.filter((node) => node.id !== nodeId),
            edges: state.canvas.edges.filter(
              (edge) => edge.sourceId !== nodeId && edge.targetId !== nodeId
            ),
            updatedAt: new Date().toISOString(),
          }
        : undefined,
    })),

  duplicateNode: (nodeId: string) =>
    set((state) => {
      const node = state.canvas?.nodes.find((n) => n.id === nodeId);
      if (!node || !state.canvas) return state;

      const newNode: MetricCard = {
        ...node,
        id: generateUUID(),
        title: `${node.title} (Copy)`,
        position: { x: node.position.x + 50, y: node.position.y + 50 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return {
        canvas: {
          ...state.canvas,
          nodes: [...state.canvas.nodes, newNode],
          updatedAt: new Date().toISOString(),
        },
      };
    }),

  // Selection management
  selectNodes: (nodeIds: string[]) => set({ selectedNodeIds: nodeIds }),
  selectNode: (nodeId: string) =>
    set((state) => ({
      selectedNodeIds: state.selectedNodeIds.includes(nodeId)
        ? state.selectedNodeIds
        : [...state.selectedNodeIds, nodeId],
    })),
  deselectNode: (nodeId: string) =>
    set((state) => ({
      selectedNodeIds: state.selectedNodeIds.filter((id) => id !== nodeId),
    })),
  deselectNodes: () => set({ selectedNodeIds: [] }),
  clearSelection: () => set({ selectedNodeIds: [] }),

  // Getters
  getNodeById: (nodeId: string) => {
    const state = get();
    return state.canvas?.nodes.find((node) => node.id === nodeId);
  },

  getSelectedNodes: () => {
    const state = get();
    return (
      state.canvas?.nodes.filter((node) =>
        state.selectedNodeIds.includes(node.id)
      ) || []
    );
  },
});
