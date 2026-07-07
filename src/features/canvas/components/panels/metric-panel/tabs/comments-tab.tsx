'use client';

import CommentThread from '@/features/canvas/components/collaboration/CommentThread';
import { useCanvasNodesStore } from '@/features/canvas/stores/useCanvasNodesStore';
import { Button } from '@/shared/components/ui/button';
import { listCommentThreads } from '@/shared/lib/supabase/services/collaboration';
import { getClientForEnvironment } from '@/shared/utils/authenticatedClient';
import { MapPin } from 'lucide-react';
import * as React from 'react';
import { useParams } from 'react-router-dom';

interface CommentsTabProps {
  cardId?: string;
  // Kept for call-site compatibility (the tab persists on post).
  onSave?: () => void;
  isModified?: boolean;
  onFieldChange?: (field: string, value: any) => void;
}

/**
 * Card discussion — a thin shell over the shared Monday-style CommentThread
 * (one thread per card, keyed by `context.cardId`; same tables + realtime as
 * the canvas comment pins, so both views stay in sync).
 */
export function CommentsTab({ cardId }: CommentsTabProps) {
  const { canvasId } = useParams();
  const projectId = canvasId && canvasId !== 'new' ? canvasId : undefined;

  const [threadId, setThreadId] = React.useState<string | null>(null);
  const [resolved, setResolved] = React.useState(false);

  // Resolve (but don't create) this card's thread on open.
  React.useEffect(() => {
    let mounted = true;
    if (!projectId || !cardId) return;
    setResolved(false);
    (async () => {
      try {
        const client = getClientForEnvironment();
        const threads = await listCommentThreads(projectId, client);
        if (!mounted) return;
        const match = threads.find(
          (t) => t.source === 'node' && (t.context as any)?.cardId === cardId
        );
        setThreadId(match?.id ?? null);
      } catch (e) {
        console.error('Failed to resolve card thread', e);
      } finally {
        if (mounted) setResolved(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [projectId, cardId]);

  // Pin the SAME thread to the canvas as a comment pin (one conversation, two
  // views). Handled by CanvasPage — hidden on non-canvas surfaces (Assets).
  const [onCanvas, setOnCanvas] = React.useState(false);
  React.useEffect(() => {
    setOnCanvas(!!document.querySelector('.react-flow__viewport'));
  }, []);

  // Does a canvas pin already embed this thread? Then the button LOCATES it
  // instead of creating a duplicate (CanvasPage fit-views the existing pin).
  const pinExists = useCanvasNodesStore((s) =>
    Boolean(
      threadId &&
        s.canvasNodes.some(
          (n) =>
            n.nodeType === 'commentNode' &&
            (n.data as any)?.threadId === threadId
        )
    )
  );

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold mb-1">Discussion</h3>
          <p className="text-sm text-muted-foreground">
            Collaborate with your team on this metric. Type @ to mention someone.
          </p>
        </div>
        {onCanvas && cardId && (
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 gap-1.5"
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent('card:pin-discussion', {
                  detail: { cardId, threadId },
                })
              )
            }
            title={
              pinExists
                ? 'Locate this discussion’s pin on the canvas'
                : 'Show this discussion as a pin next to the card'
            }
          >
            <MapPin className="h-3.5 w-3.5" />
            {pinExists ? 'Show pin' : 'Pin to canvas'}
          </Button>
        )}
      </div>

      {resolved && (
        <CommentThread
          projectId={projectId}
          threadId={threadId}
          onThreadCreated={setThreadId}
          source="node"
          context={cardId ? { cardId } : null}
        />
      )}
    </div>
  );
}
