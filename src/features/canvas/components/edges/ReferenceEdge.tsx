/**
 * Reference Edge Component
 * Represents reference connections for Evidence, Metadata, and Comments
 */

import { memo } from 'react';
import { EdgeProps, getSmoothStepPath, EdgeLabelRenderer, BaseEdge } from '@xyflow/react';
import { FileText, Tag, MessageCircle, Link } from 'lucide-react';

interface ReferenceEdgeData {
  label?: string;
  sourceType?: string;
  targetType?: string;
  [key: string]: unknown;
}

interface ReferenceEdgeProps extends EdgeProps {
  data?: ReferenceEdgeData;
}

const ReferenceEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: ReferenceEdgeProps) => {
  const label = data?.label || 'Reference';
  const sourceType = data?.sourceType;

  // Calculate the path
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Get icon and color based on source type
  const getIconAndColor = () => {
    switch (sourceType) {
      case 'evidenceNode':
        return {
          icon: <FileText className="w-3 h-3" />,
          color: '#8b5cf6', // Purple
        };
      case 'metadataNode':
        return {
          icon: <Tag className="w-3 h-3" />,
          color: '#f59e0b', // Amber
        };
      case 'commentNode':
        return {
          icon: <MessageCircle className="w-3 h-3" />,
          color: '#06b6d4', // Cyan
        };
      default:
        return {
          icon: <Link className="w-3 h-3" />,
          color: '#6b7280', // Gray
        };
    }
  };

  const { icon, color } = getIconAndColor();

  // Edge styling
  const edgeStyle = {
    stroke: selected ? '#2563eb' : color,
    strokeWidth: selected ? 2 : 1.5,
    strokeDasharray: '2,3',
    opacity: selected ? 1 : 0.7,
    transition: 'all 0.2s ease-in-out',
  };

  return (
    <>
      {/* Main Edge Path */}
      <BaseEdge
        path={edgePath}
        style={edgeStyle}
      />

      {/* Edge Label */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <div
            className={`
              flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
              border shadow-sm bg-white
              ${selected 
                ? 'border-blue-500 text-blue-700' 
                : 'border-gray-200 text-gray-600'
              }
              hover:shadow-md transition-all duration-200
            `}
            style={{
              borderColor: selected ? '#2563eb' : color,
              color: selected ? '#2563eb' : color,
            }}
          >
            {icon}
            <span>{label}</span>
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
});

ReferenceEdge.displayName = 'ReferenceEdge';

export default ReferenceEdge;
