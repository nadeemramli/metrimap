// Clerk-backed OAuth token verifier for the MCP server (CVS-99, OAuth path).
// Clerk is the OAuth 2.1 authorization server; this server is the resource
// server. We verify an incoming Clerk OAuth access token with `@clerk/backend`
// and hand back the Clerk user id, which the shared OAuth resolver maps into a
// Supabase JWT (mintSupabaseJwt) → RLS-scoped client. This is the ONLY place
// Clerk's Node-only SDK is imported (kept out of the shared lib / browser bundle).
import { createClerkClient } from '@clerk/backend';
import type { OAuthTokenVerifier } from '@/shared/lib/api/mcp';

export interface ClerkVerifierOptions {
  /** Clerk secret key (sk_live_… / sk_test_…). Server-only. */
  secretKey: string;
  /** Clerk publishable key (pk_live_…), used to resolve the instance. */
  publishableKey: string;
  /** The resource id this server represents (the MCP endpoint URL). */
  resourceUrl: string;
  /** Optional allowlist of OAuth client origins (e.g. claude.ai). */
  authorizedParties?: string[];
}

/**
 * Build an OAuthTokenVerifier backed by Clerk. It calls `authenticateRequest`
 * with `acceptsToken: 'oauth_token'`; on success the machine-auth object's
 * `userId` is the Clerk user id (`user_…`) that Supabase RLS keys off as `sub`.
 */
export function makeClerkVerifier(opts: ClerkVerifierOptions): OAuthTokenVerifier {
  const clerk = createClerkClient({
    secretKey: opts.secretKey,
    publishableKey: opts.publishableKey,
  });
  return async (token) => {
    // authenticateRequest reads the token off a Fetch Request's headers.
    const request = new Request(opts.resourceUrl, {
      headers: { authorization: `Bearer ${token}` },
    });
    const requestState = await clerk.authenticateRequest(request, {
      acceptsToken: 'oauth_token',
      authorizedParties: opts.authorizedParties,
    });
    if (!requestState.isAuthenticated) return null;
    const auth = requestState.toAuth();
    if (!auth?.userId) return null;
    return { userId: auth.userId, scopes: auth.scopes ?? undefined };
  };
}
