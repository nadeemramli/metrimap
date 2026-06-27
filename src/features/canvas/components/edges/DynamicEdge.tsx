// @ts-nocheck
// TODO(type-debt): pre-existing type errors quarantined when strict type-checking
// was enabled. See docs/architecture/TYPE_CHECK_DEBT.md. Fix the errors and remove
// this directive — do not add new code here assuming it is type-checked.
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import type {
  ConfidenceLevel,
  Relationship,
  RelationshipType,
} from '@/shared/types';
import { cn } from '@/shared/utils';
import type { EdgeProps } from '@xyflow/react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  useReactFlow,
} from '@xyflow/react';
import {
  ArrowRight,
  Eye,
  Layers,
  MoreHorizontal,
  Network,
  Settings,
  Trash2,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import EnhancedEdgeButton, {
  useEdgeActions,
} from './shared/EnhancedEdgeButton';

interface DynamicEdgeData {
  relationship: Relationship;
  onOpenRelationshipSheet?: (relationshipId: string) => void;
  onSwitchToRelationship?: (relationshipId: string) => void;
  isRelationshipSheetOpen?: boolean;
  renderKey?: string; // Unique identifier to force re-rendering
  [key: string]: unknown;
}

interface DynamicEdgeProps extends EdgeProps {
  data: DynamicEdgeData;
}

// Build an SVG path from an orthogonal polyline (ELK bend-points), rounding the
// corners so routed edges match the smoothstep aesthetic.
function roundedOrthogonalPath(
  points: { x: number; y: number }[],
  r = 12
): string {
  if (!points || points.length < 2) return '';
  if (points.length === 2) {
    return `M ${points[0].x},${points[0].y} L ${points[1].x},${points[1].y}`;
  }
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];
    const len1 = Math.hypot(curr.x - prev.x, curr.y - prev.y) || 1;
    const len2 = Math.hypot(next.x - curr.x, next.y - curr.y) || 1;
    const rr = Math.min(r, len1 / 2, len2 / 2);
    const p1x = curr.x - ((curr.x - prev.x) / len1) * rr;
    const p1y = curr.y - ((curr.y - prev.y) / len1) * rr;
    const p2x = curr.x + ((next.x - curr.x) / len2) * rr;
    const p2y = curr.y + ((next.y - curr.y) / len2) * rr;
    d += ` L ${p1x},${p1y} Q ${curr.x},${curr.y} ${p2x},${p2y}`;
  }
  const last = points[points.length - 1];
  d += ` L ${last.x},${last.y}`;
  return d;
}

// Relationship type styling based on PRD specifications
const getRelationshipTypeConfig = (type: RelationshipType, weight?: number) => {
  const getColorByWeight = (weight?: number) => {
    if (weight === undefined || weight === 0) return '#6b7280'; // Gray for no correlation
    return weight > 0 ? '#16a34a' : '#dc2626'; // Green for positive, red for negative
  };

  // Check if relationship type needs numeric button - TODO: Use when implementing dynamic button logic
  // const needsNumericButton = (type: RelationshipType) => {
  //   return ["Deterministic", "Probabilistic", "Causal"].includes(type);
  // };

  switch (type) {
    case 'Deterministic':
      return {
        icon: ArrowRight,
        color: 'text-gray-600',
        stroke: '#6b7280', // Gray base color
        label: 'Deterministic',
        description: 'Formulaic relationship',
        lineStyle: 'smoothstep', // Rigid/formulaic
        buttonValue: weight ? `${weight}` : '1.0',
        showButton: true,
      };
    case 'Probabilistic':
      return {
        icon: TrendingUp,
        color: 'text-gray-600',
        stroke: getColorByWeight(weight),
        label: 'Probabilistic',
        description: 'Statistical correlation',
        lineStyle: 'dotted',
        buttonValue: weight ? `${weight}` : '0.0',
        showButton: true,
      };
    case 'Causal':
      return {
        icon: Zap,
        color: 'text-gray-600',
        stroke: getColorByWeight(weight),
        label: 'Causal',
        description: 'Proven causal influence',
        lineStyle: 'solid',
        buttonValue: weight ? `${weight}` : '0.0',
        showButton: true,
      };
    case 'Compositional':
      return {
        icon: Layers,
        color: 'text-gray-600',
        stroke: '#6b7280', // Gray base color
        label: 'Compositional',
        description: 'Part-of relationship',
        lineStyle: 'dotted-smoothstep', // Hierarchical with dots
        buttonValue: weight ? `${weight}` : '1.0',
        showButton: false, // No numeric value needed
      };
    default:
      return {
        icon: Network,
        color: 'text-gray-600',
        stroke: '#6b7280',
        label: 'Unknown',
        description: 'Undefined relationship',
        lineStyle: 'solid',
        buttonValue: '0.0',
        showButton: false,
      };
  }
};

