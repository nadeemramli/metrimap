// Personal/workspace API-key auth for the MCP server (CVS-99). Implements the
// AuthContextResolver seam (CVS-100): resolve an incoming request's API key to a
// user + an RLS-scoped Supabase client, so non-interactive clients (Codex/CLI,
// claude.ai with a static token) can call tools. The OAuth "Connect" sign-in flow
// is the documented follow-up (see docs/features/mcp-server.md).
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/shared/lib/supabase/types';
import type {
  AuthContextResolver,
  McpRequestLike,
  McpScope,
} from '../authContext';
import { McpToolError } from '../errors';
import { hashApiKey, mintSupabaseJwt } from './jwt';

/** Resolves a key hash → the owning user (never exposes the raw key store). */
export type ApiKeyLookup = (
  keyHash: string
) => Promise<{ userId: string; orgId: string | null } | null>;

/**
 * Build an ApiKeyLookup backed by the `mcp_resolve_api_key` SECURITY DEFINER RPC
 * (migration 20260704160000). The RPC matches on the exact hash, bumps
 * last_used_at, and returns the key owner — callable with a plain anon client, so
 * the service-role key is never needed.
 */
export function supabaseApiKeyLookup(
  anonClient: SupabaseClient<Database>
): ApiKeyLookup {
  const rpc = anonClient.rpc as unknown as (
    fn: string,
    args: Record<string, unknown>
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
  return async (keyHash) => {
    const { data, error } = await rpc('mcp_resolve_api_key', { p_key_hash: keyHash });
    if (error) throw new Error(error.message);
    const row = (Array.isArray(data) ? data[0] : data) as
      | { user_id?: string; workspace_id?: string | null }
      | null
      | undefined;
    return row?.user_id
      ? { userId: row.user_id, orgId: row.workspace_id ?? null }
      : null;
  };
}

export interface ApiKeyAuthOptions {
  /** Supabase JWT secret (server-only) used to mint the per-user token. */
  jwtSecret: string;
  supabaseUrl: string;
  anonKey: string;
  /** Key-hash → owner resolver (see supabaseApiKeyLookup). */
  lookupKey: ApiKeyLookup;
  tokenTtlSec?: number;
  /** Scopes granted to key-authenticated connections (per-key scopes = CVS-89). */
  scopes?: McpScope[];
  /** Override the scoped-client factory (tests). */
  scopedClientFactory?: (jwt: string) => SupabaseClient<Database>;
  /**
   * Optional live re-check that the key owner is still a member of the key's
   * workspace org. The api_keys row captures workspace_id once at creation time,
   * so without this a removed member keeps org-wide access. When provided and it
   * returns false (a DEFINITIVE non-membership), the minted JWT is degraded to
   * personal scope (orgId: null) instead of throwing, so the key still works for
   * the user's own data. Implementations should FAIL OPEN (return true) on a
   * transient provider error so an outage can't lock out every legitimate key.
   * Undefined = no re-check (backward compatible).
   */
  verifyOrgMembership?: (userId: string, orgId: string) => Promise<boolean>;
}

function extractApiKey(headers: Record<string, string | undefined>): string | null {
  const auth = headers['authorization'] ?? headers['Authorization'];
  if (auth) {
    const m = auth.match(/^Bearer\s+(.+)$/i);
    return (m ? m[1] : auth).trim() || null;
  }
  const x = headers['x-api-key'] ?? headers['X-API-Key'];
  return x?.trim() || null;
}

export function createApiKeyAuthResolver(
  opts: ApiKeyAuthOptions
): AuthContextResolver {
  const makeScopedClient =
    opts.scopedClientFactory ??
    ((jwt: string) =>
      createClient<Database>(opts.supabaseUrl, opts.anonKey, {
        global: { headers: { Authorization: `Bearer ${jwt}` } },
        auth: { persistSession: false, autoRefreshToken: false },
      }));

  return async (req: McpRequestLike) => {
    const key = extractApiKey(req.headers);
    if (!key) {
      throw new McpToolError(
        'unauthenticated',
        'Missing API key — send it as `Authorization: Bearer <key>`.'
      );
    }
    const found = await opts.lookupKey(await hashApiKey(key));
    if (!found) {
      throw new McpToolError('unauthenticated', 'Invalid or revoked API key.');
    }
    // Re-verify the owner is still a member of the key's workspace org. A
    // definitive non-membership degrades to personal scope (orgId: null) rather
    // than granting stale workspace-wide access; the verifier fails open on a
    // provider error so a Clerk outage can't lock out legitimate keys.
    let orgId = found.orgId;
    if (orgId && opts.verifyOrgMembership) {
      const stillMember = await opts.verifyOrgMembership(found.userId, orgId);
      if (!stillMember) orgId = null;
    }
    const jwt = await mintSupabaseJwt(
      { sub: found.userId, orgId },
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
