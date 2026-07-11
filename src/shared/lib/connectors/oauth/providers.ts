// OAuth provider registry (CVS-322). One module per OAuth connector: how to build
// the consent URL, exchange the callback code, refresh a token, and enumerate the
// provider-side accounts/properties a connection can bind to. The shared start/
// callback flow (flow.ts) and edge function stay provider-agnostic — adding Shopify
// or a marketplace later is a new entry here, no callback changes.
import {
  GA4_SCOPE,
  buildGoogleAuthUrl,
  exchangeGoogleCode,
  refreshGoogleToken,
  type GoogleTokens,
} from '../adapters/ga4';

export interface ProviderEnv {
  clientId?: string;
  clientSecret?: string;
}

/** Tokens shaped for the CVS-141 secret store. */
export interface ProviderTokens {
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
  expiresAt?: string | null;
}

/** A provider-side account/property/store the user can bind the connection to. */
export interface SourceAccountOption {
  id: string;
  label: string;
}

export interface OAuthProvider {
  /** Consent-screen URL for a signed connect attempt. */
  authUrl(opts: { env: ProviderEnv; redirectUri: string; state: string }): string;
  /** Exchange the callback code for tokens. */
  exchange(opts: {
    code: string;
    env: ProviderEnv;
    redirectUri: string;
    fetchImpl?: typeof fetch;
  }): Promise<ProviderTokens>;
  /** Refresh an access token (absent for providers whose tokens don't expire). */
  refresh?(refreshToken: string, env: ProviderEnv, fetchImpl?: typeof fetch): Promise<ProviderTokens>;
  /** Enumerate bindable provider accounts (e.g. GA4 properties). */
  listSourceAccounts?(accessToken: string, fetchImpl?: typeof fetch): Promise<SourceAccountOption[]>;
  /** Env var names this provider draws its client credentials from. */
  envKeys: { clientId: string; clientSecret: string };
}

function requireEnv(env: ProviderEnv, provider: string): { clientId: string; clientSecret: string } {
  if (!env.clientId || !env.clientSecret) {
    throw new Error(`${provider} OAuth client credentials are not configured`);
  }
  return { clientId: env.clientId, clientSecret: env.clientSecret };
}

function fromGoogleTokens(t: GoogleTokens): ProviderTokens {
  return {
    accessToken: t.accessToken,
    refreshToken: t.refreshToken,
    tokenType: t.tokenType,
    expiresAt: t.expiresAt ?? null,
  };
}

const GA4_ADMIN_API = 'https://analyticsadmin.googleapis.com/v1beta';

interface AccountSummariesResponse {
  accountSummaries?: {
    displayName?: string;
    propertySummaries?: { property?: string; displayName?: string }[];
  }[];
  nextPageToken?: string;
}

/** Google / GA4: analytics.readonly covers both the Data API and Admin API reads. */
const googleGa4: OAuthProvider = {
  envKeys: { clientId: 'GOOGLE_OAUTH_CLIENT_ID', clientSecret: 'GOOGLE_OAUTH_CLIENT_SECRET' },

  authUrl({ env, redirectUri, state }) {
    const { clientId } = requireEnv(env, 'Google');
    return buildGoogleAuthUrl({ clientId, redirectUri, state, scope: GA4_SCOPE });
  },

  async exchange({ code, env, redirectUri, fetchImpl }) {
    const { clientId, clientSecret } = requireEnv(env, 'Google');
    return fromGoogleTokens(await exchangeGoogleCode({ code, clientId, clientSecret, redirectUri }, fetchImpl ?? fetch));
  },

  async refresh(refreshToken, env, fetchImpl) {
    const { clientId, clientSecret } = requireEnv(env, 'Google');
    const t = await refreshGoogleToken({ refreshToken, clientId, clientSecret }, fetchImpl ?? fetch);
    return { ...fromGoogleTokens(t), refreshToken: t.refreshToken ?? refreshToken };
  },

  async listSourceAccounts(accessToken, fetchImpl) {
    const doFetch = fetchImpl ?? fetch;
    const options: SourceAccountOption[] = [];
    let pageToken: string | undefined;
    do {
      const url = `${GA4_ADMIN_API}/accountSummaries?pageSize=200${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}`;
      const res = await doFetch(url, { headers: { authorization: `Bearer ${accessToken}` } });
      if (!res.ok) throw new Error(`GA4 accountSummaries failed (${res.status})`);
      const json = (await res.json()) as AccountSummariesResponse;
      for (const acc of json.accountSummaries ?? []) {
        for (const p of acc.propertySummaries ?? []) {
          if (!p.property) continue;
          options.push({
            id: p.property, // 'properties/123' — the GA4 adapter's propertyId shape
            label: [acc.displayName, p.displayName].filter(Boolean).join(' / ') || p.property,
          });
        }
      }
      pageToken = json.nextPageToken;
    } while (pageToken);
    return options;
  },
};

/** OAuth providers keyed by connector id (CVS-140 manifest ids). */
export const OAUTH_PROVIDERS: Record<string, OAuthProvider> = {
  ga4: googleGa4,
};

/** Resolve a provider's client credentials from an env getter (Deno.env.get, tests). */
export function providerEnv(provider: OAuthProvider, get: (key: string) => string | undefined): ProviderEnv {
  return { clientId: get(provider.envKeys.clientId), clientSecret: get(provider.envKeys.clientSecret) };
}
