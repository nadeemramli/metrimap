// The one Monday-style comment surface, shared by every place that shows a
// discussion (card panel Comments tab, canvas comment pins, task/value panels…).
// Composer on top; newest post first; each post = card with author header,
// mention-highlighted body, Like/Reply bar, indented replies, and an inline
// reply composer. Realtime INSERT subscription keeps every mounted view of the
// same thread in sync — pin and panel always agree.
import { CommentComposer } from '@/features/canvas/components/collaboration/CommentComposer';
import { useProjectMembers } from '@/features/canvas/hooks/useProjectMembers';
import { postComment } from '@/features/canvas/utils/comments';
import { useAppStore } from '@/lib/stores';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import {
  listCommentLikes,
  listComments,
  setCommentLike,
  type CommentRow,
} from '@/shared/lib/supabase/services/collaboration';
import { getClientForEnvironment } from '@/shared/utils/authenticatedClient';
import { codenameInitials, userCodename } from '@/shared/utils/codename';
import { cn } from '@/shared/utils';
import { Reply, ThumbsUp } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

function relativeTime(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'now';
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

function nameInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/** Highlight "@Name" tokens (longest member names first) in Monday blue. */
function MentionText({ text, names }: { text: string; names: string[] }) {
  const parts = React.useMemo(() => {
    if (names.length === 0) return [text];
    const sorted = [...names].sort((a, b) => b.length - a.length);
    const pattern = new RegExp(
      `(@(?:${sorted
        .map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('|')}))`,
      'g'
    );
    return text.split(pattern);
  }, [text, names]);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('@') ? (
          <span
            key={i}
            className="rounded bg-primary/10 px-0.5 font-medium text-primary"
          >
            {p}
          </span>
        ) : (
          <React.Fragment key={i}>{p}</React.Fragment>
        )
      )}
    </>
  );
}

export interface CommentThreadProps {
  projectId?: string;
  /** Existing thread; null lazily creates one on first post. */
  threadId: string | null;
  /** Called when a first post created the thread (persist the id upstream). */
  onThreadCreated?: (threadId: string) => void;
  /** Thread creation params (used only when threadId is null). */
  source?: 'canvas' | 'node' | 'evidence';
  context?: Record<string, unknown> | null;
  /** Tight spacing + capped height for the canvas pin bubble. */
  compact?: boolean;
  /** Hide composers (view-only access). */
  readOnly?: boolean;
  composerPlaceholder?: string;
  autoFocusComposer?: boolean;
  className?: string;
}

