"use client";

import React, {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

// Lazy-load Excalidraw so the app can run even if the package isn't installed yet.
// When you install the dependency, also import its CSS once in your app root:
// import "@excalidraw/excalidraw/dist/excalidraw.css";
const Excalidraw = lazy(async () => {
  try {
    const moduleName = "@excalidraw/excalidraw";
    // Prevent Vite from resolving this at transform time if the package isn't installed yet
    const mod = await import(/* @vite-ignore */ moduleName as any);
    return { default: (mod as any).Excalidraw } as any;
  } catch (err) {
    console.warn(
      "@excalidraw/excalidraw not found. Install it to enable the whiteboard overlay.",
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
  // Optional safe area at top where the overlay should not intercept events/cover UI
  topOffset?: number; // pixels
}

export interface WhiteboardOverlayHandle {
  clear: () => void;
  exportPNG: () => Promise<Blob | null>;
  exportSVG: () => Promise<SVGSVGElement | null>;
  setTool: (
    tool:
      | "selection"
      | "hand"
      | "freedraw"
      | "rectangle"
      | "diamond"
      | "ellipse"
      | "arrow"
      | "line"
      | "text"
      | "image"
      | "eraser"
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
    zIndex = 6,
    viewport,
    initialData,
    onSceneChange,
    topOffset,
  },
  ref
) {
  const style = useMemo(
    () => ({
      position: "absolute" as const,
      // Leave room for top toolbar so it remains clickable while drawing
      top: isActive ? (topOffset ?? 56) : 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex,
      // Key: disable hit-testing when not drawing so React Flow is fully interactive
      pointerEvents: isActive ? ("auto" as const) : ("none" as const),
      // Ensure parent background shows through
      background: "transparent",
    }),
    [isActive, zIndex, topOffset]
  );

  const excalidrawRef = useRef<any>(null);
  const debounceRef = useRef<number | null>(null);

  // Expose export/clear via ref
  useImperativeHandle(ref, () => ({
    clear: () => {
      excalidrawRef.current?.resetScene?.();
    },
    exportPNG: async () => {
      try {
        const moduleName = "@excalidraw/excalidraw";
        const mod: any = await import(/* @vite-ignore */ moduleName as any);
        const api = excalidrawRef.current?.getSceneElements
          ? excalidrawRef.current
          : null;
        if (!api) return null;
        const elements = api.getSceneElements();
        const appState = api.getAppState();
        const files = api.getFiles?.() || undefined;
        const canvas = await mod.exportToCanvas({ elements, appState, files });
        return await new Promise<Blob | null>((resolve) =>
          canvas?.toBlob((b: Blob | null) => resolve(b))
        );
      } catch (e) {
        console.warn("Whiteboard exportPNG failed", e);
        return null;
      }
    },
    exportSVG: async () => {
      try {
        const moduleName = "@excalidraw/excalidraw";
        const mod: any = await import(/* @vite-ignore */ moduleName as any);
        const api = excalidrawRef.current?.getSceneElements
          ? excalidrawRef.current
          : null;
        if (!api) return null;
        const elements = api.getSceneElements();
        const appState = api.getAppState();
        const files = api.getFiles?.() || undefined;
        const svg = await mod.exportToSvg({ elements, appState, files });
        return svg as SVGSVGElement;
      } catch (e) {
        console.warn("Whiteboard exportSVG failed", e);
        return null;
      }
    },
    setTool: (tool) => {
      try {
        excalidrawRef.current?.setActiveTool?.({ type: tool });
      } catch {}
    },
    setKeepToolActive: (locked: boolean) => {
      try {
        const appState = excalidrawRef.current?.getAppState?.();
        const type = appState?.activeTool?.type || "selection";
        excalidrawRef.current?.setActiveTool?.({ type, locked });
      } catch {}
    },
    setStrokeColor: (hex: string) => {
      try {
        excalidrawRef.current?.updateScene?.({
          appState: { currentItemStrokeColor: hex },
        });
      } catch {}
    },
    setBackgroundColor: (hex: string) => {
      try {
        excalidrawRef.current?.updateScene?.({
          appState: { currentItemBackgroundColor: hex },
        });
      } catch {}
    },
    setStrokeWidth: (px: number) => {
      try {
        excalidrawRef.current?.updateScene?.({
          appState: { currentItemStrokeWidth: px },
        });
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
        viewBackgroundColor: "transparent",
      },
    });
  }, [viewport?.x, viewport?.y, viewport?.zoom]);

  // Debounced persistence
  const handleChange = (elements: any[], appState: any, files: any) => {
    if (!onSceneChange) return;
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      onSceneChange({ elements, appState, files });
    }, 500);
  };

  return (
    <div style={style} className={className}>
      <Suspense fallback={null}>
        <Excalidraw
          ref={excalidrawRef}
          initialData={
            initialData || { appState: { viewBackgroundColor: "transparent" } }
          }
          onChange={handleChange}
        />
      </Suspense>
    </div>
  );
});

export default WhiteboardOverlay;
