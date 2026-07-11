// CLIENT-SAFE OAuth connect kickoff (CVS-322). Talks to the `connector-oauth` edge
// function — no token material ever reaches this module; the browser only sees the
// consent URL, source-account options, and connection metadata.
import { resolveClient } from '@/shared/utils/authenticatedClient';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/shared/lib/supabase/types';
import { createPendingConnection } from './connectedAccounts';
import type { SourceAccountOption } from '../oauth/providers';

type Client = SupabaseClient<Database>;

function functionsBase(): string {
  const url = import.meta.env.VITE_SUPABASE_URL ?? import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error('VITE_SUPABASE_URL is not configured');
  return `${url}/functions/v1/connector-oauth`;
}

async function callEdge<T>(path: string, jwt: string, body: unknown): Promise<T> {
  const res = await fetch(`${functionsBase()}/${path}`, {
    method: 'POST',
    headers: { authorization: `Bearer ${jwt}`, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as T & { error?: string };
  if (!res.ok) throw new Error(json.error ?? `connector-oauth/${path} failed (${res.status})`);
  return json;
}

/**
 * Begin an OAuth connect: create the `pending` row, ask the server for the consent
 * URL, and return it for the caller to `window.location.assign(...)`. On return,
 * the callback redirects back to the app with `?connector_oauth=success|error`.
 */
export async function beginOAuthConnect(
  connectorId: string,
  getToken: () => Promise<string | null>,
  authenticatedClient?: Client
): Promise<{ accountId: string; url: string }> {
  const accountId = await createPendingConnection(
    { connectorId, authType: 'oauth2' },
    resolveClient(authenticatedClient)
  );
  const jwt = await getToken();
  if (!jwt) throw new Error('not signed in');
  const { url } = await callEdge<{ url: string }>('start', jwt, { account_id: accountId });
  return { accountId, url };
}

/** Provider-side accounts (e.g. GA4 properties) the connection can bind to. */
export async function listOAuthSources(
  accountId: string,
  getToken: () => Promise<string | null>
): Promise<SourceAccountOption[]> {
  const jwt = await getToken();
  if (!jwt) throw new Error('not signed in');
  const { sources } = await callEdge<{ sources: SourceAccountOption[] }>('sources', jwt, {
    account_id: accountId,
  });
  return sources;
}

/** Bind the connection to one provider account (metadata-only update, RLS-scoped). */
export async function selectSourceAccount(
  accountId: string,
  source: SourceAccountOption,
  authenticatedClient?: Client
): Promise<void> {
  const client = resolveClient(authenticatedClient);
  const { error } = await client
    .from('connected_accounts')
    .update({
      source_account_id: source.id,
      source_account_label: source.label,
      updated_at: new Date().toISOString(),
    })
    .eq('id', accountId);
  if (error) throw new Error(error.message);
}
