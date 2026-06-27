import { memo } from 'react';
import { getSmoothStepPath, EdgeLabelRenderer, type EdgeProps } from '@xyflow/react';
import type { RelationshipType } from '@/shared/types';
import {
  getRelationshipStroke,
  getRelationshipTypeMeta,
  getRelationshipWeightLabel,
} from '@/features/canvas/constants/relationshipTypeMeta';

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

// Relationship type styling — sourced from the canonical metadata map.
const getRelationshipTypeConfig = (type: RelationshipType, weight?: number) => {
  const meta = getRelationshipTypeMeta(type);
  return {
    icon: meta.icon,
    color: meta.textColor,
    stroke: getRelationshipStroke(type, weight),
    label: meta.label,
    description: meta.description,
    lineStyle: meta.lineStyle,
    buttonValue: getRelationshipWeightLabel(type, weight),
    showButton: meta.showWeightButton,
  };
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
