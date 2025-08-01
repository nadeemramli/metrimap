import { useState, useRef, useEffect } from "react";
import { Handle, Position, useReactFlow, type NodeProps } from "@xyflow/react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Edit,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// AlertDialog imports removed - no longer needed in card component
import TagsList from "./TagsList";
import { TagInput } from "@/components/ui/tag-input";
import { cn } from "@/lib/utils";
import { useAccessibility } from "@/hooks/useAccessibility";
import { useCanvasStore } from "@/lib/stores/canvasStore";
import type {
  MetricCard as MetricCardType,
  MetricValue,
  CardCategory,
} from "@/lib/types";

interface MetricCardNodeData {
  card: MetricCardType;
  onOpenSettings?: (cardId: string) => void;
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
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [tempTitle, setTempTitle] = useState(card.title);
  const [tempDescription, setTempDescription] = useState(card.description);
  const [tempTags, setTempTags] = useState<string[]>(card.tags);
  const [selectedCategory, setSelectedCategory] = useState<CardCategory>(
    card.category
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState<
    string | undefined
  >(card.subCategory);

  const cardRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  const isDataMetric = card.category === "Data/Metric";
  const categoryColor = getCategoryColor(card.category);

  // Canvas store for updates
  const { updateNode, persistNodeUpdate, deleteNode, persistNodeDelete } =
    useCanvasStore();

  const { deleteElements } = useReactFlow();

  // Accessibility hooks
  const { announce, getARIAProps, createKeyboardNavigationHandler } =
    useAccessibility();

  // Announce card selection changes
  useEffect(() => {
    if (selected) {
      announce(`Selected ${card.title} metric card`);
    }
  }, [selected, card.title, announce]);

  // Focus on input when editing starts
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  useEffect(() => {
    if (isEditingDescription && descriptionInputRef.current) {
      descriptionInputRef.current.focus();
    }
  }, [isEditingDescription]);

  // Action handlers moved to context menu

  // Title editing functions
  const startEditingTitle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTempTitle(card.title);
    setIsEditingTitle(true);
  };

  const saveTitle = async () => {
    if (tempTitle.trim() && tempTitle !== card.title) {
      try {
        // Update local state
        updateNode(card.id, { title: tempTitle.trim() });
        // Persist to database
        await persistNodeUpdate(card.id, { title: tempTitle.trim() });
        console.log("✅ Title updated:", tempTitle.trim());
      } catch (error) {
        console.error("❌ Failed to update title:", error);
        setTempTitle(card.title); // Revert on error
      }
    }
    setIsEditingTitle(false);
  };

  const cancelTitleEdit = () => {
    setTempTitle(card.title);
    setIsEditingTitle(false);
  };

