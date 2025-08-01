import { useState, useRef, useEffect } from "react";
import { Handle, Position, NodeToolbar, type NodeProps } from "@xyflow/react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Edit,
  Check,
  X,
  Eye,
  Link,
  Minimize2,
  Copy,
  MessageSquare,
  BarChart3,
  Database,
  Layers,
  Trash2,
  GripVertical,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import TagsList from "./TagsList";
import { TagInput } from "@/components/ui/tag-input";
import { cn } from "@/lib/utils";
import { useAccessibility } from "@/hooks/useAccessibility";
import { useCanvasStore } from "@/lib/stores/canvasStore";
import { DimensionSliceModal } from "./index";
import type {
  MetricCard as MetricCardType,
  MetricValue,
  CardCategory,
} from "@/lib/types";

interface MetricCardNodeData {
  card: MetricCardType;
  onOpenSettings?: (cardId: string, tab?: string) => void;
  onNodeClick?: (cardId: string, position: { x: number; y: number }) => void;
  isPreview?: boolean;
}

// Sub-category options based on main category
const getSubCategoryOptions = (category: CardCategory): string[] => {
  switch (category) {
    case "Core/Value":
      return ["Journey Step", "Value Chain", "Critical Path"];
    case "Data/Metric":
      return [
        "Input Metric",
        "Output Metric",
        "Leading KPI",
        "Lagging KPI",
        "Diagnostic Metric",
        "North Star Metric",
      ];
    case "Work/Action":
      return [
        "Experiment",
        "BAU",
        "Initiative",
        "Scope/Function",
        "Business Driver",
      ];
    case "Ideas/Hypothesis":
      return ["Factor", "Seller Solution"];
    case "Metadata":
      return ["Group", "Subflow", "Reference"];
    default:
      return [];
  }
};

// Category icons mapping
const getCategoryIcon = (category: MetricCardType["category"]) => {
  switch (category) {
    case "Core/Value":
      return "🎯";
    case "Data/Metric":
      return "📊";
    case "Work/Action":
      return "⚡";
    case "Ideas/Hypothesis":
      return "💡";
    case "Metadata":
      return "📋";
    default:
      return "📄";
  }
};

// Category colors
const getCategoryColor = (category: MetricCardType["category"]) => {
  switch (category) {
    case "Core/Value":
      return "bg-blue-50 border-blue-200 text-blue-900";
    case "Data/Metric":
      return "bg-green-50 border-green-200 text-green-900";
    case "Work/Action":
      return "bg-orange-50 border-orange-200 text-orange-900";
    case "Ideas/Hypothesis":
      return "bg-purple-50 border-purple-200 text-purple-900";
    case "Metadata":
      return "bg-gray-50 border-gray-200 text-gray-900";
    default:
      return "bg-gray-50 border-gray-200 text-gray-900";
  }
};

// Trend components
const getTrendIcon = (trend: MetricValue["trend"]) => {
  switch (trend) {
    case "up":
      return <TrendingUp className="h-3 w-3 text-green-500" />;
    case "down":
      return <TrendingDown className="h-3 w-3 text-red-500" />;
    default:
      return <Minus className="h-3 w-3 text-yellow-500" />;
  }
};

const getTrendColor = (trend: MetricValue["trend"]) => {
  switch (trend) {
    case "up":
      return "text-green-600";
    case "down":
      return "text-red-600";
    default:
      return "text-yellow-600";
  }
};

// Format value for display
const formatValue = (value: number): string => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toLocaleString();
};

