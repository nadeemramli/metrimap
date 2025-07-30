import { useState, useCallback } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
} from "@xyflow/react";
import type { EdgeProps } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ArrowRight,
  Zap,
  TrendingUp,
  Network,
  Layers,
  MoreHorizontal,
  Settings,
  Trash2,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  Relationship,
  RelationshipType,
  ConfidenceLevel,
} from "@/lib/types";

interface DynamicEdgeData {
  relationship: Relationship;
  onOpenRelationshipSheet?: (relationshipId: string) => void;
}

interface DynamicEdgeProps extends EdgeProps {
  data: DynamicEdgeData;
}

// Relationship type icons and colors
const getRelationshipTypeConfig = (type: RelationshipType) => {
  switch (type) {
    case "Deterministic":
      return {
        icon: ArrowRight,
        color: "text-blue-600",
        stroke: "#2563eb",
        label: "Deterministic",
        description: "Direct causal relationship",
      };
    case "Probabilistic":
      return {
        icon: TrendingUp,
        color: "text-green-600",
        stroke: "#16a34a",
        label: "Probabilistic",
        description: "Statistical correlation",
      };
    case "Causal":
      return {
        icon: Zap,
        color: "text-yellow-600",
        stroke: "#ca8a04",
        label: "Causal",
        description: "Proven causal influence",
      };
    case "Compositional":
      return {
        icon: Layers,
        color: "text-purple-600",
        stroke: "#9333ea",
        label: "Compositional",
        description: "Part-of relationship",
      };
    default:
      return {
        icon: Network,
        color: "text-gray-600",
        stroke: "#6b7280",
        label: "Unknown",
        description: "Undefined relationship",
      };
  }
};

// Confidence level styling
const getConfidenceConfig = (confidence: ConfidenceLevel) => {
  switch (confidence) {
    case "High":
      return {
        strokeWidth: 3,
        strokeDasharray: "none",
        opacity: 1,
        badge: "bg-green-100 text-green-800 border-green-200",
      };
    case "Medium":
      return {
        strokeWidth: 2,
        strokeDasharray: "5,5",
        opacity: 0.8,
        badge: "bg-yellow-100 text-yellow-800 border-yellow-200",
      };
    case "Low":
      return {
        strokeWidth: 1,
        strokeDasharray: "2,8",
        opacity: 0.6,
        badge: "bg-red-100 text-red-800 border-red-200",
      };
    default:
      return {
        strokeWidth: 1,
        strokeDasharray: "2,8",
        opacity: 0.4,
        badge: "bg-gray-100 text-gray-800 border-gray-200",
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

  const { relationship, onOpenRelationshipSheet } = data;
  const typeConfig = getRelationshipTypeConfig(relationship.type);
  const confidenceConfig = getConfidenceConfig(relationship.confidence);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleDelete = useCallback(() => {
    if (confirm("Are you sure you want to delete this relationship?")) {
      deleteElements({ edges: [{ id }] });
    }
  }, [deleteElements, id]);

  const handleOpenSheet = useCallback(() => {
    onOpenRelationshipSheet?.(relationship.id);
    setShowActions(false);
  }, [onOpenRelationshipSheet, relationship.id]);

  const handleViewEvidence = useCallback(() => {
    console.log("View evidence for relationship:", relationship.id);
    setShowActions(false);
  }, [relationship.id]);

  return (
    <>
      {/* Main Edge Path */}
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: typeConfig.stroke,
          strokeWidth: confidenceConfig.strokeWidth,
          strokeDasharray: confidenceConfig.strokeDasharray,
          opacity: selected || isHovered ? 1 : confidenceConfig.opacity,
          transition: "all 0.2s ease-in-out",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />

      {/* Edge Label and Actions */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: "all",
          }}
          className={cn(
            "transition-all duration-200",
            selected || isHovered ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Relationship Info */}
          <div className="flex flex-col items-center gap-1">
            {/* Type and Confidence Badges */}
            <div className="flex items-center gap-1">
              <Badge
                variant="outline"
                className={cn("text-xs font-normal", typeConfig.color)}
              >
                <typeConfig.icon className="mr-1 h-3 w-3" />
                {typeConfig.label}
              </Badge>
              <Badge
                variant="outline"
                className={cn("text-xs font-normal", confidenceConfig.badge)}
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
    </>
  );
}
