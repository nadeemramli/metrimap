import { useReactFlow, useStore } from '@xyflow/react';
import { useRef, type PointerEvent } from 'react';

interface EraseToolProps {
  isActive: boolean;
  onErase?: (nodeIds: string[], edgeIds: string[]) => void;
}

export function EraseToolComponent({ isActive, onErase }: EraseToolProps) {
  const { setNodes, setEdges, flowToScreenPosition } = useReactFlow();
  const { width, height, nodeLookup, edgeLookup } = useStore((state) => ({
    width: state.width,
    height: state.height,
    nodeLookup: state.nodeLookup,
    edgeLookup: state.edgeLookup,
  }));

  const canvas = useRef<HTMLCanvasElement>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const isErasing = useRef(false);
  const erasedItems = useRef<{ nodeIds: Set<string>; edgeIds: Set<string> }>({
    nodeIds: new Set(),
    edgeIds: new Set(),
  });

  if (!isActive) {
    return null;
  }

  function handlePointerDown(e: PointerEvent) {
    if (!canvas.current) return;

    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    isErasing.current = true;
    erasedItems.current = { nodeIds: new Set(), edgeIds: new Set() };

    // Initialize canvas context
    if (!ctx.current) {
      ctx.current = canvas.current.getContext('2d');
    }

    if (ctx.current) {
      ctx.current.clearRect(0, 0, width, height);
      // Don't draw anything - eraser should only show cursor and erase elements
    }

    checkForIntersections(e.clientX, e.clientY);
  }

  function handlePointerMove(e: PointerEvent) {
    if (!isErasing.current) return;

    // Only check for intersections, don't draw anything
    checkForIntersections(e.clientX, e.clientY);
  }

  function handlePointerUp() {
    if (!isErasing.current) return;

    isErasing.current = false;

    // Apply erasure - mark items as toBeDeleted
    const nodeIds = Array.from(erasedItems.current.nodeIds);
    const edgeIds = Array.from(erasedItems.current.edgeIds);

    if (nodeIds.length > 0) {
      setNodes((nodes) =>
        nodes.map((node) =>
          nodeIds.includes(node.id)
            ? { ...node, data: { ...node.data, toBeDeleted: true } }
            : node
        )
      );
    }

    if (edgeIds.length > 0) {
      setEdges((edges) =>
        edges.map((edge) =>
          edgeIds.includes(edge.id)
            ? { ...edge, data: { ...edge.data, toBeDeleted: true } }
            : edge
        )
      );
    }

    // No need to clear canvas since we're not drawing anything

    // Notify parent component
    if (onErase && (nodeIds.length > 0 || edgeIds.length > 0)) {
      onErase(nodeIds, edgeIds);
    }

    // Reset erased items
    erasedItems.current = { nodeIds: new Set(), edgeIds: new Set() };
  }

  function checkForIntersections(x: number, y: number) {
    const eraserRadius = 10; // Half of lineWidth

    // Check nodes
    for (const node of nodeLookup.values()) {
      if (erasedItems.current.nodeIds.has(node.id)) continue;

      const { x: nodeX, y: nodeY } = node.internals.positionAbsolute;
      const { width: nodeWidth = 200, height: nodeHeight = 100 } =
        node.measured || {};

      // Convert screen coordinates to flow coordinates
      const screenPos = flowToScreenPosition({ x: nodeX, y: nodeY });

      // Check if eraser intersects with node bounds
      if (
        x >= screenPos.x - eraserRadius &&
        x <= screenPos.x + nodeWidth + eraserRadius &&
        y >= screenPos.y - eraserRadius &&
        y <= screenPos.y + nodeHeight + eraserRadius
      ) {
        erasedItems.current.nodeIds.add(node.id);
      }
    }

    // Check edges (simplified - check if eraser is near edge path)
    for (const edge of edgeLookup.values()) {
      if (erasedItems.current.edgeIds.has(edge.id)) continue;

      const sourceNode = nodeLookup.get(edge.source);
      const targetNode = nodeLookup.get(edge.target);

      if (sourceNode && targetNode) {
        const sourcePos = flowToScreenPosition(
          sourceNode.internals.positionAbsolute
        );
        const targetPos = flowToScreenPosition(
          targetNode.internals.positionAbsolute
        );

        // Simple line intersection check
        const distance = distanceToLineSegment({ x, y }, sourcePos, targetPos);

        if (distance < eraserRadius) {
          erasedItems.current.edgeIds.add(edge.id);
        }
      }
    }
  }

  // Helper function to calculate distance from point to line segment
  function distanceToLineSegment(
    point: { x: number; y: number },
    lineStart: { x: number; y: number },
    lineEnd: { x: number; y: number }
  ): number {
    const A = point.x - lineStart.x;
    const B = point.y - lineStart.y;
    const C = lineEnd.x - lineStart.x;
    const D = lineEnd.y - lineStart.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq !== 0) {
      param = dot / lenSq;
    }

    let xx, yy;

    if (param < 0) {
      xx = lineStart.x;
      yy = lineStart.y;
    } else if (param > 1) {
      xx = lineEnd.x;
      yy = lineEnd.y;
    } else {
      xx = lineStart.x + param * C;
      yy = lineStart.y + param * D;
    }

    const dx = point.x - xx;
    const dy = point.y - yy;
    return Math.sqrt(dx * dx + dy * dy);
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
        cursor: isActive
          ? "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Ccircle cx='10' cy='10' r='8' fill='none' stroke='%23ff4444' stroke-width='2'/%3E%3C/svg%3E\") 10 10, auto"
          : 'default',
        zIndex: 1001, // Higher z-index for eraser tool
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    />
  );
}

export default EraseToolComponent;
