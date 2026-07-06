// Structured errors for the MCP tool layer (CVS-100). The transport adapter maps
// these codes to MCP/JSON-RPC error responses so agents get actionable failures.
export type McpErrorCode =
  | 'invalid_input'
  | 'unauthenticated'
  | 'forbidden'
  | 'not_found'
  | 'rate_limited'
  | 'payload_too_large'
  | 'internal';

export class McpToolError extends Error {
  readonly code: McpErrorCode;
  readonly details?: unknown;
  constructor(code: McpErrorCode, message: string, details?: unknown) {
    super(message);
    this.name = 'McpToolError';
    this.code = code;
    this.details = details;
  }
}
