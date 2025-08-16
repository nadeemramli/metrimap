import { memo } from 'react';
import { EdgeProps, getSmoothStepPath, EdgeLabelRenderer } from '@xyflow/react';
import { ArrowRight, TrendingUp, Zap, BarChart3 } from 'lucide-react';
import type { RelationshipType } from '@/shared/types';

interface ErasableDynamicEdgeData {
  relationship: any;
  onOpenRelationshipSheet?: (relationshipId: string) => void;
  onSwitchToRelationship?: (relationshipId: string) => void;
  isRelationshipSheetOpen?: boolean;
  renderKey?: string;
  toBeDeleted?: boolean; // For eraser functionality
  [key: string]: unknown;
}

interface ErasableDynamicEdgeProps extends EdgeProps {
  data: ErasableDynamicEdgeData;
}

// Relationship type styling based on PRD specifications
const getRelationshipTypeConfig = (type: RelationshipType, weight?: number) => {
  const getColorByWeight = (weight?: number) => {
    if (weight === undefined || weight === 0) return "#6b7280"; // Gray for no correlation
    return weight > 0 ? "#16a34a" : "#dc2626"; // Green for positive, red for negative
  };

  switch (type) {
    case "Deterministic":
      return {
        icon: ArrowRight,
        color: "text-gray-600",
        stroke: "#6b7280",
        label: "Deterministic",
        description: "Formulaic relationship",
        lineStyle: "smoothstep",
        buttonValue: weight ? `${weight}` : "1.0",
        showButton: true,
      };
    case "Probabilistic":
      return {
        icon: TrendingUp,
        color: "text-gray-600",
        stroke: getColorByWeight(weight),
        label: "Probabilistic",
        description: "Statistical correlation",
        lineStyle: "dotted",
        buttonValue: weight ? `${weight}` : "0.0",
        showButton: true,
      };
    case "Causal":
      return {
        icon: Zap,
        color: "text-gray-600",
        stroke: getColorByWeight(weight),
        label: "Causal",
        description: "Cause and effect",
        lineStyle: "smoothstep",
        buttonValue: weight ? `${weight}` : "0.0",
        showButton: true,
      };
    case "Compositional":
      return {
        icon: BarChart3,
        color: "text-gray-600",
        stroke: "#6b7280",
        label: "Compositional",
        description: "Part of whole",
        lineStyle: "straight",
        buttonValue: "1.0",
        showButton: false,
      };
    default:
      return {
        icon: ArrowRight,
        color: "text-gray-600",
        stroke: "#6b7280",
        label: "Unknown",
        description: "Unknown relationship",
        lineStyle: "smoothstep",
        buttonValue: "1.0",
        showButton: false,
      };
  }
};

const ErasableDynamicEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: ErasableDynamicEdgeProps) => {
  const relationship = data?.relationship;
  const isToBeDeleted = data?.toBeDeleted;

  if (!relationship) {
    return null;
  }

  const config = getRelationshipTypeConfig(
    relationship.type,
    relationship.weight
  );

  // Calculate the path
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Apply eraser effect styling
  const edgeStyle = {
    stroke: config.stroke,
    strokeWidth: selected ? 3 : 2,
    opacity: isToBeDeleted ? 0.3 : 1,
    filter: isToBeDeleted ? 'grayscale(100%)' : 'none',
    transition: 'opacity 0.2s ease, filter 0.2s ease',
  };

  const labelStyle = {
    opacity: isToBeDeleted ? 0.3 : 1,
    filter: isToBeDeleted ? 'grayscale(100%)' : 'none',
    transition: 'opacity 0.2s ease, filter 0.2s ease',
  };

  return (
    <>
      <path
        id={id}
        style={edgeStyle}
        className="react-flow__edge-path"
        d={edgePath}
        strokeDasharray={config.lineStyle === 'dotted' ? '5,5' : undefined}
      />
      
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: 'all',
            ...labelStyle,
          }}
          className="nodrag nopan"
        >
          {config.showButton && (
            <button
              className={`
                px-2 py-1 text-xs font-medium rounded-full border-2 bg-white
                transition-all duration-200 hover:scale-110 shadow-sm
                ${selected ? 'border-blue-500 text-blue-700' : 'border-gray-300 text-gray-700'}
                ${isToBeDeleted ? 'opacity-50' : ''}
              `}
              onClick={(e) => {
                e.stopPropagation();
                if (data?.onOpenRelationshipSheet) {
                  data.onOpenRelationshipSheet(relationship.id);
                }
              }}
              title={`${config.label}: ${config.description}`}
            >
              {config.buttonValue}
            </button>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
});

ErasableDynamicEdge.displayName = 'ErasableDynamicEdge';

export default ErasableDynamicEdge;
