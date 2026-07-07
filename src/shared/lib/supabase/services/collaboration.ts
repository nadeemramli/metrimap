// @ts-nocheck
// TODO(type-debt): pre-existing type errors quarantined when strict type-checking
// was enabled. See docs/architecture/TYPE_CHECK_DEBT.md. Fix the errors and remove
// this directive — do not add new code here assuming it is type-checked.
import {
  CreateCommentMentionSchema,
  CreateCommentSchema,
  CreateCommentThreadSchema,
  CreateNotificationSchema,
  UpdateCommentSchema,
  UpdateCommentThreadSchema,
  UpdateNotificationSchema,
} from '@/shared/lib/validation/zod';
import type { SupabaseClient } from '@supabase/supabase-js';
import { resolveClient } from '@/shared/utils/authenticatedClient';
import type { Database, Tables, TablesInsert, TablesUpdate } from '../types';

export type CommentThreadRow = Tables<'comment_threads'>;
// parent_id landed via migration 20260708090000 (threaded replies); the
// generated Tables<> type predates it (prisma:types is broken — hand-patched).
export type CommentRow = Tables<'comments'> & { parent_id?: string | null };
export type CommentMentionRow = Tables<'comment_mentions'>;
export type NotificationRow = Tables<'notifications'>;

export type CommentThreadInsert = TablesInsert<'comment_threads'>;
export type CommentInsert = TablesInsert<'comments'>;
export type CommentUpdate = TablesUpdate<'comments'>;

export interface CreateThreadParams {
  projectId: string;
  source: 'canvas' | 'evidence' | 'node';
  context?: Record<string, unknown> | null;
  createdBy?: string | null;
}

export async function createCommentThread(
  params: CreateThreadParams,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = resolveClient(authenticatedClient);
  const insert: CommentThreadInsert = {
    project_id: params.projectId,
    source: params.source,
    context: (params.context as any) ?? null,
    created_by: params.createdBy ?? null,
  };
  try {
    CreateCommentThreadSchema.parse(insert as unknown);
  } catch (e) {
    console.error('Validation error creating comment thread:', e);
    throw e;
  }

  const { data, error } = await client
    .from('comment_threads')
    .insert(insert)
    .select('*')
    .single();

  if (error) {
    console.error('Error creating comment thread:', error);
    throw error;
  }
  return data as CommentThreadRow;
}

export async function listCommentThreads(
  projectId: string,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = resolveClient(authenticatedClient);
  const { data, error } = await client
    .from('comment_threads')
    .select('*')
    .eq('project_id', projectId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching comment threads:', error);
    throw error;
  }
  return (data || []) as CommentThreadRow[];
}

export async function updateCommentThread(
  threadId: string,
  updates: Partial<Pick<CommentThreadRow, 'is_resolved' | 'context'>>,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = resolveClient(authenticatedClient);
  const patch = {
    is_resolved: updates.is_resolved ?? undefined,
    context: (updates.context as any) ?? undefined,
    updated_at: new Date().toISOString(),
  } as const;
  try {
    UpdateCommentThreadSchema.parse(patch as unknown);
  } catch (e) {
    console.error('Validation error updating comment thread:', e);
    throw e;
  }
  const { data, error } = await client
    .from('comment_threads')
    .update(patch)
    .eq('id', threadId)
    .select('*')
    .single();

  if (error) {
    console.error('Error updating comment thread:', error);
    throw error;
  }
  return data as CommentThreadRow;
}

export async function deleteCommentThread(
  threadId: string,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = resolveClient(authenticatedClient);
  const { error } = await client
    .from('comment_threads')
    .delete()
    .eq('id', threadId);

  if (error) {
    console.error('Error deleting comment thread:', error);
    throw error;
  }
}

export interface CreateCommentParams {
  threadId: string;
  authorId?: string | null;
  content: string;
  /** Threaded reply target (Monday-style). Top-level posts omit it. */
  parentId?: string | null;
}

