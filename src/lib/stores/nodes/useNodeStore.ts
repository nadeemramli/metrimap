import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  createMetricCard,
  deleteMetricCard as deleteMetricCardInSupabase,
  updateMetricCard as updateMetricCardInSupabase,
} from '../../supabase/services/metric-cards';
import type { MetricCard } from '../../types';
import { getClientForEnvironment } from '../../utils/authenticatedClient';
import { generateUUID } from '../../utils/validation';
import { useAppStore } from '../appStore';

export interface NodeStoreState {
  // Selection state
  selectedNodeIds: string[];

  // Async Node management (Supabase)
  createNode: (
    node: Omit<MetricCard, 'id' | 'createdAt' | 'updatedAt'>,
    canvasId: string
  ) => Promise<MetricCard>;
  persistNodeUpdate: (
    nodeId: string,
    updates: Partial<MetricCard>
  ) => Promise<void>;
  persistNodeDelete: (nodeId: string) => Promise<void>;

  // Local Node management (for optimistic updates)
  addNodeLocal: (node: MetricCard) => MetricCard[];
  updateNodeLocal: (
    nodes: MetricCard[],
    nodeId: string,
    updates: Partial<MetricCard>
  ) => MetricCard[];
  deleteNodeLocal: (nodes: MetricCard[], nodeId: string) => MetricCard[];
  duplicateNodeLocal: (nodes: MetricCard[], nodeId: string) => MetricCard[];

  // Node selection
  selectNodes: (nodeIds: string[]) => void;
  selectNode: (nodeId: string) => void;
  deselectNode: (nodeId: string) => void;
  deselectNodes: () => void;
  clearSelection: () => void;

  // Utility functions
  getNodeById: (nodes: MetricCard[], nodeId: string) => MetricCard | undefined;
  getConnectedNodes: (
    nodes: MetricCard[],
    edges: any[],
    nodeId: string
  ) => MetricCard[];
  getNodesByCategory: (
    nodes: MetricCard[],
    category: MetricCard['category']
  ) => MetricCard[];
}

export const useNodeStore = create<NodeStoreState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    selectedNodeIds: [],

    // Async Node management (Supabase)
    createNode: async (
      nodeData: Omit<MetricCard, 'id' | 'createdAt' | 'updatedAt'>,
      canvasId: string
    ): Promise<MetricCard> => {
      console.log('🔍 createNode called with:', {
        canvasId,
        nodeData: nodeData.title,
        user: useAppStore.getState().user?.id,
      });

      try {
        const { user } = useAppStore.getState();
        if (!user) throw new Error('User not authenticated');

        const client = getClientForEnvironment();
        console.log('🔍 Using client:', client ? 'authenticated' : 'default');

        const newNode = await createMetricCard(
          { ...nodeData, owner: user.id, id: '', createdAt: '', updatedAt: '' },
          canvasId,
          user.id,
          client
        );

        console.log('✅ New metric card created and saved:', newNode.title);
        return newNode as MetricCard;
      } catch (error) {
        console.error('❌ Error creating node:', error);
        throw new Error('Failed to create node');
      }
    },

    persistNodeUpdate: async (nodeId: string, updates: Partial<MetricCard>) => {
      try {
        const client = getClientForEnvironment();
        await updateMetricCardInSupabase(nodeId, updates, client);
        console.log('✅ Node updated successfully:', nodeId);
      } catch (error) {
        console.error('❌ Error updating node:', error);
        throw new Error('Failed to update node');
      }
    },

    persistNodeDelete: async (nodeId: string) => {
      try {
        const client = getClientForEnvironment();
        await deleteMetricCardInSupabase(nodeId, client);
        console.log('✅ Node deleted successfully:', nodeId);
      } catch (error) {
        console.error('❌ Error deleting node:', error);
        throw new Error('Failed to delete node');
      }
    },

    // Local Node management (for optimistic updates)
    addNodeLocal: (node: MetricCard): MetricCard[] => {
      // This returns the new nodes array for the canvas store to use
      return (currentNodes: MetricCard[]) => [...currentNodes, node];
    },

    updateNodeLocal: (
      nodes: MetricCard[],
      nodeId: string,
      updates: Partial<MetricCard>
    ): MetricCard[] => {
      return nodes.map((node) =>
        node.id === nodeId
          ? { ...node, ...updates, updatedAt: new Date().toISOString() }
          : node
      );
    },

    deleteNodeLocal: (nodes: MetricCard[], nodeId: string): MetricCard[] => {
      const state = get();
      // Update selection when deleting
      if (state.selectedNodeIds.includes(nodeId)) {
        set({
          selectedNodeIds: state.selectedNodeIds.filter((id) => id !== nodeId),
        });
      }
      return nodes.filter((node) => node.id !== nodeId);
    },

    duplicateNodeLocal: (nodes: MetricCard[], nodeId: string): MetricCard[] => {
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return nodes;

      const newNode: MetricCard = {
        ...node,
        id: generateUUID(),
        title: `${node.title} (Copy)`,
        position: { x: node.position.x + 50, y: node.position.y + 50 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return [...nodes, newNode];
    },

    // Node selection
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

    // Utility functions
    getNodeById: (nodes: MetricCard[], nodeId: string) => {
      return nodes.find((node) => node.id === nodeId);
    },

    getConnectedNodes: (
      nodes: MetricCard[],
      edges: any[],
      nodeId: string
    ): MetricCard[] => {
      const connectedNodeIds = new Set<string>();

      edges.forEach((edge) => {
        if (edge.sourceId === nodeId) {
          connectedNodeIds.add(edge.targetId);
        }
        if (edge.targetId === nodeId) {
          connectedNodeIds.add(edge.sourceId);
        }
      });

      return nodes.filter((node) => connectedNodeIds.has(node.id));
    },

    getNodesByCategory: (
      nodes: MetricCard[],
      category: MetricCard['category']
    ): MetricCard[] => {
      return nodes.filter((node) => node.category === category);
    },
  }))
);
