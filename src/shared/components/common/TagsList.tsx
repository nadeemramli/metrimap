import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { getTagColor } from '@/shared/utils/tag-colors';
import { Tag as TagIcon } from 'lucide-react';

type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'blue'
  | 'green'
  | 'purple'
  | 'orange'
  | 'pink'
  | 'indigo'
  | 'teal'
  | 'yellow'
  | 'red'
  | 'gray';

interface TagsListProps {
  tags: string[];
  variant?: BadgeVariant;
  maxDisplayTags?: number;
  showAddButton?: boolean;
  onAddTag?: (e?: React.MouseEvent) => void;
  useColorfulTags?: boolean;
  className?: string;
}

export default function TagsList({
  tags,
  variant = 'secondary',
  maxDisplayTags = 3,
  showAddButton = false,
  onAddTag,
  useColorfulTags = true,
  className = 'flex flex-wrap gap-1',
}: TagsListProps) {
  const safeTags = Array.isArray(tags) ? tags : [];
  const visible = safeTags.slice(0, Math.max(0, maxDisplayTags));
  const remaining = Math.max(0, safeTags.length - visible.length);

  if (safeTags.length === 0 && !showAddButton) {
    return null;
  }

  return (
    <div className={className}>
      {safeTags.length === 0 && showAddButton ? (
        <span className="text-xs text-muted-foreground">No tags</span>
      ) : (
        <>
          {visible.map((tag) => (
            <Badge
              key={tag}
              variant={(useColorfulTags ? getTagColor(tag) : variant) as any}
              className="text-xs px-2.5 py-1 font-medium shadow-sm"
            >
              {tag}
            </Badge>
          ))}

          {remaining > 0 && (
            <Badge
              variant={(useColorfulTags ? 'gray' : variant) as any}
              className="text-xs px-2.5 py-1 font-medium shadow-sm"
            >
              +{remaining}
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
          aria-label="Add tag"
        >
          <TagIcon className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
