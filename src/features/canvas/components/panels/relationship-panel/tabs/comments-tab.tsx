'use client';

import { CommentComposer } from '@/features/canvas/components/collaboration/CommentComposer';
import { useProjectMembers } from '@/features/canvas/hooks/useProjectMembers';
import { postComment } from '@/features/canvas/utils/comments';
import { useAppStore } from '@/lib/stores';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
  listCommentThreads,
  listComments,
  type CommentRow,
} from '@/shared/lib/supabase/services/collaboration';
import { getClientForEnvironment } from '@/shared/utils/authenticatedClient';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

interface CommentsTabProps {
  cardId?: string;
  // Kept for call-site compatibility; this tab now persists to the DB on post,
  // so the explicit Save controls are no longer used.
  onSave?: () => void;
  isModified?: boolean;
  onFieldChange?: (field: string, value: any) => void;
}

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/**
 * Card discussion — backed by the real comment_threads/comments tables (one
 * thread per card, keyed by `context.cardId`). Replaces the previous local
 * card-JSON storage with hardcoded "Current User" authorship. Shares the
 * @mention composer + persistence helper with the collaboration panel.
 */
export function CommentsTab({ cardId }: CommentsTabProps) {
  const { canvasId } = useParams();
  const projectId = canvasId && canvasId !== 'new' ? canvasId : undefined;
  const user = useAppStore((s) => s.user);
  const { members, byId } = useProjectMembers(projectId, Boolean(cardId));

  const [threadId, setThreadId] = React.useState<string | null>(null);
  const [comments, setComments] = React.useState<CommentRow[]>([]);
  const [posting, setPosting] = React.useState(false);

  const authorName = (id: string | null) =>
    (id && byId[id]?.name) || id || 'Unknown';

  // Resolve (but don't create) this card's thread on open.
  React.useEffect(() => {
    let mounted = true;
    if (!projectId || !cardId) return;
    const load = async () => {
      try {
        const client = getClientForEnvironment();
        const threads = await listCommentThreads(projectId, client);
        const match = threads.find(
          (t) => t.source === 'node' && (t.context as any)?.cardId === cardId
        );
        if (!mounted) return;
        if (match) {
          setThreadId(match.id);
          const c = await listComments(match.id, client);
          if (mounted) setComments(c);
        } else {
          setThreadId(null);
          setComments([]);
        }
      } catch (e) {
        console.error('Failed to load card comments', e);
      }
    };
    void load();
    return () => {
      mounted = false;
    };
  }, [projectId, cardId]);

  const handlePost = async (content: string, mentionedIds: string[]) => {
    if (!projectId || !cardId) {
      toast.error('Save the canvas before commenting');
      return;
    }
    setPosting(true);
    try {
      const { threadId: tid, comment } = await postComment({
        threadId,
        projectId,
        source: 'node',
        context: { cardId },
        content,
        mentionedIds,
        userId: user?.id,
      });
      setThreadId(tid);
      setComments((prev) => [...prev, comment]);
    } catch (e: any) {
      console.error('Failed to post comment', e);
      toast.error(e?.message || 'Could not post comment');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-1">Discussion</h3>
        <p className="text-sm text-muted-foreground">
          Collaborate with your team on this metric. Type @ to mention someone.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <CommentComposer
            members={members}
            onPost={handlePost}
            isPosting={posting}
          />
        </CardContent>
      </Card>

      <div className="space-y-3">
        {comments.map((c) => (
          <Card key={c.id}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {initials(authorName(c.author_id))}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">
                      {authorName(c.author_id)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(c.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{c.content}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {comments.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-muted-foreground">
                No comments yet. Start the discussion!
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
