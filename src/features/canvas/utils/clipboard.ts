import type { Relationship } from '@/shared/types';

/** Edge data shape accepted by the stores' `createEdge` (server assigns id/timestamps). */
export type PasteEdge = Omit<Relationship, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Relationships internal to a selection — i.e. both endpoints are selected.
 * Only these travel with a copy; edges to nodes outside the selection are
 * intentionally dropped (there's nothing to reconnect them to on paste).
 */
export function internalEdges(
  edges: Relationship[],
  selectedIds: Set<string>
): Relationship[] {
  return edges.filter(
    (e) => selectedIds.has(e.sourceId) && selectedIds.has(e.targetId)
  );
}

/**
 * Remap copied edges onto freshly-created node ids using an old→new id map.
 * Edges whose endpoints aren't both in the map are dropped (defensive — e.g. a
 * node that failed to copy). Evidence is intentionally not carried over.
 */
export function remapEdges(
  edges: Relationship[],
  idMap: Map<string, string>
): PasteEdge[] {
  const out: PasteEdge[] = [];
  for (const e of edges) {
    const sourceId = idMap.get(e.sourceId);
    const targetId = idMap.get(e.targetId);
    if (!sourceId || !targetId) continue;
    out.push({
      sourceId,
      targetId,
      type: e.type,
      confidence: e.confidence,
      weight: e.weight,
      evidence: [],
      notes: e.notes,
    });
  }
  return out;
}
