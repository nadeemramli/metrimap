// Collaboration handoff + remaining work (owned by the collaboration pipeline,
// incl. the required uuid→text comment-columns migration):
// docs/backlog/collaboration-consolidation.md  — read before changing this path.
import {
  addMention,
  createComment,
  createCommentThread,
  type CommentRow,
} from '@/shared/lib/supabase/services/collaboration';
import { createNotification } from '@/shared/lib/supabase/services/collaboration';
import { getClientForEnvironment } from '@/shared/utils/authenticatedClient';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/shared/lib/supabase/types';

export interface PostCommentArgs {
  /** Existing thread to append to. When absent, a thread is lazily created. */
  threadId?: string | null;
  projectId: string;
  /** Required only when no threadId is supplied (to create the thread). */
  source?: 'canvas' | 'evidence' | 'node';
  context?: Record<string, unknown> | null;
  content: string;
  /** User ids to @mention (already de-duped by the caller). */
  mentionedIds?: string[];
  userId?: string | null;
  client?: SupabaseClient<Database>;
}

export interface PostCommentResult {
  threadId: string;
  comment: CommentRow;
}

/**
 * Single source of truth for posting a comment to the real DB tables, shared by
 * the collaboration panel and the card discussion tab. Lazily creates the thread
 * (mirrors comment-node.tsx), inserts the comment, then fans out mentions +
 * notifications. Mentions to the author itself are skipped.
 */
export async function postComment(
  args: PostCommentArgs
): Promise<PostCommentResult> {
  const client = args.client ?? getClientForEnvironment();
  const userId = args.userId ?? null;

  let threadId = args.threadId ?? null;
  if (!threadId) {
    const thread = await createCommentThread(
      {
        projectId: args.projectId,
        source: args.source ?? 'canvas',
        context: args.context ?? null,
        createdBy: userId,
      },
      client
    );
    threadId = thread.id;
  }

  const comment = await createComment(
    { threadId: threadId!, authorId: userId, content: args.content },
    client
  );

  const mentions = (args.mentionedIds ?? []).filter(
    (id) => id && id !== userId
  );
  for (const mentionedId of mentions) {
    try {
      await addMention(comment.id, mentionedId, client);
      await createNotification(
        {
          userId: mentionedId,
          type: 'mention',
          title: 'You were mentioned',
          description: args.content.slice(0, 140),
          metadata: { threadId, projectId: args.projectId, commentId: comment.id },
        },
        client
      );
    } catch (e) {
      // A mention to a non-provisioned user (no users row yet) shouldn't fail the
      // whole post — the comment is already saved. See backlog P1-12.
      console.warn('postComment: mention/notification skipped', mentionedId, e);
    }
  }

  return { threadId: threadId!, comment };
}

/**
 * Parses `@Name` tokens out of composed text and maps them back to member ids.
 * Used as a fallback when the composer's tracked id set is unavailable.
 */
export function resolveMentionIds(
  content: string,
  members: Array<{ id: string; name: string }>
): string[] {
  const ids = new Set<string>();
  for (const m of members) {
    // Match "@Name" on a word boundary; names can contain spaces so test directly.
    if (content.includes(`@${m.name}`)) ids.add(m.id);
  }
  return Array.from(ids);
}
