import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../client';

export interface UserLite {
  id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
}

/** Batch-resolve user display info by id, keyed by id. */
export async function getUsersByIds(
  ids: string[],
  client?: SupabaseClient
): Promise<Record<string, UserLite>> {
  if (!ids.length) return {};
  const c = client || supabase();
  const { data, error } = await c
    .from('users')
    .select('id, name, email, avatar_url')
    .in('id', ids);
  if (error) throw new Error(error.message);
  const map: Record<string, UserLite> = {};
  for (const u of (data ?? []) as UserLite[]) map[u.id] = u;
  return map;
}
