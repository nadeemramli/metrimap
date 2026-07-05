// Connector fetch error model + classification (CVS-142).
//
// Adapters and the runtime speak in a small set of error classes so retry/backoff can
// decide what is worth retrying (transient/rate-limit/timeout) versus fatal (auth/
// permanent), and so run summaries can name a stable error class without ever carrying
// a source payload or secret. See docs/data/connector-runtime.md.

/** Stable, payload-free classes a connector run can fail with. */
export type ConnectorErrorClass =
  | 'rate_limit'
  | 'transient'
  | 'timeout'
  | 'auth'
  | 'permanent';

const RETRYABLE: ReadonlySet<ConnectorErrorClass> = new Set([
  'rate_limit',
  'transient',
  'timeout',
]);

/** Whether an error class is worth retrying. */
export function isRetryable(cls: ConnectorErrorClass): boolean {
  return RETRYABLE.has(cls);
}

/**
 * A classified connector failure. Carries only a class, a safe message, and an optional
 * `retryAfterMs` hint (from a source's Retry-After) — never a payload, token, or URL.
 */
export class ConnectorFetchError extends Error {
  readonly class: ConnectorErrorClass;
  readonly retryAfterMs?: number;

  constructor(cls: ConnectorErrorClass, message: string, opts: { retryAfterMs?: number } = {}) {
    super(message);
    this.name = 'ConnectorFetchError';
    this.class = cls;
    this.retryAfterMs = opts.retryAfterMs;
  }

  get retryable(): boolean {
    return isRetryable(this.class);
  }
}

/** Build a rate-limit error, optionally with the source's Retry-After delay. */
export function rateLimitError(message = 'Rate limited by source', retryAfterMs?: number): ConnectorFetchError {
  return new ConnectorFetchError('rate_limit', message, { retryAfterMs });
}

/** Build a timeout error for a page that exceeded its budget. */
export function timeoutError(message = 'Request timed out'): ConnectorFetchError {
  return new ConnectorFetchError('timeout', message);
}

/**
 * Coerce an unknown thrown value into a classified error. A raw HTTP status maps to a
 * class (429 → rate_limit, 5xx/network → transient, 401/403 → auth, other 4xx →
 * permanent); anything already a ConnectorFetchError passes through unchanged.
 */
export function classifyError(err: unknown): ConnectorFetchError {
  if (err instanceof ConnectorFetchError) return err;
  const message = err instanceof Error ? err.message : String(err);
  const status = (err as { status?: number } | null)?.status;
  if (typeof status === 'number') {
    if (status === 429) return rateLimitError(message);
    if (status >= 500) return new ConnectorFetchError('transient', message);
    if (status === 401 || status === 403) return new ConnectorFetchError('auth', message);
    if (status >= 400) return new ConnectorFetchError('permanent', message);
  }
  // Fetch/network failures surface as TypeError with no status — treat as transient.
  if (err instanceof TypeError) return new ConnectorFetchError('transient', message);
  return new ConnectorFetchError('permanent', message);
}
