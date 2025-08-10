// Hook to synchronize viewport between React Flow and Excalidraw
// Ensures both canvases move together when panning/zooming

import { useCallback, useRef, useEffect } from "react";
import { useReactFlow } from "@xyflow/react";
import { createViewportSyncAppState } from "@/lib/utils/excalidrawDefaults";

export interface ViewportState {
  x: number;
  y: number;
  zoom: number;
}

export interface CanvasViewportSyncHook {
  // Current viewport state
  viewport: ViewportState;

  // Sync functions
  syncToExcalidraw: (excalidrawRef: React.RefObject<any>) => void;
  syncFromExcalidraw: (excalidrawViewport: ViewportState) => void;
  syncToReactFlow: (viewport: ViewportState) => void;

  // Event handlers
  onReactFlowMove: (event: any, viewport: ViewportState) => void;
  onExcalidrawMove: (excalidrawRef: React.RefObject<any>) => void;
}

export function useCanvasViewportSync(): CanvasViewportSyncHook {
  const { setViewport, getViewport } = useReactFlow();
  const lastSyncRef = useRef<{
    source: "reactflow" | "excalidraw" | null;
    timestamp: number;
  }>({
    source: null,
    timestamp: 0,
  });

  // Debounce to prevent infinite loops
  const SYNC_DEBOUNCE_MS = 50;

  const getCurrentViewport = useCallback((): ViewportState => {
    const current = getViewport();
    return {
      x: current.x,
      y: current.y,
      zoom: current.zoom,
    };
  }, [getViewport]);

  // Sync React Flow viewport to Excalidraw
  const syncToExcalidraw = useCallback(
    (excalidrawRef: React.RefObject<any>) => {
      if (!excalidrawRef.current) return;

      const now = Date.now();
      if (
        lastSyncRef.current.source === "reactflow" &&
        now - lastSyncRef.current.timestamp < SYNC_DEBOUNCE_MS
      ) {
        return; // Prevent bounce-back
      }

      try {
        const rfViewport = getViewport();

        // Convert React Flow viewport to Excalidraw format
        // Excalidraw scrollX/scrollY are opposite to React Flow x/y
        excalidrawRef.current.updateScene?.({
          appState: createViewportSyncAppState(
            -rfViewport.x, // Excalidraw scrollX = negative React Flow x
            -rfViewport.y, // Excalidraw scrollY = negative React Flow y
            rfViewport.zoom
          ),
        });

        lastSyncRef.current = { source: "excalidraw", timestamp: now };
      } catch (error) {
        console.warn("Failed to sync viewport to Excalidraw:", error);
      }
    },
    [getViewport]
  );

  // Sync Excalidraw viewport to React Flow
  const syncToReactFlow = useCallback(
    (viewport: ViewportState) => {
      const now = Date.now();
      if (
        lastSyncRef.current.source === "excalidraw" &&
        now - lastSyncRef.current.timestamp < SYNC_DEBOUNCE_MS
      ) {
        return; // Prevent bounce-back
      }

      try {
        setViewport(viewport, { duration: 0 }); // No animation for smooth sync
        lastSyncRef.current = { source: "reactflow", timestamp: now };
      } catch (error) {
        console.warn("Failed to sync viewport to React Flow:", error);
      }
    },
    [setViewport]
  );

  // Handle React Flow viewport changes
  const onReactFlowMove = useCallback((event: any, viewport: ViewportState) => {
    // This will be called by React Flow's onMove event
    // We'll use this to trigger sync to Excalidraw
  }, []);

  // Extract viewport from Excalidraw and sync to React Flow
  const syncFromExcalidraw = useCallback(
    (excalidrawViewport: ViewportState) => {
      syncToReactFlow(excalidrawViewport);
    },
    [syncToReactFlow]
  );

  // Get viewport from Excalidraw API
  const onExcalidrawMove = useCallback(
    (excalidrawRef: React.RefObject<any>) => {
      if (!excalidrawRef.current) return;

      try {
        const appState = excalidrawRef.current.getAppState?.();
        if (!appState) return;

        // Convert Excalidraw viewport to React Flow format
        // React Flow x/y are opposite to Excalidraw scrollX/scrollY
        const viewport: ViewportState = {
          x: -(appState.scrollX || 0), // React Flow x = negative Excalidraw scrollX
          y: -(appState.scrollY || 0), // React Flow y = negative Excalidraw scrollY
          zoom: appState.zoom?.value || 1,
        };

        syncFromExcalidraw(viewport);
      } catch (error) {
        console.warn("Failed to get Excalidraw viewport:", error);
      }
    },
    [syncFromExcalidraw]
  );

  return {
    viewport: getCurrentViewport(),
    syncToExcalidraw,
    syncFromExcalidraw,
    syncToReactFlow,
    onReactFlowMove,
    onExcalidrawMove,
  };
}
