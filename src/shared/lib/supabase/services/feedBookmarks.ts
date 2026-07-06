import type { SupabaseClient } from '@supabase/supabase-js';
import { resolveClient } from '@/shared/utils/authenticatedClient';

// Persistent "saved" primitive for the update feed. item_key is the feed item's
// composite id ('c:<id>' changelog, 'n:<id>' notification). RLS scopes rows to
// the owner, so user_id defaults to requesting_user_id() — we don't send it.

/** The caller's bookmarked feed item keys. */
export async function listFeedBookmarks(
  client?: SupabaseClient
): Promise<string[]> {
  const c = resolveClient(client);
  const { data, error } = await c.from('feed_bookmarks').select('item_key');
  if (error) throw new Error(error.message);
  return (data ?? []).map((r: { item_key: string }) => r.item_key);
}

export async function addFeedBookmark(
  itemKey: string,
  client?: SupabaseClient
): Promise<void> {
  const c = resolveClient(client);
  // Ignore duplicate-PK conflicts so re-bookmarking is a no-op.
  const { error } = await c
    .from('feed_bookmarks')
    .upsert({ item_key: itemKey }, { onConflict: 'user_id,item_key' });
  if (error) throw new Error(error.message);
}

export async function removeFeedBookmark(
  itemKey: string,
  client?: SupabaseClient
): Promise<void> {
  const c = resolveClient(client);
  const { error } = await c
    .from('feed_bookmarks')
    .delete()
    .eq('item_key', itemKey);
  if (error) throw new Error(error.message);
}
