import { useReactFlow, useViewport } from '@xyflow/react';
import { MousePointer2 } from 'lucide-react';
import { useEffect } from 'react';
import type { RemoteCursor } from '@/shared/hooks/useCanvasRealtime';

interface Props {
  cursors: RemoteCursor[];
  sendCursor: (x: number, y: number) => void;
}

/**
 * Renders other users' live cursors over the canvas and broadcasts the local
 * pointer position (in flow coordinates, throttled by the hook). Rendered
 * inside <ReactFlow> so it has the viewport context. Cursors are positioned in
 * flow space but drawn at constant screen size (we apply the viewport transform
 * manually rather than using ViewportPortal, which would scale them with zoom).
 */
export function CanvasCursorsLayer({ cursors, sendCursor }: Props) {
  const { x: vx, y: vy, zoom } = useViewport();
  const { screenToFlowPosition } = useReactFlow();

  useEffect(() => {
    const handler = (e: PointerEvent) => {
      const pos = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      sendCursor(pos.x, pos.y);
    };
    window.addEventListener('pointermove', handler);
    return () => window.removeEventListener('pointermove', handler);
  }, [screenToFlowPosition, sendCursor]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 5,
      }}
    >
      {cursors.map((c) => (
        <div
          key={c.userId}
          style={{
            position: 'absolute',
            left: c.x * zoom + vx,
            top: c.y * zoom + vy,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            willChange: 'left, top',
          }}
        >
          <MousePointer2
            className="h-4 w-4"
            style={{ color: c.color, fill: c.color }}
          />
          <span
            style={{
              background: c.color,
              color: 'white',
              fontSize: 11,
              lineHeight: '14px',
              padding: '1px 6px',
              borderRadius: 6,
              whiteSpace: 'nowrap',
              boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
            }}
          >
            {c.name}
          </span>
        </div>
      ))}
    </div>
  );
}

export default CanvasCursorsLayer;
