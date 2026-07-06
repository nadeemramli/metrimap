import { useReactFlow } from '@xyflow/react';
import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Draw-mode tool overlays render as siblings of React Flow's `.react-flow__
 * renderer` (where its d3-zoom wheel listener lives), and they sit on top with
 * `pointer-events: auto` — so a wheel over an active tool never reaches React
 * Flow, and Ctrl+scroll falls through to the browser (page zoom) while plain
 * scroll does nothing. This wrapper catches the wheel via a NATIVE, non-passive
 * listener (React's onWheel is passive and can't preventDefault) and drives the
 * canvas pan/zoom directly, so navigation works with any drawing tool active.
 *
 * The wrapper itself is `pointer-events: none` (it never blocks drawing); its
 * children keep their own `pointer-events: auto`. Wheel events on those children
 * bubble to this element's native listener.
 */
export function DrawWheelZoom({ children }: { children: ReactNode }) {
  const rf = useReactFlow();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const { x, y, zoom } = rf.getViewport();
      const rect = el.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;

      if (e.ctrlKey || e.metaKey) {
        // Zoom toward the cursor (keep the point under the pointer fixed).
        const factor = Math.exp(-e.deltaY * 0.0015);
        const nextZoom = Math.min(3, Math.max(0.05, zoom * factor));
        const fx = (px - x) / zoom;
        const fy = (py - y) / zoom;
        rf.setViewport({
          x: px - fx * nextZoom,
          y: py - fy * nextZoom,
          zoom: nextZoom,
        });
      } else {
        // Pan (matches React Flow's scroll-to-pan in the other modes).
        rf.setViewport({ x: x - e.deltaX, y: y - e.deltaY, zoom });
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [rf]);

  return (
    <div ref={ref} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {children}
    </div>
  );
}

export default DrawWheelZoom;
