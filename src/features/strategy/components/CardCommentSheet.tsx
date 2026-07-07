import { DockPanel } from '@/features/canvas/components/dock';
import { CommentsTab } from '@/features/canvas/components/panels/relationship-panel/tabs/comments-tab';
import { MessageSquare } from 'lucide-react';

// Right-side discussion panel for a Strategy card — docked below the top bar
// like every detail panel. Reuses the card CommentsTab (keyed by
// context.cardId; reads projectId from the /canvas/:id route). Fires onClosed
// so the table can refresh its per-card comment counts.

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
    <DockPanel
      open={open}
      onClose={() => {
        onOpenChange(false);
        onClosed?.();
      }}
      width="md"
      icon={<MessageSquare />}
      eyebrow="Discussion"
      title={cardTitle || 'Discussion'}
      subtitle="Comments and @mentions on this item."
    >
      {cardId && <CommentsTab cardId={cardId} />}
    </DockPanel>
  );
}
