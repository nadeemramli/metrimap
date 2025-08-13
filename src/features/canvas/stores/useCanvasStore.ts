import { useAutoSaveStore } from '@/lib/stores/autosave/useAutoSaveStore';
import type {
  CanvasProject,
  CanvasSettings,
  CanvasState,
  GroupNode,
  MetricCard,
  Relationship,
} from '@/shared/types';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  sliceMetricByDimensions,
  type MetricSliceOptions,
} from './metricSlicing';
import { useEdgeStore } from './useEdgeStore';
import { useGroupStore } from './useGroupStore';
import { useNodeStore } from './useNodeStore';

interface CanvasStoreState extends CanvasState {
  // Canvas management
  loadCanvas: (canvas: CanvasProject) => void;
  clearCanvas: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | undefined) => void;

  // Node operations (delegated to NodeStore)
  createNode: (
    node: Omit<MetricCard, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
  persistNodeUpdate: (
    nodeId: string,
    updates: Partial<MetricCard>
  ) => Promise<void>;
  persistNodeDelete: (nodeId: string) => Promise<void>;
  addNode: (node: MetricCard) => void;
  updateNode: (nodeId: string, updates: Partial<MetricCard>) => void;
  updateNodePosition: (
    nodeId: string,
    position: { x: number; y: number }
  ) => Promise<void>;
  deleteNode: (nodeId: string) => void;
  duplicateNode: (nodeId: string) => void;
  selectNodes: (nodeIds: string[]) => void;
  selectNode: (nodeId: string) => void;
  deselectNode: (nodeId: string) => void;
  deselectNodes: () => void;
  clearSelection: () => void;

  // Edge operations (delegated to EdgeStore)
  createEdge: (
    edge: Omit<Relationship, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
  persistEdgeUpdate: (
    edgeId: string,
    updates: Partial<Relationship>
  ) => Promise<void>;
  persistEdgeDelete: (edgeId: string) => Promise<void>;
  addEdge: (edge: Relationship) => void;
  updateEdge: (edgeId: string, updates: Partial<Relationship>) => void;
  deleteEdge: (edgeId: string) => void;
  selectEdges: (edgeIds: string[]) => void;
  selectEdge: (edgeId: string) => void;
  deselectEdges: () => void;

  // Group operations (delegated to GroupStore)
  addGroup: (group: GroupNode) => Promise<void>;
  updateGroup: (groupId: string, updates: Partial<GroupNode>) => Promise<void>;
  deleteGroup: (groupId: string) => Promise<void>;
  addNodesToGroup: (groupId: string, nodeIds: string[]) => void;
  removeNodesFromGroup: (groupId: string, nodeIds: string[]) => void;
  applyGroupLocalAdd: (group: GroupNode) => void;
  applyGroupLocalUpdate: (groupId: string, updates: Partial<GroupNode>) => void;
  applyGroupLocalDelete: (groupId: string) => void;
  toggleGroupCollapse: (groupId: string) => void;
  updateGroupSize: (
    groupId: string,
    size: { width: number; height: number }
  ) => void;
  groupSelectedNodes: (nodeIds: string[]) => Promise<string>;
  ungroupSelectedGroups: (groupIds: string[]) => Promise<void>;

  // Auto-save operations (delegated to AutoSaveStore)
  addPendingChange: (nodeId: string) => void;
  removePendingChange: (nodeId: string) => void;
  saveAllPendingChanges: () => Promise<void>;
  setSaving: (saving: boolean) => void;

  // Dimension slice
  sliceMetricByDimensions: (
    parentCardId: string,
    dimensions: string[],
    historyOption: 'manual' | 'proportional' | 'forfeit',
    percentages?: number[]
  ) => Promise<string[]>;

  // Canvas view
  setViewport: (viewport: CanvasState['viewport']) => void;
  setDateRange: (start: string, end: string) => void;
  toggleMiniMap: () => void;
  toggleControls: () => void;
  updateCanvasSettings: (settings: Partial<CanvasSettings>) => void;

  // Utility functions
  getNodeById: (nodeId: string) => MetricCard | undefined;
  getEdgeById: (edgeId: string) => Relationship | undefined;
  getGroupById: (groupId: string) => GroupNode | undefined;
  getConnectedNodes: (nodeId: string) => MetricCard[];
  getNodesByCategory: (category: MetricCard['category']) => MetricCard[];
}

export const useCanvasStore = create<CanvasStoreState>()(
  subscribeWithSelector((set, get) => {
    // Get store instances
    const nodeStore = useNodeStore.getState();
    const edgeStore = useEdgeStore.getState();
    const groupStore = useGroupStore.getState();
    const autoSaveStore = useAutoSaveStore.getState();

    return {
      // Initial state
      canvas: undefined,
      selectedNodeIds: [],
      selectedEdgeIds: [],
      isLoading: false,
      error: undefined,
      viewport: { x: 0, y: 0, zoom: 1 },
      showMiniMap: true,
      showControls: true,
      dateRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        end: new Date().toISOString().split('T')[0],
      },

      // Canvas management
      loadCanvas: (canvas: CanvasProject) => {
        console.log('🎨 Canvas loaded with:', {
          nodes: canvas.nodes.length,
          edges: canvas.edges.length,
          groups: canvas.groups?.length || 0,
        });
        set({ canvas, isLoading: false, error: undefined });
      },

      clearCanvas: () =>
        set({
          canvas: undefined,
          selectedNodeIds: [],
          selectedEdgeIds: [],
          error: undefined,
        }),

      setLoading: (isLoading: boolean) => set({ isLoading }),
      setError: (error: string | undefined) => set({ error }),

      // Node operations (delegated to NodeStore)
      createNode: async (
        nodeData: Omit<MetricCard, 'id' | 'createdAt' | 'updatedAt'>
      ) => {
        const state = get();
        if (!state.canvas) {
          console.error('❌ No canvas loaded');
          return;
        }

        console.groupCollapsed('➕ add-node');
        console.log('payload', nodeData);
        console.time('createNode');
        set({ isLoading: true, error: undefined });
        try {
          const newNode = await nodeStore.createNode(nodeData, state.canvas.id);

          set((state) => ({
            canvas: state.canvas
              ? {
                  ...state.canvas,
                  nodes: [...state.canvas.nodes, newNode],
                  updatedAt: new Date().toISOString(),
                }
              : undefined,
            isLoading: false,
          }));
          console.log('result', { id: newNode.id, title: newNode.title });
          console.timeEnd('createNode');
          console.groupEnd();
        } catch (error) {
          console.error('❌ Error creating node:', error);
          // Fallback: add a local temp node so the user sees immediate feedback
          const tempId =
            crypto?.randomUUID?.() || Math.random().toString(36).slice(2);
          set((state) => ({
            canvas: state.canvas
              ? {
                  ...state.canvas,
                  nodes: [
                    ...state.canvas.nodes,
                    {
                      ...(nodeData as any),
                      id: tempId,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    } as MetricCard,
                  ],
                  updatedAt: new Date().toISOString(),
                }
              : undefined,
            error:
              'Failed to persist node to server. Added locally; will save when possible.',
            isLoading: false,
          }));
          console.warn('fallback', { id: tempId });
          console.timeEnd('createNode');
          console.groupEnd();
        }
      },

      persistNodeUpdate: async (
        nodeId: string,
        updates: Partial<MetricCard>
      ) => {
        set({ isLoading: true, error: undefined });
        try {
          await nodeStore.persistNodeUpdate(nodeId, updates);

          // Update local state
          set((state) => ({
            canvas: state.canvas
              ? {
                  ...state.canvas,
                  nodes: nodeStore.updateNodeLocal(
                    state.canvas.nodes,
                    nodeId,
                    updates
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
          await nodeStore.persistNodeDelete(nodeId);

          // Update local state - remove node and related edges
          set((state) => ({
            canvas: state.canvas
              ? {
                  ...state.canvas,
                  nodes: nodeStore.deleteNodeLocal(state.canvas.nodes, nodeId),
                  edges: state.canvas.edges.filter(
                    (edge) =>
                      edge.sourceId !== nodeId && edge.targetId !== nodeId
                  ),
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

      addNode: (node: MetricCard) =>
        set((state) => ({
          canvas: state.canvas
            ? {
                ...state.canvas,
                nodes: nodeStore.addNodeLocal(node)(state.canvas.nodes),
                updatedAt: new Date().toISOString(),
              }
            : undefined,
        })),

      updateNode: (nodeId: string, updates: Partial<MetricCard>) =>
        set((state) => ({
          canvas: state.canvas
            ? {
                ...state.canvas,
                nodes: nodeStore.updateNodeLocal(
                  state.canvas.nodes,
                  nodeId,
                  updates
                ),
                updatedAt: new Date().toISOString(),
              }
            : undefined,
        })),

      updateNodePosition: async (
        nodeId: string,
        position: { x: number; y: number }
      ) => {
        // Update local state immediately for smooth UX
        set((state) => ({
          canvas: state.canvas
            ? {
                ...state.canvas,
                nodes: nodeStore.updateNodeLocal(state.canvas.nodes, nodeId, {
                  position,
                }),
                updatedAt: new Date().toISOString(),
              }
            : undefined,
        }));

        // Add to pending changes for auto-save
        autoSaveStore.addPendingChange(nodeId);
      },

      deleteNode: (nodeId: string) =>
        set((state) => ({
          canvas: state.canvas
            ? {
                ...state.canvas,
                nodes: nodeStore.deleteNodeLocal(state.canvas.nodes, nodeId),
                edges: state.canvas.edges.filter(
                  (edge) => edge.sourceId !== nodeId && edge.targetId !== nodeId
                ),
                updatedAt: new Date().toISOString(),
              }
            : undefined,
        })),

      duplicateNode: (nodeId: string) =>
        set((state) => ({
          canvas: state.canvas
            ? {
                ...state.canvas,
                nodes: nodeStore.duplicateNodeLocal(state.canvas.nodes, nodeId),
                updatedAt: new Date().toISOString(),
              }
            : undefined,
        })),

      // Selection delegation to NodeStore
      selectNodes: nodeStore.selectNodes,
      selectNode: nodeStore.selectNode,
      deselectNode: nodeStore.deselectNode,
      deselectNodes: nodeStore.deselectNodes,
      clearSelection: nodeStore.clearSelection,

      // Edge operations (delegated to EdgeStore)
      createEdge: async (
        edgeData: Omit<Relationship, 'id' | 'createdAt' | 'updatedAt'>
      ) => {
        const state = get();
        if (!state.canvas) return;

        set({ isLoading: true, error: undefined });
        try {
          const newEdge = await edgeStore.createEdge(edgeData, state.canvas.id);

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
        } catch (error) {
          console.error('Error creating edge:', error);
          set({ error: 'Failed to create relationship', isLoading: false });
        }
      },

      persistEdgeUpdate: async (
        edgeId: string,
        updates: Partial<Relationship>
      ) => {
        set({ isLoading: true, error: undefined });
        try {
          await edgeStore.persistEdgeUpdate(edgeId, updates);

          set((state) => ({
            canvas: state.canvas
              ? {
                  ...state.canvas,
                  edges: edgeStore.updateEdgeLocal(
                    state.canvas.edges,
                    edgeId,
                    updates
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
          await edgeStore.persistEdgeDelete(edgeId);

          set((state) => ({
            canvas: state.canvas
              ? {
                  ...state.canvas,
                  edges: edgeStore.deleteEdgeLocal(state.canvas.edges, edgeId),
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

      addEdge: (edge: Relationship) =>
        set((state) => ({
          canvas: state.canvas
            ? {
                ...state.canvas,
                edges: edgeStore.addEdgeLocal(edge)(state.canvas.edges),
                updatedAt: new Date().toISOString(),
              }
            : undefined,
        })),

      updateEdge: (edgeId: string, updates: Partial<Relationship>) =>
        set((state) => ({
          canvas: state.canvas
            ? {
                ...state.canvas,
                edges: edgeStore.updateEdgeLocal(
                  state.canvas.edges,
                  edgeId,
                  updates
                ),
                updatedAt: new Date().toISOString(),
              }
            : undefined,
        })),

      deleteEdge: (edgeId: string) =>
        set((state) => ({
          canvas: state.canvas
            ? {
                ...state.canvas,
                edges: edgeStore.deleteEdgeLocal(state.canvas.edges, edgeId),
                updatedAt: new Date().toISOString(),
              }
            : undefined,
        })),

      // Edge selection delegation
      selectEdges: edgeStore.selectEdges,
      selectEdge: edgeStore.selectEdge,
      deselectEdges: edgeStore.deselectEdges,

      // Group operations (delegated to GroupStore)
      addGroup: async (group: GroupNode) => {
        const state = get();
        if (!state.canvas?.id) {
          console.error('No canvas loaded');
          return;
        }

        try {
          await groupStore.createGroup(group, state.canvas.id);

          set((state) => ({
            canvas: state.canvas
              ? {
                  ...state.canvas,
                  groups: groupStore.addGroupLocal(group)(state.canvas.groups),
                  updatedAt: new Date().toISOString(),
                }
              : undefined,
          }));
        } catch (error) {
          console.error('Failed to create group:', error);
          throw error;
        }
      },

      updateGroup: async (groupId: string, updates: Partial<GroupNode>) => {
        try {
          await groupStore.updateGroup(groupId, updates);

          set((state) => ({
            canvas: state.canvas
              ? {
                  ...state.canvas,
                  groups: groupStore.updateGroupLocal(
                    state.canvas.groups,
                    groupId,
                    updates
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : undefined,
          }));
        } catch (error) {
          console.error('Failed to update group:', error);
          throw error;
        }
      },

      deleteGroup: async (groupId: string) => {
        try {
          await groupStore.deleteGroup(groupId);

          set((state) => ({
            canvas: state.canvas
              ? {
                  ...state.canvas,
                  groups: groupStore.deleteGroupLocal(
                    state.canvas.groups,
                    groupId
                  ),
                  // Remove parentId from all nodes in this group
                  nodes: state.canvas.nodes.map((node) =>
                    node.parentId === groupId
                      ? { ...node, parentId: undefined }
                      : node
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : undefined,
          }));
        } catch (error) {
          console.error('Failed to delete group:', error);
          throw error;
        }
      },

      addNodesToGroup: (groupId: string, nodeIds: string[]) =>
        set((state) => {
          if (!state.canvas) return state;
          const result = groupStore.addNodesToGroupLocal(
            state.canvas.groups,
            state.canvas.nodes,
            groupId,
            nodeIds
          );
          return {
            canvas: {
              ...state.canvas,
              groups: result.groups,
              nodes: result.nodes,
              updatedAt: new Date().toISOString(),
            },
          };
        }),

      removeNodesFromGroup: (groupId: string, nodeIds: string[]) =>
        set((state) => {
          if (!state.canvas) return state;
          const result = groupStore.removeNodesFromGroupLocal(
            state.canvas.groups,
            state.canvas.nodes,
            groupId,
            nodeIds
          );
          return {
            canvas: {
              ...state.canvas,
              groups: result.groups,
              nodes: result.nodes,
              updatedAt: new Date().toISOString(),
            },
          };
        }),

      // Local-only group updates for realtime
      applyGroupLocalAdd: (group: GroupNode) =>
        set((state) => ({
          canvas: state.canvas
            ? {
                ...state.canvas,
                groups: groupStore.addGroupLocal(group)(state.canvas.groups),
                updatedAt: new Date().toISOString(),
              }
            : undefined,
        })),

      applyGroupLocalUpdate: (groupId: string, updates: Partial<GroupNode>) =>
        set((state) => ({
          canvas: state.canvas
            ? {
                ...state.canvas,
                groups: groupStore.updateGroupLocal(
                  state.canvas.groups,
                  groupId,
                  updates
                ),
                updatedAt: new Date().toISOString(),
              }
            : undefined,
        })),

      applyGroupLocalDelete: (groupId: string) =>
        set((state) => ({
          canvas: state.canvas
            ? {
                ...state.canvas,
                groups: groupStore.deleteGroupLocal(
                  state.canvas.groups,
                  groupId
                ),
                nodes: state.canvas.nodes.map((node) =>
                  node.parentId === groupId
                    ? { ...node, parentId: undefined }
                    : node
                ),
                updatedAt: new Date().toISOString(),
              }
            : undefined,
        })),

      toggleGroupCollapse: (groupId: string) =>
        set((state) => ({
          canvas: state.canvas
            ? {
                ...state.canvas,
                groups: groupStore.toggleGroupCollapse(
                  state.canvas.groups,
                  groupId
                ),
                updatedAt: new Date().toISOString(),
              }
            : undefined,
        })),

      updateGroupSize: (
        groupId: string,
        size: { width: number; height: number }
      ) =>
        set((state) => ({
          canvas: state.canvas
            ? {
                ...state.canvas,
                groups: groupStore.updateGroupSize(
                  state.canvas.groups,
                  groupId,
                  size
                ),
                updatedAt: new Date().toISOString(),
              }
            : undefined,
        })),

      groupSelectedNodes: async (nodeIds: string[]) => {
        const state = get();
        if (!state.canvas?.id) {
          throw new Error('No canvas loaded');
        }

        const groupId = await groupStore.groupSelectedNodes(
          state.canvas.nodes,
          nodeIds,
          state.canvas.groups,
          state.canvas.id
        );

        // The group creation is handled in the groupStore
        // We just need to refresh the canvas state
        return groupId;
      },

      ungroupSelectedGroups: async (groupIds: string[]) => {
        await groupStore.ungroupSelectedGroups(groupIds);

        set((state) => ({
          canvas: state.canvas
            ? {
                ...state.canvas,
                groups: state.canvas.groups.filter(
                  (group) => !groupIds.includes(group.id)
                ),
                // Remove parentId from all nodes in the deleted groups
                nodes: state.canvas.nodes.map((node) =>
                  node.parentId && groupIds.includes(node.parentId)
                    ? { ...node, parentId: undefined }
                    : node
                ),
                updatedAt: new Date().toISOString(),
              }
            : undefined,
        }));
      },

      // Auto-save operations (delegated to AutoSaveStore)
      addPendingChange: autoSaveStore.addPendingChange,
      removePendingChange: autoSaveStore.removePendingChange,
      setSaving: autoSaveStore.setSaving,

      saveAllPendingChanges: async () => {
        const state = get();
        if (!state.canvas) return;

        try {
          await autoSaveStore.saveAllPendingChanges(state.canvas.nodes);
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Save failed',
          });
          throw error;
        }
      },

      // Dimension slice
      sliceMetricByDimensions: async (
        parentCardId: string,
        dimensions: string[],
        historyOption: 'manual' | 'proportional' | 'forfeit',
        percentages?: number[]
      ) => {
        const state = get();
        if (!state.canvas) return [];

        const sliceOptions: MetricSliceOptions = {
          parentCardId,
          dimensions,
          historyOption,
          percentages,
        };

        const result = await sliceMetricByDimensions(
          state.canvas,
          sliceOptions
        );

        // Update canvas state with sliced results
        set({
          canvas: {
            ...state.canvas,
            nodes: [
              ...state.canvas.nodes.filter((node) => node.id !== parentCardId),
              result.updatedParentCard,
              ...result.newCards,
            ],
            edges: [...state.canvas.edges, ...result.newRelationships],
            updatedAt: new Date().toISOString(),
          },
        });

        return result.newCards.map((card) => card.id);
      },

      // Canvas view
      setViewport: (viewport: CanvasState['viewport']) => set({ viewport }),
      setDateRange: (start: string, end: string) =>
        set({ dateRange: { start, end } }),
      toggleMiniMap: () =>
        set((state) => ({ showMiniMap: !state.showMiniMap })),
      toggleControls: () =>
        set((state) => ({ showControls: !state.showControls })),

      updateCanvasSettings: (settings: Partial<CanvasSettings>) =>
        set((state) => ({
          canvas: state.canvas
            ? {
                ...state.canvas,
                settings: { ...state.canvas.settings, ...settings },
                updatedAt: new Date().toISOString(),
              }
            : undefined,
        })),

      // Utility functions
      getNodeById: (nodeId: string) => {
        const state = get();
        return nodeStore.getNodeById(state.canvas?.nodes || [], nodeId);
      },

      getEdgeById: (edgeId: string) => {
        const state = get();
        return edgeStore.getEdgeById(state.canvas?.edges || [], edgeId);
      },

      getGroupById: (groupId: string) => {
        const state = get();
        return groupStore.getGroupById(state.canvas?.groups || [], groupId);
      },

      getConnectedNodes: (nodeId: string) => {
        const state = get();
        if (!state.canvas) return [];
        return nodeStore.getConnectedNodes(
          state.canvas.nodes,
          state.canvas.edges,
          nodeId
        );
      },

      getNodesByCategory: (category: MetricCard['category']) => {
        const state = get();
        return nodeStore.getNodesByCategory(
          state.canvas?.nodes || [],
          category
        );
      },
    };
  })
);
