import { useEffect, useRef } from 'react';
import { useCanvasStore } from '../stores';
import { useVersionHistoryStore } from '../stores/version-history/useVersionHistoryStore';

interface UseAutoSnapshotOptions {
  canvasId: string;
  enabled?: boolean;
  debounceMs?: number;
}

/**
 * Hook to automatically create canvas snapshots based on changes
 */
export function useAutoSnapshot({
  canvasId,
  enabled = true,
  debounceMs = 2000,
}: UseAutoSnapshotOptions) {
  const { checkAutoSnapshot, config } = useVersionHistoryStore();
  const { canvas } = useCanvasStore();

  const lastCheckTime = useRef<number>(0);
  const debounceTimer = useRef<NodeJS.Timeout>();
  const previousCanvasState = useRef<string>('');

  // Check for changes and trigger auto-snapshot if needed
  const checkForChanges = () => {
    if (!enabled || !config.autoSnapshotEnabled || !canvas) {
      return;
    }

    // Serialize current canvas state for comparison
    const currentState = JSON.stringify({
      nodes: canvas.nodes.map((n) => ({
        id: n.id,
        position: n.position,
        updatedAt: n.updatedAt,
      })),
      edges: canvas.edges.map((e) => ({
        id: e.id,
        updatedAt: e.updatedAt,
      })),
      groups: canvas.groups.map((g) => ({
        id: g.id,
        position: g.position,
        size: g.size,
      })),
    });

    // Check if state has changed
    if (currentState !== previousCanvasState.current) {
      previousCanvasState.current = currentState;

      // Debounce the auto-snapshot check
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        const now = Date.now();

        // Throttle checks to prevent excessive API calls
        if (
          now - lastCheckTime.current >
          config.changeThresholds.minTimeElapsed * 60 * 1000
        ) {
          lastCheckTime.current = now;
          checkAutoSnapshot(canvasId);
        }
      }, debounceMs);
    }
  };

  // Monitor canvas changes
  useEffect(() => {
    checkForChanges();
  }, [canvas?.nodes, canvas?.edges, canvas?.groups, canvas?.updatedAt]);

  // Periodic check for auto-snapshots
  useEffect(() => {
    if (!enabled || !config.autoSnapshotEnabled) {
      return;
    }

    const interval = setInterval(
      () => {
        checkAutoSnapshot(canvasId);
      },
      config.autoSnapshotInterval * 60 * 1000
    );

    return () => clearInterval(interval);
  }, [
    canvasId,
    config.autoSnapshotEnabled,
    config.autoSnapshotInterval,
    enabled,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return {
    isAutoSnapshotEnabled: config.autoSnapshotEnabled && enabled,
    nextCheckIn: config.autoSnapshotInterval,
  };
}
