// Per-request auth context for the MCP server (CVS-100). This is the SEAM the
// auth issue (CVS-99, OAuth "Connect" + personal API key) fills in: it resolves
// an incoming request to a specific user + a Clerk-authenticated Supabase client,
// so every tool call runs under that user's RLS. The service-role key is never
// used here.
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/shared/lib/supabase/types';
import { McpToolError } from './errors';

export type McpScope = 'read' | 'write';

export interface McpAuthContext {
  /** Authenticated user id (Clerk) — drives created_by + RLS. */
  userId: string;
  /** RLS-scoped client from createClerkSupabaseClient — never service-role. */
  client: SupabaseClient<Database>;
  /** Optional per-connection scopes; when omitted, all tools are allowed. */
  scopes?: McpScope[];
}

/** Minimal request shape the resolver needs (headers carry the bearer/API key). */
export interface McpRequestLike {
  headers: Record<string, string | undefined>;
}

/** CVS-99 implements this (OAuth token exchange / API-key lookup → user + client). */
export type AuthContextResolver = (
  req: McpRequestLike
) => Promise<McpAuthContext>;

/**
 * Placeholder resolver until CVS-99 lands. Wiring a real resolver is what makes
 * the server multi-tenant; until then the scaffold refuses to serve tool calls.
 */
export const unimplementedAuthResolver: AuthContextResolver = async () => {
  throw new McpToolError(
    'unauthenticated',
    'MCP auth is not wired yet — implement the AuthContextResolver in CVS-99 (OAuth Connect + personal API key).'
  );
};
