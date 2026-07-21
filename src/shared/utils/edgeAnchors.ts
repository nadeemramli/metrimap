import type { LayoutDirection } from '@/shared/utils/autoLayout';

// Anchor an edge to the direction-appropriate handle on each side so the tree
// reads with clear parent→child flow instead of every edge funnelling through
// one handle. Every node type exposes all four handles (top-target /
// bottom-source / left-target / right-source) and connectionMode is loose, so
// all four layout directions anchor cleanly — the edge leaves the parent's
// "downstream" side and enters the child's "upstream" side.
export const handlesForDirection = (
  dir: LayoutDirection
): { sourceHandle?: string; targetHandle?: string } => {
  switch (dir) {
    case 'TB':
      return { sourceHandle: 'bottom-source', targetHandle: 'top-target' };
    case 'BT':
      return { sourceHandle: 'top-target', targetHandle: 'bottom-source' };
    case 'LR':
      return { sourceHandle: 'right-source', targetHandle: 'left-target' };
    case 'RL':
      return { sourceHandle: 'left-target', targetHandle: 'right-source' };
    default:
      return {};
  }
};

export interface PinnedHandles {
  sourceHandle?: string | null;
  targetHandle?: string | null;
}

// CVS-335 endpoint hierarchy: per-edge pinned handle → auto-layout direction.
// A pinned handle survives reloads AND re-layouts; only un-pinned sides follow
// the current direction.
export const resolveEdgeHandles = (
  pinned: PinnedHandles,
  dir: LayoutDirection
): { sourceHandle?: string; targetHandle?: string } => {
  const dirHandles = handlesForDirection(dir);
  return {
    sourceHandle: pinned.sourceHandle ?? dirHandles.sourceHandle,
    targetHandle: pinned.targetHandle ?? dirHandles.targetHandle,
  };
};

export const isPinned = (pinned: PinnedHandles): boolean =>
  pinned.sourceHandle != null || pinned.targetHandle != null;
