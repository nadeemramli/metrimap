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
  onSwitchToCard?: (cardId: string, tab?: string) => void;
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

// Handle colors - reversed design with dark as default
const getHandleStyles = () => {
  return {
    // Base handle style - dark as default (reversed)
    backgroundColor: "#374151", // dark gray background
    border: "2px solid #1f2937", // darker gray border

    // Hover state - lighter
    hoverBackgroundColor: "#4b5563", // lighter gray
    hoverBorder: "2px solid #374151", // gray-700

    // Active/clicked state for touch device toggle - white (reversed)
    activeBackgroundColor: "#ffffff", // white background
    activeBorder: "3px solid #d1d5db", // light gray border

    // Connecting state (when handle is selected for connection)
    connectingBackgroundColor: "#dbeafe", // blue-50
    connectingBorder: "3px solid #2563eb", // blue-600
  };
};

// Category hover colors (darker borders and shadows)
const getCategoryHoverColor = (category: MetricCardType["category"]) => {
  switch (category) {
    case "Core/Value":
      return "hover:border-blue-600 hover:shadow-blue-600/20";
    case "Data/Metric":
      return "hover:border-green-600 hover:shadow-green-600/20";
    case "Work/Action":
      return "hover:border-orange-600 hover:shadow-orange-600/20";
    case "Ideas/Hypothesis":
      return "hover:border-purple-600 hover:shadow-purple-600/20";
    case "Metadata":
      return "hover:border-gray-600 hover:shadow-gray-600/20";
    default:
      return "hover:border-gray-600 hover:shadow-gray-600/20";
  }
};

