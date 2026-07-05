// OAuth "Connect" auth for the MCP server (CVS-99, OAuth path). Implements the
// same AuthContextResolver seam as apiKeyResolver.ts, but for OAuth 2.1 access
// tokens issued by Clerk (the authorization server). The MCP server is the
// OAuth resource server: it verifies the incoming Clerk token, extracts the
// Clerk user id, and mints the SAME short-lived Supabase JWT (mintSupabaseJwt)
// so every tool call runs under that user's RLS — identical downstream shape to
// the API-key path. The service-role key is never used.
//
// Token verification is INJECTED (`verifyOAuthToken`) so this shared module
// never imports Clerk's Node-only SDK; the running server supplies a verifier
// backed by `@clerk/backend` (see mcp-server/clerkAuth.ts).
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/shared/lib/supabase/types';
import type { AuthContextResolver, McpRequestLike, McpScope } from '../authContext';
import { McpToolError } from '../errors';
import { mintSupabaseJwt } from './jwt';
import { extractBearer } from './compositeResolver';

/** Verifies a Clerk OAuth access token → the owning user (or null if invalid). */
export type OAuthTokenVerifier = (
  token: string
) => Promise<{ userId: string; orgId?: string | null; scopes?: string[] } | null>;

export interface OAuthAuthOptions {
  /** Supabase JWT secret (server-only) used to mint the per-user token. */
  jwtSecret: string;
  supabaseUrl: string;
  anonKey: string;
  /** Clerk token verifier (see mcp-server/clerkAuth.ts → makeClerkVerifier). */
  verifyOAuthToken: OAuthTokenVerifier;
  tokenTtlSec?: number;
  /** Scopes granted to OAuth-authenticated connections. */
  scopes?: McpScope[];
  /** Override the scoped-client factory (tests). */
  scopedClientFactory?: (jwt: string) => SupabaseClient<Database>;
}

export function createOAuthAuthResolver(
  opts: OAuthAuthOptions
): AuthContextResolver {
  const makeScopedClient =
    opts.scopedClientFactory ??
    ((jwt: string) =>
      createClient<Database>(opts.supabaseUrl, opts.anonKey, {
        global: { headers: { Authorization: `Bearer ${jwt}` } },
        auth: { persistSession: false, autoRefreshToken: false },
      }));

  return async (req: McpRequestLike) => {
    const token = extractBearer(req.headers);
    if (!token) {
      throw new McpToolError(
        'unauthenticated',
        'Missing OAuth token — send it as `Authorization: Bearer <token>`.'
      );
    }
    const found = await opts.verifyOAuthToken(token);
    if (!found) {
      throw new McpToolError('unauthenticated', 'Invalid or expired OAuth token.');
    }
    // v1 = personal scope: mint a user-only JWT (no `o.id`). RLS is additive, so
    // the user sees/acts on everything they created. Workspace scope is a v2
    // follow-up (a default-workspace resolver would pass orgId here).
    const jwt = await mintSupabaseJwt(
      { sub: found.userId, orgId: found.orgId ?? null },
      opts.jwtSecret,
      opts.tokenTtlSec
    );
    return {
      userId: found.userId,
      client: makeScopedClient(jwt),
      scopes: opts.scopes ?? ['read', 'write'],
    };
  };
}
