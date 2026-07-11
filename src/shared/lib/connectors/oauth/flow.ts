// SERVER-ONLY OAuth connect flow (CVS-322): start (signed state → consent URL),
// callback (verify state → exchange code → store encrypted tokens → flip to
// `connected`), and source-account listing for the post-connect picker. Provider
// specifics live in providers.ts; failures land as payload-free connection errors,
// never thrown token material.
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/shared/lib/supabase/types';
import {
  markConnectionError,
  needsRefresh,
  readAccountSecret,
  storeAccountSecret,
} from '../connections/secrets';
import { recordConnectionEvent } from '../observability';
import { OAUTH_PROVIDERS, providerEnv, type SourceAccountOption } from './providers';
import { signState, verifyState } from './state';

type ServiceClient = SupabaseClient<Database>;
type EnvGetter = (key: string) => string | undefined;

export interface FlowDeps {
  service: ServiceClient;
  /** CONNECTOR_SECRET_KEY — signs state tokens AND encrypts stored secrets. */
  secretKey: string;
  /** Env lookup for provider client credentials (Deno.env.get in the edge fn). */
  getEnv: EnvGetter;
  /** The one registered OAuth redirect URI (the callback route of the edge fn). */
  redirectUri: string;
  fetchImpl?: typeof fetch;
  nowMs?: number;
}

type Ok<T> = { ok: true } & T;
type Err = { ok: false; error: string };

async function loadAccount(service: ServiceClient, accountId: string) {
  const { data, error } = await service
    .from('connected_accounts')
    .select('id, connector_id, auth_type, status, source_account_id, workspace_id')
    .eq('id', accountId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

function resolveProvider(connectorId: string) {
  return OAUTH_PROVIDERS[connectorId];
}

/** Build the consent-screen URL for a pending (or reconnecting) account. */
export async function startConnect(
  deps: FlowDeps,
  input: { accountId: string }
): Promise<Ok<{ url: string }> | Err> {
  const account = await loadAccount(deps.service, input.accountId);
  if (!account) return { ok: false, error: 'connection not found' };
  if (account.auth_type !== 'oauth2') return { ok: false, error: 'connection is not OAuth-based' };
  if (account.status === 'revoked') return { ok: false, error: 'connection is revoked — create a new one' };
  const provider = resolveProvider(account.connector_id);
  if (!provider) return { ok: false, error: `no OAuth provider registered for '${account.connector_id}'` };

  const state = await signState(
    { accountId: account.id, connectorId: account.connector_id },
    deps.secretKey,
    undefined,
    deps.nowMs
  );
  try {
    const url = provider.authUrl({
      env: providerEnv(provider, deps.getEnv),
      redirectUri: deps.redirectUri,
      state,
    });
    return { ok: true, url };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'failed to build consent URL' };
  }
}

/**
 * Complete the provider callback: verify the signed state, exchange the code, store
 * the encrypted tokens (flips the row to `connected`), and — when the provider
 * exposes exactly one bindable source account — bind it automatically.
 */
export async function completeCallback(
  deps: FlowDeps,
  input: { code: string; state: string }
): Promise<Ok<{ accountId: string; connectorId: string }> | Err> {
  const state = await verifyState(input.state, deps.secretKey, deps.nowMs);
  if (!state) return { ok: false, error: 'invalid or expired state' };

  const account = await loadAccount(deps.service, state.accountId);
  if (!account) return { ok: false, error: 'connection not found' };
  const provider = resolveProvider(account.connector_id);
  if (!provider) return { ok: false, error: `no OAuth provider registered for '${account.connector_id}'` };

  try {
    const tokens = await provider.exchange({
      code: input.code,
      env: providerEnv(provider, deps.getEnv),
      redirectUri: deps.redirectUri,
      fetchImpl: deps.fetchImpl,
    });

    // Auto-bind when unambiguous; otherwise the picker (listSources) resolves it.
    let meta: { sourceAccountId?: string; label?: string } | undefined;
    if (!account.source_account_id && provider.listSourceAccounts) {
      try {
        const options = await provider.listSourceAccounts(tokens.accessToken, deps.fetchImpl);
        if (options.length === 1) meta = { sourceAccountId: options[0].id, label: options[0].label };
      } catch {
        // Listing is best-effort at connect time — the picker can retry.
      }
    }

    await storeAccountSecret(deps.service, account.id, tokens, deps.secretKey, meta);
    await recordConnectionEvent(deps.service, {
      connectorId: account.connector_id,
      connectedAccountId: account.id,
      event: 'connection_connected',
      workspaceId: account.workspace_id ?? undefined,
    });
    return { ok: true, accountId: account.id, connectorId: account.connector_id };
  } catch (err) {
    const detail = err instanceof Error ? err.message : 'token exchange failed';
    await markConnectionError(deps.service, account.id, detail);
    await recordConnectionEvent(deps.service, {
      connectorId: account.connector_id,
      connectedAccountId: account.id,
      event: 'auth_failed',
      errorClass: 'auth',
      workspaceId: account.workspace_id ?? undefined,
    });
    return { ok: false, error: detail };
  }
}

/** List the provider-side accounts a connection can bind to (refreshing if needed). */
export async function listSources(
  deps: FlowDeps,
  input: { accountId: string }
): Promise<Ok<{ sources: SourceAccountOption[] }> | Err> {
  const account = await loadAccount(deps.service, input.accountId);
  if (!account) return { ok: false, error: 'connection not found' };
  const provider = resolveProvider(account.connector_id);
  if (!provider?.listSourceAccounts) {
    return { ok: false, error: `'${account.connector_id}' does not expose source accounts` };
  }

  let secret = await readAccountSecret(deps.service, account.id, deps.secretKey);
  if (!secret?.accessToken) return { ok: false, error: 'no credential stored — connect first' };

  if (needsRefresh(secret.expiresAt, 60, deps.nowMs) && provider.refresh && secret.refreshToken) {
    secret = {
      ...secret,
      ...(await provider.refresh(secret.refreshToken, providerEnv(provider, deps.getEnv), deps.fetchImpl)),
    };
    await storeAccountSecret(deps.service, account.id, secret, deps.secretKey);
  }

  const sources = await provider.listSourceAccounts(secret.accessToken!, deps.fetchImpl);
  return { ok: true, sources };
}
