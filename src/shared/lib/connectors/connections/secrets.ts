// SERVER-ONLY connector secret store + token lifecycle (CVS-141).
//
// ⚠️ Never import this into a browser bundle. Every function takes a SERVICE-ROLE
// Supabase client (bypasses RLS) — the only role that can touch
// `connected_account_secrets`. Tokens are AES-256-GCM encrypted (crypto.ts) with
// the server env `CONNECTOR_SECRET_KEY` before they are stored, and decrypted only
// here. Callers: the OAuth-callback edge function and the fetch runtime (CVS-142+).
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, TablesUpdate } from '@/shared/lib/supabase/types';
import { decryptSecret, encryptSecret, importSecretKey } from './crypto';

type ServiceClient = SupabaseClient<Database>;

export interface AccountSecret {
  accessToken?: string;
  refreshToken?: string;
  apiKey?: string;
  tokenType?: string;
  /** ISO-8601, or null when the credential doesn't expire (e.g. an API key). */
  expiresAt?: string | null;
}

async function encMaybe(value: string | undefined, key: CryptoKey): Promise<string | null> {
  return value === undefined ? null : encryptSecret(value, key);
}
async function decMaybe(value: string | null, key: CryptoKey): Promise<string | undefined> {
  return value == null ? undefined : decryptSecret(value, key);
}

/**
 * Encrypt + store a connection's secret, then flip the account to `connected`. This
 * is the atomic "the connection now works" moment: tokens land in the service-role
 * table and the client-visible status/metadata update together.
 */
export async function storeAccountSecret(
  service: ServiceClient,
  accountId: string,
  secret: AccountSecret,
  base64Key: string,
  meta?: { sourceAccountId?: string; label?: string; scopes?: string[] }
): Promise<void> {
  const key = await importSecretKey(base64Key);
  const row = {
    account_id: accountId,
    access_token: await encMaybe(secret.accessToken, key),
    refresh_token: await encMaybe(secret.refreshToken, key),
    api_key: await encMaybe(secret.apiKey, key),
    token_type: secret.tokenType ?? null,
    expires_at: secret.expiresAt ?? null,
    updated_at: new Date().toISOString(),
  };
  const { error: secErr } = await service
    .from('connected_account_secrets')
    .upsert(row, { onConflict: 'account_id' });
  if (secErr) throw new Error(secErr.message);

  const patch: TablesUpdate<'connected_accounts'> = {
    status: 'connected',
    status_detail: null,
    last_synced_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  if (meta?.sourceAccountId !== undefined) patch.source_account_id = meta.sourceAccountId;
  if (meta?.label !== undefined) patch.source_account_label = meta.label;
  if (meta?.scopes !== undefined) patch.granted_scopes = meta.scopes;
  const { error: accErr } = await service.from('connected_accounts').update(patch).eq('id', accountId);
  if (accErr) throw new Error(accErr.message);
}

/** Read + decrypt a connection's secret. Returns null if none is stored. */
export async function readAccountSecret(
  service: ServiceClient,
  accountId: string,
  base64Key: string
): Promise<AccountSecret | null> {
  const { data, error } = await service
    .from('connected_account_secrets')
    .select('access_token, refresh_token, api_key, token_type, expires_at')
    .eq('account_id', accountId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const key = await importSecretKey(base64Key);
  return {
    accessToken: await decMaybe(data.access_token, key),
    refreshToken: await decMaybe(data.refresh_token, key),
    apiKey: await decMaybe(data.api_key, key),
    tokenType: data.token_type ?? undefined,
    expiresAt: data.expires_at ?? null,
  };
}

/** Soft-revoke: delete the token row and mark the account `revoked` (audit row stays). */
export async function revokeAccountSecret(service: ServiceClient, accountId: string): Promise<void> {
  const { error: delErr } = await service
    .from('connected_account_secrets')
    .delete()
    .eq('account_id', accountId);
  if (delErr) throw new Error(delErr.message);
  const { error: accErr } = await service
    .from('connected_accounts')
    .update({ status: 'revoked', revoked_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('id', accountId);
  if (accErr) throw new Error(accErr.message);
}

/** Record a payload-free failure on a connection (expired token, permission change, …). */
export async function markConnectionError(
  service: ServiceClient,
  accountId: string,
  detail: string
): Promise<void> {
  const { error } = await service
    .from('connected_accounts')
    .update({ status: 'error', status_detail: detail, updated_at: new Date().toISOString() })
    .eq('id', accountId);
  if (error) throw new Error(error.message);
}

/**
 * True when an OAuth token is missing an expiry or is within `skewSeconds` of
 * expiring — i.e. the caller should refresh before using it. `nowMs` is injectable
 * for tests.
 */
export function needsRefresh(
  expiresAt: string | null | undefined,
  skewSeconds = 60,
  nowMs: number = Date.now()
): boolean {
  if (!expiresAt) return false; // non-expiring credential (e.g. API key)
  const expMs = Date.parse(expiresAt);
  if (Number.isNaN(expMs)) return true; // unparseable → treat as needing refresh
  return expMs - nowMs <= skewSeconds * 1000;
}
