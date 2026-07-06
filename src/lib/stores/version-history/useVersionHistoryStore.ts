import { useCanvasStore } from '@/features/canvas/stores/canvasStore';
import { logChangelogEntry } from '@/shared/lib/supabase/services/changelog';
import {
  createMetricCard,
  deleteMetricCard,
  updateMetricCard,
} from '@/shared/lib/supabase/services/metric-cards';
import {
  createGroup,
  deleteGroup,
  updateGroup,
} from '@/shared/lib/supabase/services/projects';
import {
  createRelationship,
  deleteRelationship,
  updateRelationship,
} from '@/shared/lib/supabase/services/relationships';
import {
  createCanvasSnapshot,
  deleteCanvasSnapshot,
  getCanvasSnapshots,
} from '@/shared/lib/supabase/services/version-history';
import { useAppStore } from '@/shared/stores/useAppStore';
import type {
  CanvasProject,
  GroupNode,
  MetricCard,
  Relationship,
} from '@/shared/types';
import type {
  CanvasSnapshot,
  HistoryStats,
  SnapshotComparison,
  SnapshotMetadata,
  VersionHistoryConfig,
  VersionHistoryStore,
} from '@/shared/types/version-history';
import { DEFAULT_VERSION_HISTORY_CONFIG } from '@/shared/types/version-history';
import { getClientForEnvironment } from '@/shared/utils/authenticatedClient';
import { createLogger } from '@/shared/utils/logger';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

const log = createLogger('checkpoints');

function diffCounts(previous: CanvasSnapshot, canvas: CanvasProject) {
  const prevNodeIds = new Set(previous.nodes.map((n) => n.id));
  const currNodeIds = new Set(canvas.nodes.map((n) => n.id));
  const prevEdgeIds = new Set(previous.edges.map((e) => e.id));
  const currEdgeIds = new Set(canvas.edges.map((e) => e.id));
  const prevGroupIds = new Set((previous.groups ?? []).map((g) => g.id));
  const currGroups = canvas.groups ?? [];

  return {
    nodesAdded: canvas.nodes.filter((n) => !prevNodeIds.has(n.id)).length,
    nodesModified: canvas.nodes.filter((n) => {
      const prev = previous.nodes.find((p) => p.id === n.id);
      return prev && prev.updatedAt !== n.updatedAt;
    }).length,
    nodesDeleted: previous.nodes.filter((n) => !currNodeIds.has(n.id)).length,
    edgesAdded: canvas.edges.filter((e) => !prevEdgeIds.has(e.id)).length,
    edgesModified: canvas.edges.filter((e) => {
      const prev = previous.edges.find((p) => p.id === e.id);
      return prev && prev.updatedAt !== e.updatedAt;
    }).length,
    edgesDeleted: previous.edges.filter((e) => !currEdgeIds.has(e.id)).length,
    groupsAdded: currGroups.filter((g) => !prevGroupIds.has(g.id)).length,
    groupsModified: 0,
    groupsDeleted: (previous.groups ?? []).filter(
      (g) => !currGroups.some((c) => c.id === g.id)
    ).length,
  };
}

function buildSnapshotMetadata(
  canvas: CanvasProject,
  viewport: { x: number; y: number; zoom: number },
  triggerType: 'manual' | 'auto' | 'milestone',
  previous?: CanvasSnapshot
): SnapshotMetadata {
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

  return {
    triggerType,
    nodeCount: canvas.nodes.length,
    edgeCount: canvas.edges.length,
    groupCount: canvas.groups?.length ?? 0,
    canvasSize: {
      totalNodes: canvas.nodes.length,
      totalEdges: canvas.edges.length,
      boundingBox,
    },
    viewport,
    ...(previous
      ? { changesSinceLastSnapshot: diffCounts(previous, canvas) }
      : {}),
  };
}

