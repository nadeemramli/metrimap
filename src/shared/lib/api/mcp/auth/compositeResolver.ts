// Composite MCP auth resolver (CVS-99). The server accepts TWO credential kinds
// on the same endpoint: personal API keys (`mk_live_…`, used by the CLI) and
// Clerk OAuth access tokens (used by claude.ai / Desktop connectors). This
// resolver inspects the bearer token and routes to the right underlying
// resolver; both produce the identical McpAuthContext, so everything downstream
// (dispatch, guards, audit, RLS) is unchanged.
import type { AuthContextResolver, McpRequestLike } from '../authContext';
import { McpToolError } from '../errors';

/** API keys are minted with this prefix (see services/apiKeys.ts). */
const API_KEY_PREFIX = 'mk_live_';

/**
 * Pull the credential from a request: `Authorization: Bearer <token>`, a bare
 * `Authorization` value, or `x-api-key`. Shared by the OAuth + composite paths
 * (the API-key resolver keeps its own copy for isolation).
 */
export function extractBearer(
  headers: Record<string, string | undefined>
): string | null {
  const auth = headers['authorization'] ?? headers['Authorization'];
  if (auth) {
    const m = auth.match(/^Bearer\s+(.+)$/i);
    return (m ? m[1] : auth).trim() || null;
  }
  const x = headers['x-api-key'] ?? headers['X-API-Key'];
  return x?.trim() || null;
}

export interface CompositeResolverOptions {
  /** Handles `mk_live_…` personal API keys. */
  apiKey: AuthContextResolver;
  /** Handles Clerk OAuth access tokens. */
  oauth: AuthContextResolver;
}

export function createCompositeAuthResolver(
  opts: CompositeResolverOptions
): AuthContextResolver {
  return async (req: McpRequestLike) => {
    const token = extractBearer(req.headers);
    if (!token) {
      throw new McpToolError(
        'unauthenticated',
        'Missing credential — send an API key or OAuth token as `Authorization: Bearer <token>`.'
      );
    }
    return token.startsWith(API_KEY_PREFIX)
      ? opts.apiKey(req)
      : opts.oauth(req);
  };
}
