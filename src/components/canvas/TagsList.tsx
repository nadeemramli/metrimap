import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tag, Plus } from "lucide-react";

interface TagsListProps {
  tags: string[];
  variant?: "default" | "secondary" | "outline";
  onAddTag?: (e?: React.MouseEvent) => void;
  maxDisplayTags?: number;
  showAddButton?: boolean;
  className?: string;
}

export function TagsList({
  tags,
  variant = "secondary",
  onAddTag,
  maxDisplayTags = 3,
  showAddButton = false,
  className = "",
}: TagsListProps) {
  const displayTags = tags.slice(0, maxDisplayTags);
  const remainingCount = tags.length - maxDisplayTags;

  if (tags.length === 0 && !showAddButton) {
    return null;
  }

  return (
    <div className={`flex items-center gap-1 flex-wrap ${className}`}>
      {tags.length === 0 && showAddButton ? (
        <span className="text-xs text-muted-foreground">No tags</span>
      ) : (
        <>
          {displayTags.map((tag) => (
            <Badge
              key={tag}
              variant={variant}
              className="text-xs px-1.5 py-0.5"
            >
              {tag}
            </Badge>
          ))}

          {remainingCount > 0 && (
            <Badge variant="outline" className="text-xs px-1.5 py-0.5">
              +{remainingCount}
            </Badge>
          )}
        </>
      )}

      {showAddButton && onAddTag && (
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0 ml-1"
          onClick={onAddTag}
        >
          <Tag className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}

export default TagsList;
