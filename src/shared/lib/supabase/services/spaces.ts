// Hierarchy (B.3): Spaces/Folders. Owner-scoped for now (re-scopes to a Clerk-org
// workspace later). A canvas (project) belongs to 0..1 space via projects.space_id.

import type { SupabaseClient } from '@supabase/supabase-js';
import { resolveClient } from '@/shared/utils/authenticatedClient';
import type { Database } from '../types';

type Client = SupabaseClient<Database>;

export interface Space {
  id: string;
  name: string;
  color: string | null;
  sort_order: number;
}

export async function listSpaces(client?: Client): Promise<Space[]> {
  const c = resolveClient(client);
  const { data, error } = await c
    .from('spaces')
    .select('id, name, color, sort_order')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Space[];
}

export async function createSpace(
  name: string,
  color?: string | null,
  client?: Client
): Promise<Space> {
  const c = resolveClient(client);
  const { data, error } = await c
    .from('spaces')
    .insert({ name, color: color ?? null })
    .select('id, name, color, sort_order')
    .single();
  if (error) throw new Error(error.message);
  return data as Space;
}

export async function renameSpace(
  id: string,
  name: string,
  client?: Client
): Promise<void> {
  const c = resolveClient(client);
  const { error } = await c
    .from('spaces')
    .update({ name, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

/** Update a space's name and/or color. */
export async function updateSpace(
  id: string,
  patch: { name?: string; color?: string | null },
  client?: Client
): Promise<void> {
  const c = resolveClient(client);
  const { error } = await c
    .from('spaces')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

/** Delete a space; its canvases unlink to Uncategorized via FK ON DELETE SET NULL. */
export async function deleteSpace(id: string, client?: Client): Promise<void> {
  const c = resolveClient(client);
  const { error } = await c.from('spaces').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

/** Move a canvas into a space (or null = Uncategorized). */
export async function setProjectSpace(
  projectId: string,
  spaceId: string | null,
  client?: Client
): Promise<void> {
  const c = resolveClient(client);
  const { error } = await c
    .from('projects')
    .update({ space_id: spaceId })
    .eq('id', projectId);
  if (error) throw new Error(error.message);
}
