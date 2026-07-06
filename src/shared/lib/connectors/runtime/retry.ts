// Retry with exponential backoff + jitter (CVS-142).
//
// Retries only retryable classes (transient/rate_limit/timeout); auth/permanent fail
// fast. A source's Retry-After hint (on a rate_limit error) overrides the computed delay
// so we back off exactly as long as asked. All waits go through the injected Clock.
import { classifyError, ConnectorFetchError } from './errors';
import type { Clock, RetryPolicy } from './types';

export const DEFAULT_RETRY: RetryPolicy = {
  maxAttempts: 4,
  baseDelayMs: 500,
  maxDelayMs: 30_000,
};

/** Exponential backoff for attempt `n` (0-based), full-jitter, capped at maxDelayMs. */
export function backoffDelay(n: number, policy: RetryPolicy, rand: () => number): number {
  const ceiling = Math.min(policy.maxDelayMs, policy.baseDelayMs * 2 ** n);
  return Math.floor(rand() * ceiling);
}

/**
 * Run `fn`, retrying retryable failures up to `policy.maxAttempts`. Returns the first
 * success; rethrows the last classified error when attempts are exhausted or the error
 * is not retryable. Never swallows — the caller decides how a terminal failure is
 * reported. `signal` aborts both the work and the backoff wait.
 */
export async function withRetry<T>(
  fn: (signal: AbortSignal) => Promise<T>,
  policy: RetryPolicy,
  clock: Clock,
  signal?: AbortSignal
): Promise<T> {
  const rand = policy.jitter ?? Math.random;
  let attempt = 0;
  for (;;) {
    try {
      return await fn(signal ?? new AbortController().signal);
    } catch (raw) {
      const err = classifyError(raw);
      attempt += 1;
      if (!err.retryable || attempt >= policy.maxAttempts) throw err;
      const wait = retryAfter(err) ?? backoffDelay(attempt - 1, policy, rand);
      await clock.sleep(wait, signal);
    }
  }
}

function retryAfter(err: ConnectorFetchError): number | undefined {
  return err.class === 'rate_limit' ? err.retryAfterMs : undefined;
}
