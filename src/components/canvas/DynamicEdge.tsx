import { useState, useCallback } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  getSmoothStepPath,
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
  onSwitchToRelationship?: (relationshipId: string) => void;
  isRelationshipSheetOpen?: boolean;
  renderKey?: string; // Unique identifier to force re-rendering
  [key: string]: unknown;
}

interface DynamicEdgeProps extends EdgeProps {
  data: DynamicEdgeData;
}

// Relationship type styling based on PRD specifications
const getRelationshipTypeConfig = (type: RelationshipType, weight?: number) => {
  const getColorByWeight = (weight?: number) => {
    if (weight === undefined || weight === 0) return "#6b7280"; // Gray for no correlation
    return weight > 0 ? "#16a34a" : "#dc2626"; // Green for positive, red for negative
  };

  // Check if relationship type needs numeric button - TODO: Use when implementing dynamic button logic
  // const needsNumericButton = (type: RelationshipType) => {
  //   return ["Deterministic", "Probabilistic", "Causal"].includes(type);
  // };

  switch (type) {
    case "Deterministic":
      return {
        icon: ArrowRight,
        color: "text-gray-600",
        stroke: "#6b7280", // Gray base color
        label: "Deterministic",
        description: "Formulaic relationship",
        lineStyle: "smoothstep", // Rigid/formulaic
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
        description: "Proven causal influence",
        lineStyle: "solid",
        buttonValue: weight ? `${weight}` : "0.0",
        showButton: true,
      };
    case "Compositional":
      return {
        icon: Layers,
        color: "text-gray-600",
        stroke: "#6b7280", // Gray base color
        label: "Compositional",
        description: "Part-of relationship",
        lineStyle: "dotted-smoothstep", // Hierarchical with dots
        buttonValue: weight ? `${weight}` : "1.0",
        showButton: false, // No numeric value needed
      };
    default:
      return {
        icon: Network,
        color: "text-gray-600",
        stroke: "#6b7280",
        label: "Unknown",
        description: "Undefined relationship",
        lineStyle: "solid",
        buttonValue: "0.0",
        showButton: false,
      };
  }
};

// Confidence level styling - affects button appearance, not line style
const getConfidenceConfig = (confidence: ConfidenceLevel) => {
  switch (confidence) {
    case "High":
      return {
        badge: "bg-green-100 text-green-800 border-green-200",
        buttonOpacity: 1,
        buttonBorder: "border-green-300",
      };
    case "Medium":
      return {
        badge: "bg-yellow-100 text-yellow-800 border-yellow-200",
        buttonOpacity: 0.9,
        buttonBorder: "border-yellow-300",
      };
    case "Low":
      return {
        badge: "bg-red-100 text-red-800 border-red-200",
        buttonOpacity: 0.7,
        buttonBorder: "border-red-300",
      };
    default:
      return {
        badge: "bg-gray-100 text-gray-800 border-gray-200",
        buttonOpacity: 0.5,
        buttonBorder: "border-gray-300",
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
          "🔗 Double-clicked relationship (switch):",
          relationship.id
        );
      } else if (onOpenRelationshipSheet) {
        onOpenRelationshipSheet(relationship.id);
        console.log("🔗 Double-clicked relationship (open):", relationship.id);
      }
    },
    [
      onOpenRelationshipSheet,
      onSwitchToRelationship,
      relationship.id,
      isRelationshipSheetOpen,
    ]
  );

  // Handle button click to open relationship sheet
  const handleButtonClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      console.log("🔗 Button clicked relationship:", relationship.id);
      console.log("🔗 Sheet open:", isRelationshipSheetOpen);
      console.log(
        "🔗 onSwitchToRelationship available:",
        !!onSwitchToRelationship
      );
      console.log(
        "🔗 onOpenRelationshipSheet available:",
        !!onOpenRelationshipSheet
      );

      // If relationship sheet is open, switch to this relationship instead of opening new sheet
      if (isRelationshipSheetOpen && onSwitchToRelationship) {
        onSwitchToRelationship(relationship.id);
        console.log("🔗 Called onSwitchToRelationship with:", relationship.id);
      } else if (onOpenRelationshipSheet) {
        onOpenRelationshipSheet(relationship.id);
        console.log("🔗 Called onOpenRelationshipSheet with:", relationship.id);
      } else {
        console.error("❌ No relationship sheet handler defined!");
      }
    },
    [
      onOpenRelationshipSheet,
      onSwitchToRelationship,
      relationship.id,
      isRelationshipSheetOpen,
    ]
  );

  // Get path based on relationship type
  const getEdgePath = () => {
    if (typeConfig.lineStyle === "smoothstep") {
      // Use smoothstep for deterministic relationships
      return getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
      });
    } else if (typeConfig.lineStyle === "dotted-smoothstep") {
      // Use smoothstep with dots for compositional relationships
      return getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
      });
    } else {
      // Use bezier for probabilistic and causal
      return getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
      });
    }
  };

  const [edgePath, labelX, labelY] = getEdgePath();

  const handleDelete = useCallback(() => {
    if (confirm("Are you sure you want to delete this relationship?")) {
      deleteElements({ edges: [{ id }] });
    }
  }, [deleteElements, id]);

  const handleOpenSheet = useCallback(() => {
    if (isRelationshipSheetOpen && onSwitchToRelationship) {
      onSwitchToRelationship(relationship.id);
    } else if (onOpenRelationshipSheet) {
      onOpenRelationshipSheet(relationship.id);
    }
    setShowActions(false);
  }, [
    onOpenRelationshipSheet,
    onSwitchToRelationship,
    relationship.id,
    isRelationshipSheetOpen,
  ]);

  const handleViewEvidence = useCallback(() => {
    console.log("View evidence for relationship:", relationship.id);
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
            typeConfig.lineStyle === "dotted" ||
            typeConfig.lineStyle === "dotted-smoothstep"
              ? "5,5"
              : "none",
          opacity: selected || isHovered ? 1 : 0.8,
          transition: "all 0.2s ease-in-out",
          cursor: "pointer",
          // Add animation for dotted lines
          ...(typeConfig.lineStyle === "dotted" ||
          typeConfig.lineStyle === "dotted-smoothstep"
            ? {
                animation: "dash 1s linear infinite",
              }
            : {}),
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDoubleClick={handleDoubleClick}
      />

      {/* Invisible Wider Path for Easier Clicking */}
      <BaseEdge
        path={edgePath}
        style={{
          stroke: "transparent",
          strokeWidth: 20, // Wider invisible area for easier clicking
          cursor: "pointer",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDoubleClick={handleDoubleClick}
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

      {/* Relationship Management Button - Only for Numeric Relationships */}
      {typeConfig.showButton && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
            }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={handleButtonClick}
              className={`h-8 w-8 p-0 rounded-full bg-white shadow-sm transition-all duration-200 ${confidenceConfig.buttonBorder} hover:bg-gray-50 hover:border-gray-400`}
              style={{
                opacity: confidenceConfig.buttonOpacity,
              }}
              title={`${typeConfig.label} Relationship (${relationship.confidence} confidence) - Click to edit, Right-click for options`}
            >
              <span className="text-xs font-mono font-medium text-gray-700">
                {typeConfig.buttonValue}
              </span>
            </Button>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
