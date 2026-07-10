// SERVER-ONLY credential resolution + token refresh (CVS-320). Before every run:
// read the encrypted secret (CVS-141), refresh an expiring OAuth token through the
// provider's refresher, persist the rotated token, and hand the runtime an opaque
// ConnectorCredentials object. A refresh/auth failure marks the connection `error`
// (payload-free) and records an `auth_failed` connection event — never a silent zero.
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/shared/lib/supabase/types';
import { refreshGoogleToken } from '../adapters/ga4';
import {
  markConnectionError,
  needsRefresh,
  readAccountSecret,
  storeAccountSecret,
  type AccountSecret,
} from '../connections/secrets';
import { recordConnectionEvent } from '../observability';
import { ConnectorFetchError, type ConnectorCredentials } from '../runtime';

type ServiceClient = SupabaseClient<Database>;

/** Server env the refreshers draw provider client credentials from. */
export interface HostEnv {
  googleClientId?: string;
  googleClientSecret?: string;
}

export type TokenRefresher = (
  secret: AccountSecret,
  env: HostEnv,
  fetchImpl: typeof fetch
) => Promise<AccountSecret>;

async function refreshGoogle(secret: AccountSecret, env: HostEnv, fetchImpl: typeof fetch): Promise<AccountSecret> {
  if (!secret.refreshToken) throw new Error('no refresh token stored — reconnect the account');
  if (!env.googleClientId || !env.googleClientSecret) {
    throw new Error('GOOGLE_OAUTH_CLIENT_ID / _SECRET not configured');
  }
  const tokens = await refreshGoogleToken(
    { refreshToken: secret.refreshToken, clientId: env.googleClientId, clientSecret: env.googleClientSecret },
    fetchImpl
  );
  return {
    accessToken: tokens.accessToken,
    // Google usually omits a new refresh token on refresh — keep the old one.
    refreshToken: tokens.refreshToken ?? secret.refreshToken,
    tokenType: tokens.tokenType ?? secret.tokenType,
    expiresAt: tokens.expiresAt ?? null,
  };
}

/** Provider refreshers keyed by connector id. OAuth connectors register here (CVS-146+). */
export const TOKEN_REFRESHERS: Record<string, TokenRefresher> = {
  ga4: refreshGoogle,
};

export interface ResolveCredentialsInput {
  accountId: string;
  connectorId: string;
  workspaceId?: string;
  secretKey: string; // CONNECTOR_SECRET_KEY (base64)
  env: HostEnv;
  fetchImpl?: typeof fetch;
  nowMs?: number;
}

/**
 * Resolve run credentials for a connected account: decrypt the stored secret,
 * refresh-and-rotate an expiring OAuth token, and return the opaque credentials
 * the adapter consumes (`access_token` or `api_key` — matching the adapter contract).
 * Throws a classified `auth` ConnectorFetchError after marking the connection.
 */
export async function resolveCredentials(
  service: ServiceClient,
  input: ResolveCredentialsInput
): Promise<ConnectorCredentials> {
  const fetchImpl = input.fetchImpl ?? fetch;
  const fail = async (detail: string): Promise<never> => {
    await markConnectionError(service, input.accountId, detail);
    await recordConnectionEvent(service, {
      connectorId: input.connectorId,
      connectedAccountId: input.accountId,
      event: 'auth_failed',
      errorClass: 'auth',
      workspaceId: input.workspaceId,
    });
    throw new ConnectorFetchError('auth', detail);
  };

  let secret = await readAccountSecret(service, input.accountId, input.secretKey);
  if (!secret) return fail('no credential stored for this connection');

  if (secret.apiKey) return { api_key: secret.apiKey };

  if (needsRefresh(secret.expiresAt, 60, input.nowMs)) {
    const refresher = TOKEN_REFRESHERS[input.connectorId];
    if (!refresher) return fail('access token expired and no refresher is registered');
    try {
      secret = await refresher(secret, input.env, fetchImpl);
    } catch (err) {
      return fail(`token refresh failed: ${err instanceof Error ? err.message : 'unknown error'}`);
    }
    // Rotated token is persisted before use so a crash mid-run never strands it.
    await storeAccountSecret(service, input.accountId, secret, input.secretKey);
    await recordConnectionEvent(service, {
      connectorId: input.connectorId,
      connectedAccountId: input.accountId,
      event: 'connection_refreshed',
      workspaceId: input.workspaceId,
    });
  }

  if (!secret.accessToken) return fail('no access token stored for this connection');
  return { access_token: secret.accessToken };
}
