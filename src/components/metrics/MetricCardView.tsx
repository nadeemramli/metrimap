
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Copy, TrendingUp, TrendingDown, Minus } from "lucide-react";
import TagsList from "@/components/canvas/TagsList";
import type { MetricCard } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MetricCardViewProps {
  card: MetricCard;
  onOpenSettings?: (cardId: string) => void;
  onCopy?: (cardId: string) => void;
  className?: string;
  showActions?: boolean;
  compact?: boolean;
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Core/Value":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "Data/Metric":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Work/Action":
      return "bg-green-100 text-green-800 border-green-200";
    case "Ideas/Hypothesis":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "Context/System":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const formatValue = (value: number): string => {
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toLocaleString();
};

const getTrendIcon = (trend: "up" | "down" | "neutral", size = 16) => {
  switch (trend) {
    case "up":
      return <TrendingUp className={`h-${size/4} w-${size/4} text-green-600`} />;
    case "down":
      return <TrendingDown className={`h-${size/4} w-${size/4} text-red-600`} />;
    default:
      return <Minus className={`h-${size/4} w-${size/4} text-gray-600`} />;
  }
};

/**
 * Reusable MetricCard component that can be used across different pages
 * Supports both compact and full display modes
 */
export function MetricCardView({
  card,
  onOpenSettings,
  onCopy,
  className,
  showActions = true,
  compact = false,
}: MetricCardViewProps) {
  const isDataMetric = card.category === "Data/Metric";
  const categoryColor = getCategoryColor(card.category);

  const handleSettings = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenSettings?.(card.id);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopy?.(card.id);
  };

  return (
    <Card className={cn("w-full transition-shadow hover:shadow-md", className)}>
      <CardHeader className={compact ? "pb-2" : "pb-3"}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className={cn(
              "text-base font-medium truncate",
              compact && "text-sm"
            )}>
              {card.title}
            </CardTitle>
            {!compact && card.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {card.description}
              </p>
            )}
          </div>
          
          {showActions && (
            <div className="flex items-center gap-1 ml-2">
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
          )}
        </div>

        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className={cn("text-xs", categoryColor)}>
            {card.category}
          </Badge>
          {card.subCategory && (
            <Badge variant="secondary" className="text-xs">
              {card.subCategory}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className={compact ? "pt-0" : "pt-2"}>
        {/* Data for Data/Metric cards */}
        {isDataMetric && card.data && card.data.length > 0 && !compact && (
          <div className="space-y-3 mb-4">
            {card.data.slice(0, 3).map((dataPoint, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {dataPoint.period || `Period ${index + 1}`}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {formatValue(dataPoint.value)}
                  </span>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(dataPoint.trend)}
                    <span className={cn(
                      "text-xs",
                      dataPoint.change_percent > 0 ? "text-green-600" : 
                      dataPoint.change_percent < 0 ? "text-red-600" : "text-gray-600"
                    )}>
                      {dataPoint.change_percent > 0 ? "+" : ""}
                      {dataPoint.change_percent.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Causal Factors */}
        {card.causalFactors && card.causalFactors.length > 0 && !compact && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-muted-foreground">Factors:</span>
            <div className="flex flex-wrap gap-1">
              {card.causalFactors.slice(0, 2).map((factor) => (
                <Badge key={factor} variant="outline" className="text-xs">
                  {factor}
                </Badge>
              ))}
              {card.causalFactors.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{card.causalFactors.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {card.tags && card.tags.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Tags:</span>
            <TagsList 
              tags={card.tags}
              variant="secondary"
              maxDisplayTags={compact ? 1 : 3}
              showAddButton={false}
            />
          </div>
        )}

        {/* Metadata */}
        {!compact && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t text-xs text-muted-foreground">
            <span>
              {new Date(card.updatedAt).toLocaleDateString()}
            </span>
            {card.assignees && card.assignees.length > 0 && (
              <span>
                Assigned to {card.assignees.length} user{card.assignees.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default MetricCardView;