  // Description editing functions
  const startEditingDescription = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTempDescription(card.description);
    setIsEditingDescription(true);
  };

  const saveDescription = async () => {
    if (tempDescription !== card.description) {
      try {
        // Update local state
        updateNode(card.id, { description: tempDescription });
        // Persist to database
        await persistNodeUpdate(card.id, { description: tempDescription });
        console.log("✅ Description updated");
      } catch (error) {
        console.error("❌ Failed to update description:", error);
        setTempDescription(card.description); // Revert on error
      }
    }
    setIsEditingDescription(false);
  };

  const cancelDescriptionEdit = () => {
    setTempDescription(card.description);
    setIsEditingDescription(false);
  };

  // Category change handlers
  const handleCategoryChange = async (newCategory: CardCategory) => {
    setSelectedCategory(newCategory);
    setSelectedSubCategory(undefined); // Reset subcategory when main category changes

    try {
      // Update local state
      updateNode(card.id, {
        category: newCategory,
        subCategory: undefined,
      });
      // Persist to database
      await persistNodeUpdate(card.id, {
        category: newCategory,
        subCategory: undefined,
      });
      console.log("✅ Category updated:", newCategory);
    } catch (error) {
      console.error("❌ Failed to update category:", error);
    }
  };

  const handleSubCategoryChange = async (newSubCategory: string) => {
    setSelectedSubCategory(newSubCategory);

    try {
      // Update local state (avoid type issues with dynamic subcategory)
      updateNode(card.id, { subCategory: newSubCategory as any });
      // Persist to database
      await persistNodeUpdate(card.id, { subCategory: newSubCategory as any });
      console.log("✅ Subcategory updated:", newSubCategory);
    } catch (error) {
      console.error("❌ Failed to update subcategory:", error);
    }
  };

  // Tags editing functions
  const handleAddTag = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setTempTags([...card.tags]);
    setIsEditingTags(true);
  };

  const handleTagsChange = (newTags: string[]) => {
    setTempTags(newTags);
  };

  const saveTags = async () => {
    try {
      // Update local state
      updateNode(card.id, { tags: tempTags });
      // Persist to database
      await persistNodeUpdate(card.id, { tags: tempTags });
      console.log("✅ Tags updated:", tempTags);
    } catch (error) {
      console.error("❌ Failed to update tags:", error);
      setTempTags(card.tags); // Revert on error
    }
    setIsEditingTags(false);
  };

  const cancelTagsEdit = () => {
    setTempTags(card.tags);
    setIsEditingTags(false);
  };

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
          <div className="dragHandle cursor-move mb-2 flex items-center justify-center py-1 hover:bg-accent/20 rounded transition-colors">
            <div className="flex items-center gap-1 px-2 py-1 rounded-sm text-muted-foreground hover:text-foreground transition-colors">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="rotate-90"
              >
                <path
                  d="M9 3H15M9 12H15M9 21H15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-xs font-medium">Drag</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="rotate-90"
              >
                <path
                  d="M9 3H15M9 12H15M9 21H15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        )}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-lg">{getCategoryIcon(card.category)}</span>

            {/* Two-layer Category Selection */}
            {!isPreview && (
              <div className="flex items-center gap-1 text-xs">
                <Select
                  value={selectedCategory}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="h-6 w-auto border-none p-0 focus:ring-0 text-xs text-muted-foreground hover:text-foreground nodrag">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Core/Value">Core/Value</SelectItem>
                    <SelectItem value="Data/Metric">Data/Metric</SelectItem>
                    <SelectItem value="Work/Action">Work/Action</SelectItem>
                    <SelectItem value="Ideas/Hypothesis">
                      Ideas/Hypothesis
                    </SelectItem>
                    <SelectItem value="Metadata">Metadata</SelectItem>
                  </SelectContent>
                </Select>

                {getSubCategoryOptions(selectedCategory).length > 0 && (
                  <>
                    <span className="text-muted-foreground">→</span>
                    <Select
                      value={selectedSubCategory || ""}
                      onValueChange={handleSubCategoryChange}
                    >
                      <SelectTrigger className="h-6 w-auto border-none p-0 focus:ring-0 text-xs text-muted-foreground hover:text-foreground nodrag">
                        <SelectValue placeholder="Choose..." />
                      </SelectTrigger>
                      <SelectContent>
                        {getSubCategoryOptions(selectedCategory).map(
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
              </div>
            )}
          </div>

          {/* Action buttons removed - now handled via context menu */}
        </div>

        {/* Editable Title */}
        <div className="mb-1">
          {isEditingTitle ? (
            <div className="flex items-center gap-1">
              <Input
                ref={titleInputRef}
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === "Enter") saveTitle();
                  if (e.key === "Escape") cancelTitleEdit();
                }}
                className="h-7 text-sm font-semibold nodrag"
                placeholder="Enter title..."
              />
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 nodrag"
                onClick={saveTitle}
              >
                <Check className="h-3 w-3 text-green-600" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 nodrag"
                onClick={cancelTitleEdit}
              >
                <X className="h-3 w-3 text-red-600" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center">
              <h3 className="font-semibold text-card-foreground text-sm leading-tight flex-1">
                {card.title}
              </h3>
            </div>
          )}
        </div>

        {/* Editable Description */}
        <div>
          {isEditingDescription ? (
            <div className="space-y-1">
              <Textarea
                ref={descriptionInputRef}
                value={tempDescription}
                onChange={(e) => setTempDescription(e.target.value)}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === "Enter" && e.ctrlKey) saveDescription();
                  if (e.key === "Escape") cancelDescriptionEdit();
                }}
                className="min-h-[60px] text-xs resize-none"
                placeholder="Enter description..."
              />
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2"
                  onClick={saveDescription}
                >
                  <Check className="h-3 w-3 text-green-600 mr-1" />
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2"
                  onClick={cancelDescriptionEdit}
                >
                  <X className="h-3 w-3 text-red-600 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="group cursor-pointer"
              onClick={startEditingDescription}
            >
              {card.description ? (
                <p className="text-xs text-muted-foreground line-clamp-2 group-hover:text-foreground transition-colors">
                  {card.description}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground/50 italic group-hover:text-muted-foreground transition-colors">
                  Click to add description...
                </p>
              )}
            </div>
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

        {/* Editable Tags */}
        <div className="space-y-1">
          {isEditingTags ? (
            <div className="space-y-2">
              <TagInput
                tags={tempTags}
                onChange={handleTagsChange}
                placeholder="Add tags..."
                maxTags={10}
                variant="secondary"
                className="text-xs"
              />
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2"
                  onClick={saveTags}
                >
                  <Check className="h-3 w-3 text-green-600 mr-1" />
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2"
                  onClick={cancelTagsEdit}
                >
                  <X className="h-3 w-3 text-red-600 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-xs text-muted-foreground">Tags:</span>
              <TagsList
                tags={card.tags}
                variant="secondary"
                onAddTag={handleAddTag}
                showAddButton={true}
                maxDisplayTags={2}
                useColorfulTags={true}
              />
            </div>
          )}
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
    </div>
  );
}
