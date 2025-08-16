import { useReactFlow } from '@xyflow/react';
import { useRef, type PointerEvent } from 'react';

interface FreehandDrawProps {
  isActive: boolean;
  brushSize?: number;
  brushColor?: string;
  onPathCreate?: (path: string) => void;
}

export function FreehandDrawComponent({
  isActive,
  brushSize = 3,
  brushColor = '#000000',
  onPathCreate,
}: FreehandDrawProps) {
  const { addNodes, screenToFlowPosition } = useReactFlow();
  const isDrawing = useRef(false);
  const points = useRef<{ x: number; y: number }[]>([]);
  const pathBounds = useRef<{
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  } | null>(null);

  console.log('🎨 FreehandDrawComponent render:', {
    isActive,
    brushSize,
    brushColor,
  });

  if (!isActive) {
    return null;
  }

  function handlePointerDown(e: PointerEvent) {
    console.log('🎨 FreehandDraw: Pointer down', { isActive });
    e.preventDefault();
    e.stopPropagation();

    // Get the ReactFlow container bounds
    const reactFlowContainer = document.querySelector('.react-flow');
    if (!reactFlowContainer) return;

    const rect = reactFlowContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    console.log('🎨 Drawing at coordinates:', {
      x,
      y,
      clientX: e.clientX,
      clientY: e.clientY,
    });

    isDrawing.current = true;
    points.current = [{ x, y }];
    pathBounds.current = { minX: x, minY: y, maxX: x, maxY: y };
  }

  function handlePointerMove(e: PointerEvent) {
    if (!isDrawing.current) return;

    // Get the ReactFlow container bounds
    const reactFlowContainer = document.querySelector('.react-flow');
    if (!reactFlowContainer) return;

    const rect = reactFlowContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    points.current.push({ x, y });

    // Update bounds
    if (pathBounds.current) {
      pathBounds.current.minX = Math.min(pathBounds.current.minX, x);
      pathBounds.current.minY = Math.min(pathBounds.current.minY, y);
      pathBounds.current.maxX = Math.max(pathBounds.current.maxX, x);
      pathBounds.current.maxY = Math.max(pathBounds.current.maxY, y);
    }
  }

  function handlePointerUp() {
    if (!isDrawing.current || points.current.length < 2) {
      isDrawing.current = false;
      points.current = [];
      pathBounds.current = null;
      return;
    }

    isDrawing.current = false;

    // Convert points to SVG path
    const svgPath = pointsToSVGPath(points.current);

    if (pathBounds.current && svgPath) {
      // Convert screen coordinates to flow coordinates
      const flowPosition = screenToFlowPosition({
        x: pathBounds.current.minX,
        y: pathBounds.current.minY,
      });

      const width = pathBounds.current.maxX - pathBounds.current.minX;
      const height = pathBounds.current.maxY - pathBounds.current.minY;

      // Adjust path coordinates to be relative to the node position and scale to viewBox
      const adjustedPoints = points.current.map((point) => ({
        x: ((point.x - pathBounds.current!.minX) / width) * 100,
        y: ((point.y - pathBounds.current!.minY) / height) * 100,
      }));
      const adjustedPath = pointsToSVGPath(adjustedPoints);

      // Create a new freehand drawing node
      const drawingNode = {
        id: `freehand-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'whiteboardNode',
        position: flowPosition,
        data: {
          shape: 'freehand' as const,
          path: adjustedPath,
          stroke: brushColor,
          strokeWidth: brushSize,
          fill: 'none',
          width,
          height,
        },
        style: {
          width: Math.max(width, 50),
          height: Math.max(height, 50),
        },
        draggable: true,
        selectable: true,
      };

      console.log('🎨 Creating freehand drawing node:', drawingNode);
      addNodes([drawingNode]);

      // Notify parent component
      if (onPathCreate) {
        onPathCreate(svgPath);
      }
    }

    // Reset state
    points.current = [];
    pathBounds.current = null;
  }

  function pointsToSVGPath(points: { x: number; y: number }[]): string {
    if (points.length < 2) return '';

    let path = `M ${points[0].x} ${points[0].y}`;

    // Use quadratic curves for smoother lines
    for (let i = 1; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const controlX = (current.x + next.x) / 2;
      const controlY = (current.y + next.y) / 2;

      path += ` Q ${current.x} ${current.y} ${controlX} ${controlY}`;
    }

    // Add the last point
    if (points.length > 1) {
      const lastPoint = points[points.length - 1];
      path += ` L ${lastPoint.x} ${lastPoint.y}`;
    }

    return path;
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: isActive ? 'auto' : 'none',
        cursor: isActive ? 'crosshair' : 'default',
        zIndex: 1002, // Higher z-index for freehand tool
        touchAction: 'none', // Prevent browser touch handling
        userSelect: 'none', // Prevent text selection
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Live preview while drawing */}
      {isDrawing.current && points.current.length > 1 && (
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
          <path
            d={pointsToSVGPath(points.current)}
            stroke={brushColor}
            strokeWidth={brushSize}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}

export default FreehandDrawComponent;
