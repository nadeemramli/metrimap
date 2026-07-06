// Client access layer for connected accounts (CVS-141).
//
// Metadata ONLY — this module never reads or writes token material. Connection
// rows are RLS-scoped (owner or workspace), so the browser only ever sees status,
// scopes, labels, and timestamps. Tokens live in `connected_account_secrets`,
// which is service-role-only (see secrets.ts + the migration).
import { resolveClient } from '@/shared/utils/authenticatedClient';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/shared/lib/supabase/types';

export type ConnectorAuthType = 'oauth2' | 'api_key';
export type ConnectionStatus = 'pending' | 'connected' | 'error' | 'revoked';

export interface ConnectedAccount {
  id: string;
  connector_id: string;
  auth_type: ConnectorAuthType;
  source_account_id: string | null;
  source_account_label: string | null;
  granted_scopes: string[];
  status: ConnectionStatus;
  status_detail: string | null;
  last_synced_at: string | null;
  last_query_at: string | null;
  revoked_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateConnectionInput {
  connectorId: string;
  authType: ConnectorAuthType;
  sourceAccountId?: string;
  label?: string;
  scopes?: string[];
}

type Client = SupabaseClient<Database>;

const COLUMNS =
  'id, connector_id, auth_type, source_account_id, source_account_label, granted_scopes, status, status_detail, last_synced_at, last_query_at, revoked_at, created_at, updated_at';

/** List the caller's connected accounts (workspace-scoped, no secrets). */
export async function listConnectedAccounts(authenticatedClient?: Client): Promise<ConnectedAccount[]> {
  const client = resolveClient(authenticatedClient);
  const { data, error } = await client
    .from('connected_accounts')
    .select(COLUMNS)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as ConnectedAccount[];
}

/** Fetch one connected account by id (or null if not visible). */
export async function getConnectedAccount(
  id: string,
  authenticatedClient?: Client
): Promise<ConnectedAccount | null> {
  const client = resolveClient(authenticatedClient);
  const { data, error } = await client
    .from('connected_accounts')
    .select(COLUMNS)
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as ConnectedAccount | null) ?? null;
}

/**
 * Start a connection: insert a `pending` metadata row and return its id. The OAuth
 * callback / API-key handler then stores the token server-side and flips the row to
 * `connected` (see secrets.storeAccountSecret). created_by + workspace_id come from
 * the RLS defaults.
 */
export async function createPendingConnection(
  input: CreateConnectionInput,
  authenticatedClient?: Client
): Promise<string> {
  const client = resolveClient(authenticatedClient);
  const { data, error } = await client
    .from('connected_accounts')
    .insert({
      connector_id: input.connectorId,
      auth_type: input.authType,
      source_account_id: input.sourceAccountId ?? null,
      source_account_label: input.label ?? null,
      granted_scopes: input.scopes ?? [],
      status: 'pending',
    })
    .select('id')
    .single();
  if (error) throw new Error(error.message);
  return (data as { id: string }).id;
}

/** Rename a connection's human label. */
export async function renameConnection(
  id: string,
  label: string,
  authenticatedClient?: Client
): Promise<void> {
  const client = resolveClient(authenticatedClient);
  const { error } = await client
    .from('connected_accounts')
    .update({ source_account_label: label, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

/**
 * Disconnect + delete a connection. The FK `ON DELETE CASCADE` drops its secret row
 * too, so no token material survives. (For a soft revoke that keeps the audit row,
 * use the server-side `revokeAccountSecret`.)
 */
export async function removeConnection(id: string, authenticatedClient?: Client): Promise<void> {
  const client = resolveClient(authenticatedClient);
  const { error } = await client.from('connected_accounts').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
