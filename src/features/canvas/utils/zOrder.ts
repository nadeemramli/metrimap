// Canvas paint order (Layers panel, bring-forward/send-back).
//
// Every canvas item may carry a persisted integer `zIndex` (steps of 10).
// Legacy items have none: their effective z derives from createdAt order, so
// nothing needs a bulk backfill — the first explicit reorder renormalizes and
// persists the whole list, after which single moves are usually one write
// (midpoint between neighbors, renormalize only when the gap is exhausted).

export const Z_STEP = 10;

export interface ZItem {
  id: string;
  zIndex?: number | null;
  createdAt?: string;
}

export interface ZPatch {
  id: string;
  zIndex: number;
}

function createdAtKey(item: ZItem): string {
  return `${item.createdAt ?? ''}|${item.id}`;
}

/**
 * Effective z for every item: persisted zIndex wins; items without one get
 * createdAt-rank * Z_STEP (rank taken across ALL items so the pre-feature
 * creation-order painting is preserved).
 */
export function resolveZ(items: ZItem[]): Map<string, number> {
  const byCreation = [...items].sort((a, b) =>
    createdAtKey(a).localeCompare(createdAtKey(b))
  );
  const out = new Map<string, number>();
  byCreation.forEach((item, i) => {
    out.set(
      item.id,
      item.zIndex !== null && item.zIndex !== undefined
        ? item.zIndex
        : (i + 1) * Z_STEP
    );
  });
  return out;
}

/** Items sorted bottom → top by effective z (stable: createdAt, then id). */
export function sortByZ<T extends ZItem>(items: T[]): T[] {
  const z = resolveZ(items);
  return [...items].sort((a, b) => {
    const dz = (z.get(a.id) ?? 0) - (z.get(b.id) ?? 0);
    if (dz !== 0) return dz;
    return createdAtKey(a).localeCompare(createdAtKey(b));
  });
}

/** z for a newly created item — always on top. */
export function nextZ(items: ZItem[]): number {
  if (items.length === 0) return Z_STEP;
  const z = resolveZ(items);
  return Math.max(...z.values()) + Z_STEP;
}

function renormalize(ordered: ZItem[]): ZPatch[] {
  const patches: ZPatch[] = [];
  ordered.forEach((item, i) => {
    const want = (i + 1) * Z_STEP;
    if (item.zIndex !== want) patches.push({ id: item.id, zIndex: want });
  });
  return patches;
}

/**
 * Move `id` to `toIndex` in the bottom→top order. Returns persistence patches:
 * a single midpoint write when every item already has a persisted z and a gap
 * exists; otherwise a full renormalization (which doubles as the lazy
 * backfill on the first-ever reorder).
 */
export function reorder(items: ZItem[], id: string, toIndex: number): ZPatch[] {
  const ordered = sortByZ(items);
  const from = ordered.findIndex((i) => i.id === id);
  if (from === -1) return [];
  const clamped = Math.max(0, Math.min(toIndex, ordered.length - 1));
  if (clamped === from) return [];

  const moved = ordered[from];
  const next = [...ordered];
  next.splice(from, 1);
  next.splice(clamped, 0, moved);

  const allPersisted = items.every(
    (i) => i.zIndex !== null && i.zIndex !== undefined
  );
  if (allPersisted) {
    const below = next[clamped - 1];
    const above = next[clamped + 1];
    const lo = below ? (below.zIndex as number) : 0;
    const hi = above
      ? (above.zIndex as number)
      : (next[next.length - 2]?.zIndex as number | undefined) !== undefined
        ? (next[next.length - 2]!.zIndex as number) + 2 * Z_STEP
        : 2 * Z_STEP;
    if (hi - lo >= 2) {
      return [{ id, zIndex: Math.floor((lo + hi) / 2) }];
    }
  }
  return renormalize(next);
}

export function bringToFront(items: ZItem[], id: string): ZPatch[] {
  return reorder(items, id, items.length - 1);
}

export function sendToBack(items: ZItem[], id: string): ZPatch[] {
  return reorder(items, id, 0);
}

export function bringForward(items: ZItem[], id: string): ZPatch[] {
  const idx = sortByZ(items).findIndex((i) => i.id === id);
  return idx === -1 ? [] : reorder(items, id, idx + 1);
}

export function sendBackward(items: ZItem[], id: string): ZPatch[] {
  const idx = sortByZ(items).findIndex((i) => i.id === id);
  return idx === -1 ? [] : reorder(items, id, idx - 1);
}
