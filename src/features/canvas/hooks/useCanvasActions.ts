// Canvas clipboard + duplicate/delete actions with undo/redo. Covers:
//  - metric cards (useCanvasStore) — this also covers PRD value/action/hypothesis/
//    metric nodes, which persist AS metric_cards.
//  - canvas nodes — operator/source/chart/comment/whiteboard (useCanvasNodesStore).
//  - evidence (useEvidenceStore).
// Each create/delete pushes an undo+redo pair onto useCanvasHistoryStore.

import { useCallback, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import type { CanvasNode, EvidenceItem, MetricCard } from '@/shared/types';
import { useCanvasStore } from '@/features/canvas/stores/useCanvasStore';
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
type Ref = { family: Family; id: string };

const OFFSET = 48;

export function useCanvasActions(
  projectId: string | undefined,
  createdBy: string
) {
  const clipboard = useRef<ClipItem[]>([]);
  const pasteGen = useRef(0);

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
          return created ? { family: 'card', id: created.id } : null;
        }
        if (item.family === 'evidence') {
          const newId = generateUUID();
          const pos = item.node.position || { x: 100, y: 100 };
          useEvidenceStore.getState().addEvidence({
            ...item.node,
            id: newId,
            position: { x: pos.x + d, y: pos.y + d },
          } as EvidenceItem);
          return { family: 'evidence', id: newId };
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
        return created ? { family: 'canvasNode', id: created.id } : null;
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

  // Create copies of `items` and record an undo (delete) + redo (recreate).
  const pasteItems = useCallback(
    async (items: ClipItem[], gen: number) => {
      if (!items.length) return;
      const recreate = async (): Promise<Ref[]> => {
        const made: Ref[] = [];
        for (const item of items) {
          const c = await createCopy(item, OFFSET * gen);
          if (c) made.push(c);
        }
        return made;
      };
      let current = await recreate();
      if (!current.length) {
        console.warn('📋 pasteItems produced 0 nodes from', items.length);
        return; // createCopy already toasts on failure
      }
      useCanvasHistoryStore.getState().push({
        label: `Add ${current.length}`,
        undo: async () => {
          for (const r of current) await deleteOne(r.family, r.id);
        },
        redo: async () => {
          current = await recreate();
        },
      });
      toast.success(`Pasted ${current.length} item${current.length === 1 ? '' : 's'}`);
    },
    [createCopy, deleteOne]
  );

  const copySelection = useCallback(() => {
    const items = getSelection();
    console.log('📋 copySelection:', {
      selectedNodeIds: useCanvasStore.getState().selectedNodeIds,
      resolved: items.length,
    });
    if (!items.length) {
      toast.info('Select a node first, then copy');
      return;
    }
    clipboard.current = items;
    pasteGen.current = 0;
    toast.success(`Copied ${items.length} item${items.length === 1 ? '' : 's'}`);
  }, [getSelection]);

  const paste = useCallback(() => {
    console.log('📋 paste: clipboard size', clipboard.current.length);
    if (!clipboard.current.length) {
      toast.info('Nothing to paste — copy a node first');
      return;
    }
    pasteGen.current += 1;
    void pasteItems(clipboard.current, pasteGen.current);
  }, [pasteItems]);

  const duplicateSelection = useCallback(() => {
    const items = getSelection();
    console.log('📋 duplicateSelection:', {
      selectedNodeIds: useCanvasStore.getState().selectedNodeIds,
      resolved: items.length,
    });
    if (!items.length) {
      toast.info('Select a node first, then duplicate');
      return;
    }
    void pasteItems(items, 1);
  }, [getSelection, pasteItems]);

  // Delete a specific set of items, with undo (recreate) / redo.
  const deleteItems = useCallback(
    async (items: ClipItem[]) => {
      console.log('🗑️ deleteItems:', items.map((i) => `${i.family}:${i.node.id}`));
      if (!items.length) return;
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
      const recreate = async (): Promise<Ref[]> => {
        const made: Ref[] = [];
        for (const item of items) {
          const c = await createCopy(item, 0);
          if (c) made.push(c);
        }
        return made;
      };
      useCanvasHistoryStore.getState().push({
        label: `Delete ${items.length}`,
        undo: async () => {
          current = await recreate();
        },
        redo: async () => {
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
