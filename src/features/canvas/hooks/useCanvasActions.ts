// Canvas clipboard + duplicate/delete actions with undo recording. Supports
// metric cards (useCanvasStore) and canvas nodes — operator/source/chart/comment/
// whiteboard (useCanvasNodesStore) — both of which have persisted create/delete.
// Each create/delete pushes an inverse onto useCanvasHistoryStore so Ctrl+Z works.
// (Evidence + PRD nodes are a follow-up — their create paths are local/multi-step.)

import { useCallback, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import type { CanvasNode, MetricCard } from '@/shared/types';
import { useCanvasStore } from '@/features/canvas/stores/useCanvasStore';
import { useCanvasNodesStore } from '@/features/canvas/stores/useCanvasNodesStore';
import { useCanvasHistoryStore } from '@/features/canvas/stores/useCanvasHistoryStore';

type ClipItem =
  | { family: 'card'; node: MetricCard }
  | { family: 'canvasNode'; node: CanvasNode };

const OFFSET = 48;

export function useCanvasActions(
  projectId: string | undefined,
  createdBy: string
) {
  const clipboard = useRef<ClipItem[]>([]);
  const pasteGen = useRef(0);

  const getSelection = useCallback((): ClipItem[] => {
    const ids = new Set(useCanvasStore.getState().selectedNodeIds || []);
    if (ids.size === 0) return [];
    const cards = useCanvasStore.getState().canvas?.nodes || [];
    const cnodes = useCanvasNodesStore.getState().canvasNodes || [];
    const items: ClipItem[] = [];
    for (const c of cards) if (ids.has(c.id)) items.push({ family: 'card', node: c });
    for (const n of cnodes)
      if (ids.has(n.id)) items.push({ family: 'canvasNode', node: n });
    return items;
  }, []);

  // Create one copy at a position offset; returns the new node id (or null).
  const createCopy = useCallback(
    async (item: ClipItem, d: number): Promise<{ family: ClipItem['family']; id: string } | null> => {
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
        return created ? { family: 'card', id: created.id } : null;
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
      return created ? { family: 'canvasNode', id: created.id } : null;
    },
    [projectId, createdBy]
  );

  const deleteOne = useCallback(
    async (family: ClipItem['family'], id: string) => {
      if (family === 'card') await useCanvasStore.getState().persistNodeDelete(id);
      else await useCanvasNodesStore.getState().deleteNode(id);
    },
    []
  );

  // Create copies of `items` and record an undo that deletes them.
  const pasteItems = useCallback(
    async (items: ClipItem[], gen: number) => {
      if (!items.length) return;
      const created: { family: ClipItem['family']; id: string }[] = [];
      for (const item of items) {
        const c = await createCopy(item, OFFSET * gen);
        if (c) created.push(c);
      }
      if (!created.length) return;
      useCanvasHistoryStore.getState().push({
        label: `Add ${created.length}`,
        undo: async () => {
          for (const { family, id } of created) await deleteOne(family, id);
        },
      });
      toast.success(`Pasted ${created.length} item${created.length === 1 ? '' : 's'}`);
    },
    [createCopy, deleteOne]
  );

  const copySelection = useCallback(() => {
    const items = getSelection();
    if (!items.length) return;
    clipboard.current = items;
    pasteGen.current = 0;
    toast.success(`Copied ${items.length} item${items.length === 1 ? '' : 's'}`);
  }, [getSelection]);

  const paste = useCallback(() => {
    if (!clipboard.current.length) return;
    pasteGen.current += 1;
    void pasteItems(clipboard.current, pasteGen.current);
  }, [pasteItems]);

  const duplicateSelection = useCallback(() => {
    const items = getSelection();
    if (!items.length) return;
    void pasteItems(items, 1);
  }, [getSelection, pasteItems]);

  const deleteSelection = useCallback(async () => {
    const items = getSelection();
    if (!items.length) return;
    for (const item of items) await deleteOne(item.family, item.node.id);
    // Undo = recreate at the original position (new ids).
    useCanvasHistoryStore.getState().push({
      label: `Delete ${items.length}`,
      undo: async () => {
        for (const item of items) await createCopy(item, 0);
      },
    });
    useCanvasStore.setState({ selectedNodeIds: [] });
    toast.success(`Deleted ${items.length} item${items.length === 1 ? '' : 's'}`);
  }, [getSelection, deleteOne, createCopy]);

  const undo = useCallback(() => {
    void useCanvasHistoryStore.getState().undo();
  }, []);

  return useMemo(
    () => ({ copySelection, paste, duplicateSelection, deleteSelection, undo }),
    [copySelection, paste, duplicateSelection, deleteSelection, undo]
  );
}
