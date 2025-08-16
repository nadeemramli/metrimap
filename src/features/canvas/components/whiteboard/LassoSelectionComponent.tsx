import { useReactFlow, useStore } from '@xyflow/react';
import { useRef, type PointerEvent } from 'react';

interface LassoSelectionProps {
  isActive: boolean;
  partial?: boolean; // Whether to select nodes partially or fully enclosed
  onSelection?: (nodeIds: string[], edgeIds: string[]) => void;
}

export function LassoSelectionComponent({
  isActive,
  partial = false,
  onSelection,
}: LassoSelectionProps) {
  const { setNodes, setEdges, flowToScreenPosition } = useReactFlow();
  const { width, height, nodeLookup, edgeLookup } = useStore((state) => ({
    width: state.width,
    height: state.height,
    nodeLookup: state.nodeLookup,
    edgeLookup: state.edgeLookup,
  }));

  const canvas = useRef<HTMLCanvasElement>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawing = useRef(false);
  const points = useRef<{ x: number; y: number }[]>([]);

  if (!isActive) {
    return null;
  }

  function handlePointerDown(e: PointerEvent) {
    if (!canvas.current) return;

    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    isDrawing.current = true;
    points.current = [{ x: e.clientX, y: e.clientY }];

    // Initialize canvas context
    if (!ctx.current) {
      ctx.current = canvas.current.getContext('2d');
    }

    if (ctx.current) {
      ctx.current.clearRect(0, 0, width, height);
      ctx.current.strokeStyle = '#3b82f6';
      ctx.current.fillStyle = 'rgba(59, 130, 246, 0.1)';
      ctx.current.lineWidth = 2;
      ctx.current.lineCap = 'round';
      ctx.current.lineJoin = 'round';
      ctx.current.beginPath();
      ctx.current.moveTo(e.clientX, e.clientY);
    }
  }

  function handlePointerMove(e: PointerEvent) {
    if (!isDrawing.current || !ctx.current) return;

    const point = { x: e.clientX, y: e.clientY };
    points.current.push(point);

    // Clear and redraw the entire lasso path
    ctx.current.clearRect(0, 0, width, height);

    if (points.current.length > 1) {
      // Draw the lasso outline
      ctx.current.beginPath();
      ctx.current.moveTo(points.current[0].x, points.current[0].y);

      for (let i = 1; i < points.current.length; i++) {
        ctx.current.lineTo(points.current[i].x, points.current[i].y);
      }

      // Close the path for fill
      ctx.current.closePath();
      ctx.current.fill();
      ctx.current.stroke();
    }
  }

  function handlePointerUp() {
    if (!isDrawing.current) return;

    isDrawing.current = false;

    // Find selected items
    const selectedNodeIds: string[] = [];
    const selectedEdgeIds: string[] = [];

    // Check nodes
    for (const node of nodeLookup.values()) {
      const { x: nodeX, y: nodeY } = node.internals.positionAbsolute;
      const { width: nodeWidth = 200, height: nodeHeight = 100 } =
        node.measured || {};

      const screenPos = flowToScreenPosition({ x: nodeX, y: nodeY });

      if (partial) {
        // Partial selection: any part of the node intersects with lasso
        if (isNodeIntersectingLasso(screenPos, nodeWidth, nodeHeight)) {
          selectedNodeIds.push(node.id);
        }
      } else {
        // Full selection: entire node must be inside lasso
        if (isNodeFullyInLasso(screenPos, nodeWidth, nodeHeight)) {
          selectedNodeIds.push(node.id);
        }
      }
    }

    // Check edges (simplified - check if edge midpoint is in lasso)
    for (const edge of edgeLookup.values()) {
      const sourceNode = nodeLookup.get(edge.source);
      const targetNode = nodeLookup.get(edge.target);

      if (sourceNode && targetNode) {
        const sourcePos = flowToScreenPosition(
          sourceNode.internals.positionAbsolute
        );
        const targetPos = flowToScreenPosition(
          targetNode.internals.positionAbsolute
        );

        const midpoint = {
          x: (sourcePos.x + targetPos.x) / 2,
          y: (sourcePos.y + targetPos.y) / 2,
        };

        if (isPointInPolygon(midpoint, points.current)) {
          selectedEdgeIds.push(edge.id);
        }
      }
    }

    // Apply selection
    if (selectedNodeIds.length > 0) {
      setNodes((nodes) =>
        nodes.map((node) => ({
          ...node,
          selected: selectedNodeIds.includes(node.id),
        }))
      );
    }

    if (selectedEdgeIds.length > 0) {
      setEdges((edges) =>
        edges.map((edge) => ({
          ...edge,
          selected: selectedEdgeIds.includes(edge.id),
        }))
      );
    }

    // Clear canvas after a delay to show the selection
    setTimeout(() => {
      if (ctx.current) {
        ctx.current.clearRect(0, 0, width, height);
      }
    }, 300);

    // Notify parent component
    if (
      onSelection &&
      (selectedNodeIds.length > 0 || selectedEdgeIds.length > 0)
    ) {
      onSelection(selectedNodeIds, selectedEdgeIds);
    }

    // Reset points
    points.current = [];
  }

  function isNodeIntersectingLasso(
    nodePos: { x: number; y: number },
    nodeWidth: number,
    nodeHeight: number
  ): boolean {
    // Check if any corner of the node is inside the lasso
    const corners = [
      nodePos,
      { x: nodePos.x + nodeWidth, y: nodePos.y },
      { x: nodePos.x + nodeWidth, y: nodePos.y + nodeHeight },
      { x: nodePos.x, y: nodePos.y + nodeHeight },
    ];

    return corners.some((corner) => isPointInPolygon(corner, points.current));
  }

  function isNodeFullyInLasso(
    nodePos: { x: number; y: number },
    nodeWidth: number,
    nodeHeight: number
  ): boolean {
    // Check if all corners of the node are inside the lasso
    const corners = [
      nodePos,
      { x: nodePos.x + nodeWidth, y: nodePos.y },
      { x: nodePos.x + nodeWidth, y: nodePos.y + nodeHeight },
      { x: nodePos.x, y: nodePos.y + nodeHeight },
    ];

    return corners.every((corner) => isPointInPolygon(corner, points.current));
  }

  // Ray casting algorithm to check if point is inside polygon
  function isPointInPolygon(
    point: { x: number; y: number },
    polygon: { x: number; y: number }[]
  ): boolean {
    if (polygon.length < 3) return false;

    let inside = false;
    let j = polygon.length - 1;

    for (let i = 0; i < polygon.length; i++) {
      const xi = polygon[i].x;
      const yi = polygon[i].y;
      const xj = polygon[j].x;
      const yj = polygon[j].y;

      if (
        yi > point.y !== yj > point.y &&
        point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi
      ) {
        inside = !inside;
      }
      j = i;
    }

    return inside;
  }

  return (
    <canvas
      ref={canvas}
      width={width}
      height={height}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: isActive ? 'auto' : 'none',
        cursor: isActive ? 'crosshair' : 'default',
        zIndex: 1003, // Higher z-index for lasso tool
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    />
  );
}

export default LassoSelectionComponent;
