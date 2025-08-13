import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CanvasNode, CanvasNodeType } from '@/shared/types';
import { 
  createCanvasNode, 
  getCanvasNodesByProject, 
  updateCanvasNode, 
  deleteCanvasNode,
  updateCanvasNodePosition 
} from '@/shared/lib/supabase/services/canvasNodes';
import { getClientForEnvironment } from '@/shared/utils/authenticatedClient';
import { useAppStore } from '@/lib/stores';

interface CanvasNodesState {
  // State
  canvasNodes: CanvasNode[];
  isLoading: boolean;
  error: string | undefined;

  // Actions
  loadCanvasNodes: (projectId: string) => Promise<void>;
  createNode: (nodeData: Omit<CanvasNode, 'id' | 'createdAt' | 'updatedAt'>) => Promise<CanvasNode>;
  updateNode: (nodeId: string, updates: Partial<Pick<CanvasNode, 'title' | 'position' | 'data'>>) => Promise<void>;
  updateNodePosition: (nodeId: string, position: { x: number; y: number }) => Promise<void>;
  deleteNode: (nodeId: string) => Promise<void>;
  
  // Local state management
  addNodeLocal: (node: CanvasNode) => void;
  updateNodeLocal: (nodeId: string, updates: Partial<CanvasNode>) => void;
  removeNodeLocal: (nodeId: string) => void;
  clearNodes: () => void;
  
  // Utilities
  getNodeById: (nodeId: string) => CanvasNode | undefined;
  getNodesByType: (nodeType: CanvasNodeType) => CanvasNode[];
}

export const useCanvasNodesStore = create<CanvasNodesState>()(
  persist(
    (set, get) => ({
      // Initial state
      canvasNodes: [],
      isLoading: false,
      error: undefined,

      // Load canvas nodes for a project
      loadCanvasNodes: async (projectId: string) => {
        set({ isLoading: true, error: undefined });
        
        try {
          const client = getClientForEnvironment();
          const nodes = await getCanvasNodesByProject(projectId, client);
          
          set({ 
            canvasNodes: nodes, 
            isLoading: false 
          });
          
          console.log(`✅ Loaded ${nodes.length} canvas nodes for project ${projectId}`);
        } catch (error) {
          console.error('❌ Error loading canvas nodes:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load canvas nodes',
            isLoading: false 
          });
        }
      },

      // Create a new canvas node
      createNode: async (nodeData) => {
        set({ isLoading: true, error: undefined });
        
        try {
          const client = getClientForEnvironment();
          const newNode = await createCanvasNode(nodeData, client);
          
          // Add to local state
          set(state => ({
            canvasNodes: [...state.canvasNodes, newNode],
            isLoading: false
          }));
          
          console.log(`✅ Created canvas node: ${newNode.id} (${newNode.nodeType})`);
          return newNode;
        } catch (error) {
          console.error('❌ Error creating canvas node:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create canvas node',
            isLoading: false 
          });
          throw error;
        }
      },

      // Update a canvas node
      updateNode: async (nodeId, updates) => {
        try {
          const client = getClientForEnvironment();
          const updatedNode = await updateCanvasNode(nodeId, updates, client);
          
          // Update local state
          set(state => ({
            canvasNodes: state.canvasNodes.map(node =>
              node.id === nodeId ? updatedNode : node
            )
          }));
          
          console.log(`✅ Updated canvas node: ${nodeId}`);
        } catch (error) {
          console.error('❌ Error updating canvas node:', error);
          set({ error: error instanceof Error ? error.message : 'Failed to update canvas node' });
          throw error;
        }
      },

      // Update canvas node position (optimized for frequent updates)
      updateNodePosition: async (nodeId, position) => {
        // Update local state immediately for smooth UX
        set(state => ({
          canvasNodes: state.canvasNodes.map(node =>
            node.id === nodeId 
              ? { ...node, position, updatedAt: new Date().toISOString() }
              : node
          )
        }));

        try {
          const client = getClientForEnvironment();
          await updateCanvasNodePosition(nodeId, position, client);
          console.log(`✅ Updated canvas node position: ${nodeId}`);
        } catch (error) {
          console.error('❌ Error updating canvas node position:', error);
          // Revert local state on error
          set(state => ({
            canvasNodes: state.canvasNodes.map(node =>
              node.id === nodeId 
                ? { ...node, position: node.position } // Revert to original position
                : node
            ),
            error: error instanceof Error ? error.message : 'Failed to update node position'
          }));
        }
      },

      // Delete a canvas node
      deleteNode: async (nodeId) => {
        try {
          const client = getClientForEnvironment();
          await deleteCanvasNode(nodeId, client);
          
          // Remove from local state
          set(state => ({
            canvasNodes: state.canvasNodes.filter(node => node.id !== nodeId)
          }));
          
          console.log(`✅ Deleted canvas node: ${nodeId}`);
        } catch (error) {
          console.error('❌ Error deleting canvas node:', error);
          set({ error: error instanceof Error ? error.message : 'Failed to delete canvas node' });
          throw error;
        }
      },

      // Local state management
      addNodeLocal: (node) => {
        set(state => ({
          canvasNodes: [...state.canvasNodes, node]
        }));
      },

      updateNodeLocal: (nodeId, updates) => {
        set(state => ({
          canvasNodes: state.canvasNodes.map(node =>
            node.id === nodeId ? { ...node, ...updates } : node
          )
        }));
      },

      removeNodeLocal: (nodeId) => {
        set(state => ({
          canvasNodes: state.canvasNodes.filter(node => node.id !== nodeId)
        }));
      },

      clearNodes: () => {
        set({ canvasNodes: [], error: undefined });
      },

      // Utilities
      getNodeById: (nodeId) => {
        const state = get();
        return state.canvasNodes.find(node => node.id === nodeId);
      },

      getNodesByType: (nodeType) => {
        const state = get();
        return state.canvasNodes.filter(node => node.nodeType === nodeType);
      },
    }),
    {
      name: 'metrimap-canvas-nodes-store',
      // Only persist the nodes, not loading states
      partialize: (state) => ({ canvasNodes: state.canvasNodes }),
    }
  )
);
