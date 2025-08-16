import { useReactFlow } from '@xyflow/react';
import { useState, type PointerEvent } from 'react';

interface RectangleToolProps {
  isActive: boolean;
  onRectangleCreate?: (rectangle: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => void;
}

export function RectangleToolComponent({
  isActive,
  onRectangleCreate,
}: RectangleToolProps) {
  const { addNodes, screenToFlowPosition } = useReactFlow();
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const [currentRect, setCurrentRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  if (!isActive) {
    return null;
  }

  function handlePointerDown(e: PointerEvent) {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setStartPoint({ x, y });
    setCurrentRect({ x, y, width: 0, height: 0 });
  }

  function handlePointerMove(e: PointerEvent) {
    if (!isDrawing || !startPoint) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const width = currentX - startPoint.x;
    const height = currentY - startPoint.y;

    setCurrentRect({
      x: width < 0 ? currentX : startPoint.x,
      y: height < 0 ? currentY : startPoint.y,
      width: Math.abs(width),
      height: Math.abs(height),
    });
  }

  function handlePointerUp() {
    if (!isDrawing || !currentRect || !startPoint) return;

    setIsDrawing(false);

    // Only create rectangle if it has meaningful size
    if (currentRect.width > 10 && currentRect.height > 10) {
      // Convert screen coordinates to flow coordinates
      const flowPosition = screenToFlowPosition({
        x: currentRect.x,
        y: currentRect.y,
      });

      // Create a new rectangle node
      const rectangleNode = {
        id: `rectangle-${Date.now()}`,
        type: 'whiteboardNode',
        position: flowPosition,
        data: {
          shape: 'rectangle',
          width: currentRect.width,
          height: currentRect.height,
          fill: 'rgba(59, 130, 246, 0.1)',
          stroke: '#3b82f6',
          strokeWidth: 2,
        },
        style: {
          width: currentRect.width,
          height: currentRect.height,
        },
      };

      addNodes([rectangleNode]);

      // Notify parent component
      if (onRectangleCreate) {
        onRectangleCreate({
          x: flowPosition.x,
          y: flowPosition.y,
          width: currentRect.width,
          height: currentRect.height,
        });
      }
    }

    // Reset state
    setStartPoint(null);
    setCurrentRect(null);
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
        zIndex: 1004, // Higher z-index for rectangle tool
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Preview rectangle while drawing */}
      {isDrawing && currentRect && (
        <div
          style={{
            position: 'absolute',
            left: currentRect.x,
            top: currentRect.y,
            width: currentRect.width,
            height: currentRect.height,
            border: '2px solid #3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}

export default RectangleToolComponent;
