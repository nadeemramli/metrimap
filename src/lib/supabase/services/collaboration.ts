import {
  CreateCommentMentionSchema,
  CreateCommentSchema,
  CreateCommentThreadSchema,
  CreateNotificationSchema,
  UpdateCommentSchema,
  UpdateCommentThreadSchema,
  UpdateNotificationSchema,
} from '@/lib/validation/zod';
import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../client';
import type { Database, Tables, TablesInsert, TablesUpdate } from '../types';

export type CommentThreadRow = Tables<'comment_threads'>;
export type CommentRow = Tables<'comments'>;
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
  const client = authenticatedClient || supabase();
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
  const client = authenticatedClient || supabase();
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
  const client = authenticatedClient || supabase();
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
  const client = authenticatedClient || supabase();
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
}

export async function createComment(
  params: CreateCommentParams,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = authenticatedClient || supabase();
  const insert: CommentInsert = {
    thread_id: params.threadId,
    author_id: params.authorId ?? null,
    content: params.content,
  };
  try {
    CreateCommentSchema.parse(insert as unknown);
  } catch (e) {
    console.error('Validation error creating comment:', e);
    throw e;
  }

  const { data, error } = await client
    .from('comments')
    .insert(insert)
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
  const client = authenticatedClient || supabase();
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

export async function updateComment(
  commentId: string,
  updates: Partial<Pick<CommentRow, 'content' | 'resolved'>>,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = authenticatedClient || supabase();
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
  const client = authenticatedClient || supabase();
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
  const client = authenticatedClient || supabase();
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
  const client = authenticatedClient || supabase();
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
  const client = authenticatedClient || supabase();
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

export async function listNotifications(
  userId: string,
  options?: { unreadOnly?: boolean },
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = authenticatedClient || supabase();
  let query = client
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (options?.unreadOnly) {
    query = query.eq('read', false);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
  return (data || []) as NotificationRow[];
}

export async function markNotificationRead(
  notificationId: string,
  read: boolean = true,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = authenticatedClient || supabase();
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
