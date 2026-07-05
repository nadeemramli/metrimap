import { describe, it, expect, vi } from 'vitest';
import { createCompositeAuthResolver, extractBearer } from './compositeResolver';
import { McpToolError } from '../errors';
import type { McpAuthContext } from '../authContext';

const fakeCtx = (userId: string) => ({ userId }) as McpAuthContext;

describe('extractBearer', () => {
  it('reads Authorization: Bearer <token>', () => {
    expect(extractBearer({ authorization: 'Bearer abc' })).toBe('abc');
    expect(extractBearer({ Authorization: 'Bearer xyz' })).toBe('xyz');
  });
  it('reads a bare Authorization value', () => {
    expect(extractBearer({ authorization: 'mk_live_raw' })).toBe('mk_live_raw');
  });
  it('reads x-api-key', () => {
    expect(extractBearer({ 'x-api-key': 'mk_live_x' })).toBe('mk_live_x');
    expect(extractBearer({ 'X-API-Key': 'mk_live_X' })).toBe('mk_live_X');
  });
  it('returns null when absent', () => {
    expect(extractBearer({})).toBeNull();
  });
});

describe('createCompositeAuthResolver', () => {
  it('routes mk_live_ keys to the API-key resolver', async () => {
    const apiKey = vi.fn(async () => fakeCtx('via_apikey'));
    const oauth = vi.fn(async () => fakeCtx('via_oauth'));
    const resolve = createCompositeAuthResolver({ apiKey, oauth });

    const ctx = await resolve({ headers: { authorization: 'Bearer mk_live_secret' } });

    expect(apiKey).toHaveBeenCalledOnce();
    expect(oauth).not.toHaveBeenCalled();
    expect(ctx.userId).toBe('via_apikey');
  });

  it('routes any other token to the OAuth resolver', async () => {
    const apiKey = vi.fn(async () => fakeCtx('via_apikey'));
    const oauth = vi.fn(async () => fakeCtx('via_oauth'));
    const resolve = createCompositeAuthResolver({ apiKey, oauth });

    const ctx = await resolve({ headers: { authorization: 'Bearer oauth_token_here' } });

    expect(oauth).toHaveBeenCalledOnce();
    expect(apiKey).not.toHaveBeenCalled();
    expect(ctx.userId).toBe('via_oauth');
  });

  it('rejects a request with no credential', async () => {
    const resolve = createCompositeAuthResolver({
      apiKey: vi.fn(),
      oauth: vi.fn(),
    });
    await expect(resolve({ headers: {} })).rejects.toMatchObject({
      name: 'McpToolError',
      code: 'unauthenticated',
    });
    await expect(resolve({ headers: {} })).rejects.toBeInstanceOf(McpToolError);
  });
});
