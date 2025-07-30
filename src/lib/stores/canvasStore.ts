import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { CanvasState, CanvasProject, MetricCard, Relationship, GroupNode, CanvasSettings } from '../types';

interface CanvasStoreState extends CanvasState {
  // Canvas management
  loadCanvas: (canvas: CanvasProject) => void;
  clearCanvas: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | undefined) => void;

  // Node management
  addNode: (node: MetricCard) => void;
  updateNode: (nodeId: string, updates: Partial<MetricCard>) => void;
  deleteNode: (nodeId: string) => void;
  duplicateNode: (nodeId: string) => void;
  selectNodes: (nodeIds: string[]) => void;
  selectNode: (nodeId: string) => void;
  deselectNodes: () => void;

  // Edge management
  addEdge: (edge: Relationship) => void;
  updateEdge: (edgeId: string, updates: Partial<Relationship>) => void;
  deleteEdge: (edgeId: string) => void;
  selectEdges: (edgeIds: string[]) => void;
  selectEdge: (edgeId: string) => void;
  deselectEdges: () => void;

  // Group management
  addGroup: (group: GroupNode) => void;
  updateGroup: (groupId: string, updates: Partial<GroupNode>) => void;
  deleteGroup: (groupId: string) => void;
  addNodesToGroup: (groupId: string, nodeIds: string[]) => void;
  removeNodesFromGroup: (groupId: string, nodeIds: string[]) => void;

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
  subscribeWithSelector((set, get) => ({
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
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
    },

    // Canvas management
    loadCanvas: (canvas: CanvasProject) =>
      set({ canvas, isLoading: false, error: undefined }),

    clearCanvas: () =>
      set({
        canvas: undefined,
        selectedNodeIds: [],
        selectedEdgeIds: [],
        error: undefined,
      }),

    setLoading: (isLoading: boolean) => set({ isLoading }),
    setError: (error: string | undefined) => set({ error }),

    // Node management
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
        selectedNodeIds: state.selectedNodeIds.filter((id) => id !== nodeId),
      })),

    duplicateNode: (nodeId: string) =>
      set((state) => {
        const node = state.canvas?.nodes.find((n) => n.id === nodeId);
        if (!node || !state.canvas) return state;

        const newNode: MetricCard = {
          ...node,
          id: `${node.id}_copy_${Date.now()}`,
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

    selectNodes: (nodeIds: string[]) => set({ selectedNodeIds: nodeIds }),
    selectNode: (nodeId: string) => set({ selectedNodeIds: [nodeId] }),
    deselectNodes: () => set({ selectedNodeIds: [] }),

    // Edge management
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
      set((state) => ({
        canvas: state.canvas
          ? {
              ...state.canvas,
              edges: state.canvas.edges.map((edge) =>
                edge.id === edgeId
                  ? { ...edge, ...updates, updatedAt: new Date().toISOString() }
                  : edge
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
              edges: state.canvas.edges.filter((edge) => edge.id !== edgeId),
              updatedAt: new Date().toISOString(),
            }
          : undefined,
        selectedEdgeIds: state.selectedEdgeIds.filter((id) => id !== edgeId),
      })),

    selectEdges: (edgeIds: string[]) => set({ selectedEdgeIds: edgeIds }),
    selectEdge: (edgeId: string) => set({ selectedEdgeIds: [edgeId] }),
    deselectEdges: () => set({ selectedEdgeIds: [] }),

    // Group management
    addGroup: (group: GroupNode) =>
      set((state) => ({
        canvas: state.canvas
          ? {
              ...state.canvas,
              groups: [...state.canvas.groups, group],
              updatedAt: new Date().toISOString(),
            }
          : undefined,
      })),

    updateGroup: (groupId: string, updates: Partial<GroupNode>) =>
      set((state) => ({
        canvas: state.canvas
          ? {
              ...state.canvas,
              groups: state.canvas.groups.map((group) =>
                group.id === groupId ? { ...group, ...updates } : group
              ),
              updatedAt: new Date().toISOString(),
            }
          : undefined,
      })),

    deleteGroup: (groupId: string) =>
      set((state) => ({
        canvas: state.canvas
          ? {
              ...state.canvas,
              groups: state.canvas.groups.filter((group) => group.id !== groupId),
              updatedAt: new Date().toISOString(),
            }
          : undefined,
      })),

    addNodesToGroup: (groupId: string, nodeIds: string[]) =>
      set((state) => ({
        canvas: state.canvas
          ? {
              ...state.canvas,
              groups: state.canvas.groups.map((group) =>
                group.id === groupId
                  ? { ...group, nodeIds: [...new Set([...group.nodeIds, ...nodeIds])] }
                  : group
              ),
              updatedAt: new Date().toISOString(),
            }
          : undefined,
      })),

    removeNodesFromGroup: (groupId: string, nodeIds: string[]) =>
      set((state) => ({
        canvas: state.canvas
          ? {
              ...state.canvas,
              groups: state.canvas.groups.map((group) =>
                group.id === groupId
                  ? { ...group, nodeIds: group.nodeIds.filter((id) => !nodeIds.includes(id)) }
                  : group
              ),
              updatedAt: new Date().toISOString(),
            }
          : undefined,
      })),

    // Canvas view
    setViewport: (viewport: CanvasState['viewport']) => set({ viewport }),
    setDateRange: (start: string, end: string) => set({ dateRange: { start, end } }),
    toggleMiniMap: () => set((state) => ({ showMiniMap: !state.showMiniMap })),
    toggleControls: () => set((state) => ({ showControls: !state.showControls })),
    
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
      return state.canvas?.nodes.find((node) => node.id === nodeId);
    },

    getEdgeById: (edgeId: string) => {
      const state = get();
      return state.canvas?.edges.find((edge) => edge.id === edgeId);
    },

    getGroupById: (groupId: string) => {
      const state = get();
      return state.canvas?.groups.find((group) => group.id === groupId);
    },

    getConnectedNodes: (nodeId: string) => {
      const state = get();
      if (!state.canvas) return [];

      const connectedNodeIds = new Set<string>();
      
      state.canvas.edges.forEach((edge) => {
        if (edge.sourceId === nodeId) {
          connectedNodeIds.add(edge.targetId);
        }
        if (edge.targetId === nodeId) {
          connectedNodeIds.add(edge.sourceId);
        }
      });

      return state.canvas.nodes.filter((node) => connectedNodeIds.has(node.id));
    },

    getNodesByCategory: (category: MetricCard['category']) => {
      const state = get();
      return state.canvas?.nodes.filter((node) => node.category === category) || [];
    },
  }))
);