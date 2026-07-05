// Connector fetch runtime (CVS-142): the shared engine that runs a connector stream —
// pagination, cursors, rate limits, retries, timeouts — and returns a payload-free run
// report. Adapters implement `ConnectorAdapter`; credentials are injected (CVS-141).
// See docs/data/connector-runtime.md.
export * from './errors';
export * from './types';
export { systemClock, withTimeout } from './clock';
export { createRateLimiter, type RateLimiter } from './rateLimiter';
export { DEFAULT_RETRY, backoffDelay, withRetry } from './retry';
export { InMemoryCursorStore, cursorKeyFor } from './cursorStore';
export { runStream } from './runStream';
