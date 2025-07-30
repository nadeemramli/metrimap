import { useState } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import {
  Copy,
  Settings,
  TrendingUp,
  TrendingDown,
  Minus,
  Tag,
  Users,
  MessageSquare,
  BarChart3,
  Database,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { MetricCard as MetricCardType, MetricValue } from "@/lib/types";

interface MetricCardNodeData {
  card: MetricCardType;
  onOpenSettings?: (cardId: string) => void;
  onNodeClick?: (cardId: string, position: { x: number; y: number }) => void;
}

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

export default function MetricCard({
  data,
  selected,
}: NodeProps<MetricCardNodeData>) {
  const { card, onOpenSettings, onNodeClick } = data;
  const [isExpanded, setIsExpanded] = useState(true);

  const isDataMetric = card.category === "Data/Metric";
  const categoryColor = getCategoryColor(card.category);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement copy functionality
    console.log("Copy card:", card.id);
  };

  const handleSettings = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenSettings?.(card.id);
  };

  const handleAddTag = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Open tag input
    console.log("Add tag to:", card.id);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onNodeClick) {
      onNodeClick(card.id, card.position);
    }
  };

  return (
    <div
      className={cn(
        "bg-card border-2 rounded-lg shadow-lg min-w-[280px] max-w-[320px] cursor-pointer",
        selected ? "border-primary shadow-xl" : "border-border",
        categoryColor
      )}
      onClick={handleCardClick}
    >
      {/* Handles for connections */}
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />

      {/* Card Header */}
      <div className="p-3 border-b border-border/50">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-lg">{getCategoryIcon(card.category)}</span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>{card.category}</span>
              {card.subCategory && (
                <>
                  <span>→</span>
                  <span>{card.subCategory}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={handleCopy}
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={handleSettings}
            >
              <Settings className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Title and Description */}
        <h3 className="font-semibold text-card-foreground text-sm mb-1 leading-tight">
          {card.title}
        </h3>
        {card.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {card.description}
          </p>
        )}
      </div>

      {/* Data/Metric Specific Content */}
      {isDataMetric && card.data && isExpanded && (
        <div className="p-3 border-b border-border/50 bg-background/50">
          <div className="space-y-2">
            {card.data.slice(0, 3).map((metric, index) => (
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
            <Badge variant="outline" className="text-xs">
              {card.causalFactors[0]}
            </Badge>
          </div>
        )}

        {/* Tags */}
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-xs text-muted-foreground">Tags:</span>
          {card.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
              {tag}
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 ml-1"
            onClick={handleAddTag}
          >
            <Tag className="h-3 w-3" />
          </Button>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center justify-between pt-2 border-t border-border/30">
          <div className="flex items-center gap-1">
            {/* Assignee */}
            {card.assignees && card.assignees.length > 0 && (
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {card.assignees[0]}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Comments */}
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MessageSquare className="h-3 w-3" />
            </Button>

            {/* Chart Type (for Data/Metric cards) */}
            {isDataMetric && (
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <BarChart3 className="h-3 w-3" />
              </Button>
            )}

            {/* Data Source */}
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Database className="h-3 w-3" />
            </Button>

            {/* Dimensions */}
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Layers className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
