/**
 * Group Store Module
 * Handles all group-related operations for the canvas
 */

import { StateCreator } from 'zustand';
import {
  createGroup,
  deleteGroup as deleteGroupInSupabase,
  updateGroup as updateGroupInSupabase,
} from '../../supabase/services/projects';
import type { CanvasProject, GroupNode, MetricCard } from '../../types';
import { generateUUID } from '../../utils/validation';
import { useAppStore } from '../appStore';

export interface GroupState {
  // Group data
  groups: GroupNode[];

  // Loading state
  isLoading: boolean;
  error: string | undefined;
}

export interface GroupActions {
  // Async Group management (Supabase)
  addGroup: (group: GroupNode) => Promise<void>;
  updateGroup: (groupId: string, updates: Partial<GroupNode>) => Promise<void>;
  deleteGroup: (groupId: string) => Promise<void>;

  // Local Group management
  addNodesToGroup: (groupId: string, nodeIds: string[]) => void;
  removeNodesFromGroup: (groupId: string, nodeIds: string[]) => void;
  toggleGroupCollapse: (groupId: string) => void;
  updateGroupSize: (
    groupId: string,
    size: { width: number; height: number }
  ) => void;

  // Local-only group updates for realtime (do not persist)
  applyGroupLocalAdd: (group: GroupNode) => void;
  applyGroupLocalUpdate: (groupId: string, updates: Partial<GroupNode>) => void;
  applyGroupLocalDelete: (groupId: string) => void;

  // Selection-based grouping
  groupSelectedNodes: (nodeIds: string[]) => Promise<string>;
  ungroupSelectedGroups: (groupIds: string[]) => Promise<void>;

  // Getters
  getGroupById: (groupId: string) => GroupNode | undefined;
  getGroupsContainingNode: (nodeId: string) => GroupNode[];
}

export interface GroupSlice extends GroupState, GroupActions {}

// Type for the full store (to be used when accessing canvas and nodes)
interface FullStore {
  canvas: CanvasProject | undefined;
  nodes: MetricCard[];
}

export const createGroupSlice: StateCreator<
  FullStore & GroupSlice,
  [],
  [],
  GroupSlice
> = (set, get) => ({
  // Initial state
  groups: [],
  isLoading: false,
  error: undefined,

  // Async Group management (Supabase)
  addGroup: async (group: GroupNode) => {
    const state = get();
    if (!state.canvas?.id) {
      console.error('No canvas loaded');
      return;
    }

    try {
      const { user } = useAppStore.getState();
      if (!user) throw new Error('User not authenticated');

      console.log('🎯 Creating group in database:', group);

      // Create group in database
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

      console.log('✅ Group created successfully:', group.name);
    } catch (error) {
      console.error('❌ Failed to create group:', error);
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
                group.id === groupId
                  ? {
                      ...group,
                      ...updates,
                      updatedAt: new Date().toISOString(),
                    }
                  : group
              ),
              updatedAt: new Date().toISOString(),
            }
          : undefined,
      }));
    } catch (error) {
      console.error('Error updating group:', error);
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
              groups: state.canvas.groups.filter((g) => g.id !== groupId),
              updatedAt: new Date().toISOString(),
            }
          : undefined,
      }));
    } catch (error) {
      console.error('Error deleting group:', error);
      throw error;
    }
  },

  // Local Group management
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
                    updatedAt: new Date().toISOString(),
                  }
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
                ? {
                    ...group,
                    nodeIds: group.nodeIds.filter(
                      (nodeId) => !nodeIds.includes(nodeId)
                    ),
                    updatedAt: new Date().toISOString(),
                  }
                : group
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

  updateGroupSize: (groupId: string, size: { width: number; height: number }) =>
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
      // Get the selected nodes
      const selectedNodes = state.canvas.nodes.filter((node) =>
        nodeIds.includes(node.id)
      );

      if (selectedNodes.length !== nodeIds.length) {
        throw new Error('Some selected nodes were not found');
      }

      // Calculate bounding box for the group
      const positions = selectedNodes.map((node) => ({
        x: node.position.x,
        y: node.position.y,
        width: 160, // Default node width
        height: 100, // Default node height
      }));

      const minX = Math.min(...positions.map((p) => p.x)) - 20;
      const minY = Math.min(...positions.map((p) => p.y)) - 20;
      const maxX = Math.max(...positions.map((p) => p.x + p.width)) + 20;
      const maxY = Math.max(...positions.map((p) => p.y + p.height)) + 20;

      const groupPosition = { x: minX, y: minY };
      const groupSize = { width: maxX - minX, height: maxY - minY };

      // Generate group name based on selected nodes
      const groupName = `Group (${selectedNodes
        .slice(0, 2)
        .map((n) => n.title)
        .join(', ')}${selectedNodes.length > 2 ? '...' : ''})`;

      // Create the group
      const groupId = generateUUID();
      const newGroup: GroupNode = {
        id: groupId,
        name: groupName,
        nodeIds,
        position: groupPosition,
        size: groupSize,
        color: '#e5e7eb',
        isCollapsed: false,
        description: `Automatically created group containing ${nodeIds.length} nodes`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add the group
      await get().addGroup(newGroup);

      console.log('✅ Group created successfully with ID:', groupId);
      return groupId;
    } catch (error) {
      console.error('❌ Failed to group selected nodes:', error);
      throw error;
    }
  },

  ungroupSelectedGroups: async (groupIds: string[]) => {
    const state = get();
    if (!state.canvas?.id) {
      throw new Error('No canvas loaded');
    }

    try {
      // Delete each group
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
              updatedAt: new Date().toISOString(),
            }
          : undefined,
      }));

      console.log('✅ Groups ungrouped successfully:', groupIds);
    } catch (error) {
      console.error('❌ Failed to ungroup selected groups:', error);
      throw error;
    }
  },

  // Getters
  getGroupById: (groupId: string) => {
    const state = get();
    return state.canvas?.groups.find((group) => group.id === groupId);
  },

  getGroupsContainingNode: (nodeId: string) => {
    const state = get();
    return (
      state.canvas?.groups.filter((group) => group.nodeIds.includes(nodeId)) ||
      []
    );
  },
});
