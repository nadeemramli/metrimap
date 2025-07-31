import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Copy, ArrowRight, TrendingUp, Link } from "lucide-react";
import type { Relationship } from "@/lib/types";
import { cn } from "@/lib/utils";

interface RelationshipViewProps {
  relationship: Relationship;
  sourceNode?: { id: string; title: string; category: string };
  targetNode?: { id: string; title: string; category: string };
  onOpenSettings?: (relationshipId: string) => void;
  onCopy?: (relationshipId: string) => void;
  className?: string;
  showActions?: boolean;
  compact?: boolean;
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "Causal":
      return "bg-red-100 text-red-800 border-red-200";
    case "Correlational":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Probabilistic":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "Hierarchical":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getConfidenceColor = (confidence: string) => {
  switch (confidence) {
    case "High":
      return "text-green-600";
    case "Medium":
      return "text-yellow-600";
    case "Low":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

/**
 * Reusable RelationshipView component that can be used across different pages
 * Displays relationship information with source and target nodes
 */
export function RelationshipView({
  relationship,
  sourceNode,
  targetNode,
  onOpenSettings,
  onCopy,
  className,
  showActions = true,
  compact = false,
}: RelationshipViewProps) {
  const typeColor = getTypeColor(relationship.type);
  const confidenceColor = getConfidenceColor(relationship.confidence);

  const handleSettings = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenSettings?.(relationship.id);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopy?.(relationship.id);
  };

  return (
    <Card className={cn("w-full transition-shadow hover:shadow-md", className)}>
      <CardHeader className={compact ? "pb-2" : "pb-3"}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle
              className={cn(
                "text-base font-medium flex items-center gap-2",
                compact && "text-sm"
              )}
            >
              <Link className="h-4 w-4 text-muted-foreground" />
              {relationship.type} Relationship
            </CardTitle>

            {/* Node Connection */}
            <div className="flex items-center gap-2 mt-2 text-sm">
              {sourceNode && (
                <span className="font-medium text-foreground truncate max-w-[120px]">
                  {sourceNode.title}
                </span>
              )}
              <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              {targetNode && (
                <span className="font-medium text-foreground truncate max-w-[120px]">
                  {targetNode.title}
                </span>
              )}
            </div>
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
          <Badge variant="outline" className={cn("text-xs", typeColor)}>
            {relationship.type}
          </Badge>
          <Badge variant="secondary" className={cn("text-xs", confidenceColor)}>
            {relationship.confidence} Confidence
          </Badge>
          {relationship.weight && (
            <Badge variant="outline" className="text-xs">
              Weight: {relationship.weight}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className={compact ? "pt-0" : "pt-2"}>
        {/* Description */}
        {relationship.evidence &&
          relationship.evidence.length > 0 &&
          !compact && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {relationship.evidence[0].summary}
            </p>
          )}

        {/* Evidence Count */}
        {relationship.evidence && relationship.evidence.length > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {relationship.evidence.length} evidence item
              {relationship.evidence.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Evidence Preview (non-compact) */}
        {!compact &&
          relationship.evidence &&
          relationship.evidence.length > 0 && (
            <div className="space-y-2 mb-3">
              {relationship.evidence.slice(0, 2).map((evidence, index) => (
                <div
                  key={evidence.id || index}
                  className="text-xs bg-muted/50 rounded p-2"
                >
                  <div className="font-medium">{evidence.title}</div>
                  <div className="text-muted-foreground truncate">
                    {evidence.summary}
                  </div>
                </div>
              ))}
              {relationship.evidence.length > 2 && (
                <div className="text-xs text-muted-foreground">
                  +{relationship.evidence.length - 2} more evidence items
                </div>
              )}
            </div>
          )}

        {/* Metadata */}
        {!compact && (
          <div className="flex items-center justify-between pt-3 border-t text-xs text-muted-foreground">
            <span>
              Created {new Date(relationship.createdAt).toLocaleDateString()}
            </span>
            <span>
              Updated {new Date(relationship.updatedAt).toLocaleDateString()}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default RelationshipView;
