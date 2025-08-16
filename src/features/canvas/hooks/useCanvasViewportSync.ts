import { useCallback, useRef } from 'react';

export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

/**
 * Enhanced viewport sync helper for ReactFlow canvas
 */
export function useCanvasViewportSync() {
  const viewportRef = useRef<Viewport>({ x: 0, y: 0, zoom: 1 });
  const reactFlowRef = useRef<any>(null);

  // Prevent bounce-backs when syncing
  const lastSyncRef = useRef<{
    source: 'reactflow' | null;
    timestamp: number;
  }>({
    source: null,
    timestamp: 0,
  });
  const SYNC_DEBOUNCE_MS = 50;

  const getViewport = useCallback(() => viewportRef.current, []);

  const updateViewport = useCallback((viewport: Viewport) => {
    viewportRef.current = viewport;
  }, []);

  // Set the React Flow instance reference
  const setReactFlowRef = useCallback((ref: any) => {
    reactFlowRef.current = ref;
  }, []);

  // Sync from React Flow to shared viewport state
  const syncFromReactFlow = useCallback(
    (viewport: Viewport) => {
      const now = Date.now();
      if (
        lastSyncRef.current.source === 'excalidraw' &&
        now - lastSyncRef.current.timestamp < SYNC_DEBOUNCE_MS
      ) {
        return;
      }
      updateViewport(viewport);
      lastSyncRef.current = { source: 'reactflow', timestamp: now };
    },
    [updateViewport]
  );

  // Update React Flow viewport
  const syncToReactFlow = useCallback(
    (viewport: Viewport) => {
      const now = Date.now();
      if (
        lastSyncRef.current.source === 'reactflow' &&
        now - lastSyncRef.current.timestamp < SYNC_DEBOUNCE_MS
      ) {
        return;
      }
      updateViewport(viewport);

      // Apply the viewport to React Flow if available
      if (reactFlowRef.current && reactFlowRef.current.setViewport) {
        try {
          reactFlowRef.current.setViewport(viewport, { duration: 0 });
        } catch (error) {
          console.warn('Failed to set React Flow viewport:', error);
        }
      }

      lastSyncRef.current = { source: 'reactflow', timestamp: now };
    },
    [updateViewport]
  );

  return {
    get viewport() {
      return viewportRef.current;
    },
    getViewport,
    updateViewport,
    setReactFlowRef,
    syncFromReactFlow,
    syncToReactFlow,
  };
}
