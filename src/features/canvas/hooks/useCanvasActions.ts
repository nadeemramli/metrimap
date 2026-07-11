// Canvas clipboard + duplicate/delete actions with undo/redo. Covers:
//  - metric cards (useCanvasStore) — this also covers PRD value/action/hypothesis/
//    metric nodes, which persist AS metric_cards.
//  - canvas nodes — operator/source/chart/comment/whiteboard (useCanvasNodesStore).
//  - evidence (useEvidenceStore).
// Each create/delete pushes an undo+redo pair onto useCanvasHistoryStore.

import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import type {
  CanvasNode,
  EvidenceItem,
  MetricCard,
  Relationship,
} from '@/shared/types';
import { internalEdges, remapEdges } from '@/features/canvas/utils/clipboard';
// IMPORTANT: use the SAME store instance the canvas renders from (@/lib/stores
// → canvasStore). A second useCanvasStore.ts exists but is a different instance;
// reading it here made getSelection/itemsFromIds see an empty store, so
// copy/duplicate/delete silently found "no selection".
import { useCanvasStore } from '@/lib/stores';
import { useCanvasNodesStore } from '@/features/canvas/stores/useCanvasNodesStore';
import { useEvidenceStore } from '@/features/evidence/stores/useEvidenceStore';
import { useCanvasHistoryStore } from '@/features/canvas/stores/useCanvasHistoryStore';
import { generateUUID } from '@/shared/utils/validation';
import { linkCardToMetric } from '@/shared/lib/supabase/services/trackedMetrics';
import { getClientForEnvironment } from '@/shared/utils/authenticatedClient';

type Family = 'card' | 'canvasNode' | 'evidence';
type ClipItem =
  | { family: 'card'; node: MetricCard }
  | { family: 'canvasNode'; node: CanvasNode }
  | { family: 'evidence'; node: EvidenceItem };
type Ref = { family: Family; id: string; srcId?: string };

const OFFSET = 48;

// Module-level clipboard so a copy survives navigating between canvases
// (cross-canvas paste, CVS-41). Holds the copied nodes, the relationships
// internal to the selection, and the paste-offset generation.
const clip: { items: ClipItem[]; edges: Relationship[]; gen: number } = {
  items: [],
  edges: [],
  gen: 0,
};

