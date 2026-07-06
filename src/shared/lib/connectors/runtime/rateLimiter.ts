// Manifest-driven rate limiter (CVS-142).
//
// Paces requests according to a connector manifest's `rate_limit` block so the runtime
// respects source quotas without each adapter reimplementing throttling. `token_bucket`
// and `fixed_window` pace by requests-per-minute; `concurrency`/`none` add no delay
// (single-stream runs are already sequential). Waits go through the injected Clock.
import type { RateLimitStrategy } from '../manifests';
import type { Clock } from './types';

export interface RateLimiter {
  /** Wait until the next request is allowed. */
  acquire(signal?: AbortSignal): Promise<void>;
}

/** Build a limiter for a manifest's rate-limit strategy. */
export function createRateLimiter(rate: RateLimitStrategy, clock: Clock): RateLimiter {
  const rpm = rate.requests_per_minute;
  const paces = (rate.strategy === 'token_bucket' || rate.strategy === 'fixed_window') && !!rpm;
  if (!paces || !rpm) {
    return { acquire: async () => undefined };
  }
  const minIntervalMs = Math.ceil(60_000 / rpm);
  let nextAllowedAt = 0;
  return {
    async acquire(signal) {
      const now = clock.now();
      const wait = Math.max(0, nextAllowedAt - now);
      // Reserve this slot before awaiting so concurrent acquires queue behind it.
      nextAllowedAt = Math.max(now, nextAllowedAt) + minIntervalMs;
      if (wait > 0) await clock.sleep(wait, signal);
    },
  };
}
