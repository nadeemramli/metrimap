import { useCanvasNodeSources } from '@/features/canvas/hooks/useCanvasNodeSources';
import { resolveZ } from '@/features/canvas/utils/zOrder';
import { useCanvasStore } from '@/lib/stores';
import type { GroupNode } from '@/shared/types';
import { useMemo } from 'react';

export type LayerKind = 'metricCard' | 'canvasNode' | 'newNode' | 'evidence';

export interface LayerEntry {
  id: string;
  kind: LayerKind;
  /** Visual type key for the row icon (category / nodeType / whiteboard shape). */
  typeKey: string;
  title: string;
  /** Effective paint order (higher = on top). */
  z: number;
  /** Persisted zIndex (null = legacy, resolved from createdAt). */
  zIndex: number | null;
  createdAt?: string;
  groupId?: string;
}

export interface LayersTree {
  /** Every entry, top-most first (the flat z order reorders operate on). */
  all: LayerEntry[];
  /** Entries not claimed by any group, top-most first. */
  rootEntries: LayerEntry[];
  /** Groups (as folders) with their member entries, top-most first. */
  groups: Array<{ group: GroupNode; entries: LayerEntry[]; maxZ: number }>;
}

/**
 * Flattens the four node stores into one z-ordered layer list, with groups as
 * folders (membership from GroupNode.nodeIds). Pure derivation — selection,
 * hide/lock, and search live in useLayersUiStore / the panel.
 */
export function useLayersTree(): LayersTree {
  const sources = useCanvasNodeSources();
  const groups = useCanvasStore((s) => s.canvas?.groups);

  return useMemo(() => {
    const groupByMember = new Map<string, string>();
    for (const g of groups ?? []) {
      for (const nodeId of g.nodeIds ?? []) groupByMember.set(nodeId, g.id);
    }

    const raw: Array<Omit<LayerEntry, 'z'>> = [];
    for (const card of sources.metricCards) {
      raw.push({
        id: card.id,
        kind: 'metricCard',
        typeKey: card.category ?? 'metricCard',
        title: card.title || 'Untitled card',
        zIndex: card.zIndex ?? null,
        createdAt: card.createdAt,
        groupId: groupByMember.get(card.id),
      });
    }
    for (const node of sources.canvasNodes) {
      const shape =
        node.nodeType === 'whiteboardNode'
          ? ((node.data?.shape as string) ?? 'freehand')
          : undefined;
      raw.push({
        id: node.id,
        kind: 'canvasNode',
        typeKey: shape ? `whiteboard:${shape}` : node.nodeType,
        title:
          node.title ||
          (shape
            ? shape.charAt(0).toUpperCase() + shape.slice(1)
            : node.nodeType.replace(/Node$/, '')),
        zIndex: node.zIndex ?? null,
        createdAt: node.createdAt,
        groupId: groupByMember.get(node.id),
      });
    }
    for (const node of sources.newNodes) {
      raw.push({
        id: node.id,
        kind: 'newNode',
        typeKey: node.type ?? 'metricNode',
        title: node.title || 'Untitled node',
        zIndex: node.zIndex ?? null,
        createdAt: node.createdAt,
        groupId: groupByMember.get(node.id),
      });
    }
    for (const evidence of sources.positionedEvidence) {
      raw.push({
        id: evidence.id,
        kind: 'evidence',
        typeKey: 'evidence',
        title: evidence.title || 'Evidence',
        zIndex: (evidence as { zIndex?: number | null }).zIndex ?? null,
        createdAt: evidence.createdAt,
        groupId: groupByMember.get(evidence.id),
      });
    }

    const zMap = resolveZ(raw);
    const all: LayerEntry[] = raw
      .map((e) => ({ ...e, z: zMap.get(e.id) ?? 0 }))
      .sort((a, b) => b.z - a.z);

    const rootEntries = all.filter((e) => !e.groupId);
    const groupFolders = (groups ?? [])
      .map((group) => {
        const entries = all.filter((e) => e.groupId === group.id);
        return {
          group,
          entries,
          maxZ: entries.length ? Math.max(...entries.map((e) => e.z)) : 0,
        };
      })
      .sort((a, b) => b.maxZ - a.maxZ);

    return { all, rootEntries, groups: groupFolders };
  }, [sources, groups]);
}
