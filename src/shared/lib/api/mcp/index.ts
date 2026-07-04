// MCP scaffold (CVS-100): transport-agnostic tool registry + dispatch + auth seam
// over the RLS-scoped programmatic API (CVS-98). The Streamable-HTTP transport +
// deploy is documented in docs/features/mcp-server.md; auth resolver is CVS-99.
export {
  TOOLS,
  listTools,
  dispatchTool,
  type McpTool,
  type DispatchGuards,
} from './registry';
export { McpToolError, type McpErrorCode } from './errors';
export {
  RateLimiter,
  enforcePayloadSize,
  enforceRateLimit,
  DEFAULT_MAX_PAYLOAD_BYTES,
} from './guards';
export {
  noopAuditSink,
  supabaseAuditSink,
  type AuditSink,
  type McpAuditEntry,
} from './audit';
export {
  unimplementedAuthResolver,
  type McpAuthContext,
  type McpScope,
  type McpRequestLike,
  type AuthContextResolver,
} from './authContext';
// Auth (CVS-99): API-key resolver + JWT minting. OAuth "Connect" is a follow-up.
export {
  createApiKeyAuthResolver,
  supabaseApiKeyLookup,
  type ApiKeyAuthOptions,
  type ApiKeyLookup,
} from './auth/apiKeyResolver';
export { mintSupabaseJwt, hashApiKey, decodeJwtPayload } from './auth/jwt';
