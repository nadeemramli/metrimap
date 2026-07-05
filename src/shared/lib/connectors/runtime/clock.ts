// Clock + timeout helpers (CVS-142).
//
// A single injectable Clock backs every wait in the runtime (retry backoff, rate-limit
// pacing, per-page timeout) so tests advance time deterministically instead of sleeping.
import { timeoutError } from './errors';
import type { Clock } from './types';

/** The real clock: wall time + an abortable setTimeout-based sleep. */
export const systemClock: Clock = {
  now: () => Date.now(),
  sleep: (ms, signal) =>
    new Promise<void>((resolve, reject) => {
      if (signal?.aborted) return reject(new DOMException('Aborted', 'AbortError'));
      const id = setTimeout(resolve, ms);
      signal?.addEventListener(
        'abort',
        () => {
          clearTimeout(id);
          reject(new DOMException('Aborted', 'AbortError'));
        },
        { once: true }
      );
    }),
};

/**
 * Race a page fetch against a timeout. On expiry the shared AbortController fires (so the
 * adapter can cancel its request) and a classified `timeout` error is thrown.
 */
export async function withTimeout<T>(
  fn: (signal: AbortSignal) => Promise<T>,
  ms: number | undefined,
  parent: AbortSignal | undefined,
  clock: Clock
): Promise<T> {
  const controller = new AbortController();
  const onParentAbort = () => controller.abort();
  if (parent) {
    if (parent.aborted) controller.abort();
    else parent.addEventListener('abort', onParentAbort, { once: true });
  }
  try {
    if (!ms) return await fn(controller.signal);
    const timeout = clock.sleep(ms, controller.signal).then(() => {
      throw timeoutError(`Page exceeded ${ms}ms budget`);
    });
    // Swallow the abort-driven rejection once the fetch has already won the race.
    timeout.catch(() => undefined);
    return await Promise.race([fn(controller.signal), timeout]);
  } finally {
    controller.abort();
    parent?.removeEventListener('abort', onParentAbort);
  }
}
