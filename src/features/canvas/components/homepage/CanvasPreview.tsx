import { useMemo } from 'react';

interface CanvasPreviewProps {
  nodes: any[];
  edges: any[];
  onClick?: () => void;
  className?: string;
}

export function CanvasPreview({
  nodes,
  edges,
  onClick,
  className = '',
}: CanvasPreviewProps) {
  const nodePositions = useMemo(() => {
    return nodes.map((node, index) => {
      return {
        id: node.id,
        x: (index % 3) * 40 + 20,
        y: Math.floor(index / 3) * 30 + 20,
        title:
          node.data?.card?.title || node.data?.title || node.title || 'Metric',
        category:
          node.data?.card?.category ||
          node.data?.category ||
          node.category ||
          'Data/Metric',
      };
    });
  }, [nodes]);

  const edgeLines = useMemo(() => {
    return edges
      .map((edge: any) => {
        const sourceId = edge.sourceId || edge.source;
        const targetId = edge.targetId || edge.target;
        const sourceNode = nodePositions.find((n) => n.id === sourceId);
        const targetNode = nodePositions.find((n) => n.id === targetId);
        if (!sourceNode || !targetNode) return null;

        return {
          id: edge.id,
          x1: sourceNode.x + 15,
          y1: sourceNode.y + 15,
          x2: targetNode.x + 15,
          y2: targetNode.y + 15,
        };
      })
      .filter((edge): edge is NonNullable<typeof edge> => edge !== null);
  }, [edges, nodePositions]);

  if (nodes.length === 0) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center ${className}`}
      >
        <div className="text-center text-muted-foreground">
          <div className="w-8 h-8 mx-auto mb-2 bg-muted rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <p className="text-xs">Canvas Preview</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full h-full relative ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Nodes */}
      {nodePositions.map((node) => (
        <div
          key={node.id}
          className="absolute w-6 h-6 bg-primary/80 rounded-sm border border-primary/20 flex items-center justify-center text-white text-xs font-medium shadow-sm"
          style={{
            left: `${node.x}px`,
            top: `${node.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
          title={node.title}
        >
          {node.category === 'Data/Metric'
            ? '📊'
            : node.category === 'Core/Value'
              ? '🎯'
              : node.category === 'Work/Action'
                ? '⚡'
                : node.category === 'Ideas/Hypothesis'
                  ? '💡'
                  : '📄'}
        </div>
      ))}

      {/* Edges */}
      {edgeLines.map((edge) => (
        <svg
          key={edge.id}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: -1 }}
        >
          <line
            x1={edge.x1}
            y1={edge.y1}
            x2={edge.x2}
            y2={edge.y2}
            stroke="#888"
            strokeWidth="1"
            opacity="0.6"
          />
        </svg>
      ))}
    </div>
  );
}
