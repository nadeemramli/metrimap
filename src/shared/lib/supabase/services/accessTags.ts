import { supabase } from '@/shared/lib/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types';

/**
 * Access-tag + audience policy (CVS-120). A tag can be marked an "access tag"
 * carrying an audience of workspace groups (CVS-119); nodes with it are visible
 * only to those groups (resolved by node_visible_to_me, enforced by RLS in
 * CVS-121). A per-node allowlist (node_access_grants) is the escape hatch.
 *
 * Access columns are written directly (not via updateTag) because the generated
 * tags zod schema is `.strict()` and doesn't know is_access/redaction_mode.
 */

export type RedactionMode = 'hide_value' | 'hide_node';

function db(client?: SupabaseClient<Database>) {
  return client || supabase();
}

/** Flag/unflag a tag as an access tag and set its redaction mode. */
export async function setTagAccess(
  tagId: string,
  opts: { isAccess: boolean; redactionMode?: RedactionMode },
  authenticatedClient?: SupabaseClient<Database>
): Promise<void> {
  const client = db(authenticatedClient);
  const patch: { is_access: boolean; redaction_mode?: string } = {
    is_access: opts.isAccess,
  };
  if (opts.redactionMode) patch.redaction_mode = opts.redactionMode;
  const { error } = await client
    .from('tags')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', tagId);
  if (error) throw error;
}

/** Group ids that may see nodes carrying this access tag. */
export async function getTagAudience(
  tagId: string,
  authenticatedClient?: SupabaseClient<Database>
): Promise<string[]> {
  const client = db(authenticatedClient);
  const { data, error } = await client
    .from('tag_audiences')
    .select('group_id')
    .eq('tag_id', tagId);
  if (error) throw error;
  return (data ?? []).map((r) => r.group_id);
}

/** Replace a tag's audience with exactly `groupIds`. */
export async function setTagAudience(
  tagId: string,
  groupIds: string[],
  authenticatedClient?: SupabaseClient<Database>
): Promise<void> {
  const client = db(authenticatedClient);
  const { error: delErr } = await client
    .from('tag_audiences')
    .delete()
    .eq('tag_id', tagId);
  if (delErr) throw delErr;
  if (groupIds.length === 0) return;
  const { error } = await client
    .from('tag_audiences')
    .insert(groupIds.map((group_id) => ({ tag_id: tagId, group_id })));
  if (error) throw error;
}

/** Per-node allowlist grants (escape hatch). */
export async function getNodeAccessGrants(
  metricCardId: string,
  authenticatedClient?: SupabaseClient<Database>
): Promise<string[]> {
  const client = db(authenticatedClient);
  const { data, error } = await client
    .from('node_access_grants')
    .select('group_id')
    .eq('metric_card_id', metricCardId);
  if (error) throw error;
  return (data ?? []).map((r) => r.group_id);
}

export async function setNodeAccessGrants(
  metricCardId: string,
  groupIds: string[],
  authenticatedClient?: SupabaseClient<Database>
): Promise<void> {
  const client = db(authenticatedClient);
  const { error: delErr } = await client
    .from('node_access_grants')
    .delete()
    .eq('metric_card_id', metricCardId);
  if (delErr) throw delErr;
  if (groupIds.length === 0) return;
  const { error } = await client
    .from('node_access_grants')
    .insert(groupIds.map((group_id) => ({ metric_card_id: metricCardId, group_id })));
  if (error) throw error;
}

/**
 * Authoritative visibility of a node for the current user (mirrors the RLS
 * predicate). Used by the redaction UX (CVS-122) to preview / mask.
 */
export async function nodeVisibleToMe(
  metricCardId: string,
  authenticatedClient?: SupabaseClient<Database>
): Promise<boolean> {
  const client = db(authenticatedClient);
  const { data, error } = await client.rpc('node_visible_to_me', {
    card_id: metricCardId,
  });
  if (error) throw error;
  return data ?? false;
}
