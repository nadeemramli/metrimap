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
  // State (not a ref) so the live preview actually re-renders while drawing.
  const [points, setPoints] = useState<InputPoint[]>([]);

  if (!isActive) return null;

  // Pointer position relative to the React Flow container (screen space).
  function toLocal(e: PointerEvent): InputPoint | null {
    const container = document.querySelector('.react-flow');
    if (!container) return null;
    const rect = container.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top];
  }

  function handlePointerDown(e: PointerEvent) {
    e.preventDefault();
    e.stopPropagation();
    const p = toLocal(e);
    if (!p) return;
    isDrawing.current = true;
    setPoints([p]);
  }

  function handlePointerMove(e: PointerEvent) {
    if (!isDrawing.current) return;
    const p = toLocal(e);
    if (!p) return;
    setPoints((prev) => [...prev, p]);
  }

  function handlePointerUp() {
    if (!isDrawing.current) {
      return;
    }
    isDrawing.current = false;

    const captured = points;
    setPoints([]);
    if (captured.length < 2) return;

    // Outline in screen space; its bounds include the stroke's variable width.
    const outline = getStrokeOutline(captured, brushSize);
    if (outline.length < 2) return;
    const bounds = boundsOf(outline);

    // Normalize the outline into a 0..100 viewBox so it renders crisply at any
    // node size (whiteboard-node draws freehand in a 100x100 viewBox, stretched
    // back to the node's width/height — so proportions are preserved).
    const normalized = outline.map(([x, y]) => [
      ((x - bounds.minX) / bounds.width) * 100,
      ((y - bounds.minY) / bounds.height) * 100,
    ]);
    const path = outlineToPath(normalized);

    const position = screenToFlowPosition({ x: bounds.minX, y: bounds.minY });

    onCommit?.({
      position,
      width: bounds.width,
      height: bounds.height,
      data: {
        shape: 'freehand',
        path,
        stroke: brushColor,
        width: bounds.width,
        height: bounds.height,
      },
    });
  }

  const previewPath = points.length > 1 ? outlineToPath(getStrokeOutline(points, brushSize)) : '';

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
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
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