export const useVersionHistoryStore = create<VersionHistoryStore>()(
  subscribeWithSelector((set, get) => ({
    snapshots: [],
    isLoading: false,
    error: undefined,
    config: DEFAULT_VERSION_HISTORY_CONFIG,
    lastSnapshotTime: undefined,
    loadedCanvasId: undefined,

    createSnapshot: async (
      canvasId: string,
      title: string,
      description?: string,
      triggerType: 'manual' | 'auto' | 'milestone' = 'manual'
    ): Promise<CanvasSnapshot> => {
      const canvasStore = useCanvasStore.getState();
      const { user } = useAppStore.getState();

      if (!canvasStore.canvas || canvasStore.canvas.id !== canvasId) {
        throw new Error('No canvas loaded');
      }
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Version numbers come from what's already saved for this canvas.
      if (get().loadedCanvasId !== canvasId) {
        await get().loadSnapshots(canvasId);
      }

      set({ isLoading: true, error: undefined });

      try {
        const canvas = canvasStore.canvas;
        const latest = get().getLatestSnapshot();
        const metadata = buildSnapshotMetadata(
          canvas,
          canvasStore.viewport,
          triggerType,
          latest
        );
        const version =
          get().snapshots.reduce((max, s) => Math.max(max, s.version), 0) + 1;

        log.debug('📸 Saving checkpoint:', { canvasId, title, triggerType });

        const newSnapshot = await createCanvasSnapshot({
          canvasId,
          version,
          title,
          description,
          nodes: canvas.nodes,
          edges: canvas.edges,
          groups: canvas.groups ?? [],
          metadata,
          createdBy: user.id,
        });

        // Deliberate checkpoints get a single marker in the changelog — the
        // curated timeline stays readable while granular edits live in the
        // activity feed. Best-effort: a failed marker never fails the save.
        if (triggerType !== 'auto') {
          try {
            await logChangelogEntry({
              timestamp: newSnapshot.createdAt,
              action: 'checkpoint',
              target: 'project',
              targetId: canvasId,
              targetName: title,
              description: description?.trim()
                ? description.trim()
                : `Checkpoint "${title}" saved (${metadata.nodeCount} nodes, ${metadata.edgeCount} connections)`,
              userId: user.id,
              projectId: canvasId,
              metadata: {
                snapshotId: newSnapshot.id,
                version,
                nodeCount: metadata.nodeCount,
                edgeCount: metadata.edgeCount,
              },
            });
          } catch (markerError) {
            console.error(
              'checkpoint: saved, but failed to write changelog marker',
              markerError
            );
          }
        }

        set((state) => ({
          snapshots: [newSnapshot, ...state.snapshots],
          lastSnapshotTime: newSnapshot.createdAt,
          isLoading: false,
        }));

        if (triggerType === 'auto') {
          await get().cleanupOldSnapshots(canvasId);
        }

        return newSnapshot;
      } catch (error) {
        console.error('❌ Failed to save checkpoint:', error);
        set({
          error:
            error instanceof Error
              ? error.message
              : 'Failed to save checkpoint',
          isLoading: false,
        });
        throw error;
      }
    },

    loadSnapshots: async (canvasId: string) => {
      set({ isLoading: true, error: undefined });
      try {
        const snapshots = await getCanvasSnapshots(canvasId);
        const sorted = snapshots.sort((a, b) => b.version - a.version);
        set({
          snapshots: sorted,
          lastSnapshotTime: sorted[0]?.createdAt,
          loadedCanvasId: canvasId,
          isLoading: false,
        });
      } catch (error) {
        console.error('❌ Failed to load checkpoints:', error);
        set({
          error:
            error instanceof Error
              ? error.message
              : 'Failed to load checkpoints',
          isLoading: false,
        });
      }
    },

    // "Load game": persist the checkpoint state back to the database (diffing
    // against the live canvas), then swap the in-memory canvas. An automatic
    // backup checkpoint of the current state is saved first, so loading is
    // always reversible.
    restoreSnapshot: async (snapshotId: string) => {
      const canvasStore = useCanvasStore.getState();
      const { user } = useAppStore.getState();

      const snapshot = get().getSnapshotById(snapshotId);
      if (!snapshot) throw new Error('Checkpoint not found');

      const canvas = canvasStore.canvas;
      if (!canvas || canvas.id !== snapshot.canvasId) {
        throw new Error('Open the canvas before loading one of its checkpoints');
      }
      if (!user) throw new Error('User not authenticated');

      await get().createSnapshot(
        canvas.id,
        `Backup before loading "${snapshot.title}"`,
        `Saved automatically before loading checkpoint v${snapshot.version}`,
        'auto'
      );

      set({ isLoading: true, error: undefined });

      try {
        log.debug('🔄 Loading checkpoint:', {
          snapshotId,
          version: snapshot.version,
        });

        const client = getClientForEnvironment();
        const currNodeIds = new Set(canvas.nodes.map((n) => n.id));
        const currEdges = canvas.edges;
        const currGroups = canvas.groups ?? [];
        const snapNodeIds = new Set(snapshot.nodes.map((n) => n.id));
        const snapEdgeIds = new Set(snapshot.edges.map((e) => e.id));
        const snapGroups = snapshot.groups ?? [];
        const snapGroupIds = new Set(snapGroups.map((g) => g.id));

        // 1. Drop edges that don't exist in the checkpoint (before their nodes).
        await Promise.all(
          currEdges
            .filter((e) => !snapEdgeIds.has(e.id))
            .map((e) => deleteRelationship(e.id, client))
        );

        // 2. Drop nodes that don't exist in the checkpoint.
        await Promise.all(
          canvas.nodes
            .filter((n) => !snapNodeIds.has(n.id))
            .map((n) => deleteMetricCard(n.id, client))
        );

        // 3. Upsert the checkpoint's nodes. Re-created nodes get fresh DB ids,
        //    so remember the mapping for edges and group membership.
        const idMap = new Map<string, string>();
        const restoredNodes: MetricCard[] = await Promise.all(
          snapshot.nodes.map(async (node) => {
            if (currNodeIds.has(node.id)) {
              return updateMetricCard(node.id, node, client);
            }
            const created = await createMetricCard(
              node,
              canvas.id,
              user.id,
              client
            );
            idMap.set(node.id, created.id);
            return created;
          })
        );
        const mapId = (id: string) => idMap.get(id) ?? id;

        // 4. Upsert edges, remapping endpoints of re-created nodes.
        const currEdgeIds = new Set(currEdges.map((e) => e.id));
        const restoredEdges: Relationship[] = await Promise.all(
          snapshot.edges.map((edge) => {
            const remapped = {
              ...edge,
              sourceId: mapId(edge.sourceId),
              targetId: mapId(edge.targetId),
            };
            return currEdgeIds.has(edge.id)
              ? updateRelationship(edge.id, remapped, client)
              : createRelationship(remapped, canvas.id, user.id, client);
          })
        );

        // 5. Groups keep their ids; remap member node ids.
        await Promise.all(
          currGroups
            .filter((g) => !snapGroupIds.has(g.id))
            .map((g) => deleteGroup(g.id, client))
        );
        const currGroupIds = new Set(currGroups.map((g) => g.id));
        const restoredGroups: GroupNode[] = await Promise.all(
          snapGroups.map(async (group) => {
            const remapped = {
              ...group,
              nodeIds: group.nodeIds.map(mapId),
            };
            if (currGroupIds.has(group.id)) {
              await updateGroup(group.id, remapped, client);
            } else {
              await createGroup(
                {
                  id: group.id,
                  name: group.name,
                  nodeIds: remapped.nodeIds,
                  position: group.position,
                  size: group.size,
                  projectId: canvas.id,
                  createdBy: user.id,
                },
                client
              );
            }
            return remapped;
          })
        );

        // 6. Swap the live canvas — keep its identity, take the checkpoint's content.
        canvasStore.loadCanvas({
          ...canvas,
          nodes: restoredNodes,
          edges: restoredEdges,
          groups: restoredGroups,
          updatedAt: new Date().toISOString(),
        });

        set({ isLoading: false });
        log.debug('✅ Checkpoint loaded:', snapshot.version);
      } catch (error) {
        console.error('❌ Failed to load checkpoint:', error);
        set({
          error:
            error instanceof Error
              ? error.message
              : 'Failed to load checkpoint',
          isLoading: false,
        });
        throw error;
      }
    },

    deleteSnapshot: async (snapshotId: string) => {
      const snapshot = get().getSnapshotById(snapshotId);
      if (!snapshot) throw new Error('Checkpoint not found');

      set({ isLoading: true, error: undefined });
      try {
        await deleteCanvasSnapshot(snapshotId);
        set((state) => ({
          snapshots: state.snapshots.filter((s) => s.id !== snapshotId),
          isLoading: false,
        }));
      } catch (error) {
        console.error('❌ Failed to delete checkpoint:', error);
        set({
          error:
            error instanceof Error
              ? error.message
              : 'Failed to delete checkpoint',
          isLoading: false,
        });
        throw error;
      }
    },

    compareSnapshots: async (
      snapshotId1: string,
      snapshotId2: string
    ): Promise<SnapshotComparison> => {
      const snapshot1 = get().getSnapshotById(snapshotId1);
      const snapshot2 = get().getSnapshotById(snapshotId2);
      if (!snapshot1 || !snapshot2) {
        throw new Error('One or both checkpoints not found');
      }

      const summary = {
        nodesChanged: Math.abs(snapshot1.nodes.length - snapshot2.nodes.length),
        edgesChanged: Math.abs(snapshot1.edges.length - snapshot2.edges.length),
        groupsChanged: Math.abs(
          (snapshot1.groups?.length ?? 0) - (snapshot2.groups?.length ?? 0)
        ),
        totalChanges: 0,
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

    // Time/change-based auto-snapshots are intentionally OFF by default —
    // checkpoints are deliberate saves; auto entries only pollute the timeline.
    // This hook stays for opt-in use (config.autoSnapshotEnabled).
    checkAutoSnapshot: async (canvasId: string) => {
      const state = get();
      const canvasStore = useCanvasStore.getState();
      if (!state.config.autoSnapshotEnabled || !canvasStore.canvas) return;

      if (state.lastSnapshotTime) {
        const minutesSince =
          (Date.now() - new Date(state.lastSnapshotTime).getTime()) / 60000;
        if (minutesSince < state.config.changeThresholds.minTimeElapsed) return;
      }

      const latest = state.getLatestSnapshot();
      if (!latest) return;

      const changes = diffCounts(latest, canvasStore.canvas);
      const nodesChanged =
        changes.nodesAdded + changes.nodesModified + changes.nodesDeleted;
      const edgesChanged =
        changes.edgesAdded + changes.edgesModified + changes.edgesDeleted;
      if (
        nodesChanged >= state.config.changeThresholds.minNodesChanged ||
        edgesChanged >= state.config.changeThresholds.minEdgesChanged
      ) {
        await state.createSnapshot(
          canvasId,
          `Auto-save ${new Date().toLocaleString()}`,
          `Automatic save after ${nodesChanged} node and ${edgesChanged} connection changes`,
          'auto'
        );
      }
    },

    updateConfig: (newConfig: Partial<VersionHistoryConfig>) => {
      set((state) => ({ config: { ...state.config, ...newConfig } }));
    },

    getSnapshotById: (snapshotId: string) =>
      get().snapshots.find((s) => s.id === snapshotId),

    getLatestSnapshot: () => {
      // Sorted newest-first by version
      return get().snapshots[0];
    },

    getSnapshotsSince: (date: string) => {
      const since = new Date(date);
      return get().snapshots.filter((s) => new Date(s.createdAt) >= since);
    },

    // Only automatic backups are ever trimmed. Manual checkpoints are the
    // user's saves — they are never garbage-collected.
    cleanupOldSnapshots: async (_canvasId: string) => {
      const state = get();
      const autoSnapshots = state.snapshots
        .filter((s) => s.metadata.triggerType === 'auto')
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      const excess = autoSnapshots.slice(state.config.maxAutoSnapshots);
      for (const snapshot of excess) {
        try {
          await deleteCanvasSnapshot(snapshot.id);
          set((s) => ({
            snapshots: s.snapshots.filter((x) => x.id !== snapshot.id),
          }));
        } catch (error) {
          console.error('checkpoint: failed to trim auto backup', error);
        }
      }
    },

    getHistoryStats: (): HistoryStats => {
      const snapshots = get().snapshots;
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

      let totalTimeDiff = 0;
      for (let i = 1; i < sortedByDate.length; i++) {
        totalTimeDiff +=
          new Date(sortedByDate[i].createdAt).getTime() -
          new Date(sortedByDate[i - 1].createdAt).getTime();
      }
      const averageTimeBetweenSnapshots =
        sortedByDate.length > 1
          ? totalTimeDiff / (sortedByDate.length - 1) / 3600000
          : undefined;

      const totalCanvasChanges = snapshots.reduce((acc, s) => {
        const c = s.metadata.changesSinceLastSnapshot;
        if (!c) return acc;
        return (
          acc +
          c.nodesAdded +
          c.nodesModified +
          c.nodesDeleted +
          c.edgesAdded +
          c.edgesModified +
          c.edgesDeleted +
          c.groupsAdded +
          c.groupsModified +
          c.groupsDeleted
        );
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
  }))
);
