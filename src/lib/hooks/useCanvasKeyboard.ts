/**
 * Canvas Keyboard and Navigation Handlers
 * Centralized keyboard shortcuts and navigation logic for the CanvasPage component
 */

import { useEffect, useRef } from "react";
import { useReactFlow } from "@xyflow/react";
import type { CanvasPageState } from "./useCanvasPageState";
import type { WhiteboardOverlayHandle } from "@/components/canvas/WhiteboardOverlay";

interface UseCanvasKeyboardProps {
  state: CanvasPageState;
}

export function useCanvasKeyboard({ state }: UseCanvasKeyboardProps) {
  const {
    zoomIn,
    zoomOut,
    setViewport: setFlowViewport,
    getViewport,
  } = useReactFlow() as any;

  // Spacebar to temporarily switch to Hand tool
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if focused on input elements
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.code === "Space" && !e.repeat) {
        e.preventDefault(); // Prevent page scroll
        state.prevNavigationToolRef.current = state.navigationTool;

        // In draw mode, enable passthrough so React Flow can pan while space is held
        if (state.toolbarMode === "draw") {
          state.setWbPassthrough(true);
        }

        state.setNavigationTool("hand");
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        state.setNavigationTool(state.prevNavigationToolRef.current);

        if (state.toolbarMode === "draw") {
          state.setWbPassthrough(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [state]);

  // Draw-mode hotkeys (match Excalidraw)
  useEffect(() => {
    if (state.toolbarMode !== "draw") return;

    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (
        tag === "input" ||
        tag === "textarea" ||
        (target as any)?.isContentEditable
      )
        return;

      let handled = true;
      switch (e.key.toLowerCase()) {
        case "q":
          state.setKeepToolActive((prev) => {
            const next = !prev;
            state.whiteboardRef.current?.setKeepToolActive(next);
            return next;
          });
          break;
        case "h":
          state.whiteboardRef.current?.setTool("hand");
          state.setDrawActiveTool("hand");
          break;
        case "v":
        case "1":
          state.whiteboardRef.current?.setTool("selection");
          state.setDrawActiveTool("selection");
          break;
        case "r":
        case "2":
          state.whiteboardRef.current?.setTool("rectangle");
          state.setDrawActiveTool("rectangle");
          break;
        case "d":
        case "3":
          state.whiteboardRef.current?.setTool("diamond");
          state.setDrawActiveTool("diamond");
          break;
        case "o":
        case "4":
          state.whiteboardRef.current?.setTool("ellipse");
          state.setDrawActiveTool("ellipse");
          break;
        case "a":
        case "5":
          state.whiteboardRef.current?.setTool("arrow");
          state.setDrawActiveTool("arrow");
          break;
        case "l":
        case "6":
          state.whiteboardRef.current?.setTool("line");
          state.setDrawActiveTool("line");
          break;
        case "p":
        case "7":
          state.whiteboardRef.current?.setTool("freedraw");
          state.setDrawActiveTool("freedraw");
          break;
        case "t":
        case "8":
          state.whiteboardRef.current?.setTool("text");
          state.setDrawActiveTool("text");
          break;
        case "9":
          state.whiteboardRef.current?.setTool("image");
          state.setDrawActiveTool("image");
          break;
        case "e":
        case "0":
          state.whiteboardRef.current?.setTool("eraser");
          state.setDrawActiveTool("eraser");
          break;
        default:
          handled = false;
      }

      if (handled) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener("keydown", handler, { capture: true });
    return () =>
      window.removeEventListener("keydown", handler, { capture: true } as any);
  }, [state]);

  // Optimized Shift+scroll zoom (works in both edit and draw modes)
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      // Only handle Shift+scroll, let React Flow handle regular scrolling
      if (!e.shiftKey) return;

      e.preventDefault();
      e.stopPropagation();

      try {
        // Use React Flow's smooth zoom functions (reversed for natural feel)
        if (e.deltaY < 0) {
          zoomOut?.({ duration: 150 }); // Scroll up = zoom out
          console.log("🔍 Scroll UP → Zoom OUT");
        } else {
          zoomIn?.({ duration: 150 }); // Scroll down = zoom in
          console.log("🔍 Scroll DOWN → Zoom IN");
        }
      } catch {
        // Fallback: manual smooth zooming
        const vp = getViewport?.();
        if (!vp) return;

        const factor = e.deltaY < 0 ? 0.85 : 1.15; // Reversed: scroll up = zoom out
        const nextZoom = Math.max(0.05, Math.min(3, vp.zoom * factor));

        // Smooth transition
        setFlowViewport?.(
          { x: vp.x, y: vp.y, zoom: nextZoom },
          { duration: 150 }
        );

        // Smooth zoom applied
      }
    };

    // Only attach to React Flow wrapper to avoid conflicts
    const rfWrapper = document.querySelector('[data-testid="rf__wrapper"]');
    if (rfWrapper) {
      rfWrapper.addEventListener("wheel", onWheel, { passive: false });
      return () => rfWrapper.removeEventListener("wheel", onWheel as any);
    }
  }, [zoomIn, zoomOut, setFlowViewport, getViewport]);

  return {
    // Keyboard shortcuts are handled via useEffect hooks
    // No explicit return needed as all handlers are event-based
  };
}
