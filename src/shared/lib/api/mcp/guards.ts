// Abuse controls for the MCP server (CVS-104): a per-key token-bucket rate
// limiter + a payload-size cap. Both are transport-agnostic and injected into
// dispatchTool. The limiter is in-memory (per server instance) — fine for a
// single Vercel function / Node process; a multi-instance deploy should back it
// with Postgres/Redis (see docs/features/mcp-server.md).
import { McpToolError } from './errors';

/** Token bucket: `capacity` burst, refilled at `refillPerSec` tokens/second. */
export class RateLimiter {
  private readonly capacity: number;
  private readonly refillPerSec: number;
  private readonly buckets = new Map<string, { tokens: number; last: number }>();

  constructor(capacity = 60, refillPerSec = 1) {
    this.capacity = capacity;
    this.refillPerSec = refillPerSec;
  }

  /** Returns true if a token was available (and consumed) for `key`. */
  tryRemove(key: string, now: number = Date.now()): boolean {
    const b = this.buckets.get(key) ?? { tokens: this.capacity, last: now };
    const elapsedSec = Math.max(0, (now - b.last) / 1000);
    const tokens = Math.min(this.capacity, b.tokens + elapsedSec * this.refillPerSec);
    if (tokens < 1) {
      this.buckets.set(key, { tokens, last: now });
      return false;
    }
    this.buckets.set(key, { tokens: tokens - 1, last: now });
    return true;
  }
}

// Coarse outer bound on a single tool-call payload. Sits above the per-tool Zod
// caps (e.g. the 1MB CSV limit) so valid calls pass but pathological ones don't.
export const DEFAULT_MAX_PAYLOAD_BYTES = 2_000_000;

export function enforcePayloadSize(
  args: unknown,
  maxBytes: number = DEFAULT_MAX_PAYLOAD_BYTES
): void {
  let size = 0;
  try {
    size = JSON.stringify(args ?? {}).length;
  } catch {
    throw new McpToolError('invalid_input', 'Tool arguments are not serializable');
  }
  if (size > maxBytes) {
    throw new McpToolError(
      'payload_too_large',
      `Payload ${size} bytes exceeds the ${maxBytes}-byte limit`
    );
  }
}

export function enforceRateLimit(
  limiter: RateLimiter,
  key: string,
  now: number = Date.now()
): void {
  if (!limiter.tryRemove(key, now)) {
    throw new McpToolError('rate_limited', 'Rate limit exceeded — slow down and retry');
  }
}