// Confidence level styling - affects button appearance, not line style
const getConfidenceConfig = (confidence: ConfidenceLevel) => {
  switch (confidence) {
    case 'High':
      return {
        badge: 'bg-green-100 text-green-800 border-green-200',
        buttonOpacity: 1,
        buttonBorder: 'border-green-300',
        buttonBg: 'bg-green-50',
      };
    case 'Medium':
      return {
        badge: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        buttonOpacity: 1,
        buttonBorder: 'border-yellow-300',
        buttonBg: 'bg-yellow-50',
      };
    case 'Low':
      return {
        badge: 'bg-red-100 text-red-800 border-red-200',
        buttonOpacity: 1,
        buttonBorder: 'border-red-300',
        buttonBg: 'bg-red-50',
      };
    default:
      return {
        badge: 'bg-gray-100 text-gray-800 border-gray-200',
        buttonOpacity: 1,
        buttonBorder: 'border-gray-300',
        buttonBg: 'bg-gray-50',
      };
  }
};

export default function DynamicEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  selected,
}: DynamicEdgeProps) {
  const { deleteElements } = useReactFlow();
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const {
    relationship,
    onOpenRelationshipSheet,
    onSwitchToRelationship,
    isRelationshipSheetOpen,
  } = data;

  // Enhanced edge actions
  const {
    handleOpenSettings,
    handleView,
    handleEdit,
    handleDelete: handleEdgeDelete,
    handleCopy,
    handleShare,
    handleAddTag,
  } = useEdgeActions(id, 'relationshipEdge');
  const typeConfig = getRelationshipTypeConfig(
    relationship.type,
    relationship.weight
  );
  const confidenceConfig = getConfidenceConfig(relationship.confidence);

  // Debug logging for edge styling updates - REMOVED to reduce console noise

  // Handle double-click to open relationship sheet
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      // If relationship sheet is open, switch to this relationship instead of opening new sheet
      if (isRelationshipSheetOpen && onSwitchToRelationship) {
        onSwitchToRelationship(relationship.id);
        console.log(
          '🔗 Double-clicked relationship (switch):',
          relationship.id
        );
      } else if (onOpenRelationshipSheet) {
        onOpenRelationshipSheet(relationship.id);
        console.log('🔗 Double-clicked relationship (open):', relationship.id);
      }
    },
    [
      onOpenRelationshipSheet,
      onSwitchToRelationship,
      relationship.id,
      isRelationshipSheetOpen,
    ]
  );

  // Handle edge click to open relationship sheet
  const handleEdgeClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      console.log('🔗 Edge clicked relationship:', relationship.id);
      console.log('🔗 Sheet open:', isRelationshipSheetOpen);
      console.log(
        '🔗 onSwitchToRelationship available:',
        !!onSwitchToRelationship
      );
      console.log(
        '🔗 onOpenRelationshipSheet available:',
        !!onOpenRelationshipSheet
      );

      // If relationship sheet is open, switch to this relationship instead of opening new sheet
      if (isRelationshipSheetOpen && onSwitchToRelationship) {
        onSwitchToRelationship(relationship.id);
        console.log('🔗 Called onSwitchToRelationship with:', relationship.id);
      } else if (onOpenRelationshipSheet) {
        onOpenRelationshipSheet(relationship.id);
        console.log('🔗 Called onOpenRelationshipSheet with:', relationship.id);
      } else {
        console.error('❌ No relationship sheet handler defined!');
      }
    },
    [
      onOpenRelationshipSheet,
      onSwitchToRelationship,
      relationship.id,
      isRelationshipSheetOpen,
    ]
  );

  // Prefer the ELK-routed polyline (orthogonal channels, no overlaps) when the
  // last auto-layout produced one for this edge; otherwise fall back to
  // smoothstep (e.g. freshly drawn edges, or after a node was dragged).
  const getEdgePath = () => {
    const routed = (data as any)?.routedPoints as
      | { x: number; y: number }[]
      | undefined;
    if (routed && routed.length >= 2) {
      const path = roundedOrthogonalPath(routed, 14);
      const mid = routed[Math.floor(routed.length / 2)];
      return [path, mid.x, mid.y] as [string, number, number];
    }
    return getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      borderRadius: 14,
      offset: 28,
    });
  };

  const [edgePath, labelX, labelY] = getEdgePath();

  const handleDelete = useCallback(() => {
    if (confirm('Are you sure you want to delete this relationship?')) {
      deleteElements({ edges: [{ id }] });
    }
  }, [deleteElements, id]);

  const handleOpenSheet = useCallback(() => {
    console.log('🔗 handleOpenSheet called for relationship:', relationship.id);
    console.log('🔗 Sheet open:', isRelationshipSheetOpen);
    console.log(
      '🔗 onSwitchToRelationship available:',
      !!onSwitchToRelationship
    );
    console.log(
      '🔗 onOpenRelationshipSheet available:',
      !!onOpenRelationshipSheet
    );

    if (isRelationshipSheetOpen && onSwitchToRelationship) {
      onSwitchToRelationship(relationship.id);
      console.log('🔗 Called onSwitchToRelationship with:', relationship.id);
    } else if (onOpenRelationshipSheet) {
      onOpenRelationshipSheet(relationship.id);
      console.log('🔗 Called onOpenRelationshipSheet with:', relationship.id);
    } else {
      console.error('❌ No relationship sheet handler defined!');
    }
    setShowActions(false);
  }, [
    onOpenRelationshipSheet,
    onSwitchToRelationship,
    relationship.id,
    isRelationshipSheetOpen,
  ]);

  const handleViewEvidence = useCallback(() => {
    console.log('View evidence for relationship:', relationship.id);
    setShowActions(false);
  }, [relationship.id]);

  return (
    <>
      {/* Main Edge Path with Relationship Type Styling */}
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: typeConfig.stroke,
          strokeWidth: 2,
          strokeDasharray:
            typeConfig.lineStyle === 'dotted' ||
            typeConfig.lineStyle === 'dotted-smoothstep'
              ? '5,5'
              : 'none',
          opacity: selected || isHovered ? 1 : 0.8,
          transition: 'all 0.2s ease-in-out',
          cursor: 'pointer',
          // Add animation for dotted lines
          ...(typeConfig.lineStyle === 'dotted' ||
          typeConfig.lineStyle === 'dotted-smoothstep'
            ? {
                animation: 'dash 1s linear infinite',
              }
            : {}),
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDoubleClick={handleDoubleClick}
        onClick={handleEdgeClick} // Make the main edge clickable
      />

      {/* Invisible Wider Path for Easier Clicking */}
      <BaseEdge
        path={edgePath}
        style={{
          stroke: 'transparent',
          strokeWidth: 30, // Even wider invisible area for easier clicking
          cursor: 'pointer',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDoubleClick={handleDoubleClick}
        onClick={handleEdgeClick} // Make the entire edge clickable
      />

      {/* Edge Label and Actions */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: 'all',
          }}
          className={cn(
            'transition-all duration-200',
            selected || isHovered ? 'opacity-100' : 'opacity-0'
          )}
        >
          {/* Relationship Info */}
          <div className="flex flex-col items-center gap-1">
            {/* Type and Confidence Badges */}
            <div className="flex items-center gap-1">
              <Badge
                variant="outline"
                className={cn('text-xs font-normal', typeConfig.color)}
              >
                <typeConfig.icon className="mr-1 h-3 w-3" />
                {typeConfig.label}
              </Badge>
              <Badge
                variant="outline"
                className={cn('text-xs font-normal', confidenceConfig.badge)}
              >
                {relationship.confidence}
              </Badge>
            </div>

            {/* Evidence Count */}
            {relationship.evidence.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {relationship.evidence.length} evidence
              </Badge>
            )}

            {/* Action Buttons */}
            {(selected || isHovered) && (
              <div className="flex items-center gap-1 mt-1">
                <Popover open={showActions} onOpenChange={setShowActions}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0 bg-card/95 backdrop-blur-sm"
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-1" align="center">
                    <div className="space-y-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleOpenSheet}
                        className="w-full justify-start text-xs"
                      >
                        <Settings className="mr-2 h-3 w-3" />
                        Edit Relationship
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleViewEvidence}
                        className="w-full justify-start text-xs"
                      >
                        <Eye className="mr-2 h-3 w-3" />
                        View Evidence ({relationship.evidence.length})
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDelete}
                        className="w-full justify-start text-xs text-destructive hover:text-destructive"
                      >
                        <Trash2 className="mr-2 h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        </div>
      </EdgeLabelRenderer>

      {/* Enhanced Edge Button with Toolbar */}
      {typeConfig.showButton && (
        <EnhancedEdgeButton
          labelX={labelX}
          labelY={labelY}
          edgeId={id}
          edgeType="relationshipEdge"
          relationshipType={relationship.type}
          weight={relationship.weight}
          confidence={relationship.confidence}
          selected={selected}
          isHovered={isHovered}
          onOpenSettings={() => {
            if (isRelationshipSheetOpen && onSwitchToRelationship) {
              onSwitchToRelationship(relationship.id);
            } else if (onOpenRelationshipSheet) {
              onOpenRelationshipSheet(relationship.id);
            }
          }}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={() => {
            if (confirm('Are you sure you want to delete this relationship?')) {
              deleteElements({ edges: [{ id }] });
            }
          }}
          onCopy={handleCopy}
          onShare={handleShare}
          onAddTag={handleAddTag}
          customLabel={typeConfig.buttonValue}
        />
      )}
    </>
  );
}
