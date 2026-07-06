// Google OAuth 2.0 for the GA4 connector (CVS-146). Standard auth-code flow with
// offline access so we get a refresh token. Client id/secret come from server env
// (GOOGLE_OAUTH_CLIENT_ID / _SECRET — owner setup CVS-280); the returned tokens are
// stored encrypted via the connection layer (CVS-141). `fetchImpl` is injectable for tests.
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

/** Read-only GA4 Data API scope (least privilege). */
export const GA4_SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';

type FetchImpl = typeof fetch;

/** Tokens shaped for the CVS-141 secret store (`AccountSecret`). */
export interface GoogleTokens {
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
  /** ISO-8601 expiry, computed from `expires_in`. */
  expiresAt?: string;
}

function expiryFrom(expiresIn: unknown): string | undefined {
  const secs = typeof expiresIn === 'number' ? expiresIn : Number(expiresIn);
  return Number.isFinite(secs) ? new Date(Date.now() + secs * 1000).toISOString() : undefined;
}

/** Build the consent-screen URL to start the connect flow. */
export function buildGoogleAuthUrl(opts: {
  clientId: string;
  redirectUri: string;
  state: string;
  scope?: string;
}): string {
  const params = new URLSearchParams({
    client_id: opts.clientId,
    redirect_uri: opts.redirectUri,
    response_type: 'code',
    scope: opts.scope ?? GA4_SCOPE,
    access_type: 'offline', // → refresh token
    prompt: 'consent',
    include_granted_scopes: 'true',
    state: opts.state,
  });
  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

async function postToken(body: URLSearchParams, fetchImpl: FetchImpl): Promise<GoogleTokens> {
  const res = await fetchImpl(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) throw new Error(`Google token endpoint failed (${res.status})`);
  const j = (await res.json()) as Record<string, unknown>;
  return {
    accessToken: String(j.access_token ?? ''),
    refreshToken: j.refresh_token ? String(j.refresh_token) : undefined,
    tokenType: j.token_type ? String(j.token_type) : undefined,
    expiresAt: expiryFrom(j.expires_in),
  };
}

/** Exchange the authorization code (from the callback) for tokens. */
export function exchangeGoogleCode(
  opts: { code: string; clientId: string; clientSecret: string; redirectUri: string },
  fetchImpl: FetchImpl = fetch
): Promise<GoogleTokens> {
  return postToken(
    new URLSearchParams({
      code: opts.code,
      client_id: opts.clientId,
      client_secret: opts.clientSecret,
      redirect_uri: opts.redirectUri,
      grant_type: 'authorization_code',
    }),
    fetchImpl
  );
}

/** Refresh an access token. Google usually omits a new refresh token — keep the old one. */
export function refreshGoogleToken(
  opts: { refreshToken: string; clientId: string; clientSecret: string },
  fetchImpl: FetchImpl = fetch
): Promise<GoogleTokens> {
  return postToken(
    new URLSearchParams({
      refresh_token: opts.refreshToken,
      client_id: opts.clientId,
      client_secret: opts.clientSecret,
      grant_type: 'refresh_token',
    }),
    fetchImpl
  );
}
