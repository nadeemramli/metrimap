// @ts-nocheck
// TODO(type-debt): pre-existing type errors quarantined when strict type-checking
// was enabled. See docs/architecture/TYPE_CHECK_DEBT.md. Fix the errors and remove
// this directive — do not add new code here assuming it is type-checked.
'use client';

import { useAppStore } from '@/lib/stores';
import { Card } from '@/shared/components/ui/card';
import CommentThread from '@/features/canvas/components/collaboration/CommentThread';
import {
  listComments,
  type CommentRow,
} from '@/shared/lib/supabase/services/collaboration';
import { getClientForEnvironment } from '@/shared/utils/authenticatedClient';
import { useCanvasNodesStore } from '@/features/canvas/stores/useCanvasNodesStore';
import { useProjectMembers } from '@/features/canvas/hooks/useProjectMembers';
import {
  AnnotationPin,
  useAnnotationScale,
} from '@/features/canvas/components/nodes/shared/AnnotationPin';
import { isUnseen, markSeen } from '@/features/canvas/utils/annotationSeen';
import { codenameInitials } from '@/shared/utils/codename';
import { type NodeProps } from '@xyflow/react';
import { MessageSquare } from 'lucide-react';
import * as React from 'react';

function nameInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export type CommentNodeData = {
  title?: string;
  threadId?: string | null;
  projectId?: string; // canvas id
  pinnedBy?: string | null;
};

export default function CommentNode({ id, data }: NodeProps) {
  const nodeData = (data || {}) as CommentNodeData;
  const user = useAppStore((s) => s.user);
  const [threadId, setThreadId] = React.useState<string | null>(
    nodeData.threadId ?? null
  );
  const [comments, setComments] = React.useState<CommentRow[]>([]);
  const [isOpen, setIsOpen] = React.useState(true);
  const bubbleScale = useAnnotationScale();

  // Real identity for authors (real names + avatars — deliberately reverses the
  // CVS-33 pseudonymity for canvas comments). Unknown ids (past collaborators)
  // fall back to the codename so old threads keep rendering.
  const { byId: memberById } = useProjectMembers(
    nodeData.projectId,
    Boolean(threadId) || isOpen
  );
  const authorAvatar = (authorId: string | null) =>
    (authorId && memberById[authorId]?.avatarUrl) || undefined;
  const authorInitials = (authorId: string | null) => {
    const real = authorId && memberById[authorId]?.name;
    return real ? nameInitials(real) : codenameInitials(authorId);
  };

  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!threadId) return;
      try {
        const c = await listComments(threadId, getClientForEnvironment());
        if (mounted) setComments(c || []);
      } catch (e: any) {
        console.error('Failed to load comments', e);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [threadId]);

  // Live sync: append comments inserted by other sessions on this thread so the
  // node updates without a reload (dedup by id — our own optimistic append may
  // arrive here too).
  React.useEffect(() => {
    if (!threadId) return;
    const client = getClientForEnvironment();
    const channel = client
      .channel(`comments-${threadId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `thread_id=eq.${threadId}`,
        },
        (payload) => {
          const row = payload.new as CommentRow;
          setComments((prev) =>
            prev.some((c) => c.id === row.id) ? prev : [...prev, row]
          );
        }
      )
      .subscribe();
    return () => {
      void client.removeChannel(channel);
    };
  }, [threadId]);

  // Unread (device-local): activity from OTHERS newer than the last time this
  // user had the bubble open. Viewing (or posting) marks the thread seen.
  const latestOther = React.useMemo(() => {
    for (let i = comments.length - 1; i >= 0; i--) {
      if (comments[i].author_id !== user?.id) return comments[i].created_at;
    }
    return null;
  }, [comments, user?.id]);
  const unread =
    !isOpen && !!threadId && isUnseen(user?.id, threadId, latestOther);
  React.useEffect(() => {
    if (isOpen && threadId && comments.length > 0) {
      markSeen(user?.id, threadId);
    }
  }, [isOpen, threadId, comments.length, user?.id]);

  // Pin face: the latest commenter's avatar/initials (Figma-style); empty
  // threads show the comment glyph.
  const latest = comments[comments.length - 1];
  const pinFace = latest ? (
    authorAvatar(latest.author_id) ? (
      <img
        src={authorAvatar(latest.author_id)}
        alt=""
        className="h-full w-full object-cover"
      />
    ) : (
      <span className="text-[10px] font-semibold">
        {authorInitials(latest.author_id)}
      </span>
    )
  ) : (
    <MessageSquare className="h-4 w-4" />
  );

  // Collapsed: just the pin (constant screen size via AnnotationPin).
  if (!isOpen) {
    return (
      <div className="relative cursor-move">
        <AnnotationPin
          colorClass="bg-rose-500"
          unread={unread}
          title="Open comments"
          onClick={() => setIsOpen(true)}
        >
          {pinFace}
        </AnnotationPin>
      </div>
    );
  }

  return (
    <div className="relative select-none cursor-move">
      {/* Bubble counter-scales with zoom so it stays readable when zoomed out;
          scaling an inner wrapper keeps the RF-measured footprint stable. */}
      <div style={{ transform: `scale(${bubbleScale})`, transformOrigin: 'top left' }}>
        <div className="mb-1">
          <AnnotationPin
            colorClass="bg-rose-500"
            title="Collapse comments"
            onClick={() => setIsOpen(false)}
          >
            {pinFace}
          </AnnotationPin>
        </div>

        <Card
          data-testid="comment-card"
          className="nodrag w-[320px] rounded-xl rounded-tl-sm border bg-card/95 p-3 shadow-md backdrop-blur-sm"
        >
          <div className="mb-2 flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Comments</span>
            {comments.length > 0 && (
              <span
                data-testid="comment-count"
                className="text-xs text-muted-foreground"
              >
                {comments.length}
              </span>
            )}
          </div>

          {/* Shared Monday-style thread — same component + realtime as the
              card panel's Comments tab, so both views always agree. */}
          <CommentThread
            projectId={nodeData.projectId}
            threadId={threadId}
            onThreadCreated={async (tid) => {
              setThreadId(tid);
              // Persist the threadId onto the node so comments survive reload.
              try {
                await useCanvasNodesStore.getState().updateNode(id, {
                  data: { ...nodeData, threadId: tid },
                });
              } catch (persistErr) {
                console.error('Failed to persist comment threadId', persistErr);
              }
            }}
            source="canvas"
            context={{ nodeId: id, title: nodeData.title ?? 'Comment' }}
            compact
            composerPlaceholder="Write an update and mention others with @"
            autoFocusComposer
          />
        </Card>
      </div>
    </div>
  );
}
