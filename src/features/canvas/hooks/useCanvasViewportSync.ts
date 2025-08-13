import { createViewportSyncAppState } from '@/shared/utils/excalidrawDefaults';
import { useCallback, useRef } from 'react';

export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

/**
 * Enhanced viewport sync helper that synchronizes viewport between ReactFlow and Excalidraw
 */
export function useCanvasViewportSync() {
  const viewportRef = useRef<Viewport>({ x: 0, y: 0, zoom: 1 });
  const reactFlowRef = useRef<any>(null);

  // Prevent bounce-backs when syncing between canvases
  const lastSyncRef = useRef<{
    source: 'reactflow' | 'excalidraw' | null;
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

  // Sync from Excalidraw to React Flow
  const syncToReactFlow = useCallback(
    (viewport: Viewport) => {
      const now = Date.now();
      if (
        lastSyncRef.current.source === 'excalidraw' &&
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

  // Sync current React Flow viewport to Excalidraw
  const syncToExcalidraw = useCallback(
    (excalidrawRef: React.RefObject<any>) => {
      if (!excalidrawRef.current) return;

      const now = Date.now();
      if (
        lastSyncRef.current.source === 'reactflow' &&
        now - lastSyncRef.current.timestamp < SYNC_DEBOUNCE_MS
      ) {
        return;
      }

      try {
        const rfViewport = viewportRef.current;
        // Excalidraw scrollX/scrollY are opposite to React Flow x/y
        excalidrawRef.current.updateScene?.({
          appState: createViewportSyncAppState(
            -rfViewport.x,
            -rfViewport.y,
            rfViewport.zoom
          ),
        });
        lastSyncRef.current = { source: 'excalidraw', timestamp: now };
      } catch (error) {
        console.warn('Failed to sync viewport to Excalidraw:', error);
      }
    },
    []
  );

  // Extract viewport from Excalidraw and sync to React Flow
  const onExcalidrawMove = useCallback(
    (excalidrawRef: React.RefObject<any>) => {
      if (!excalidrawRef.current) return;
      try {
        const appState = excalidrawRef.current.getAppState?.();
        if (!appState) return;
        const viewport: Viewport = {
          x: -(appState.scrollX || 0),
          y: -(appState.scrollY || 0),
          zoom: appState.zoom?.value || 1,
        };
        syncToReactFlow(viewport);
      } catch (error) {
        console.warn('Failed to read Excalidraw viewport:', error);
      }
    },
    [syncToReactFlow]
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
    // Optional Excalidraw helpers
    syncToExcalidraw,
    onExcalidrawMove,
  };
}
