import { useMemo } from 'react';
import {
  Panel,
  useNodes,
  useReactFlow,
  useStore,
  useViewport,
} from '@xyflow/react';
import { ArrowRight } from 'lucide-react';

// Wayfinding (CVS-30): when the user pans/zooms so that NO node is in view, show
// an edge-anchored arrow pointing toward the nodes' centroid. Clicking it (or the
// Shift+1 shortcut wired in CanvasPage) fits the view back to the content.

const DEFAULT_W = 220;
const DEFAULT_H = 120;
const EDGE_PAD = 30;

export default function OffscreenNodeIndicator() {
  const nodes = useNodes();
  const { fitView } = useReactFlow();
  const { x, y, zoom } = useViewport();
  const width = useStore((s) => s.width);
  const height = useStore((s) => s.height);

  const indicator = useMemo(() => {
    if (!nodes.length || !width || !height) return null;

    // Current viewport in flow coordinates (screen = flow * zoom + pan).
    const xMin = -x / zoom;
    const xMax = (width - x) / zoom;
    const yMin = -y / zoom;
    const yMax = (height - y) / zoom;

    let anyVisible = false;
    let sumX = 0;
    let sumY = 0;
    for (const n of nodes) {
      const w = n.measured?.width ?? n.width ?? DEFAULT_W;
      const h = n.measured?.height ?? n.height ?? DEFAULT_H;
      const cx = n.position.x + w / 2;
      const cy = n.position.y + h / 2;
      sumX += cx;
      sumY += cy;
      if (cx >= xMin && cx <= xMax && cy >= yMin && cy <= yMax) anyVisible = true;
    }
    if (anyVisible) return null;

    // Project the centroid to screen, then anchor an arrow at the viewport edge
    // along the direction from the screen center to that point.
    const centroidX = sumX / nodes.length;
    const centroidY = sumY / nodes.length;
    const sx = centroidX * zoom + x;
    const sy = centroidY * zoom + y;
    const cxp = width / 2;
    const cyp = height / 2;
    const dx = sx - cxp;
    const dy = sy - cyp;
    if (dx === 0 && dy === 0) return null;

    const halfW = width / 2 - EDGE_PAD;
    const halfH = height / 2 - EDGE_PAD;
    const tx = Math.abs(dx) > 1e-3 ? halfW / Math.abs(dx) : Infinity;
    const ty = Math.abs(dy) > 1e-3 ? halfH / Math.abs(dy) : Infinity;
    const t = Math.min(tx, ty);

    return {
      left: cxp + dx * t,
      top: cyp + dy * t,
      angleDeg: (Math.atan2(dy, dx) * 180) / Math.PI,
      count: nodes.length,
    };
  }, [nodes, x, y, zoom, width, height]);

  if (!indicator) return null;

  return (
    <Panel
      position="top-left"
      className="pointer-events-none !inset-0 !m-0"
    >
      <button
        type="button"
        onClick={() => fitView({ padding: 0.2, duration: 800 })}
        aria-label={`${indicator.count} off-screen node${indicator.count === 1 ? '' : 's'} — return to your nodes`}
        title="Return to your nodes (Shift+1)"
        style={{ left: indicator.left, top: indicator.top }}
        className="pointer-events-auto absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full border border-border bg-primary px-2.5 py-1.5 text-primary-foreground shadow-lg outline-none transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowRight
          className="h-4 w-4"
          style={{ transform: `rotate(${indicator.angleDeg}deg)` }}
        />
        <span className="text-xs font-semibold tabular-nums">{indicator.count}</span>
      </button>
    </Panel>
  );
}
