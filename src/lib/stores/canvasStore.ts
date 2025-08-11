import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  createMetricCard,
  deleteMetricCard as deleteMetricCardInSupabase,
  updateMetricCard as updateMetricCardInSupabase,
} from '../supabase/services/metric-cards';
import {
  createGroup,
  deleteGroup as deleteGroupInSupabase,
  updateGroup as updateGroupInSupabase,
} from '../supabase/services/projects';
import {
  createRelationship,
  deleteRelationship as deleteRelationshipInSupabase,
  updateRelationship as updateRelationshipInSupabase,
} from '../supabase/services/relationships';
import type {
  CanvasProject,
  CanvasSettings,
  CanvasState,
  GroupNode,
  MetricCard,
  Relationship,
} from '../types';
import { getClientForEnvironment } from '../utils/authenticatedClient';
import { generateUUID } from '../utils/validation';
import { useAppStore } from './appStore';

interface CanvasStoreState extends CanvasState {
  // Auto-save state
  pendingChanges: Set<string>;
  isSaving: boolean;
  lastSaved: string | undefined;

  // Canvas management
  loadCanvas: (canvas: CanvasProject) => void;
  clearCanvas: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | undefined) => void;

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
  selectNodes: (nodeIds: string[]) => void;
  selectNode: (nodeId: string) => void;
  deselectNode: (nodeId: string) => void;
  deselectNodes: () => void;
  clearSelection: () => void;

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
  selectEdges: (edgeIds: string[]) => void;
  selectEdge: (edgeId: string) => void;
  deselectEdges: () => void;

  // Group management
  addGroup: (group: GroupNode) => Promise<void>;
  updateGroup: (groupId: string, updates: Partial<GroupNode>) => Promise<void>;
  deleteGroup: (groupId: string) => Promise<void>;
  addNodesToGroup: (groupId: string, nodeIds: string[]) => void;
  removeNodesFromGroup: (groupId: string, nodeIds: string[]) => void;
  // Local-only group updates for realtime (do not persist)
  applyGroupLocalAdd: (group: GroupNode) => void;
  applyGroupLocalUpdate: (groupId: string, updates: Partial<GroupNode>) => void;
  applyGroupLocalDelete: (groupId: string) => void;

  // Group management
  toggleGroupCollapse: (groupId: string) => void;
  updateGroupSize: (
    groupId: string,
    size: { width: number; height: number }
  ) => void;

  // Selection-based grouping
  groupSelectedNodes: (nodeIds: string[]) => Promise<string>;
  ungroupSelectedGroups: (groupIds: string[]) => Promise<void>;

  // Auto-save functionality
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
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      end: new Date().toISOString().split('T')[0],
    },

    // Auto-save state
    pendingChanges: new Set<string>(),
    isSaving: false,
    lastSaved: undefined as string | undefined,

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

    // Async Node management (Supabase) - Using enhanced client utility
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
                edges: state.canvas.edges.filter(
                  (edge) => edge.sourceId !== nodeId && edge.targetId !== nodeId
                ),
                updatedAt: new Date().toISOString(),
              }
            : undefined,
          selectedNodeIds: state.selectedNodeIds.filter((id) => id !== nodeId),
          isLoading: false,
        }));
      } catch (error) {
        console.error('Error deleting node:', error);
        set({ error: 'Failed to delete node', isLoading: false });
      }
    },

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

    persistEdgeUpdate: async (
      edgeId: string,
      updates: Partial<Relationship>
    ) => {
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
          selectedEdgeIds: state.selectedEdgeIds.filter((id) => id !== edgeId),
          isLoading: false,
        }));
      } catch (error) {
        console.error('Error deleting edge:', error);
        set({ error: 'Failed to delete relationship', isLoading: false });
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

      // The debounced persistence will be handled by the auto-save system
    },

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
          error:
            failedNodes.length > 0
              ? `Failed to save ${failedNodes.length} items`
              : undefined,
        });

        console.log(
          `✅ Bulletproof save completed: ${successfulSaves.length} saved, ${failedNodes.length} failed`
        );

        // Sync with projects store if we have successful saves
        if (successfulSaves.length > 0) {
          const currentCanvas = get().canvas;
          if (currentCanvas) {
            try {
              // This part of the code was removed as per the new_code,
              // as the projectsStore is no longer imported.
              // The original code had this line:
              // const projectsStore = useProjectsStore.getState();
              // projectsStore.updateProject(currentCanvas.id, {
              //   updatedAt: new Date().toISOString(),
              // });
            } catch (error) {
              console.warn('Failed to sync with projects store:', error);
            }
          }
        }

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
              currentState.saveAllPendingChanges();
            }
          }, 5000);
        }
      } catch (error) {
        console.error('❌ Bulletproof save system failed:', error);
        set({ isSaving: false, error: 'Critical save failure' });
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
        selectedNodeIds: state.selectedNodeIds.filter((id) => id !== nodeId),
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
          updates.confidence &&
          updates.confidence !== existingEdge.confidence
        ) {
          historyEntries.push({
            id: `history_${edgeId}_${Date.now()}_confidence`,
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
            id: `history_${edgeId}_${Date.now()}_type`,
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
            id: `history_${edgeId}_${Date.now()}_evidence`,
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
          canvas: {
            ...state.canvas,
            edges: state.canvas.edges.map((edge) =>
              edge.id === edgeId
                ? {
                    ...edge,
                    ...updates,
                    history: updatedHistory,
                    updatedAt: timestamp,
                  }
                : edge
            ),
            updatedAt: timestamp,
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
        selectedEdgeIds: state.selectedEdgeIds.filter((id) => id !== edgeId),
      })),

    selectEdges: (edgeIds: string[]) => set({ selectedEdgeIds: edgeIds }),
    selectEdge: (edgeId: string) => set({ selectedEdgeIds: [edgeId] }),
    deselectEdges: () => set({ selectedEdgeIds: [] }),

    // Group management
    addGroup: async (group: GroupNode) => {
      const state = get();
      if (!state.canvas?.id) {
        console.error('No canvas loaded');
        return;
      }

      try {
        // Get current user for created_by field
        const { user } = useAppStore.getState();
        if (!user) {
          throw new Error('User not authenticated');
        }

        // Persist to database
        await createGroup({
          id: group.id,
          name: group.name,
          nodeIds: group.nodeIds,
          position: group.position,
          size: group.size,
          projectId: state.canvas.id,
          createdBy: user.id,
        });

        // Update local state
        set((state) => ({
          canvas: state.canvas
            ? {
                ...state.canvas,
                groups: [...state.canvas.groups, group],
                updatedAt: new Date().toISOString(),
              }
            : undefined,
        }));

        // Sync with projects store
        try {
          // This part of the code was removed as per the new_code,
          // as the projectsStore is no longer imported.
          // The original code had this line:
          // const projectsStore = useProjectsStore.getState();
          // const updatedCanvas = get().canvas;
          // if (updatedCanvas) {
          //   projectsStore.updateProject(state.canvas.id, {
          //     groups: updatedCanvas.groups,
          //     updatedAt: updatedCanvas.updatedAt,
          //   });
          // }
        } catch (error) {
          console.warn(
            'Failed to sync group creation with projects store:',
            error
          );
        }
      } catch (error) {
        console.error('Failed to create group:', error);
        throw error;
      }
    },

    updateGroup: async (groupId: string, updates: Partial<GroupNode>) => {
      try {
        // Persist to database
        await updateGroupInSupabase(groupId, {
          name: updates.name,
          nodeIds: updates.nodeIds,
          position: updates.position,
          size: updates.size,
        });

        // Update local state
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
        }));

        // Sync with projects store
        try {
          // This part of the code was removed as per the new_code,
          // as the projectsStore is no longer imported.
          // The original code had this line:
          // const projectsStore = useProjectsStore.getState();
          // const updatedCanvas = get().canvas;
          // if (updatedCanvas) {
          //   projectsStore.updateProject(updatedCanvas.id, {
          //     groups: updatedCanvas.groups,
          //     updatedAt: updatedCanvas.updatedAt,
          //   });
          // }
        } catch (error) {
          console.warn(
            'Failed to sync group update with projects store:',
            error
          );
        }
      } catch (error) {
        console.error('Failed to update group:', error);
        throw error;
      }
    },

    deleteGroup: async (groupId: string) => {
      try {
        // Persist to database
        await deleteGroupInSupabase(groupId);

        // Update local state
        set((state) => ({
          canvas: state.canvas
            ? {
                ...state.canvas,
                groups: state.canvas.groups.filter(
                  (group) => group.id !== groupId
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

        // Sync with projects store
        try {
          // This part of the code was removed as per the new_code,
          // as the projectsStore is no longer imported.
          // The original code had this line:
          // const projectsStore = useProjectsStore.getState();
          // const updatedCanvas = get().canvas;
          // if (updatedCanvas) {
          //   projectsStore.updateProject(updatedCanvas.id, {
          //     groups: updatedCanvas.groups,
          //     nodes: updatedCanvas.nodes,
          //     updatedAt: updatedCanvas.updatedAt,
          //   });
          // }
        } catch (error) {
          console.warn(
            'Failed to sync group deletion with projects store:',
            error
          );
        }
      } catch (error) {
        console.error('Failed to delete group:', error);
        throw error;
      }
    },

    // Local-only group updates for realtime (do not persist)
    applyGroupLocalAdd: (group: GroupNode) =>
      set((state) => ({
        canvas: state.canvas
          ? {
              ...state.canvas,
              groups: [...state.canvas.groups, group],
              updatedAt: new Date().toISOString(),
            }
          : undefined,
      })),

    applyGroupLocalUpdate: (groupId: string, updates: Partial<GroupNode>) =>
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

    applyGroupLocalDelete: (groupId: string) =>
      set((state) => ({
        canvas: state.canvas
          ? {
              ...state.canvas,
              groups: state.canvas.groups.filter((g) => g.id !== groupId),
              nodes: state.canvas.nodes.map((node) =>
                node.parentId === groupId
                  ? { ...node, parentId: undefined }
                  : node
              ),
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
                  ? {
                      ...group,
                      nodeIds: [...new Set([...group.nodeIds, ...nodeIds])],
                    }
                  : group
              ),
              // Update parentId for all nodes being added to the group
              nodes: state.canvas.nodes.map((node) =>
                nodeIds.includes(node.id)
                  ? { ...node, parentId: groupId }
                  : node
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
                  ? {
                      ...group,
                      nodeIds: group.nodeIds.filter(
                        (id) => !nodeIds.includes(id)
                      ),
                    }
                  : group
              ),
              // Remove parentId from nodes being removed from the group
              nodes: state.canvas.nodes.map((node) =>
                nodeIds.includes(node.id)
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
              groups: state.canvas.groups.map((group) =>
                group.id === groupId
                  ? { ...group, isCollapsed: !group.isCollapsed }
                  : group
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
              groups: state.canvas.groups.map((group) =>
                group.id === groupId ? { ...group, size } : group
              ),
              updatedAt: new Date().toISOString(),
            }
          : undefined,
      })),

    // Selection-based grouping
    groupSelectedNodes: async (nodeIds: string[]) => {
      console.log('🎯 groupSelectedNodes called with:', nodeIds);

      if (nodeIds.length < 2) {
        throw new Error('At least 2 nodes must be selected to create a group');
      }

      const state = get();
      if (!state.canvas?.id) {
        throw new Error('No canvas loaded');
      }

      try {
        // Calculate group bounds based on selected nodes
        const selectedNodes = state.canvas.nodes.filter((node) =>
          nodeIds.includes(node.id)
        );

        if (selectedNodes.length === 0) {
          throw new Error('No valid nodes found');
        }

        // Calculate bounding box
        const positions = selectedNodes.map((node) => node.position);
        const minX = Math.min(...positions.map((p) => p.x));
        const maxX = Math.max(...positions.map((p) => p.x));
        const minY = Math.min(...positions.map((p) => p.y));
        const maxY = Math.max(...positions.map((p) => p.y));

        // Add padding to the group
        const padding = 50;
        const groupPosition = { x: minX - padding, y: minY - padding };
        const groupSize = {
          width: maxX - minX + 200 + padding * 2,
          height: maxY - minY + 150 + padding * 2,
        };

        console.log('🎯 Group creation details:', {
          selectedNodes: selectedNodes.map((n) => ({
            id: n.id,
            position: n.position,
          })),
          positions,
          minX,
          maxX,
          minY,
          maxY,
          groupPosition,
          groupSize,
        });

        const groupId = generateUUID();
        const groupName = `Group ${state.canvas.groups.length + 1}`;

        const newGroup: GroupNode = {
          id: groupId,
          name: groupName,
          nodeIds,
          position: groupPosition,
          size: groupSize,
          isCollapsed: false,
          zIndex: 0,
        };

        // Get current user for created_by field
        const { user } = useAppStore.getState();
        if (!user) {
          throw new Error('User not authenticated');
        }

        // Persist to database
        await createGroup({
          id: groupId,
          name: groupName,
          nodeIds,
          position: groupPosition,
          size: groupSize,
          projectId: state.canvas.id,
          createdBy: user.id,
        });

        // Update local state
        set((state) => ({
          canvas: state.canvas
            ? {
                ...state.canvas,
                groups: [...state.canvas.groups, newGroup],
                // Update parentId for all nodes in the group
                nodes: state.canvas.nodes.map((node) =>
                  nodeIds.includes(node.id)
                    ? { ...node, parentId: groupId }
                    : node
                ),
                updatedAt: new Date().toISOString(),
              }
            : undefined,
        }));

        console.log('✅ Group created successfully:', {
          groupId,
          nodeIds,
          totalGroups: get().canvas?.groups.length,
          totalNodes: get().canvas?.nodes.length,
        });

        // Sync with projects store
        try {
          // This part of the code was removed as per the new_code,
          // as the projectsStore is no longer imported.
          // The original code had this line:
          // const projectsStore = useProjectsStore.getState();
          // const updatedCanvas = get().canvas;
          // if (updatedCanvas) {
          //   projectsStore.updateProject(state.canvas.id, {
          //     groups: updatedCanvas.groups,
          //     nodes: updatedCanvas.nodes,
          //     updatedAt: updatedCanvas.updatedAt,
          //   });
          // }
        } catch (error) {
          console.warn(
            'Failed to sync group creation with projects store:',
            error
          );
        }

        return groupId;
      } catch (error) {
        console.error('Failed to group nodes:', error);
        throw error;
      }
    },

    ungroupSelectedGroups: async (groupIds: string[]) => {
      const state = get();
      if (!state.canvas?.id) {
        throw new Error('No canvas loaded');
      }

      try {
        // Delete groups from database
        for (const groupId of groupIds) {
          await deleteGroupInSupabase(groupId);
        }

        // Update local state
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

        // Sync with projects store
        try {
          // This part of the code was removed as per the new_code,
          // as the projectsStore is no longer imported.
          // The original code had this line:
          // const projectsStore = useProjectsStore.getState();
          // const updatedCanvas = get().canvas;
          // if (updatedCanvas) {
          //   projectsStore.updateProject(state.canvas.id, {
          //     groups: updatedCanvas.groups,
          //     nodes: updatedCanvas.nodes,
          //     updatedAt: updatedCanvas.updatedAt,
          //   });
          // }
        } catch (error) {
          console.warn(
            'Failed to sync group deletion with projects store:',
            error
          );
        }
      } catch (error) {
        console.error('Failed to ungroup nodes:', error);
        throw error;
      }
    },

    // Dimension slice implementation
    sliceMetricByDimensions: async (
      parentCardId: string,
      dimensions: string[],
      historyOption: 'manual' | 'proportional' | 'forfeit',
      percentages?: number[]
    ) => {
      const state = get();
      const { canvas } = state;
      if (!canvas) return [];

      const parentCard = canvas.nodes.find((node) => node.id === parentCardId);
      if (!parentCard) return [];

      // Validate percentages for proportional split
      if (historyOption === 'proportional') {
        if (!percentages || percentages.length !== dimensions.length) {
          throw new Error(
            'Percentages array must match dimensions array length for proportional split'
          );
        }
        const total = percentages.reduce((sum, p) => sum + p, 0);
        if (Math.abs(total - 100) > 0.001) {
          // Allow for floating point precision
          throw new Error('Percentages must sum to exactly 100%');
        }
      }

      // Helper function to calculate proportional data
      const calculateProportionalData = (
        parentData: any[],
        percentage: number
      ) => {
        if (!parentData || parentData.length === 0) return [];

        return parentData.map((dataPoint) => ({
          ...dataPoint,
          value: (dataPoint.value * percentage) / 100,
          // Recalculate change_percent based on new values
          change_percent: dataPoint.change_percent, // Keep original for now, could be recalculated
        }));
      };

      // Create new dimension cards
      const newCardIds: string[] = [];
      const newCards: MetricCard[] = [];
      const newRelationships: Relationship[] = [];

      dimensions.forEach((dimension, index) => {
        const newCardId = generateUUID();

        // Calculate data based on history option
        let cardData: any[] = [];
        if (historyOption === 'manual') {
          cardData = []; // Empty for manual entry
        } else if (
          historyOption === 'proportional' &&
          percentages &&
          parentCard.data
        ) {
          cardData = calculateProportionalData(
            parentCard.data,
            percentages[index]
          );
        } else if (historyOption === 'forfeit') {
          cardData = []; // Start fresh
        }

        const newCard: MetricCard = {
          id: newCardId,
          title: `${parentCard.title} (${dimension})`,
          description: `${dimension} component of ${parentCard.title}${
            historyOption === 'proportional' && percentages
              ? ` (${percentages[index]}% of original data)`
              : ''
          }`,
          category: 'Data/Metric',
          subCategory: parentCard.subCategory || 'Input Metric',
          tags: [...parentCard.tags, dimension],
          causalFactors: [],
          dimensions: parentCard.dimensions,
          position: {
            x:
              parentCard.position.x +
              (index - Math.floor(dimensions.length / 2)) * 350,
            y: parentCard.position.y + 200,
          },
          sourceType: historyOption === 'proportional' ? 'Manual' : 'Manual', // All start as manual, can be changed later
          data: cardData,
          assignees: parentCard.assignees,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        newCards.push(newCard);
        newCardIds.push(newCardId);

        // Create relationship from dimension card to parent
        const relationshipId = generateUUID();
        const evidenceSummary =
          historyOption === 'proportional' && percentages
            ? `Created through dimension slice operation with proportional split (${percentages[index]}%). ${dimension} is a component of ${parentCard.title}.`
            : `Created through dimension slice operation. ${dimension} is a component of ${parentCard.title}.`;

        const newRelationship: Relationship = {
          id: relationshipId,
          sourceId: newCardId,
          targetId: parentCardId,
          type: 'Compositional', // As specified in PRD
          confidence: 'High',
          weight:
            historyOption === 'proportional' && percentages
              ? percentages[index] / 100
              : 1,
          evidence: [
            {
              id: generateUUID(),
              title: 'Automatic Dimension Decomposition',
              type: 'Analysis',
              date: new Date().toISOString(),
              owner: 'system',
              summary: evidenceSummary,
              impactOnConfidence:
                'This relationship was automatically generated during metric decomposition.',
              createdAt: new Date().toISOString(),
              createdBy: 'system',
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        newRelationships.push(newRelationship);
      });

      // Generate formula for parent card
      const formulaReferences = dimensions
        .map((_, index) => `[${newCardIds[index]}].value`)
        .join(' + ');

      // Update parent card data based on history option
      let parentCardData = parentCard.data;
      let parentDescription = `${parentCard.description} (Calculated from: ${dimensions.join(', ')})`;

      if (historyOption === 'forfeit') {
        parentCardData = []; // Archive data, start fresh
        parentDescription += ' - Historical data archived';
      } else if (historyOption === 'proportional') {
        // Keep original data as the parent maintains its complete dataset
        parentDescription += ` - Data distributed proportionally: ${dimensions
          .map((d, i) => `${d}(${percentages?.[i] || 0}%)`)
          .join(', ')}`;
      } else {
        // Manual - keep original data
        parentDescription += ' - Original data maintained';
      }

      const updatedParentCard: MetricCard = {
        ...parentCard,
        sourceType: 'Calculated',
        formula: formulaReferences,
        description: parentDescription,
        data: parentCardData,
        updatedAt: new Date().toISOString(),
      };

      // Update canvas state
      set({
        canvas: {
          ...canvas,
          nodes: [
            ...canvas.nodes.filter((node) => node.id !== parentCardId),
            updatedParentCard,
            ...newCards,
          ],
          edges: [...canvas.edges, ...newRelationships],
          updatedAt: new Date().toISOString(),
        },
      });

      return newCardIds;
    },

    // Canvas view
    setViewport: (viewport: CanvasState['viewport']) => set({ viewport }),
    setDateRange: (start: string, end: string) =>
      set({ dateRange: { start, end } }),
    toggleMiniMap: () => set((state) => ({ showMiniMap: !state.showMiniMap })),
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
      return (
        state.canvas?.nodes.filter((node) => node.category === category) || []
      );
    },
  }))
);
