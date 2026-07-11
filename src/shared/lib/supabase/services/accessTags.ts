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

/**
 * True when an RPC error means the function isn't in the DB yet (unapplied
 * migration): PostgREST 404 (PGRST202) or Postgres "does not exist" (42883).
 * Lets the callers below fall back to the legacy delete-then-insert path so the
 * deployed app keeps working until the atomic RPCs are applied to prod.
 */
function isMissingRpc(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  if (error.code === 'PGRST202' || error.code === '42883') return true;
  const msg = (error.message ?? '').toLowerCase();
  return (
    msg.includes('does not exist') ||
    (msg.includes('function') && msg.includes('not found')) ||
    msg.includes('could not find the function')
  );
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
  // Preferred: atomic DELETE+INSERT via SECURITY DEFINER RPC (single txn) so a
  // failed insert can't leave an empty audience. Fall back to the legacy
  // delete-then-insert only when the RPC isn't in the DB yet (unapplied migration).
  const { error: rpcErr } = await client.rpc('set_tag_audience' as never, {
    p_tag_id: tagId,
    p_group_ids: groupIds,
  } as never);
  if (!rpcErr) return;
  if (!isMissingRpc(rpcErr as { code?: string; message?: string })) throw rpcErr;

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
  // Atomic DELETE+INSERT via RPC (see setTagAudience) with a legacy fallback for
  // the unapplied-migration state.
  const { error: rpcErr } = await client.rpc('set_node_access_grants' as never, {
    p_card_id: metricCardId,
    p_group_ids: groupIds,
  } as never);
  if (!rpcErr) return;
  if (!isMissingRpc(rpcErr as { code?: string; message?: string })) throw rpcErr;

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

/**
 * Card ids in a project restricted for the current viewer (CVS-122) — one call
 * powers the "Restricted" badge + value masking across a canvas.
 */
export async function getMyRestrictedCards(
  projectId: string,
  authenticatedClient?: SupabaseClient<Database>
): Promise<string[]> {
  const client = db(authenticatedClient);
  const { data, error } = await client.rpc('my_restricted_cards', {
    pid: projectId,
  });
  if (error) throw error;
  return (data as string[] | null) ?? [];
}

/** Admin-only "view as <group>" preview: cards restricted for those groups. */
export async function getRestrictedCardsForGroups(
  projectId: string,
  groupIds: string[],
  authenticatedClient?: SupabaseClient<Database>
): Promise<string[]> {
  const client = db(authenticatedClient);
  const { data, error } = await client.rpc('cards_restricted_for_groups', {
    pid: projectId,
    group_ids: groupIds,
  });
  if (error) throw error;
  return (data as string[] | null) ?? [];
}

export type WorkspaceAccessTag = {
  id: string;
  name: string;
  redactionMode: RedactionMode;
  projectId: string | null;
  audienceGroupIds: string[];
};

/** Every access tag visible to the user (across their projects) + audiences —
 *  powers the admin access matrix (access tags × groups). */
export async function getWorkspaceAccessTags(
  authenticatedClient?: SupabaseClient<Database>
): Promise<WorkspaceAccessTag[]> {
  const client = db(authenticatedClient);
  const { data: tags, error } = await client
    .from('tags')
    .select('id, name, redaction_mode, project_id')
    .eq('is_access', true)
    .order('name');
  if (error) throw error;
  const ids = (tags ?? []).map((t) => t.id);
  const byTag = new Map<string, string[]>();
  if (ids.length) {
    const { data: auds, error: aErr } = await client
      .from('tag_audiences')
      .select('tag_id, group_id')
      .in('tag_id', ids);
    if (aErr) throw aErr;
    for (const a of auds ?? []) {
      const arr = byTag.get(a.tag_id) ?? [];
      arr.push(a.group_id);
      byTag.set(a.tag_id, arr);
    }
  }
  return (tags ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    redactionMode: t.redaction_mode === 'hide_node' ? 'hide_node' : 'hide_value',
    projectId: t.project_id,
    audienceGroupIds: byTag.get(t.id) ?? [],
  }));
}

export type CardAccessTag = {
  tagId: string;
  name: string;
  redactionMode: RedactionMode;
  audienceGroupIds: string[];
};

/** The access tags applied to a card + their audiences (for "Who can see this"). */
export async function getCardAccessInfo(
  metricCardId: string,
  authenticatedClient?: SupabaseClient<Database>
): Promise<CardAccessTag[]> {
  const client = db(authenticatedClient);
  const { data, error } = await client
    .from('metric_card_tags')
    .select('tag_id, tags!inner(id, name, is_access, redaction_mode)')
    .eq('metric_card_id', metricCardId);
  if (error) throw error;
  const accessTags = (data ?? []).filter(
    (r) => (r.tags as unknown as { is_access: boolean }).is_access
  );
  const result: CardAccessTag[] = [];
  for (const r of accessTags) {
    const t = r.tags as unknown as {
      id: string;
      name: string;
      redaction_mode: string;
    };
    result.push({
      tagId: t.id,
      name: t.name,
      redactionMode: t.redaction_mode === 'hide_node' ? 'hide_node' : 'hide_value',
      audienceGroupIds: await getTagAudience(t.id, client),
    });
  }
  return result;
}
