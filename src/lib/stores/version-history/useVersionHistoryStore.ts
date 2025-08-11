import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  createCanvasSnapshot,
  deleteCanvasSnapshot,
  getCanvasSnapshots,
} from '../../supabase/services/version-history';
import type { CanvasProject } from '../../types';
import type {
  CanvasSnapshot,
  DEFAULT_VERSION_HISTORY_CONFIG,
  HistoryStats,
  SnapshotComparison,
  SnapshotMetadata,
  VersionHistoryConfig,
  VersionHistoryStore,
} from '../../types/version-history';
import { useAppStore } from '../appStore';
import { useCanvasStore } from '../canvas/useCanvasStore';

export const useVersionHistoryStore = create<VersionHistoryStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    snapshots: [],
    isLoading: false,
    error: undefined,
    config: DEFAULT_VERSION_HISTORY_CONFIG,
    lastSnapshotTime: undefined,

    // Core operations
    createSnapshot: async (
      canvasId: string,
      title: string,
      description?: string,
      triggerType: 'manual' | 'auto' | 'milestone' = 'manual'
    ): Promise<CanvasSnapshot> => {
      const state = get();
      const canvasState = useCanvasStore.getState();
      const appState = useAppStore.getState();

      if (!canvasState.canvas) {
        throw new Error('No canvas loaded');
      }

      if (!appState.user) {
        throw new Error('User not authenticated');
      }

      set({ isLoading: true, error: undefined });

      try {
        // Calculate metadata
        const metadata = state.calculateSnapshotMetadata(
          canvasState.canvas,
          triggerType
        );

        // Create snapshot data
        const snapshotData: Omit<CanvasSnapshot, 'id' | 'createdAt'> = {
          canvasId,
          version: state.snapshots.length + 1,
          title,
          description,
          nodes: canvasState.canvas.nodes,
          edges: canvasState.canvas.edges,
          groups: canvasState.canvas.groups,
          metadata,
          createdBy: appState.user.id,
        };

        console.log('📸 Creating canvas snapshot:', {
          canvasId,
          title,
          triggerType,
          nodeCount: metadata.nodeCount,
          edgeCount: metadata.edgeCount,
        });

        // Save to database
        const newSnapshot = await createCanvasSnapshot(snapshotData);

        // Update local state
        set((state) => ({
          snapshots: [...state.snapshots, newSnapshot],
          lastSnapshotTime: newSnapshot.createdAt,
          isLoading: false,
        }));

        // Cleanup old snapshots if needed
        await state.cleanupOldSnapshots(canvasId);

        console.log('✅ Canvas snapshot created successfully:', newSnapshot.id);
        return newSnapshot;
      } catch (error) {
        console.error('❌ Failed to create snapshot:', error);
        set({
          error:
            error instanceof Error
              ? error.message
              : 'Failed to create snapshot',
          isLoading: false,
        });
        throw error;
      }
    },

    loadSnapshots: async (canvasId: string) => {
      set({ isLoading: true, error: undefined });

      try {
        console.log('🔄 Loading canvas snapshots for:', canvasId);
        const snapshots = await getCanvasSnapshots(canvasId);

        // Sort by version descending (newest first)
        const sortedSnapshots = snapshots.sort((a, b) => b.version - a.version);

        set({
          snapshots: sortedSnapshots,
          lastSnapshotTime: sortedSnapshots[0]?.createdAt,
          isLoading: false,
        });

        console.log('✅ Loaded snapshots:', sortedSnapshots.length);
      } catch (error) {
        console.error('❌ Failed to load snapshots:', error);
        set({
          error:
            error instanceof Error ? error.message : 'Failed to load snapshots',
          isLoading: false,
        });
      }
    },

    restoreSnapshot: async (snapshotId: string) => {
      const state = get();
      const canvasStore = useCanvasStore.getState();

      const snapshot = state.getSnapshotById(snapshotId);
      if (!snapshot) {
        throw new Error('Snapshot not found');
      }

      set({ isLoading: true, error: undefined });

      try {
        console.log('🔄 Restoring canvas to snapshot:', {
          snapshotId,
          version: snapshot.version,
          title: snapshot.title,
        });

        // Create current state snapshot before restoring (as backup)
        if (canvasStore.canvas) {
          await state.createSnapshot(
            canvasStore.canvas.id,
            `Auto-backup before restore to v${snapshot.version}`,
            `Automatic backup created before restoring to snapshot "${snapshot.title}"`,
            'auto'
          );
        }

        // Restore canvas state
        const restoredCanvas: CanvasProject = {
          id: snapshot.canvasId,
          name: `Canvas (Restored from v${snapshot.version})`,
          description: `Restored from snapshot: ${snapshot.title}`,
          tags: [],
          collaborators: [],
          nodes: snapshot.nodes,
          edges: snapshot.edges,
          groups: snapshot.groups,
          createdAt: snapshot.createdAt,
          updatedAt: new Date().toISOString(),
          lastModifiedBy: snapshot.createdBy,
        };

        // Update canvas store with restored data
        canvasStore.loadCanvas(restoredCanvas);

        set({ isLoading: false });

        console.log(
          '✅ Canvas restored successfully to version:',
          snapshot.version
        );
      } catch (error) {
        console.error('❌ Failed to restore snapshot:', error);
        set({
          error:
            error instanceof Error
              ? error.message
              : 'Failed to restore snapshot',
          isLoading: false,
        });
        throw error;
      }
    },

    deleteSnapshot: async (snapshotId: string) => {
      const state = get();
      const snapshot = state.getSnapshotById(snapshotId);

      if (!snapshot) {
        throw new Error('Snapshot not found');
      }

      set({ isLoading: true, error: undefined });

      try {
        await deleteCanvasSnapshot(snapshotId);

        set((state) => ({
          snapshots: state.snapshots.filter((s) => s.id !== snapshotId),
          isLoading: false,
        }));

        console.log('✅ Snapshot deleted:', snapshotId);
      } catch (error) {
        console.error('❌ Failed to delete snapshot:', error);
        set({
          error:
            error instanceof Error
              ? error.message
              : 'Failed to delete snapshot',
          isLoading: false,
        });
        throw error;
      }
    },

    compareSnapshots: async (
      snapshotId1: string,
      snapshotId2: string
    ): Promise<SnapshotComparison> => {
      const state = get();
      const snapshot1 = state.getSnapshotById(snapshotId1);
      const snapshot2 = state.getSnapshotById(snapshotId2);

      if (!snapshot1 || !snapshot2) {
        throw new Error('One or both snapshots not found');
      }

      return state.calculateSnapshotDifferences(snapshot1, snapshot2);
    },

    checkAutoSnapshot: async (canvasId: string) => {
      const state = get();
      const canvasState = useCanvasStore.getState();

      if (!state.config.autoSnapshotEnabled || !canvasState.canvas) {
        return;
      }

      // Check if enough time has elapsed
      if (state.lastSnapshotTime) {
        const timeSinceLastSnapshot =
          (Date.now() - new Date(state.lastSnapshotTime).getTime()) /
          (1000 * 60);

        if (
          timeSinceLastSnapshot < state.config.changeThresholds.minTimeElapsed
        ) {
          return;
        }
      }

      // Check if enough changes have occurred
      const latestSnapshot = state.getLatestSnapshot();
      if (latestSnapshot) {
        const changeCount = state.calculateChangesSinceSnapshot(
          latestSnapshot,
          canvasState.canvas
        );

        const hasSignificantChanges =
          changeCount.nodesChanged >=
            state.config.changeThresholds.minNodesChanged ||
          changeCount.edgesChanged >=
            state.config.changeThresholds.minEdgesChanged;

        if (hasSignificantChanges) {
          await state.createSnapshot(
            canvasId,
            `Auto-snapshot v${state.snapshots.length + 1}`,
            `Automatic snapshot after ${changeCount.nodesChanged} node changes and ${changeCount.edgesChanged} edge changes`,
            'auto'
          );
        }
      }
    },

    updateConfig: (newConfig: Partial<VersionHistoryConfig>) => {
      set((state) => ({
        config: { ...state.config, ...newConfig },
      }));
    },

    // Utility functions
    getSnapshotById: (snapshotId: string) => {
      const state = get();
      return state.snapshots.find((s) => s.id === snapshotId);
    },

    getLatestSnapshot: () => {
      const state = get();
      return state.snapshots[0]; // Sorted newest first
    },

    getSnapshotsSince: (date: string) => {
      const state = get();
      const sinceDate = new Date(date);
      return state.snapshots.filter((s) => new Date(s.createdAt) >= sinceDate);
    },

    cleanupOldSnapshots: async (canvasId: string) => {
      const state = get();
      const now = new Date();
      const retentionDate = new Date(
        now.getTime() - state.config.retentionDays * 24 * 60 * 60 * 1000
      );

      // Separate auto and manual snapshots
      const autoSnapshots = state.snapshots.filter(
        (s) =>
          s.metadata.triggerType === 'auto' &&
          new Date(s.createdAt) < retentionDate
      );
      const manualSnapshots = state.snapshots.filter(
        (s) => s.metadata.triggerType === 'manual'
      );

      // Delete excess auto snapshots
      if (autoSnapshots.length > state.config.maxAutoSnapshots) {
        const excessSnapshots = autoSnapshots.slice(
          state.config.maxAutoSnapshots
        );
        for (const snapshot of excessSnapshots) {
          await state.deleteSnapshot(snapshot.id);
        }
      }

      // Delete excess manual snapshots
      if (manualSnapshots.length > state.config.maxManualSnapshots) {
        const excessSnapshots = manualSnapshots.slice(
          state.config.maxManualSnapshots
        );
        for (const snapshot of excessSnapshots) {
          await state.deleteSnapshot(snapshot.id);
        }
      }

      // Delete old snapshots beyond retention period
      const oldSnapshots = state.snapshots.filter(
        (s) =>
          new Date(s.createdAt) < retentionDate &&
          s.metadata.triggerType !== 'milestone' // Keep milestones
      );

      for (const snapshot of oldSnapshots) {
        await state.deleteSnapshot(snapshot.id);
      }
    },

    getHistoryStats: (): HistoryStats => {
      const state = get();
      const snapshots = state.snapshots;

      if (snapshots.length === 0) {
        return {
          totalSnapshots: 0,
          snapshotsByType: { manual: 0, auto: 0, milestone: 0 },
          totalCanvasChanges: 0,
        };
      }

      const sortedByDate = [...snapshots].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      const snapshotsByType = snapshots.reduce(
        (acc, s) => {
          acc[s.metadata.triggerType]++;
          return acc;
        },
        { manual: 0, auto: 0, milestone: 0 }
      );

      // Calculate average time between snapshots
      let totalTimeDiff = 0;
      for (let i = 1; i < sortedByDate.length; i++) {
        const timeDiff =
          new Date(sortedByDate[i].createdAt).getTime() -
          new Date(sortedByDate[i - 1].createdAt).getTime();
        totalTimeDiff += timeDiff;
      }
      const averageTimeBetweenSnapshots =
        sortedByDate.length > 1
          ? totalTimeDiff / (sortedByDate.length - 1) / (1000 * 60 * 60) // hours
          : undefined;

      // Calculate total changes
      const totalCanvasChanges = snapshots.reduce((acc, s) => {
        const changes = s.metadata.changesSinceLastSnapshot;
        if (changes) {
          return (
            acc +
            changes.nodesAdded +
            changes.nodesModified +
            changes.nodesDeleted +
            changes.edgesAdded +
            changes.edgesModified +
            changes.edgesDeleted +
            changes.groupsAdded +
            changes.groupsModified +
            changes.groupsDeleted
          );
        }
        return acc;
      }, 0);

      return {
        totalSnapshots: snapshots.length,
        oldestSnapshot: sortedByDate[0]?.createdAt,
        newestSnapshot: sortedByDate[sortedByDate.length - 1]?.createdAt,
        averageTimeBetweenSnapshots,
        snapshotsByType,
        totalCanvasChanges,
      };
    },

    // Helper functions (not exposed in interface)
    calculateSnapshotMetadata: (
      canvas: CanvasProject,
      triggerType: 'manual' | 'auto' | 'milestone'
    ): SnapshotMetadata => {
      const state = get();
      const canvasStore = useCanvasStore.getState();

      // Calculate bounding box
      const positions = canvas.nodes.map((n) => n.position);
      const boundingBox =
        positions.length > 0
          ? {
              minX: Math.min(...positions.map((p) => p.x)),
              maxX: Math.max(...positions.map((p) => p.x)),
              minY: Math.min(...positions.map((p) => p.y)),
              maxY: Math.max(...positions.map((p) => p.y)),
            }
          : { minX: 0, maxX: 0, minY: 0, maxY: 0 };

      const metadata: SnapshotMetadata = {
        triggerType,
        nodeCount: canvas.nodes.length,
        edgeCount: canvas.edges.length,
        groupCount: canvas.groups.length,
        canvasSize: {
          totalNodes: canvas.nodes.length,
          totalEdges: canvas.edges.length,
          boundingBox,
        },
        viewport: canvasStore.viewport,
        userAgent: navigator.userAgent,
      };

      // Calculate changes since last snapshot
      const latestSnapshot = state.getLatestSnapshot();
      if (latestSnapshot) {
        metadata.changesSinceLastSnapshot = state.calculateChangesSinceSnapshot(
          latestSnapshot,
          canvas
        );
      }

      return metadata;
    },

    calculateChangesSinceSnapshot: (
      lastSnapshot: CanvasSnapshot,
      currentCanvas: CanvasProject
    ) => {
      // Simple change calculation based on counts and IDs
      const lastNodeIds = new Set(lastSnapshot.nodes.map((n) => n.id));
      const currentNodeIds = new Set(currentCanvas.nodes.map((n) => n.id));

      const nodesAdded = currentCanvas.nodes.filter(
        (n) => !lastNodeIds.has(n.id)
      ).length;
      const nodesDeleted = lastSnapshot.nodes.filter(
        (n) => !currentNodeIds.has(n.id)
      ).length;
      const nodesModified = currentCanvas.nodes.filter((n) => {
        const lastNode = lastSnapshot.nodes.find((ln) => ln.id === n.id);
        return lastNode && lastNode.updatedAt !== n.updatedAt;
      }).length;

      const lastEdgeIds = new Set(lastSnapshot.edges.map((e) => e.id));
      const currentEdgeIds = new Set(currentCanvas.edges.map((e) => e.id));

      const edgesAdded = currentCanvas.edges.filter(
        (e) => !lastEdgeIds.has(e.id)
      ).length;
      const edgesDeleted = lastSnapshot.edges.filter(
        (e) => !currentEdgeIds.has(e.id)
      ).length;
      const edgesModified = currentCanvas.edges.filter((e) => {
        const lastEdge = lastSnapshot.edges.find((le) => le.id === e.id);
        return lastEdge && lastEdge.updatedAt !== e.updatedAt;
      }).length;

      const lastGroupIds = new Set(lastSnapshot.groups.map((g) => g.id));
      const currentGroupIds = new Set(currentCanvas.groups.map((g) => g.id));

      const groupsAdded = currentCanvas.groups.filter(
        (g) => !lastGroupIds.has(g.id)
      ).length;
      const groupsDeleted = lastSnapshot.groups.filter(
        (g) => !currentGroupIds.has(g.id)
      ).length;
      const groupsModified = 0; // Groups don't have updatedAt, would need separate tracking

      return {
        nodesAdded,
        nodesModified,
        nodesDeleted,
        edgesAdded,
        edgesModified,
        edgesDeleted,
        groupsAdded,
        groupsModified,
        groupsDeleted,
        nodesChanged: nodesAdded + nodesModified + nodesDeleted,
        edgesChanged: edgesAdded + edgesModified + edgesDeleted,
        groupsChanged: groupsAdded + groupsModified + groupsDeleted,
      };
    },

    calculateSnapshotDifferences: (
      snapshot1: CanvasSnapshot,
      snapshot2: CanvasSnapshot
    ): SnapshotComparison => {
      // Detailed comparison implementation would go here
      // For now, return a simplified version
      const summary = {
        totalChanges: 0,
        nodesChanged: Math.abs(snapshot1.nodes.length - snapshot2.nodes.length),
        edgesChanged: Math.abs(snapshot1.edges.length - snapshot2.edges.length),
        groupsChanged: Math.abs(
          snapshot1.groups.length - snapshot2.groups.length
        ),
      };

      summary.totalChanges =
        summary.nodesChanged + summary.edgesChanged + summary.groupsChanged;

      return {
        snapshot1,
        snapshot2,
        differences: {
          nodes: { added: [], modified: [], deleted: [] },
          edges: { added: [], modified: [], deleted: [] },
          groups: { added: [], modified: [], deleted: [] },
        },
        summary,
      };
    },
  }))
);
