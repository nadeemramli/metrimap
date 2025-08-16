/**
 * Data Flow Edge Component
 * Represents data pipeline connections between Source → Operator → Metric → Chart nodes
 */

import { memo } from 'react';
import { EdgeProps, getBezierPath, EdgeLabelRenderer, BaseEdge } from '@xyflow/react';
import { Database, ArrowRight, BarChart3, Settings } from 'lucide-react';

interface DataFlowEdgeData {
  label?: string;
  sourceType?: string;
  targetType?: string;
  isActive?: boolean;
  [key: string]: unknown;
}

interface DataFlowEdgeProps extends EdgeProps {
  data?: DataFlowEdgeData;
}

const DataFlowEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: DataFlowEdgeProps) => {
  const isActive = data?.isActive ?? false;
  const label = data?.label || 'Data Flow';

  // Calculate the path
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Get icon based on connection type
  const getIcon = () => {
    const sourceType = data?.sourceType;
    const targetType = data?.targetType;

    if (sourceType === 'sourceNode') {
      return <Database className="w-3 h-3" />;
    }
    if (sourceType === 'operatorNode') {
      return <Settings className="w-3 h-3" />;
    }
    if (targetType === 'chartNode') {
      return <BarChart3 className="w-3 h-3" />;
    }
    return <ArrowRight className="w-3 h-3" />;
  };

  // Edge styling
  const edgeStyle = {
    stroke: selected ? '#2563eb' : (isActive ? '#10b981' : '#6b7280'),
    strokeWidth: selected ? 3 : 2,
    strokeDasharray: '8,4',
    opacity: selected ? 1 : 0.8,
    transition: 'all 0.2s ease-in-out',
  };

  return (
    <>
      {/* Main Edge Path */}
      <BaseEdge
        path={edgePath}
        style={edgeStyle}
        markerEnd="url(#dataflow-arrow)"
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
              flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium
              border shadow-sm bg-white
              ${selected 
                ? 'border-blue-500 text-blue-700' 
                : isActive 
                  ? 'border-green-500 text-green-700'
                  : 'border-gray-300 text-gray-600'
              }
              hover:shadow-md transition-all duration-200
            `}
          >
            {getIcon()}
            <span>{label}</span>
          </div>
        </div>
      </EdgeLabelRenderer>

      {/* Custom marker definition */}
      <defs>
        <marker
          id="dataflow-arrow"
          markerWidth="12"
          markerHeight="12"
          refX="6"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M0,0 L0,6 L9,3 z"
            fill={selected ? '#2563eb' : (isActive ? '#10b981' : '#6b7280')}
          />
        </marker>
      </defs>
    </>
  );
});

DataFlowEdge.displayName = 'DataFlowEdge';

export default DataFlowEdge;
