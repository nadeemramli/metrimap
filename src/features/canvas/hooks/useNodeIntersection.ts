import { useCallback, useMemo, useRef } from 'react';
import { useReactFlow } from '@xyflow/react';

const DROP_TARGET_CLASS = 'rf-node-drop-target';

/**
 * Pure set diff — which node ids gain/lose the drop-target highlight between
 * the previous highlighted set and the next list. Exported for unit testing.
 */
export function diffHighlight(
  prev: Set<string>,
  next: string[]
): { add: string[]; remove: string[] } {
  const nextSet = new Set(next);
  const add = next.filter((id) => !prev.has(id));
  const remove = [...prev].filter((id) => !nextSet.has(id));
  return { add, remove };
}

function nodeEl(id: string): Element | null {
  const safe =
    typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
      ? CSS.escape(id)
      : id;
  return document.querySelector(`.react-flow__node[data-id="${safe}"]`);
}

export interface NodeIntersectionApi {
  /**
   * Call on node drag with the dragged node — highlights the nodes it overlaps
   * and returns their ids.
   */
  handleDrag: (node: { id: string } | null | undefined) => string[];
  /** Call on drag stop — clears every drop-target highlight. */
  clear: () => void;
  /** Ids currently highlighted (drop targets under the dragged node). */
  getTargets: () => string[];
}

/**
 * CVS-38 — detect nodes intersecting a dragged node (React Flow's
 * `getIntersectingNodes`) and surface it as a drop-target highlight, plus a
 * `getTargets()` / `onChange` callback for grouping + subflows (CVS-43).
 *
 * Highlights are applied by toggling a class directly on the rendered node DOM
 * (not a per-frame `setNodes`) so dragging stays cheap on large canvases.
 */
export function useNodeIntersection(
  onChange?: (ids: string[]) => void
): NodeIntersectionApi {
  const { getIntersectingNodes } = useReactFlow();
  const highlighted = useRef<Set<string>>(new Set());

  const apply = useCallback(
    (ids: string[]) => {
      const { add, remove } = diffHighlight(highlighted.current, ids);
      if (!add.length && !remove.length) return;
      for (const id of remove) nodeEl(id)?.classList.remove(DROP_TARGET_CLASS);
      for (const id of add) nodeEl(id)?.classList.add(DROP_TARGET_CLASS);
      highlighted.current = new Set(ids);
      onChange?.(ids);
    },
    [onChange]
  );

  const handleDrag = useCallback(
    (node: { id: string } | null | undefined): string[] => {
      if (!node?.id) return [];
      let hits: Array<{ id: string }> = [];
      try {
        hits = (getIntersectingNodes(node as never) as Array<{ id: string }>) || [];
      } catch {
        hits = [];
      }
      const ids = hits.map((n) => n.id);
      apply(ids);
      return ids;
    },
    [getIntersectingNodes, apply]
  );

  const clear = useCallback(() => apply([]), [apply]);
  const getTargets = useCallback(() => [...highlighted.current], []);

  return useMemo(
    () => ({ handleDrag, clear, getTargets }),
    [handleDrag, clear, getTargets]
  );
}
