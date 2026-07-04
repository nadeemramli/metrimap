import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createApiKeyAuthResolver } from './apiKeyResolver';
import { decodeJwtPayload, hashApiKey } from './jwt';
import { McpToolError } from '../errors';
import type { SupabaseClient } from '@supabase/supabase-js';

const base = {
  jwtSecret: 'secret',
  supabaseUrl: 'https://x.supabase.co',
  anonKey: 'anon',
};

let scopedClientFactory: ReturnType<typeof vi.fn>;
beforeEach(() => {
  scopedClientFactory = vi.fn((jwt: string) => ({ __jwt: jwt }) as unknown as SupabaseClient);
});

describe('createApiKeyAuthResolver', () => {
  it('rejects a request with no key', async () => {
    const resolve = createApiKeyAuthResolver({ ...base, lookupKey: vi.fn(), scopedClientFactory });
    await expect(resolve({ headers: {} })).rejects.toMatchObject({
      name: 'McpToolError',
      code: 'unauthenticated',
    });
  });

  it('rejects an unknown/revoked key', async () => {
    const lookupKey = vi.fn(async () => null);
    const resolve = createApiKeyAuthResolver({ ...base, lookupKey, scopedClientFactory });
    await expect(
      resolve({ headers: { authorization: 'Bearer mk_live_nope' } })
    ).rejects.toBeInstanceOf(McpToolError);
  });

  it('resolves a valid key → user + RLS-scoped client under a minted JWT', async () => {
    const lookupKey = vi.fn(async () => ({ userId: 'user_1', orgId: 'org_1' }));
    const resolve = createApiKeyAuthResolver({ ...base, lookupKey, scopedClientFactory });

    const ctx = await resolve({ headers: { authorization: 'Bearer mk_live_secret' } });

    // looked up by the sha-256 hash of the raw key
    expect(lookupKey).toHaveBeenCalledWith(await hashApiKey('mk_live_secret'));
    expect(ctx.userId).toBe('user_1');
    expect(ctx.scopes).toEqual(['read', 'write']);

    // the client was built from a JWT carrying the user + org claims
    const jwt = scopedClientFactory.mock.calls[0][0] as string;
    expect(decodeJwtPayload(jwt)).toMatchObject({ sub: 'user_1', o: { id: 'org_1' } });
    expect(ctx.client).toBe(scopedClientFactory.mock.results[0].value);
  });

  it('accepts a raw key and x-api-key header too', async () => {
    const lookupKey = vi.fn(async () => ({ userId: 'u', orgId: null }));
    const resolve = createApiKeyAuthResolver({ ...base, lookupKey, scopedClientFactory });

    await resolve({ headers: { authorization: 'mk_live_raw' } });
    await resolve({ headers: { 'x-api-key': 'mk_live_x' } });
    expect(lookupKey).toHaveBeenNthCalledWith(1, await hashApiKey('mk_live_raw'));
    expect(lookupKey).toHaveBeenNthCalledWith(2, await hashApiKey('mk_live_x'));
  });

  it('honors custom scopes', async () => {
    const resolve = createApiKeyAuthResolver({
      ...base,
      lookupKey: vi.fn(async () => ({ userId: 'u', orgId: null })),
      scopedClientFactory,
      scopes: ['read'],
    });
    const ctx = await resolve({ headers: { authorization: 'Bearer k' } });
    expect(ctx.scopes).toEqual(['read']);
  });
});
