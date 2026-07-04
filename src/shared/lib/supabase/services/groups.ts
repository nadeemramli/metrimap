import { supabase } from '@/shared/lib/supabase/client';
import type { Tables } from '@/shared/lib/supabase/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types';

/**
 * Workspace groups / departments (CVS-119) — within-workspace tiering that
 * feeds the node-level visibility model (access-tags CVS-120 + RLS CVS-121).
 * Thin, RLS-scoped wrappers: the DB defaults workspace_id/created_by from the
 * Clerk token, and RLS scopes every row to the requester's workspace, so the
 * client never passes workspace_id. Pass the authenticated client so RLS holds.
 */

export type WorkspaceGroup = Tables<'workspace_groups'>;
export type GroupMember = Tables<'group_members'>;
export type WorkspaceGroupWithCount = WorkspaceGroup & { member_count: number };

function db(client?: SupabaseClient<Database>) {
  return client || supabase();
}

/** All groups in the current workspace, with member counts. */
export async function listGroups(
  authenticatedClient?: SupabaseClient<Database>
): Promise<WorkspaceGroupWithCount[]> {
  const client = db(authenticatedClient);
  const [{ data: groups, error }, { data: members, error: mErr }] =
    await Promise.all([
      client.from('workspace_groups').select('*').order('name', { ascending: true }),
      client.from('group_members').select('group_id'),
    ]);
  if (error) throw error;
  if (mErr) throw mErr;

  const counts = new Map<string, number>();
  for (const m of members ?? []) {
    counts.set(m.group_id, (counts.get(m.group_id) ?? 0) + 1);
  }
  return (groups ?? []).map((g) => ({
    ...g,
    member_count: counts.get(g.id) ?? 0,
  }));
}

export async function createGroup(
  input: { name: string; description?: string | null; color?: string | null },
  authenticatedClient?: SupabaseClient<Database>
): Promise<WorkspaceGroup> {
  const client = db(authenticatedClient);
  const { data, error } = await client
    .from('workspace_groups')
    .insert({
      name: input.name.trim(),
      description: input.description ?? null,
      color: input.color ?? null,
    })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function updateGroup(
  id: string,
  patch: { name?: string; description?: string | null; color?: string | null },
  authenticatedClient?: SupabaseClient<Database>
): Promise<WorkspaceGroup> {
  const client = db(authenticatedClient);
  const { data, error } = await client
    .from('workspace_groups')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function deleteGroup(
  id: string,
  authenticatedClient?: SupabaseClient<Database>
): Promise<void> {
  const client = db(authenticatedClient);
  const { error } = await client.from('workspace_groups').delete().eq('id', id);
  if (error) throw error;
}

/** User ids belonging to a group. */
export async function listGroupMembers(
  groupId: string,
  authenticatedClient?: SupabaseClient<Database>
): Promise<GroupMember[]> {
  const client = db(authenticatedClient);
  const { data, error } = await client
    .from('group_members')
    .select('*')
    .eq('group_id', groupId);
  if (error) throw error;
  return data ?? [];
}

export async function addGroupMember(
  groupId: string,
  userId: string,
  authenticatedClient?: SupabaseClient<Database>
): Promise<void> {
  const client = db(authenticatedClient);
  const { error } = await client
    .from('group_members')
    .upsert(
      { group_id: groupId, user_id: userId },
      { onConflict: 'group_id,user_id', ignoreDuplicates: true }
    );
  if (error) throw error;
}

export async function removeGroupMember(
  groupId: string,
  userId: string,
  authenticatedClient?: SupabaseClient<Database>
): Promise<void> {
  const client = db(authenticatedClient);
  const { error } = await client
    .from('group_members')
    .delete()
    .eq('group_id', groupId)
    .eq('user_id', userId);
  if (error) throw error;
}