export async function createComment(
  params: CreateCommentParams,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = resolveClient(authenticatedClient);
  const insert: CommentInsert = {
    thread_id: params.threadId,
    author_id: params.authorId ?? null,
    content: params.content,
  };
  try {
    // Validate the base shape only — parent_id postdates the generated schema.
    CreateCommentSchema.parse(insert as unknown);
  } catch (e) {
    console.error('Validation error creating comment:', e);
    throw e;
  }

  const { data, error } = await client
    .from('comments')
    .insert({ ...insert, parent_id: params.parentId ?? null } as any)
    .select('*')
    .single();

  if (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
  return data as CommentRow;
}

export async function listComments(
  threadId: string,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = resolveClient(authenticatedClient);
  const { data, error } = await client
    .from('comments')
    .select('*')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
  return (data || []) as CommentRow[];
}

/** Fetch a single thread (for pins resolving their card/panel context). */
export async function getCommentThread(
  threadId: string,
  authenticatedClient?: SupabaseClient<Database>
): Promise<CommentThreadRow | null> {
  const client = resolveClient(authenticatedClient);
  const { data, error } = await client
    .from('comment_threads')
    .select('*')
    .eq('id', threadId)
    .maybeSingle();
  if (error) {
    console.error('Error fetching comment thread:', error);
    throw error;
  }
  return (data as CommentThreadRow) ?? null;
}

/** Likes per comment for a set of comments → { commentId: [userId, …] }. */
export async function listCommentLikes(
  commentIds: string[],
  authenticatedClient?: SupabaseClient<Database>
): Promise<Record<string, string[]>> {
  if (commentIds.length === 0) return {};
  const client = resolveClient(authenticatedClient);
  const { data, error } = await client
    .from('comment_likes' as any)
    .select('comment_id, user_id')
    .in('comment_id', commentIds);
  if (error) {
    console.error('Error fetching comment likes:', error);
    throw error;
  }
  const map: Record<string, string[]> = {};
  for (const row of (data || []) as Array<{
    comment_id: string;
    user_id: string;
  }>) {
    (map[row.comment_id] ??= []).push(row.user_id);
  }
  return map;
}

/** Like/unlike a comment for the given user (RLS enforces self-only). */
export async function setCommentLike(
  commentId: string,
  userId: string,
  liked: boolean,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = resolveClient(authenticatedClient);
  if (liked) {
    const { error } = await client
      .from('comment_likes' as any)
      .upsert({ comment_id: commentId, user_id: userId } as any, {
        onConflict: 'comment_id,user_id',
      });
    if (error) throw error;
  } else {
    const { error } = await client
      .from('comment_likes' as any)
      .delete()
      .eq('comment_id', commentId)
      .eq('user_id', userId);
    if (error) throw error;
  }
}

export async function updateComment(
  commentId: string,
  updates: Partial<Pick<CommentRow, 'content' | 'resolved'>>,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = resolveClient(authenticatedClient);
  const patch: CommentUpdate = {
    content: updates.content ?? undefined,
    resolved: updates.resolved ?? undefined,
    updated_at: new Date().toISOString(),
  } as any;
  try {
    UpdateCommentSchema.parse(patch as unknown);
  } catch (e) {
    console.error('Validation error updating comment:', e);
    throw e;
  }

  const { data, error } = await client
    .from('comments')
    .update(patch)
    .eq('id', commentId)
    .select('*')
    .single();

  if (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
  return data as CommentRow;
}

export async function deleteComment(
  commentId: string,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = resolveClient(authenticatedClient);
  const { error } = await client.from('comments').delete().eq('id', commentId);

  if (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
}

export async function addMention(
  commentId: string,
  mentionedUserId: string,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = resolveClient(authenticatedClient);
  const payload = {
    comment_id: commentId,
    mentioned_user_id: mentionedUserId,
  } as const;
  try {
    CreateCommentMentionSchema.parse(payload as unknown);
  } catch (e) {
    console.error('Validation error adding mention:', e);
    throw e;
  }
  const { data, error } = await client
    .from('comment_mentions')
    .insert(payload)
    .select('*')
    .single();

  if (error) {
    console.error('Error adding mention:', error);
    throw error;
  }
  return data as CommentMentionRow;
}

export async function listMentionsForUser(
  userId: string,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = resolveClient(authenticatedClient);
  const { data, error } = await client
    .from('comment_mentions')
    .select('*')
    .eq('mentioned_user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching mentions:', error);
    throw error;
  }
  return (data || []) as CommentMentionRow[];
}

export interface CreateNotificationParams {
  userId: string;
  type: string;
  title?: string | null;
  description?: string | null;
  metadata?: Record<string, unknown> | null;
}

export async function createNotification(
  params: CreateNotificationParams,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = resolveClient(authenticatedClient);
  const payload = {
    user_id: params.userId,
    type: params.type,
    title: params.title ?? null,
    description: params.description ?? null,
    metadata: (params.metadata as any) ?? null,
  } as const;
  try {
    CreateNotificationSchema.parse(payload as unknown);
  } catch (e) {
    console.error('Validation error creating notification:', e);
    throw e;
  }
  const { data, error } = await client
    .from('notifications')
    .insert(payload)
    .select('*')
    .single();

  if (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
  return data as NotificationRow;
}

/**
 * Emit an 'assigned' notification to each newly-added card assignee (CVS-73).
 * Cross-user notifications are RLS-blocked for clients, so this goes through the
 * `notify_card_assigned` SECURITY DEFINER RPC, which verifies project access and
 * skips the caller. Pass only the NEWLY added ids so re-saves don't re-notify.
 */
export async function notifyCardAssigned(
  cardId: string,
  userIds: string[],
  authenticatedClient?: SupabaseClient<Database>
): Promise<void> {
  if (!userIds || userIds.length === 0) return;
  const client = resolveClient(authenticatedClient);
  const { error } = await client.rpc('notify_card_assigned' as never, {
    p_card_id: cardId,
    p_user_ids: userIds,
  } as never);
  if (error) {
    console.error('Error emitting assigned notification:', error);
    throw error;
  }
}

export interface NotificationFilter {
  unreadOnly?: boolean;
  // Restrict to these notification types (e.g. ['mention'], ['assigned']).
  types?: string[];
  // Only notifications newer than N days (e.g. 3, 7).
  sinceDays?: number;
}

export async function listNotifications(
  userId: string,
  options?: NotificationFilter,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = resolveClient(authenticatedClient);
  let query = client
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (options?.unreadOnly) {
    query = query.eq('read', false);
  }
  if (options?.types && options.types.length > 0) {
    query = query.in('type', options.types);
  }
  if (options?.sinceDays && options.sinceDays > 0) {
    const since = new Date(
      Date.now() - options.sinceDays * 24 * 60 * 60 * 1000
    ).toISOString();
    query = query.gte('created_at', since);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
  return (data || []) as NotificationRow[];
}

export async function getUnreadNotificationCount(
  userId: string,
  authenticatedClient?: SupabaseClient<Database>
): Promise<number> {
  const client = resolveClient(authenticatedClient);
  const { count, error } = await client
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('read', false);
  if (error) {
    console.error('Error counting unread notifications:', error);
    return 0;
  }
  return count ?? 0;
}

export async function markAllNotificationsRead(
  userId: string,
  authenticatedClient?: SupabaseClient<Database>
): Promise<void> {
  const client = resolveClient(authenticatedClient);
  const { error } = await client
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false);
  if (error) {
    console.error('Error marking all notifications read:', error);
    throw error;
  }
}

export async function markNotificationRead(
  notificationId: string,
  read: boolean = true,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = resolveClient(authenticatedClient);
  const patch = { read } as const;
  try {
    UpdateNotificationSchema.parse(patch as unknown);
  } catch (e) {
    console.error('Validation error updating notification:', e);
    throw e;
  }
  const { data, error } = await client
    .from('notifications')
    .update(patch)
    .eq('id', notificationId)
    .select('*')
    .single();

  if (error) {
    console.error('Error updating notification:', error);
    throw error;
  }
  return data as NotificationRow;
}

/**
 * Batched per-card comment counts for a project. One threads query (to map
 * each node thread → its cardId) + one comments query (counting rows across
 * all those threads), tallied client-side. Cheap enough for a table of cards;
 * avoids the per-thread N+1 loop used elsewhere.
 */
export async function getCommentCountsByCard(
  projectId: string,
  authenticatedClient?: SupabaseClient<Database>
): Promise<Record<string, number>> {
  const client = resolveClient(authenticatedClient);

  const threads = await listCommentThreads(projectId, client);
  const threadToCard: Record<string, string> = {};
  for (const t of threads) {
    const cardId = (t.context as any)?.cardId;
    if (t.source === 'node' && typeof cardId === 'string') {
      threadToCard[t.id] = cardId;
    }
  }

  const threadIds = Object.keys(threadToCard);
  if (threadIds.length === 0) return {};

  const { data, error } = await client
    .from('comments')
    .select('thread_id')
    .in('thread_id', threadIds);
  if (error) {
    console.error('Error counting card comments:', error);
    throw error;
  }

  const counts: Record<string, number> = {};
  for (const row of data || []) {
    const cardId = threadToCard[(row as { thread_id: string }).thread_id];
    if (cardId) counts[cardId] = (counts[cardId] ?? 0) + 1;
  }
  return counts;
}
