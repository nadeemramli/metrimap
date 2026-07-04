// Workspace API keys for the metrics read/write API (edge fn `metrics-api`).
// The full key is shown to the user ONCE; only its SHA-256 hash is stored.

import type { SupabaseClient } from '@supabase/supabase-js';
import { resolveClient } from '@/shared/utils/authenticatedClient';
import type { Database } from '../types';

type Client = SupabaseClient<Database>;

export interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  created_at: string;
  last_used_at: string | null;
}

async function sha256hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function randomKey(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
  return `mk_live_${hex}`;
}

export async function listApiKeys(client?: Client): Promise<ApiKey[]> {
  const c = resolveClient(client);
  const { data, error } = await c
    .from('api_keys')
    .select('id, name, key_prefix, created_at, last_used_at')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as ApiKey[];
}

/** Generate a key, store only its hash, and return the full key ONCE. */
export async function createApiKey(
  name: string,
  client?: Client
): Promise<{ key: string; row: ApiKey }> {
  const c = resolveClient(client);
  const key = randomKey();
  const key_hash = await sha256hex(key);
  const key_prefix = key.slice(0, 12); // e.g. "mk_live_a1b2"
  const { data, error } = await c
    .from('api_keys')
    .insert({ name, key_hash, key_prefix })
    .select('id, name, key_prefix, created_at, last_used_at')
    .single();
  if (error) throw new Error(error.message);
  return { key, row: data as ApiKey };
}

export async function deleteApiKey(id: string, client?: Client): Promise<void> {
  const c = resolveClient(client);
  const { error } = await c.from('api_keys').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