export function CommentThread({
  projectId,
  threadId: threadIdProp,
  onThreadCreated,
  source = 'node',
  context = null,
  compact = false,
  readOnly = false,
  composerPlaceholder = 'Write an update and mention others with @',
  autoFocusComposer = false,
  className,
}: CommentThreadProps) {
  const user = useAppStore((s) => s.user);
  const [threadId, setThreadId] = React.useState<string | null>(threadIdProp);
  React.useEffect(() => setThreadId(threadIdProp), [threadIdProp]);

  const [comments, setComments] = React.useState<CommentRow[]>([]);
  const [likes, setLikes] = React.useState<Record<string, string[]>>({});
  const [posting, setPosting] = React.useState(false);
  const [replyTo, setReplyTo] = React.useState<string | null>(null);

  const { members, byId } = useProjectMembers(projectId, true);
  const authorName = (id: string | null) =>
    (id && byId[id]?.name) || userCodename(id);
  const authorAvatar = (id: string | null) =>
    (id && byId[id]?.avatarUrl) || undefined;
  const authorInitials = (id: string | null) => {
    const real = id && byId[id]?.name;
    return real ? nameInitials(real) : codenameInitials(id);
  };
  const memberNames = React.useMemo(
    () => members.map((m) => m.name).filter(Boolean),
    [members]
  );

  // Load comments + likes.
  React.useEffect(() => {
    let mounted = true;
    if (!threadId) {
      setComments([]);
      setLikes({});
      return;
    }
    (async () => {
      try {
        const client = getClientForEnvironment();
        const rows = await listComments(threadId, client);
        if (!mounted) return;
        setComments(rows);
        const likeMap = await listCommentLikes(
          rows.map((r) => r.id),
          client
        );
        if (mounted) setLikes(likeMap);
      } catch (e) {
        console.error('Failed to load thread', e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [threadId]);

  // Realtime: any INSERT on this thread (from the pin, the panel, another
  // session…) lands here — this is what keeps all views in sync.
  React.useEffect(() => {
    if (!threadId) return;
    const client = getClientForEnvironment();
    const channel = client
      .channel(`thread-${threadId}-${Math.random().toString(36).slice(2, 8)}`)
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

  const post = async (
    content: string,
    mentionedIds: string[],
    parentId: string | null
  ) => {
    if (!projectId) {
      toast.error('Save the canvas before commenting');
      return;
    }
    setPosting(true);
    try {
      const { threadId: tid, comment } = await postComment({
        threadId,
        projectId,
        source,
        context,
        content,
        mentionedIds,
        userId: user?.id,
        parentId,
      });
      if (!threadId) {
        setThreadId(tid);
        onThreadCreated?.(tid);
      }
      setComments((prev) =>
        prev.some((c) => c.id === comment.id) ? prev : [...prev, comment]
      );
      setReplyTo(null);
    } catch (e: any) {
      console.error('Failed to post comment', e);
      toast.error(e?.message || 'Could not post comment');
    } finally {
      setPosting(false);
    }
  };

  const toggleLike = async (commentId: string) => {
    if (!user?.id) return;
    const mine = (likes[commentId] || []).includes(user.id);
    // Optimistic flip.
    setLikes((prev) => ({
      ...prev,
      [commentId]: mine
        ? (prev[commentId] || []).filter((id) => id !== user.id)
        : [...(prev[commentId] || []), user.id],
    }));
    try {
      await setCommentLike(commentId, user.id, !mine);
    } catch (e) {
      console.error('Failed to toggle like', e);
      // Roll back.
      setLikes((prev) => ({
        ...prev,
        [commentId]: mine
          ? [...(prev[commentId] || []), user.id]
          : (prev[commentId] || []).filter((id) => id !== user.id),
      }));
    }
  };

  // Monday structure: top-level posts (newest first), replies nested (oldest first).
  const posts = React.useMemo(
    () => comments.filter((c) => !c.parent_id).reverse(),
    [comments]
  );
  const repliesFor = React.useCallback(
    (postId: string) => comments.filter((c) => c.parent_id === postId),
    [comments]
  );

  const AuthorAvatar = ({
    id,
    size = 'md',
  }: {
    id: string | null;
    size?: 'sm' | 'md';
  }) => (
    <Avatar className={size === 'sm' ? 'h-6 w-6' : 'h-8 w-8'}>
      <AvatarImage src={authorAvatar(id)} alt="" />
      <AvatarFallback
        className={cn(
          'bg-muted font-medium text-muted-foreground',
          size === 'sm' ? 'text-[10px]' : 'text-xs'
        )}
      >
        {authorInitials(id)}
      </AvatarFallback>
    </Avatar>
  );

  const LikeButton = ({ commentId, small }: { commentId: string; small?: boolean }) => {
    const ids = likes[commentId] || [];
    const mine = !!user?.id && ids.includes(user.id);
    return (
      <button
        type="button"
        onClick={() => toggleLike(commentId)}
        className={cn(
          'nodrag flex items-center gap-1 transition-colors',
          small ? 'text-[11px]' : 'text-xs',
          mine
            ? 'font-medium text-primary'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <ThumbsUp className={cn(small ? 'h-3 w-3' : 'h-3.5 w-3.5', mine && 'fill-current')} />
        Like{ids.length > 0 && <span>· {ids.length}</span>}
      </button>
    );
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Top composer */}
      {!readOnly && (
        <div className="rounded-xl border border-border bg-card p-2">
          <CommentComposer
            members={members}
            onPost={(content, mentionedIds) => post(content, mentionedIds, null)}
            placeholder={composerPlaceholder}
            isPosting={posting}
            autoFocus={autoFocusComposer}
          />
        </div>
      )}

      {/* Posts, newest first */}
      <div
        className={cn(
          'space-y-3',
          compact && 'max-h-72 overflow-y-auto pr-1'
        )}
      >
        {posts.map((p) => {
          const replies = repliesFor(p.id);
          return (
            <div
              key={p.id}
              className="overflow-hidden rounded-xl border border-border bg-card"
            >
              {/* Post header + body */}
              <div className={compact ? 'p-2.5' : 'p-3'}>
                <div className="flex items-center gap-2">
                  <AuthorAvatar id={p.author_id} />
                  <span className="text-sm font-semibold">
                    {authorName(p.author_id)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {relativeTime(p.created_at)}
                  </span>
                </div>
                <div className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed">
                  <MentionText text={p.content} names={memberNames} />
                </div>
              </div>

              {/* Like / Reply bar */}
              <div className="flex items-center border-t border-border">
                <div className="flex flex-1 items-center justify-center py-1.5">
                  <LikeButton commentId={p.id} />
                </div>
                <div className="h-5 w-px bg-border" />
                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => setReplyTo(replyTo === p.id ? null : p.id)}
                    className="nodrag flex flex-1 items-center justify-center gap-1 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Reply className="h-3.5 w-3.5" />
                    Reply
                  </button>
                )}
              </div>

              {/* Replies */}
              {(replies.length > 0 || replyTo === p.id) && (
                <div className="space-y-2 border-t border-border bg-muted/30 p-2.5">
                  {replies.map((r) => (
                    <div key={r.id} className="flex items-start gap-2">
                      <AuthorAvatar id={r.author_id} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="rounded-lg bg-muted/70 px-2.5 py-1.5">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xs font-semibold">
                              {authorName(r.author_id)}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {relativeTime(r.created_at)}
                            </span>
                          </div>
                          <div className="mt-0.5 whitespace-pre-wrap break-words text-sm leading-snug">
                            <MentionText text={r.content} names={memberNames} />
                          </div>
                        </div>
                        <div className="mt-1 pl-1">
                          <LikeButton commentId={r.id} small />
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Inline reply composer */}
                  {replyTo === p.id && (
                    <div className="flex items-start gap-2">
                      <AuthorAvatar id={user?.id ?? null} size="sm" />
                      <div className="min-w-0 flex-1">
                        <CommentComposer
                          members={members}
                          onPost={(content, mentionedIds) =>
                            post(content, mentionedIds, p.id)
                          }
                          placeholder="Write a reply and mention others with @"
                          isPosting={posting}
                          autoFocus
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {posts.length === 0 && (
          <div className="rounded-xl border border-dashed border-border py-6 text-center text-xs text-muted-foreground">
            No updates yet — write the first one.
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentThread;
