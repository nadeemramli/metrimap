import '@/features/canvas/styles/excalidraw-custom.css';
import {
  createExcalidrawInitialData,
  sanitizeExcalidrawData,
} from '@/shared/utils/excalidrawDefaults';
import {
  forwardRef,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';

// Lazy-load Excalidraw so the app can run even if the package isn't installed yet.
// When you install the dependency, also import its CSS once in your app root:
// import '@excalidraw/excalidraw/dist/excalidraw.css';
const Excalidraw = lazy(async () => {
  try {
    const mod = await import('@excalidraw/excalidraw');
    return { default: mod.Excalidraw } as any;
  } catch (err) {
    console.warn(
      '@excalidraw/excalidraw not found. Install it to enable the whiteboard overlay.',
      err
    );
    // Fallback to a no-op component to avoid crashes during development
    return { default: () => null } as any;
  }
});

export interface WhiteboardOverlayProps {
  isActive: boolean;
  className?: string;
  zIndex?: number;
  // Sync viewport with React Flow
  viewport?: { x: number; y: number; zoom: number };
  // Initial scene data (persisted per canvas)
  initialData?: any;
  // Debounced scene change callback
  onSceneChange?: (scene: {
    elements: any[];
    appState: any;
    files?: any;
  }) => void;
  // Viewport change callback for syncing with React Flow
  onViewportChange?: (viewport: { x: number; y: number; zoom: number }) => void;
  // Optional safe area at top where the overlay should not intercept events/cover UI
  topOffset?: number; // pixels
  // When true, let pointer events pass through to the canvas beneath (used for temporary panning)
  passthrough?: boolean;
  // Optional wheel capture callback (attached at capture phase with passive: false)
  onWheelCapture?: (e: WheelEvent) => void;
}

export interface WhiteboardOverlayHandle {
  clear: () => void;
  exportPNG: () => Promise<Blob | null>;
  exportSVG: () => Promise<SVGSVGElement | null>;
  setTool: (
    tool:
      | 'selection'
      | 'hand'
      | 'freedraw'
      | 'rectangle'
      | 'diamond'
      | 'ellipse'
      | 'arrow'
      | 'line'
      | 'text'
      | 'image'
      | 'eraser'
  ) => void;
  setKeepToolActive: (locked: boolean) => void;
  setStrokeColor: (hex: string) => void;
  setBackgroundColor: (hex: string) => void;
  setStrokeWidth: (px: number) => void;
}

const WhiteboardOverlay = forwardRef<
  WhiteboardOverlayHandle,
  WhiteboardOverlayProps
>(function WhiteboardOverlay(
  {
    isActive,
    className,
    zIndex = 2,
    viewport,
    initialData,
    onSceneChange,
    onViewportChange,
    topOffset,
    passthrough,
    onWheelCapture,
  },
  ref
) {
  const style = useMemo(
    () => ({
      position: 'absolute' as const,
      // Leave room for top toolbar so it remains clickable while drawing
      top: isActive ? (topOffset ?? 56) : (topOffset ?? 56),
      left: 0,
      right: 0,
      bottom: 0,
      zIndex,
      // Key: disable hit-testing when not drawing OR when passthrough is enabled
      pointerEvents:
        isActive && !passthrough ? ('auto' as const) : ('none' as const),
      // Ensure toolbar and dropdowns above overlay remain clickable
      zIndex: isActive ? Math.max(zIndex, 2) : Math.max(zIndex, 1),
      // Ensure parent background shows through
      background: 'transparent',
    }),
    [isActive, zIndex, topOffset, passthrough]
  );

  const excalidrawRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<number | null>(null);
  const pendingActionsRef = useRef<Array<() => void>>([]);

  const flushPending = useCallback(() => {
    if (!excalidrawRef.current) return;
    const actions = pendingActionsRef.current;
    pendingActionsRef.current = [];
    for (const act of actions) {
      try {
        act();
      } catch {
        // ignore
      }
    }
  }, []);

  // Expose export/clear via ref
  useImperativeHandle(ref, () => ({
    clear: () => {
      excalidrawRef.current?.resetScene?.();
    },
    exportPNG: async () => {
      try {
        const mod = await import('@excalidraw/excalidraw');
        const api = excalidrawRef.current?.getSceneElements
          ? excalidrawRef.current
          : null;
        if (!api) return null;
        const elements = api.getSceneElements();
        const appState = api.getAppState();
        const files = api.getFiles?.() || undefined;
        const canvas = await mod.exportToCanvas({
          elements,
          appState,
          files,
        } as any);
        return await new Promise<Blob | null>((resolve) =>
          canvas?.toBlob((b: Blob | null) => resolve(b))
        );
      } catch (e) {
        console.warn('Whiteboard exportPNG failed', e);
        return null;
      }
    },
    exportSVG: async () => {
      try {
        const mod = await import('@excalidraw/excalidraw');
        const api = excalidrawRef.current?.getSceneElements
          ? excalidrawRef.current
          : null;
        if (!api) return null;
        const elements = api.getSceneElements();
        const appState = api.getAppState();
        const files = api.getFiles?.() || undefined;
        const svg = await mod.exportToSvg({ elements, appState, files } as any);
        return svg as SVGSVGElement;
      } catch (e) {
        console.warn('Whiteboard exportSVG failed', e);
        return null;
      }
    },
    setTool: (tool) => {
      const run = () => excalidrawRef.current?.setActiveTool?.({ type: tool });
      if (!excalidrawRef.current) {
        pendingActionsRef.current.push(run);
        return;
      }
      try {
        run();
      } catch {}
    },
    setKeepToolActive: (locked: boolean) => {
      const run = () => {
        const appState = excalidrawRef.current?.getAppState?.();
        const type = appState?.activeTool?.type || 'selection';
        excalidrawRef.current?.setActiveTool?.({ type, locked });
      };
      if (!excalidrawRef.current) {
        pendingActionsRef.current.push(run);
        return;
      }
      try {
        run();
      } catch {}
    },
    setStrokeColor: (hex: string) => {
      const run = () =>
        excalidrawRef.current?.updateScene?.({
          appState: { currentItemStrokeColor: hex },
        });
      if (!excalidrawRef.current) {
        pendingActionsRef.current.push(run);
        return;
      }
      try {
        run();
      } catch {}
    },
    setBackgroundColor: (hex: string) => {
      const run = () =>
        excalidrawRef.current?.updateScene?.({
          appState: { currentItemBackgroundColor: hex },
        });
      if (!excalidrawRef.current) {
        pendingActionsRef.current.push(run);
        return;
      }
      try {
        run();
      } catch {}
    },
    setStrokeWidth: (px: number) => {
      const run = () =>
        excalidrawRef.current?.updateScene?.({
          appState: { currentItemStrokeWidth: px },
        });
      if (!excalidrawRef.current) {
        pendingActionsRef.current.push(run);
        return;
      }
      try {
        run();
      } catch {}
    },
  }));

  // Sync viewport to Excalidraw appState
  useEffect(() => {
    if (!viewport || !excalidrawRef.current) return;
    const { x, y, zoom } = viewport;
    // Approximate mapping: React Flow translates by (x,y); Excalidraw scroll is inverse
    excalidrawRef.current.updateScene?.({
      appState: {
        scrollX: -x,
        scrollY: -y,
        zoom: { value: zoom },
        viewBackgroundColor: 'transparent',
      },
    });
  }, [viewport?.x, viewport?.y, viewport?.zoom]);

  // Track last viewport to prevent unnecessary updates
  const lastViewportRef = useRef<{ x: number; y: number; zoom: number } | null>(
    null
  );

  // Debounced persistence and viewport change detection
  const handleChange = (elements: any[], appState: any, files: any) => {
    // Ensure collaborators is always a Map before passing to callbacks
    if (
      appState &&
      (!appState.collaborators || !(appState.collaborators instanceof Map))
    ) {
      appState.collaborators = new Map();
    }

    // Handle scene changes
    if (onSceneChange) {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      debounceRef.current = window.setTimeout(() => {
        onSceneChange({ elements, appState, files });
      }, 500);
    }

    // Handle viewport changes with throttling to prevent infinite loops
    if (onViewportChange && appState) {
      const currentViewport = {
        x: -appState.scrollX || 0,
        y: -appState.scrollY || 0,
        zoom: appState.zoom?.value || 1,
      };

      // Only call onViewportChange if viewport has meaningfully changed
      const lastViewport = lastViewportRef.current;
      if (
        !lastViewport ||
        Math.abs(currentViewport.x - lastViewport.x) > 0.1 ||
        Math.abs(currentViewport.y - lastViewport.y) > 0.1 ||
        Math.abs(currentViewport.zoom - lastViewport.zoom) > 0.001
      ) {
        lastViewportRef.current = currentViewport;
        onViewportChange(currentViewport);
      }
    }
  };

  // Attach a wheel listener in capture phase so we can intercept Shift+wheel
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !onWheelCapture) return;
    const handler = (e: WheelEvent) => onWheelCapture(e);
    el.addEventListener('wheel', handler, {
      passive: false,
      capture: true,
    } as any);
    return () =>
      el.removeEventListener('wheel', handler as any, { capture: true } as any);
  }, [onWheelCapture]);

  return (
    <div ref={containerRef} style={style} className={className}>
      <Suspense fallback={null}>
        <Excalidraw
          ref={(api: any) => {
            if (!api) {
              excalidrawRef.current = null;
              return;
            }
            // Excalidraw exposes a readyPromise that resolves when imperative API is ready
            const ready = (api as any).readyPromise
              ?.then?.(() => api)
              ?.catch?.(() => api);
            if (ready && typeof (ready as any).then === 'function') {
              (ready as any).then((resolvedApi: any) => {
                excalidrawRef.current = resolvedApi || api;
                flushPending();
              });
            } else {
              excalidrawRef.current = api;
              flushPending();
            }
          }}
          initialData={
            initialData
              ? sanitizeExcalidrawData(initialData)
              : createExcalidrawInitialData()
          }
          onChange={handleChange}
          // Hide all Excalidraw UI - use only our custom toolbar
          UIOptions={{
            canvasActions: {
              changeViewBackgroundColor: false,
              clearCanvas: false,
              export: false,
              loadScene: false,
              saveToActiveFile: false,
              toggleTheme: false,
              saveAsImage: false,
            },
            tools: {
              image: false,
            },
          }}
          // Hide the main menu, help dialog, etc.
          renderTopRightUI={() => null}
          renderFooter={() => null}
          onChangeCapture={() => flushPending()}
        />
      </Suspense>
    </div>
  );
});

export default WhiteboardOverlay;
