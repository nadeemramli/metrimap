import { describe, it, expect } from 'vitest';
import { RateLimiter, enforcePayloadSize, enforceRateLimit } from './guards';
import { McpToolError } from './errors';

describe('RateLimiter', () => {
  it('allows up to capacity, then denies', () => {
    const rl = new RateLimiter(2, 1);
    expect(rl.tryRemove('u1', 0)).toBe(true);
    expect(rl.tryRemove('u1', 0)).toBe(true);
    expect(rl.tryRemove('u1', 0)).toBe(false);
  });
  it('refills over time', () => {
    const rl = new RateLimiter(1, 1); // 1 token/sec
    expect(rl.tryRemove('u1', 0)).toBe(true);
    expect(rl.tryRemove('u1', 0)).toBe(false);
    expect(rl.tryRemove('u1', 1000)).toBe(true); // +1s → +1 token
  });
  it('keys are independent', () => {
    const rl = new RateLimiter(1, 0);
    expect(rl.tryRemove('a', 0)).toBe(true);
    expect(rl.tryRemove('b', 0)).toBe(true);
    expect(rl.tryRemove('a', 0)).toBe(false);
  });
});

describe('enforcePayloadSize', () => {
  it('passes small payloads', () => {
    expect(() => enforcePayloadSize({ a: 1 }, 1000)).not.toThrow();
  });
  it('throws payload_too_large over the cap', () => {
    const err = (() => {
      try {
        enforcePayloadSize({ big: 'x'.repeat(100) }, 10);
      } catch (e) {
        return e as McpToolError;
      }
    })();
    expect(err).toBeInstanceOf(McpToolError);
    expect(err?.code).toBe('payload_too_large');
  });
});

describe('enforceRateLimit', () => {
  it('throws rate_limited when the bucket is empty', () => {
    const rl = new RateLimiter(1, 0);
    enforceRateLimit(rl, 'u1', 0);
    expect(() => enforceRateLimit(rl, 'u1', 0)).toThrow(McpToolError);
    try {
      enforceRateLimit(rl, 'u1', 0);
    } catch (e) {
      expect((e as McpToolError).code).toBe('rate_limited');
    }
  });
});