export function useCanvasActions(
  projectId: string | undefined,
  createdBy: string
) {

  // Resolve a set of node ids to full ClipItems across the three node families.
  const itemsFromIds = useCallback((idList: string[]): ClipItem[] => {
    const ids = new Set(idList);
    if (ids.size === 0) return [];
    const cards = useCanvasStore.getState().canvas?.nodes || [];
    const cnodes = useCanvasNodesStore.getState().canvasNodes || [];
    const evidence = useEvidenceStore.getState().evidence || [];
    const items: ClipItem[] = [];
    for (const c of cards) if (ids.has(c.id)) items.push({ family: 'card', node: c });
    for (const n of cnodes)
      if (ids.has(n.id)) items.push({ family: 'canvasNode', node: n });
    for (const e of evidence)
      if (ids.has(e.id) && e.position)
        items.push({ family: 'evidence', node: e });
    return items;
  }, []);

  const getSelection = useCallback(
    (): ClipItem[] =>
      itemsFromIds(useCanvasStore.getState().selectedNodeIds || []),
    [itemsFromIds]
  );

  // Create one copy at a position offset; returns the new node ref (or null).
  const createCopy = useCallback(
    async (item: ClipItem, d: number): Promise<Ref | null> => {
      try {
        if (item.family === 'card') {
          const before = new Set(
            (useCanvasStore.getState().canvas?.nodes || []).map((n) => n.id)
          );
          const { id, createdAt, updatedAt, ...rest } = item.node as any;
          await useCanvasStore.getState().createNode({
            ...rest,
            position: {
              x: (item.node.position?.x || 0) + d,
              y: (item.node.position?.y || 0) + d,
            },
          });
          const created = (useCanvasStore.getState().canvas?.nodes || []).find(
            (n) => !before.has(n.id)
          );
          console.log('📋 copy card:', {
            src: id,
            created: created?.id ?? null,
          });
          // Paste-as-reference: a copy of a catalogued card stays linked to the
          // SAME tracked metric (single source of truth) instead of forking a
          // drifting copy. createNode (zod) drops tracked_metric_id, so link after.
          const trackedMetricId = (item.node as MetricCard).trackedMetricId;
          if (created && trackedMetricId) {
            try {
              await linkCardToMetric(
                created.id,
                trackedMetricId,
                getClientForEnvironment()
              );
              useCanvasStore
                .getState()
                .updateNode(created.id, { trackedMetricId });
            } catch (e) {
              console.error('Failed to preserve catalog link on copy:', e);
            }
          }
          return created
            ? { family: 'card', id: created.id, srcId: id }
            : null;
        }
        if (item.family === 'evidence') {
          const newId = generateUUID();
          const pos = item.node.position || { x: 100, y: 100 };
          useEvidenceStore.getState().addEvidence({
            ...item.node,
            id: newId,
            position: { x: pos.x + d, y: pos.y + d },
          } as EvidenceItem);
          return { family: 'evidence', id: newId, srcId: item.node.id };
        }
        const created = await useCanvasNodesStore.getState().createNode({
          projectId: projectId || (item.node as any).projectId,
          nodeType: item.node.nodeType,
          title: item.node.title,
          position: {
            x: (item.node.position?.x || 0) + d,
            y: (item.node.position?.y || 0) + d,
          },
          data: item.node.data,
          createdBy,
        } as any);
        console.log('📋 copy canvasNode:', {
          src: item.node.id,
          created: created?.id ?? null,
        });
        return created
          ? { family: 'canvasNode', id: created.id, srcId: item.node.id }
          : null;
      } catch (e) {
        console.error('📋 createCopy failed:', item.family, e);
        toast.error(
          `Copy failed: ${e instanceof Error ? e.message : 'unknown error'}`
        );
        return null;
      }
    },
    [projectId, createdBy]
  );

  const deleteOne = useCallback(async (family: Family, id: string) => {
    try {
      if (family === 'card')
        await useCanvasStore.getState().persistNodeDelete(id);
      else if (family === 'evidence')
        useEvidenceStore.getState().deleteEvidence(id);
      else await useCanvasNodesStore.getState().deleteNode(id);
      console.log('🗑️ deleted:', family, id);
    } catch (e) {
      console.error('🗑️ deleteOne failed:', family, id, e);
      toast.error(
        `Delete failed: ${e instanceof Error ? e.message : 'unknown error'}`
      );
      throw e;
    }
  }, []);

  // Create copies of `items` + the relationships internal to the selection,
  // and record a single undo (delete both) + redo (recreate both).
  const pasteItems = useCallback(
    async (items: ClipItem[], edges: Relationship[], gen: number) => {
      if (!items.length) return;

      const recreate = async (): Promise<{ nodes: Ref[]; edgeIds: string[] }> => {
        const nodes: Ref[] = [];
        for (const item of items) {
          const c = await createCopy(item, OFFSET * gen);
          if (c) nodes.push(c);
        }
        // old id → new id, then rebuild the internal edges between the copies.
        const idMap = new Map<string, string>();
        for (const r of nodes) if (r.srcId) idMap.set(r.srcId, r.id);
        const edgeIds: string[] = [];
        for (const data of remapEdges(edges, idMap)) {
          try {
            const before = new Set(
              (useCanvasStore.getState().canvas?.edges || []).map((e) => e.id)
            );
            await useCanvasStore.getState().createEdge(data);
            const created = (
              useCanvasStore.getState().canvas?.edges || []
            ).find((e) => !before.has(e.id));
            if (created) edgeIds.push(created.id);
          } catch (e) {
            console.error('📋 paste edge failed:', e);
          }
        }
        return { nodes, edgeIds };
      };

      let current = await recreate();
      if (!current.nodes.length) {
        console.warn('📋 pasteItems produced 0 nodes from', items.length);
        return; // createCopy already toasts on failure
      }
      // Select the pasted nodes so the user can immediately move/act on them.
      useCanvasStore.setState({
        selectedNodeIds: current.nodes.map((r) => r.id),
      });

      useCanvasHistoryStore.getState().push({
        label: `Add ${current.nodes.length}`,
        undo: async () => {
          for (const id of current.edgeIds)
            await useCanvasStore.getState().persistEdgeDelete(id);
          for (const r of current.nodes) await deleteOne(r.family, r.id);
        },
        redo: async () => {
          current = await recreate();
        },
      });
      const n = current.nodes.length;
      const e = current.edgeIds.length;
      toast.success(
        `Pasted ${n} item${n === 1 ? '' : 's'}` +
          (e ? ` + ${e} edge${e === 1 ? '' : 's'}` : '')
      );
    },
    [createCopy, deleteOne]
  );

  // Relationships internal to the given items (both endpoints selected).
  const edgesFor = useCallback((items: ClipItem[]): Relationship[] => {
    const selectedIds = new Set(items.map((i) => i.node.id));
    return internalEdges(
      useCanvasStore.getState().canvas?.edges || [],
      selectedIds
    );
  }, []);

  const copySelection = useCallback(() => {
    const items = getSelection();
    if (!items.length) {
      toast.info('Select a node first, then copy');
      return;
    }
    const edges = edgesFor(items);
    clip.items = items;
    clip.edges = edges;
    clip.gen = 0;
    toast.success(
      `Copied ${items.length} item${items.length === 1 ? '' : 's'}` +
        (edges.length ? ` + ${edges.length} edge${edges.length === 1 ? '' : 's'}` : '')
    );
  }, [getSelection, edgesFor]);

  const paste = useCallback(() => {
    if (!clip.items.length) {
      toast.info('Nothing to paste — copy a node first');
      return;
    }
    clip.gen += 1;
    void pasteItems(clip.items, clip.edges, clip.gen);
  }, [pasteItems]);

  const duplicateSelection = useCallback(() => {
    const items = getSelection();
    if (!items.length) {
      toast.info('Select a node first, then duplicate');
      return;
    }
    void pasteItems(items, edgesFor(items), 1);
  }, [getSelection, pasteItems, edgesFor]);

  // Delete a specific set of items, with undo (recreate) / redo.
  const deleteItems = useCallback(
    async (items: ClipItem[]) => {
      console.log('🗑️ deleteItems:', items.map((i) => `${i.family}:${i.node.id}`));
      if (!items.length) return;
      // Snapshot relationships incident to the doomed cards BEFORE deleting —
      // persistNodeDelete drops them locally and in Supabase, and undo must
      // restore both internal edges (both endpoints deleted) and boundary
      // edges (one endpoint survives).
      const doomedCardIds = new Set(
        items.filter((i) => i.family === 'card').map((i) => i.node.id)
      );
      const savedEdges = (useCanvasStore.getState().canvas?.edges || []).filter(
        (e) => doomedCardIds.has(e.sourceId) || doomedCardIds.has(e.targetId)
      );
      // Per-item try/catch so one failure doesn't abort the rest of the batch.
      let deleted = 0;
      for (const item of items) {
        try {
          await deleteOne(item.family, item.node.id);
          deleted++;
        } catch {
          /* deleteOne already toasted the error */
        }
      }
      if (deleted === 0) return; // nothing removed — don't record a no-op undo
      let current: Ref[] = []; // alive copies (none after delete)
      let currentEdgeIds: string[] = [];
      const recreate = async (): Promise<{ nodes: Ref[]; edgeIds: string[] }> => {
        const made: Ref[] = [];
        for (const item of items) {
          const c = await createCopy(item, 0);
          if (c) made.push(c);
        }
        // old id → new id for the recreated nodes, plus identity mappings for
        // surviving endpoints so boundary edges come back — remapEdges drops
        // any edge whose endpoints aren't both in the map.
        const idMap = new Map<string, string>();
        for (const r of made) if (r.srcId) idMap.set(r.srcId, r.id);
        const alive = new Set(
          (useCanvasStore.getState().canvas?.nodes || []).map((n) => n.id)
        );
        for (const e of savedEdges) {
          for (const endpoint of [e.sourceId, e.targetId]) {
            if (!doomedCardIds.has(endpoint) && alive.has(endpoint))
              idMap.set(endpoint, endpoint);
          }
        }
        // Recreate the edges (cascaded evidence/tags/history can't be restored).
        const edgeIds: string[] = [];
        for (const data of remapEdges(savedEdges, idMap)) {
          try {
            const before = new Set(
              (useCanvasStore.getState().canvas?.edges || []).map((e) => e.id)
            );
            await useCanvasStore.getState().createEdge(data);
            const created = (
              useCanvasStore.getState().canvas?.edges || []
            ).find((e) => !before.has(e.id));
            if (created) edgeIds.push(created.id);
          } catch (e) {
            console.error('🗑️ undo edge recreate failed:', e);
          }
        }
        return { nodes: made, edgeIds };
      };
      useCanvasHistoryStore.getState().push({
        label: `Delete ${items.length}`,
        undo: async () => {
          const r = await recreate();
          current = r.nodes;
          currentEdgeIds = r.edgeIds;
        },
        redo: async () => {
          for (const id of currentEdgeIds)
            await useCanvasStore.getState().persistEdgeDelete(id);
          currentEdgeIds = [];
          for (const r of current) await deleteOne(r.family, r.id);
          current = [];
        },
      });
      useCanvasStore.setState({ selectedNodeIds: [] });
      toast.success(`Deleted ${deleted} item${deleted === 1 ? '' : 's'}`);
    },
    [deleteOne, createCopy]
  );

  const deleteSelection = useCallback(
    () => deleteItems(getSelection()),
    [deleteItems, getSelection]
  );

  // Delete exactly the nodes React Flow reports (e.g. the Delete key), robust
  // even when the store's selectedNodeIds hasn't kept up with RF's selection —
  // which left nodes "undeletable" and snapping back in controlled mode.
  const deleteByIds = useCallback(
    (ids: string[]) => deleteItems(itemsFromIds(ids)),
    [deleteItems, itemsFromIds]
  );

  const undo = useCallback(() => {
    void useCanvasHistoryStore.getState().undo();
  }, []);
  const redo = useCallback(() => {
    void useCanvasHistoryStore.getState().redo();
  }, []);

  return useMemo(
    () => ({
      copySelection,
      paste,
      duplicateSelection,
      deleteSelection,
      deleteByIds,
      undo,
      redo,
    }),
    [
      copySelection,
      paste,
      duplicateSelection,
      deleteSelection,
      deleteByIds,
      undo,
      redo,
    ]
  );
}
