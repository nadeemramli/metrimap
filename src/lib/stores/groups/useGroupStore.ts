import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  createGroup,
  deleteGroup as deleteGroupInSupabase,
  updateGroup as updateGroupInSupabase,
} from '../../supabase/services/projects';
import type { GroupNode, MetricCard } from '../../types';
import { generateUUID } from '../../utils/validation';
import { useAppStore } from '../appStore';

export interface GroupStoreState {
  // Async Group management (Supabase)
  createGroup: (group: GroupNode, canvasId: string) => Promise<void>;
  updateGroup: (groupId: string, updates: Partial<GroupNode>) => Promise<void>;
  deleteGroup: (groupId: string) => Promise<void>;

  // Local Group management (for optimistic updates and realtime)
  addGroupLocal: (group: GroupNode) => GroupNode[];
  updateGroupLocal: (
    groups: GroupNode[],
    groupId: string,
    updates: Partial<GroupNode>
  ) => GroupNode[];
  deleteGroupLocal: (groups: GroupNode[], groupId: string) => GroupNode[];

  // Group operations
  addNodesToGroupLocal: (
    groups: GroupNode[],
    nodes: MetricCard[],
    groupId: string,
    nodeIds: string[]
  ) => { groups: GroupNode[]; nodes: MetricCard[] };
  removeNodesFromGroupLocal: (
    groups: GroupNode[],
    nodes: MetricCard[],
    groupId: string,
    nodeIds: string[]
  ) => { groups: GroupNode[]; nodes: MetricCard[] };
  toggleGroupCollapse: (groups: GroupNode[], groupId: string) => GroupNode[];
  updateGroupSize: (
    groups: GroupNode[],
    groupId: string,
    size: { width: number; height: number }
  ) => GroupNode[];

  // Selection-based grouping
  groupSelectedNodes: (
    nodes: MetricCard[],
    nodeIds: string[],
    existingGroups: GroupNode[],
    canvasId: string
  ) => Promise<string>;
  ungroupSelectedGroups: (groupIds: string[]) => Promise<void>;

  // Utility functions
  getGroupById: (groups: GroupNode[], groupId: string) => GroupNode | undefined;
  calculateGroupBounds: (
    nodes: MetricCard[],
    nodeIds: string[]
  ) => {
    position: { x: number; y: number };
    size: { width: number; height: number };
  };
}

export const useGroupStore = create<GroupStoreState>()(
  subscribeWithSelector((set, get) => ({
    // Async Group management (Supabase)
    createGroup: async (group: GroupNode, canvasId: string) => {
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
          projectId: canvasId,
          createdBy: user.id,
        });

        console.log('✅ Group created successfully:', group.id);
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

        console.log('✅ Group updated successfully:', groupId);
      } catch (error) {
        console.error('❌ Failed to update group:', error);
        throw error;
      }
    },

    deleteGroup: async (groupId: string) => {
      try {
        // Persist to database
        await deleteGroupInSupabase(groupId);
        console.log('✅ Group deleted successfully:', groupId);
      } catch (error) {
        console.error('❌ Failed to delete group:', error);
        throw error;
      }
    },

    // Local Group management (for optimistic updates and realtime)
    addGroupLocal: (group: GroupNode): GroupNode[] => {
      return (currentGroups: GroupNode[]) => [...currentGroups, group];
    },

    updateGroupLocal: (
      groups: GroupNode[],
      groupId: string,
      updates: Partial<GroupNode>
    ): GroupNode[] => {
      return groups.map((group) =>
        group.id === groupId ? { ...group, ...updates } : group
      );
    },

    deleteGroupLocal: (groups: GroupNode[], groupId: string): GroupNode[] => {
      return groups.filter((group) => group.id !== groupId);
    },

    // Group operations
    addNodesToGroupLocal: (
      groups: GroupNode[],
      nodes: MetricCard[],
      groupId: string,
      nodeIds: string[]
    ) => {
      const updatedGroups = groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              nodeIds: [...new Set([...group.nodeIds, ...nodeIds])],
            }
          : group
      );

      const updatedNodes = nodes.map((node) =>
        nodeIds.includes(node.id) ? { ...node, parentId: groupId } : node
      );

      return { groups: updatedGroups, nodes: updatedNodes };
    },

    removeNodesFromGroupLocal: (
      groups: GroupNode[],
      nodes: MetricCard[],
      groupId: string,
      nodeIds: string[]
    ) => {
      const updatedGroups = groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              nodeIds: group.nodeIds.filter((id) => !nodeIds.includes(id)),
            }
          : group
      );

      const updatedNodes = nodes.map((node) =>
        nodeIds.includes(node.id) ? { ...node, parentId: undefined } : node
      );

      return { groups: updatedGroups, nodes: updatedNodes };
    },

    toggleGroupCollapse: (
      groups: GroupNode[],
      groupId: string
    ): GroupNode[] => {
      return groups.map((group) =>
        group.id === groupId
          ? { ...group, isCollapsed: !group.isCollapsed }
          : group
      );
    },

    updateGroupSize: (
      groups: GroupNode[],
      groupId: string,
      size: { width: number; height: number }
    ): GroupNode[] => {
      return groups.map((group) =>
        group.id === groupId ? { ...group, size } : group
      );
    },

    // Selection-based grouping
    groupSelectedNodes: async (
      nodes: MetricCard[],
      nodeIds: string[],
      existingGroups: GroupNode[],
      canvasId: string
    ): Promise<string> => {
      console.log('🎯 groupSelectedNodes called with:', nodeIds);

      if (nodeIds.length < 2) {
        throw new Error('At least 2 nodes must be selected to create a group');
      }

      try {
        const state = get();

        // Calculate group bounds based on selected nodes
        const selectedNodes = nodes.filter((node) => nodeIds.includes(node.id));

        if (selectedNodes.length === 0) {
          throw new Error('No valid nodes found');
        }

        const { position: groupPosition, size: groupSize } =
          state.calculateGroupBounds(selectedNodes, nodeIds);

        const groupId = generateUUID();
        const groupName = `Group ${existingGroups.length + 1}`;

        const newGroup: GroupNode = {
          id: groupId,
          name: groupName,
          nodeIds,
          position: groupPosition,
          size: groupSize,
          isCollapsed: false,
          zIndex: 0,
        };

        // Create group in database
        await state.createGroup(newGroup, canvasId);

        console.log('✅ Group created successfully:', {
          groupId,
          nodeIds,
          totalGroups: existingGroups.length + 1,
        });

        return groupId;
      } catch (error) {
        console.error('❌ Failed to group nodes:', error);
        throw error;
      }
    },

    ungroupSelectedGroups: async (groupIds: string[]) => {
      try {
        const state = get();

        // Delete groups from database
        for (const groupId of groupIds) {
          await state.deleteGroup(groupId);
        }

        console.log('✅ Groups ungrouped successfully:', groupIds);
      } catch (error) {
        console.error('❌ Failed to ungroup nodes:', error);
        throw error;
      }
    },

    // Utility functions
    getGroupById: (groups: GroupNode[], groupId: string) => {
      return groups.find((group) => group.id === groupId);
    },

    calculateGroupBounds: (nodes: MetricCard[], nodeIds: string[]) => {
      const selectedNodes = nodes.filter((node) => nodeIds.includes(node.id));

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

      return { position: groupPosition, size: groupSize };
    },
  }))
);
