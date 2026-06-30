import { useReactFlow } from '@xyflow/react';
import { useRef, useState, type PointerEvent } from 'react';
import {
  boundsOf,
  getStrokeOutline,
  outlineToPath,
  type InputPoint,
} from '@/features/canvas/utils/freehand';

export interface FreehandDrawing {
  position: { x: number; y: number };
  width: number;
  height: number;
  data: {
    shape: 'freehand';
    path: string;
    stroke: string;
    width: number;
    height: number;
  };
}

interface FreehandDrawProps {
  isActive: boolean;
  brushSize?: number;
  brushColor?: string;
  /** Called once a stroke finishes, with a ready-to-persist whiteboard node. */
  onCommit?: (drawing: FreehandDrawing) => void;
}

export function FreehandDrawComponent({
  isActive,
  brushSize = 3,
  brushColor = '#000000',
  onCommit,
}: FreehandDrawProps) {
  const { screenToFlowPosition } = useReactFlow();
  const isDrawing = useRef(false);
  // Points are kept in CLIENT (page) coordinates so the preview maps 1:1 to a
  // fixed full-viewport overlay and screenToFlowPosition (which expects client
  // coords) converts correctly. State (not a ref) so the preview re-renders.
  const [points, setPoints] = useState<InputPoint[]>([]);

  if (!isActive) return null;

  function handlePointerDown(e: PointerEvent) {
    e.preventDefault();
    e.stopPropagation();
    isDrawing.current = true;
    setPoints([[e.clientX, e.clientY]]);
  }

  function handlePointerMove(e: PointerEvent) {
    if (!isDrawing.current) return;
    setPoints((prev) => [...prev, [e.clientX, e.clientY]]);
  }

  function handlePointerUp() {
    if (!isDrawing.current) return;
    isDrawing.current = false;

    const captured = points;
    setPoints([]);
    if (captured.length < 2) return;

    // Outline (incl. variable width) in client coords; its bounds frame the node.
    const outline = getStrokeOutline(captured, brushSize);
    if (outline.length < 2) return;
    const b = boundsOf(outline);

    // Convert both corners to flow space so position AND size are in flow units
    // (correct at any zoom — the old code sized the node in raw screen pixels).
    const topLeft = screenToFlowPosition({ x: b.minX, y: b.minY });
    const bottomRight = screenToFlowPosition({
      x: b.minX + b.width,
      y: b.minY + b.height,
    });
    const width = Math.max(bottomRight.x - topLeft.x, 1);
    const height = Math.max(bottomRight.y - topLeft.y, 1);

    // Normalize the outline into a 0..100 viewBox (whiteboard-node renders
    // freehand in a 100x100 viewBox stretched to width/height — proportions
    // are preserved because the node's aspect equals the client bounds' aspect).
    const path = outlineToPath(
      outline.map(([x, y]) => [
        ((x - b.minX) / b.width) * 100,
        ((y - b.minY) / b.height) * 100,
      ])
    );

    onCommit?.({
      position: topLeft,
      width,
      height,
      data: { shape: 'freehand', path, stroke: brushColor, width, height },
    });
  }

  const previewPath =
    points.length > 1 ? outlineToPath(getStrokeOutline(points, brushSize)) : '';

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'auto',
        cursor: 'crosshair',
        zIndex: 1002,
        touchAction: 'none',
        userSelect: 'none',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {previewPath && (
        <svg
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
          }}
        >
          <path d={previewPath} fill={brushColor} stroke="none" />
        </svg>
      )}
    </div>
  );
}

export default FreehandDrawComponent;
