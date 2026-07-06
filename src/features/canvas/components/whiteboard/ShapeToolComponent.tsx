import { useReactFlow } from '@xyflow/react';
import { useRef, useState, type PointerEvent } from 'react';

export type ShapeKind = 'rectangle' | 'ellipse' | 'line' | 'arrow';

export interface ShapeStyle {
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export interface ShapeDrawing {
  position: { x: number; y: number };
  width: number;
  height: number;
  // Ready-to-persist whiteboard node data (shape descriptor).
  data: Record<string, unknown> & { shape: ShapeKind };
}

interface ShapeToolProps {
  isActive: boolean;
  shape: ShapeKind;
  style: ShapeStyle;
  /** Called once a shape finishes, with a ready-to-persist whiteboard node. */
  onCommit?: (drawing: ShapeDrawing) => void;
}

const isLineKind = (s: ShapeKind) => s === 'line' || s === 'arrow';
const MIN_DRAG = 8; // px — ignore accidental taps

/**
 * Drag-to-draw overlay for the box (rectangle/ellipse) and line (line/arrow)
 * whiteboard shapes. Mirrors FreehandDrawComponent: points are captured in
 * CLIENT coords (so screenToFlowPosition converts correctly) and the preview is
 * a fixed full-viewport SVG. On pointer-up it emits a flow-space position+size
 * plus the shape's node data; line shapes also emit normalized 0..100 endpoints
 * so drag direction is preserved by the renderer.
 */
export function ShapeToolComponent({
  isActive,
  shape,
  style,
  onCommit,
}: ShapeToolProps) {
  const { screenToFlowPosition } = useReactFlow();
  const drawing = useRef(false);
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);
  const [curr, setCurr] = useState<{ x: number; y: number } | null>(null);

  if (!isActive) return null;

  const onDown = (e: PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    drawing.current = true;
    setStart({ x: e.clientX, y: e.clientY });
    setCurr({ x: e.clientX, y: e.clientY });
  };

  const onMove = (e: PointerEvent) => {
    if (!drawing.current) return;
    setCurr({ x: e.clientX, y: e.clientY });
  };

  const onUp = () => {
    if (!drawing.current || !start || !curr) return;
    drawing.current = false;
    const s = start;
    const c = curr;
    setStart(null);
    setCurr(null);

    if (isLineKind(shape)) {
      if (Math.hypot(c.x - s.x, c.y - s.y) < MIN_DRAG) return;
      // Pad the bounding box so purely horizontal/vertical lines still get a
      // renderable (non-zero) box; endpoints normalize into that padded box.
      const PAD = 6;
      const bx = Math.min(s.x, c.x) - PAD;
      const by = Math.min(s.y, c.y) - PAD;
      const bw = Math.abs(c.x - s.x) + PAD * 2;
      const bh = Math.abs(c.y - s.y) + PAD * 2;
      const tl = screenToFlowPosition({ x: bx, y: by });
      const br = screenToFlowPosition({ x: bx + bw, y: by + bh });
      const width = Math.max(br.x - tl.x, 1);
      const height = Math.max(br.y - tl.y, 1);
      const norm = (p: { x: number; y: number }) => ({
        x: ((p.x - bx) / bw) * 100,
        y: ((p.y - by) / bh) * 100,
      });
      onCommit?.({
        position: tl,
        width,
        height,
        data: {
          shape,
          width,
          height,
          stroke: style.stroke,
          strokeWidth: style.strokeWidth,
          points: [norm(s), norm(c)],
        },
      });
      return;
    }

    // Box shapes (rectangle / ellipse)
    const minX = Math.min(s.x, c.x);
    const minY = Math.min(s.y, c.y);
    const w = Math.abs(c.x - s.x);
    const h = Math.abs(c.y - s.y);
    if (w < MIN_DRAG || h < MIN_DRAG) return;
    const tl = screenToFlowPosition({ x: minX, y: minY });
    const br = screenToFlowPosition({ x: minX + w, y: minY + h });
    const width = Math.max(br.x - tl.x, 1);
    const height = Math.max(br.y - tl.y, 1);
    onCommit?.({
      position: tl,
      width,
      height,
      data: {
        shape,
        width,
        height,
        fill: style.fill,
        stroke: style.stroke,
        strokeWidth: style.strokeWidth,
      },
    });
  };

  const renderPreview = () => {
    if (!start || !curr) return null;
    if (isLineKind(shape)) {
      return (
        <line
          x1={start.x}
          y1={start.y}
          x2={curr.x}
          y2={curr.y}
          stroke={style.stroke}
          strokeWidth={style.strokeWidth}
          strokeLinecap="round"
        />
      );
    }
    const minX = Math.min(start.x, curr.x);
    const minY = Math.min(start.y, curr.y);
    const w = Math.abs(curr.x - start.x);
    const h = Math.abs(curr.y - start.y);
    if (shape === 'ellipse') {
      return (
        <ellipse
          cx={minX + w / 2}
          cy={minY + h / 2}
          rx={w / 2}
          ry={h / 2}
          fill={style.fill}
          stroke={style.stroke}
          strokeWidth={style.strokeWidth}
        />
      );
    }
    return (
      <rect
        x={minX}
        y={minY}
        width={w}
        height={h}
        rx={6}
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth}
      />
    );
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'auto',
        cursor: 'crosshair',
        zIndex: 1004,
        touchAction: 'none',
        userSelect: 'none',
      }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={onUp}
    >
      {start && curr && (
        <svg
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
          }}
        >
          {renderPreview()}
        </svg>
      )}
    </div>
  );
}

export default ShapeToolComponent;
