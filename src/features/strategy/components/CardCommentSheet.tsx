import { CommentsTab } from '@/features/canvas/components/panels/relationship-panel/tabs/comments-tab';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';

// Right-side discussion panel for a Strategy card. Reuses the card CommentsTab
// (keyed by context.cardId; reads projectId from the /canvas/:id route). Fires
// onClosed so the table can refresh its per-card comment counts.

interface CardCommentSheetProps {
  cardId: string | null;
  cardTitle?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClosed?: () => void;
}

export function CardCommentSheet({
  cardId,
  cardTitle,
  open,
  onOpenChange,
  onClosed,
}: CardCommentSheetProps) {
  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) onClosed?.();
      }}
    >
      <SheetContent side="right" className="w-[440px] overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="truncate">
            {cardTitle || 'Discussion'}
          </SheetTitle>
          <SheetDescription>
            Comments and @mentions on this item.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 px-1">
          {cardId && <CommentsTab cardId={cardId} />}
        </div>
      </SheetContent>
    </Sheet>
  );
}