export default function MetricCard({ data, selected }: NodeProps) {
  const { card, onOpenSettings, onNodeClick, isPreview } =
    data as unknown as MetricCardNodeData;
  const [isExpanded] = useState(true);

  // Inline editing state
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(card.title);
  const [tempDescription, setTempDescription] = useState(
    card.description || ""
  );
  const [tempCategory, setTempCategory] = useState<CardCategory>(card.category);
  const [tempSubCategory, setTempSubCategory] = useState(
    card.subCategory || ""
  );
  const [tempTags, setTempTags] = useState<string[]>(card.tags || []);

  const cardRef = useRef<HTMLDivElement>(null);

  const isDataMetric = card.category === "Data/Metric";
  const categoryColor = getCategoryColor(card.category);

  // Canvas store for updates
  const { persistNodeUpdate, deleteNode, sliceMetricByDimensions } =
    useCanvasStore();

  // Accessibility hooks
  const { announce, getARIAProps, createKeyboardNavigationHandler } =
    useAccessibility();

  // Category options
  const categoryOptions: Array<{ value: CardCategory; label: string }> = [
    { value: "Core/Value", label: "Core/Value" },
    { value: "Data/Metric", label: "Data/Metric" },
    { value: "Work/Action", label: "Work/Action" },
    { value: "Ideas/Hypothesis", label: "Ideas/Hypothesis" },
    { value: "Metadata", label: "Metadata" },
  ];

  // Toolbar state
  const [isDimensionSliceOpen, setIsDimensionSliceOpen] = useState(false);

  // Toolbar functions
  const handleCollapseExpand = () => {
    console.log("Toggle collapse for node:", card.id);
  };

  const handleCreateRelationship = () => {
    console.log("Create relationship from node:", card.id);
  };

  const handleViewDetails = (tab?: string) => {
    if (onOpenSettings) {
      onOpenSettings(card.id, tab);
    }
  };

  const handleDimensionSlice = () => {
    setIsDimensionSliceOpen(true);
  };

  const handleSlice = async (
    dimensions: string[],
    historyOption: "manual" | "proportional" | "forfeit",
    percentages?: number[]
  ) => {
    try {
      const newCardIds = await sliceMetricByDimensions(
        card.id,
        dimensions,
        historyOption,
        percentages
      );
      console.log("Created dimension cards:", newCardIds);
      setIsDimensionSliceOpen(false);
    } catch (error) {
      console.error("Error slicing metric:", error);
      alert(
        error instanceof Error
          ? error.message
          : "An error occurred while slicing the metric"
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNode(card.id);
      console.log("✅ Node deleted:", card.id);
    } catch (error) {
      console.error("❌ Failed to delete node:", error);
    }
  };

  const handleDuplicate = () => {
    console.log("Duplicate node:", card.id);
    // TODO: Implement duplicate functionality
  };

  // Edit functions
  const startEditing = () => {
    setTempTitle(card.title);
    setTempDescription(card.description || "");
    setTempCategory(card.category);
    setTempSubCategory(card.subCategory || "");
    setTempTags(card.tags || []);
    setIsEditing(true);
  };

  const saveChanges = async () => {
    try {
      const updates: Partial<{
        title: string;
        description: string;
        category: CardCategory;
        subCategory: string;
        tags: string[];
      }> = {};

      if (tempTitle.trim() !== card.title) {
        updates.title = tempTitle.trim();
      }
      if (tempDescription !== card.description) {
        updates.description = tempDescription;
      }
      if (tempCategory !== card.category) {
        updates.category = tempCategory;
        updates.subCategory = undefined; // Reset subcategory when category changes
      }
      if (tempSubCategory !== card.subCategory) {
        updates.subCategory = tempSubCategory;
      }
      if (JSON.stringify(tempTags) !== JSON.stringify(card.tags)) {
        updates.tags = tempTags;
      }

      if (Object.keys(updates).length > 0) {
        await persistNodeUpdate(card.id, updates as Partial<MetricCardType>);
        console.log("✅ Card updated successfully");
      }
    } catch (error) {
      console.error("❌ Failed to update card:", error);
    }
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setTempTitle(card.title);
    setTempDescription(card.description || "");
    setTempCategory(card.category);
    setTempSubCategory(card.subCategory || "");
    setTempTags(card.tags || []);
    setIsEditing(false);
  };

  // Announce card selection changes
  useEffect(() => {
    if (selected) {
      announce(`Selected ${card.title} metric card`);
    }
  }, [selected, card.title, announce]);

  // Read-only display - editing is now handled by the toolbar

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onNodeClick) {
      onNodeClick(card.id, card.position);
    }
  };

  const handleCardActivate = () => {
    if (onNodeClick) {
      onNodeClick(card.id, card.position);
    }
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "bg-card border-2 rounded-lg shadow-lg min-w-[280px] max-w-[320px] cursor-pointer transition-all duration-200",
        selected
          ? "border-primary shadow-xl shadow-primary/25 ring-2 ring-primary/20 scale-[1.02] bg-card/95"
          : "border-border hover:shadow-xl hover:scale-[1.01]",
        categoryColor,
        isPreview && "min-w-[200px] max-w-[240px] scale-75"
      )}
      onClick={handleCardClick}
      onKeyDown={createKeyboardNavigationHandler(
        handleCardActivate,
        handleCardActivate,
        undefined,
        undefined,
        undefined,
        undefined,
        () => cardRef.current?.blur()
      )}
      {...getARIAProps({
        label: `${card.title} metric card. Category: ${card.category}. ${card.description ? `Description: ${card.description}` : ""}`,
        role: "button",
        selected: !!selected,
        pressed: !!selected,
      })}
      tabIndex={0}
    >
      {/* Enhanced Handles for Easy Connect */}
      {!isPreview && (
        <>
          <Handle
            type="target"
            position={Position.Top}
            className="w-3 h-3 border-2 border-background bg-blue-500 hover:bg-blue-600 hover:scale-125 transition-all duration-200"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            className="w-3 h-3 border-2 border-background bg-green-500 hover:bg-green-600 hover:scale-125 transition-all duration-200"
          />
          <Handle
            type="target"
            position={Position.Left}
            className="w-3 h-3 border-2 border-background bg-blue-500 hover:bg-blue-600 hover:scale-125 transition-all duration-200"
          />
          <Handle
            type="source"
            position={Position.Right}
            className="w-3 h-3 border-2 border-background bg-green-500 hover:bg-green-600 hover:scale-125 transition-all duration-200"
          />
        </>
      )}

      {/* Card Header */}
      <div className="p-3 border-b border-border/50">
        {/* Dedicated Drag Handle Section */}
        {!isPreview && (
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 cursor-grab active:cursor-grabbing">
            <div className="flex items-center gap-1 px-3 py-1 bg-muted/50 rounded-full text-xs text-muted-foreground hover:bg-muted transition-colors">
              <GripVertical className="w-3 h-3" />
              <span className="font-medium">Drag</span>
              <GripVertical className="w-3 h-3" />
            </div>
          </div>
        )}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-lg">{getCategoryIcon(card.category)}</span>

            {/* Category and Subcategory - Editable when editing */}
            {!isPreview && (
              <div className="flex items-center gap-1 text-xs">
                {isEditing ? (
                  <>
                    <Select
                      value={tempCategory}
                      onValueChange={(value: CardCategory) => {
                        setTempCategory(value);
                        setTempSubCategory(""); // Reset subcategory when category changes
                      }}
                    >
                      <SelectTrigger className="h-5 w-20 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {getSubCategoryOptions(tempCategory).length > 0 && (
                      <>
                        <span className="text-muted-foreground">→</span>
                        <Select
                          value={tempSubCategory}
                          onValueChange={setTempSubCategory}
                        >
                          <SelectTrigger className="h-5 w-16 text-xs">
                            <SelectValue placeholder="Sub" />
                          </SelectTrigger>
                          <SelectContent>
                            {getSubCategoryOptions(tempCategory).map(
                              (subCat) => (
                                <SelectItem key={subCat} value={subCat}>
                                  {subCat}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <span className="text-muted-foreground">
                      {card.category}
                    </span>
                    {card.subCategory && (
                      <>
                        <span className="text-muted-foreground">→</span>
                        <span className="text-muted-foreground">
                          {card.subCategory}
                        </span>
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Edit button - only show when not in edit mode */}
          {!isPreview && !isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={startEditing}
              className="h-6 w-6 p-0 hover:bg-blue-50 hover:text-blue-600"
              title="Edit Card"
            >
              <Edit className="h-3 w-3" />
            </Button>
          )}

          {/* Save/Cancel buttons - only show when editing */}
          {!isPreview && isEditing && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={saveChanges}
                className="h-6 w-6 p-0 hover:bg-green-50 hover:text-green-600"
                title="Save Changes"
              >
                <Check className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={cancelEdit}
                className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600"
                title="Cancel Edit"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        {/* Title - Editable when editing */}
        <div className="mb-1">
          <div className="flex items-center">
            {isEditing ? (
              <Input
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveChanges();
                  if (e.key === "Escape") cancelEdit();
                }}
                className="h-6 text-sm font-semibold"
                placeholder="Enter title..."
                autoFocus
              />
            ) : (
              <h3 className="font-semibold text-card-foreground text-sm leading-tight flex-1">
                {card.title}
              </h3>
            )}
          </div>
        </div>

        {/* Description - Editable when editing */}
        <div>
          {isEditing ? (
            <Textarea
              value={tempDescription}
              onChange={(e) => setTempDescription(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.ctrlKey) saveChanges();
                if (e.key === "Escape") cancelEdit();
              }}
              className="min-h-[40px] text-xs resize-none"
              placeholder="Enter description..."
            />
          ) : card.description ? (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {card.description}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground/50 italic">
              No description
            </p>
          )}
        </div>
      </div>

      {/* Data/Metric Specific Content */}
      {isDataMetric && card.data && isExpanded && (
        <div className="p-3 border-b border-border/50 bg-background/50">
          <div className="space-y-2">
            {card.data.slice(0, 3).map((metric: MetricValue, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">
                  {metric.period}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-card-foreground">
                    {formatValue(metric.value)}
                  </span>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(metric.trend)}
                    <span
                      className={cn(
                        "text-xs font-medium",
                        getTrendColor(metric.trend)
                      )}
                    >
                      {metric.change_percent > 0 ? "+" : ""}
                      {metric.change_percent}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Card Footer */}
      <div className="p-3 space-y-2">
        {/* Causal Factors */}
        {card.causalFactors && card.causalFactors.length > 0 && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-muted-foreground">
              Causal Factor:
            </span>
            <Badge variant="purple" className="text-xs font-medium">
              {card.causalFactors[0]}
            </Badge>
          </div>
        )}

        {/* Read-only Tags */}
        <div className="space-y-1">
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-xs text-muted-foreground">Tags:</span>
            {isEditing ? (
              <TagInput
                tags={tempTags}
                onChange={setTempTags}
                placeholder="Add tags..."
                maxTags={10}
                className="text-xs"
              />
            ) : (
              <TagsList
                tags={card.tags}
                variant="secondary"
                showAddButton={false}
                maxDisplayTags={2}
                useColorfulTags={true}
              />
            )}
          </div>
        </div>

        {/* Assignee info (if available) */}
        {card.assignees && card.assignees.length > 0 && (
          <div className="flex items-center gap-1 pt-2 border-t border-border/30">
            <Users className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {card.assignees[0]}
            </span>
          </div>
        )}
      </div>

      {/* Node Toolbar - React Flow built-in positioning */}
      {!isPreview && (
        <NodeToolbar>
          <div className="flex items-center gap-1 bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-1">
            {/* Quick View */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewDetails()}
              className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600 hover:scale-110 transition-all duration-200"
              title="View Details"
            >
              <Eye className="h-3 w-3" />
            </Button>

            {/* Divider */}
            <div className="w-px h-4 bg-gray-300 mx-1" />

            {/* Create Relationship */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCreateRelationship}
              className="h-8 w-8 p-0 hover:bg-purple-50 hover:text-purple-600 hover:scale-110 transition-all duration-200"
              title="Create Relationship"
            >
              <Link className="h-3 w-3" />
            </Button>

            {/* Divider */}
            <div className="w-px h-4 bg-gray-300 mx-1" />

            {/* Collapse/Expand */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCollapseExpand}
              className="h-8 w-8 p-0 hover:bg-gray-50 hover:text-gray-600 hover:scale-110 transition-all duration-200"
              title="Collapse/Expand"
            >
              <Minimize2 className="h-3 w-3" />
            </Button>

            {/* Divider */}
            <div className="w-px h-4 bg-gray-300 mx-1" />

            {/* Duplicate */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDuplicate}
              className="h-8 w-8 p-0 hover:bg-gray-50 hover:text-gray-600 hover:scale-110 transition-all duration-200"
              title="Duplicate"
            >
              <Copy className="h-3 w-3" />
            </Button>

            {/* Divider */}
            <div className="w-px h-4 bg-gray-300 mx-1" />

            {/* Comments */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewDetails("comments")}
              className="h-8 w-8 p-0 hover:bg-gray-50 hover:text-gray-600 hover:scale-110 transition-all duration-200"
              title="Comments"
            >
              <MessageSquare className="h-3 w-3" />
            </Button>

            {/* Divider */}
            <div className="w-px h-4 bg-gray-300 mx-1" />

            {/* Data */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewDetails("data")}
              className="h-8 w-8 p-0 hover:bg-gray-50 hover:text-gray-600 hover:scale-110 transition-all duration-200"
              title="Data"
            >
              <BarChart3 className="h-3 w-3" />
            </Button>

            {/* Divider */}
            <div className="w-px h-4 bg-gray-300 mx-1" />

            {/* Segments */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewDetails("settings")}
              className="h-8 w-8 p-0 hover:bg-gray-50 hover:text-gray-600 hover:scale-110 transition-all duration-200"
              title="Segments"
            >
              <Database className="h-3 w-3" />
            </Button>

            {/* Slice by Dimension (only for Data/Metric nodes) */}
            {card.category === "Data/Metric" && (
              <>
                {/* Divider */}
                <div className="w-px h-4 bg-gray-300 mx-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDimensionSlice}
                  className="h-8 w-8 p-0 hover:bg-gray-50 hover:text-gray-600 hover:scale-110 transition-all duration-200"
                  title="Slice by Dimension"
                >
                  <Layers className="h-3 w-3" />
                </Button>
              </>
            )}

            {/* Divider */}
            <div className="w-px h-4 bg-gray-300 mx-1" />

            {/* Delete with confirmation */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 hover:scale-110 transition-all duration-200"
                  title="Delete"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Card</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{card.title}"? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </NodeToolbar>
      )}

      {/* Dimension Slice Modal */}
      {!isPreview && card.category === "Data/Metric" && (
        <DimensionSliceModal
          isOpen={isDimensionSliceOpen}
          onClose={() => setIsDimensionSliceOpen(false)}
          parentCard={card}
          onSlice={handleSlice}
        />
      )}
    </div>
  );
}