// Category selected colors (darkest borders and shadows)
const getCategorySelectedColor = (category: MetricCardType["category"]) => {
  switch (category) {
    case "Core/Value":
      return "border-blue-800 shadow-blue-800/30 ring-1 ring-blue-700/40";
    case "Data/Metric":
      return "border-green-800 shadow-green-800/30 ring-1 ring-green-700/40";
    case "Work/Action":
      return "border-orange-800 shadow-orange-800/30 ring-1 ring-orange-700/40";
    case "Ideas/Hypothesis":
      return "border-purple-800 shadow-purple-800/30 ring-1 ring-purple-700/40";
    case "Metadata":
      return "border-gray-800 shadow-gray-800/30 ring-1 ring-gray-700/40";
    default:
      return "border-gray-800 shadow-gray-800/30 ring-1 ring-gray-700/40";
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
  const categoryHoverColor = getCategoryHoverColor(card.category);
  const categorySelectedColor = getCategorySelectedColor(card.category);
  const handleStyles = getHandleStyles();

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

  // Inject custom handle styles for touch device states
  useEffect(() => {
    const styleId = "handle-neutral-styles";
    let existingStyle = document.getElementById(styleId);

    if (!existingStyle) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        /* Custom Handle Styles for Touch Device Toggle States - Reversed Design */
        .handle-neutral.react-flow__handle {
          background-color: ${handleStyles.backgroundColor} !important;
          border: ${handleStyles.border} !important;
          transition: all 0.2s ease !important;
        }
        
        .handle-neutral.react-flow__handle:hover {
          background-color: ${handleStyles.hoverBackgroundColor} !important;
          border: ${handleStyles.hoverBorder} !important;
          transform: scale(1.05) !important;
        }
        
        .handle-neutral.react-flow__handle.connectionindicator {
          background-color: ${handleStyles.activeBackgroundColor} !important;
          border: ${handleStyles.activeBorder} !important;
          transform: scale(1.1) !important;
          box-shadow: 0 0 0 2px rgba(209, 213, 219, 0.5) !important;
        }
        
        .handle-neutral.react-flow__handle.connectingfrom,
        .handle-neutral.react-flow__handle.connectingto {
          background-color: ${handleStyles.connectingBackgroundColor} !important;
          border: ${handleStyles.connectingBorder} !important;
          transform: scale(1.15) !important;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3) !important;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      // Cleanup styles when component unmounts
      const styleToRemove = document.getElementById(styleId);
      if (styleToRemove) {
        document.head.removeChild(styleToRemove);
      }
    };
  }, [handleStyles]);

  // Read-only display - editing is now handled by the toolbar

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // If settings sheet is open, switch to this card instead of opening new sheet
    if (data.onSwitchToCard && typeof data.onSwitchToCard === "function") {
      data.onSwitchToCard(card.id);
    } else if (onNodeClick) {
      onNodeClick(card.id, card.position);
    }
  };

  const handleCardDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.onOpenSettings && typeof data.onOpenSettings === "function") {
      data.onOpenSettings(card.id);
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
        "bg-card border-2 rounded-lg shadow-lg min-w-[280px] max-w-[320px] cursor-pointer transition-all duration-200 relative",
        selected
          ? `shadow-xl bg-card/98 ${categorySelectedColor}`
          : `hover:shadow-xl ${categoryHoverColor}`,
        categoryColor,
        isPreview && "min-w-[200px] max-w-[240px] scale-75"
      )}
      onClick={handleCardClick}
      onDoubleClick={handleCardDoubleClick}
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
      {/* Enhanced Handles for Touch Device & Handle Connections - Proper source/target mix */}
      {!isPreview && (
        <>
          {/* Top Side - Source (can start connections) */}
          <Handle
            type="source"
            position={Position.Top}
            className="handle-neutral hover:scale-105 transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg"
            style={{
              width: "20px",
              height: "20px",
              minWidth: "20px",
              minHeight: "20px",
              top: "-15px", // 75% outside for easy access
              backgroundColor: handleStyles.backgroundColor,
              border: handleStyles.border,
            }}
            id="top-source"
          />

          {/* Bottom Side - Target (can receive connections) */}
          <Handle
            type="target"
            position={Position.Bottom}
            className="handle-neutral hover:scale-105 transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg"
            style={{
              width: "20px",
              height: "20px",
              minWidth: "20px",
              minHeight: "20px",
              bottom: "-15px", // 75% outside for easy access
              backgroundColor: handleStyles.backgroundColor,
              border: handleStyles.border,
            }}
            id="bottom-target"
          />

          {/* Left Side - Source (can start connections) */}
          <Handle
            type="source"
            position={Position.Left}
            className="handle-neutral hover:scale-105 transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg"
            style={{
              width: "20px",
              height: "20px",
              minWidth: "20px",
              minHeight: "20px",
              left: "-15px", // 75% outside for easy access
              backgroundColor: handleStyles.backgroundColor,
              border: handleStyles.border,
            }}
            id="left-source"
          />

          {/* Right Side - Target (can receive connections) */}
          <Handle
            type="target"
            position={Position.Right}
            className="handle-neutral hover:scale-105 transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg"
            style={{
              width: "20px",
              height: "20px",
              minWidth: "20px",
              minHeight: "20px",
              right: "-15px", // 75% outside for easy access
              backgroundColor: handleStyles.backgroundColor,
              border: handleStyles.border,
            }}
            id="right-target"
          />
        </>
      )}

      {/* Card Header */}
      <div className="p-3 border-b border-border/50">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2 flex-1">
            <span className="nodrag text-lg">
              {getCategoryIcon(card.category)}
            </span>

            {/* Category and Subcategory - Editable when editing */}
            {!isPreview && (
              <div className="flex items-center gap-1 text-xs">
                {isEditing ? (
                  <div className="nodrag flex items-center gap-1">
                    <Select
                      value={tempCategory}
                      onValueChange={(value: CardCategory) => {
                        setTempCategory(value);
                        setTempSubCategory(""); // Reset subcategory when category changes
                      }}
                    >
                      <SelectTrigger className="nodrag h-5 w-20 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="nodrag">
                        {categoryOptions.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                            className="nodrag"
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
                          <SelectTrigger className="nodrag h-5 w-16 text-xs">
                            <SelectValue placeholder="Sub" />
                          </SelectTrigger>
                          <SelectContent className="nodrag">
                            {getSubCategoryOptions(tempCategory).map(
                              (subCat) => (
                                <SelectItem
                                  key={subCat}
                                  value={subCat}
                                  className="nodrag"
                                >
                                  {subCat}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <span className="nodrag text-muted-foreground">
                      {card.category}
                    </span>
                    {card.subCategory && (
                      <>
                        <span className="nodrag text-muted-foreground">→</span>
                        <span className="nodrag text-muted-foreground">
                          {card.subCategory}
                        </span>
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Edit button moved to toolbar */}
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
                className="nodrag h-6 text-sm font-semibold"
                placeholder="Enter title..."
                autoFocus
              />
            ) : (
              <h3 className="nodrag font-semibold text-card-foreground text-sm leading-tight flex-1">
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
              className="nodrag min-h-[40px] text-xs resize-none"
              placeholder="Enter description..."
            />
          ) : card.description ? (
            <p className="nodrag text-xs text-muted-foreground line-clamp-2">
              {card.description}
            </p>
          ) : (
            <p className="nodrag text-xs text-muted-foreground/50 italic">
              No description
            </p>
          )}
        </div>
      </div>

      {/* Data/Metric Specific Content */}
      {isDataMetric && card.data && isExpanded && (
        <div className="nodrag p-3 border-b border-border/50 bg-background/50">
          <div className="nodrag space-y-2">
            {card.data.slice(0, 3).map((metric: MetricValue, index: number) => (
              <div
                key={index}
                className="nodrag flex items-center justify-between"
              >
                <span className="nodrag text-xs text-muted-foreground font-medium">
                  {metric.period}
                </span>
                <div className="nodrag flex items-center gap-2">
                  <span className="nodrag text-sm font-bold text-card-foreground">
                    {formatValue(metric.value)}
                  </span>
                  <div className="nodrag flex items-center gap-1">
                    {getTrendIcon(metric.trend)}
                    <span
                      className={cn(
                        "nodrag text-xs font-medium",
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
      <div className="nodrag p-3 space-y-2">
        {/* Causal Factors */}
        {card.causalFactors && card.causalFactors.length > 0 && (
          <div className="nodrag flex items-center gap-2 mb-2">
            <span className="nodrag text-xs text-muted-foreground">
              Causal Factor:
            </span>
            <Badge variant="purple" className="nodrag text-xs font-medium">
              {card.causalFactors[0]}
            </Badge>
          </div>
        )}

        {/* Read-only Tags */}
        <div className="nodrag space-y-1">
          <div className="nodrag flex items-center gap-1 flex-wrap">
            <span className="nodrag text-xs text-muted-foreground">Tags:</span>
            {isEditing ? (
              <TagInput
                tags={tempTags}
                onChange={setTempTags}
                placeholder="Add tags..."
                maxTags={10}
                className="nodrag text-xs"
              />
            ) : (
              <div className="nodrag">
                <TagsList
                  tags={card.tags}
                  variant="secondary"
                  showAddButton={false}
                  maxDisplayTags={2}
                  useColorfulTags={true}
                />
              </div>
            )}
          </div>
        </div>

        {/* Assignee info (if available) */}
        {card.assignees && card.assignees.length > 0 && (
          <div className="nodrag flex items-center gap-1 pt-2 border-t border-border/30">
            <Users className="nodrag h-3 w-3 text-muted-foreground" />
            <span className="nodrag text-xs text-muted-foreground">
              {card.assignees[0]}
            </span>
          </div>
        )}
      </div>

      {/* Node Toolbar - React Flow built-in positioning */}
      {!isPreview && (
        <NodeToolbar className="nodrag">
          <div className="nodrag flex items-center gap-1 bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-1">
            {/* Quick View */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewDetails()}
              className="nodrag h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600 hover:scale-110 transition-all duration-200"
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
              className="nodrag h-8 w-8 p-0 hover:bg-purple-50 hover:text-purple-600 hover:scale-110 transition-all duration-200"
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
              className="nodrag h-8 w-8 p-0 hover:bg-gray-50 hover:text-gray-600 hover:scale-110 transition-all duration-200"
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
              className="nodrag h-8 w-8 p-0 hover:bg-gray-50 hover:text-gray-600 hover:scale-110 transition-all duration-200"
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
              className="nodrag h-8 w-8 p-0 hover:bg-gray-50 hover:text-gray-600 hover:scale-110 transition-all duration-200"
              title="Comments"
            >
              <MessageSquare className="h-3 w-3" />
            </Button>

            {/* Divider */}
            <div className="w-px h-4 bg-gray-300 mx-1" />

            {/* Edit Card */}
            {!isEditing ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={startEditing}
                className="nodrag h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 hover:scale-110 transition-all duration-200"
                title="Edit Card"
              >
                <Edit className="h-3 w-3" />
              </Button>
            ) : (
              <div className="nodrag flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={saveChanges}
                  className="nodrag h-6 w-6 p-0 hover:bg-green-50 hover:text-green-600"
                  title="Save Changes"
                >
                  <Check className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={cancelEdit}
                  className="nodrag h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600"
                  title="Cancel Edit"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            {/* Divider */}
            <div className="w-px h-4 bg-gray-300 mx-1" />

            {/* Data */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewDetails("data")}
              className="nodrag h-8 w-8 p-0 hover:bg-gray-50 hover:text-gray-600 hover:scale-110 transition-all duration-200"
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
              className="nodrag h-8 w-8 p-0 hover:bg-gray-50 hover:text-gray-600 hover:scale-110 transition-all duration-200"
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
                  className="nodrag h-8 w-8 p-0 hover:bg-gray-50 hover:text-gray-600 hover:scale-110 transition-all duration-200"
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
                  className="nodrag h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 hover:scale-110 transition-all duration-200"
                  title="Delete"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="nodrag">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Card</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{card.title}"? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="nodrag">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="nodrag bg-destructive text-destructive-foreground hover:bg-destructive/90"
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

      {/* Drag Section - Moved to bottom with padding */}
      {!isPreview && (
        <div className="p-3 border-t border-border/30 bg-muted/20">
          <div className="drag-handle__custom flex justify-center cursor-grab active:cursor-grabbing">
            <div className="flex items-center gap-1 px-3 py-1.5 bg-muted/80 backdrop-blur-sm rounded-full text-xs text-muted-foreground hover:bg-muted/90 transition-colors border border-border/50 shadow-sm">
              <GripVertical className="w-3 h-3" />
              <span className="font-medium select-none">Drag</span>
              <GripVertical className="w-3 h-3" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
