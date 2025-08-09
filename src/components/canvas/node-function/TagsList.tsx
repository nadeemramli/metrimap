// no React import needed with automatic runtime
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";
import { getTagColor } from "@/lib/utils/tag-colors";

interface TagsListProps {
  tags: string[];
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "blue"
    | "green"
    | "purple"
    | "orange"
    | "pink"
    | "indigo"
    | "teal"
    | "yellow"
    | "red"
    | "gray";
  onAddTag?: (e?: React.MouseEvent) => void;
  maxDisplayTags?: number;
  showAddButton?: boolean;
  className?: string;
  useColorfulTags?: boolean;
}

export function TagsList({
  tags,
  variant = "secondary",
  onAddTag,
  maxDisplayTags = 3,
  showAddButton = false,
  className = "",
  useColorfulTags = true,
}: TagsListProps) {
  const displayTags = tags.slice(0, maxDisplayTags);
  const remainingCount = tags.length - maxDisplayTags;

  if (tags.length === 0 && !showAddButton) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      {tags.length === 0 && showAddButton ? (
        <span className="text-xs text-muted-foreground">No tags</span>
      ) : (
        <>
          {displayTags.map((tag) => (
            <Badge
              key={tag}
              variant={useColorfulTags ? getTagColor(tag) : variant}
              className="text-xs px-2.5 py-1 font-medium shadow-sm"
            >
              {tag}
            </Badge>
          ))}

          {remainingCount > 0 && (
            <Badge
              variant={useColorfulTags ? "gray" : "outline"}
              className="text-xs px-2.5 py-1 font-medium shadow-sm"
            >
              +{remainingCount}
            </Badge>
          )}
        </>
      )}

      {showAddButton && onAddTag && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 ml-1 hover:bg-accent rounded-full"
          onClick={onAddTag}
        >
          <Tag className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}

export default TagsList;
