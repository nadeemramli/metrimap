import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createOAuthAuthResolver } from './oauthResolver';
import { decodeJwtPayload } from './jwt';
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

describe('createOAuthAuthResolver', () => {
  it('rejects a request with no token', async () => {
    const resolve = createOAuthAuthResolver({
      ...base,
      verifyOAuthToken: vi.fn(),
      scopedClientFactory,
    });
    await expect(resolve({ headers: {} })).rejects.toMatchObject({
      name: 'McpToolError',
      code: 'unauthenticated',
    });
  });

  it('rejects an invalid/expired token', async () => {
    const verifyOAuthToken = vi.fn(async () => null);
    const resolve = createOAuthAuthResolver({ ...base, verifyOAuthToken, scopedClientFactory });
    await expect(
      resolve({ headers: { authorization: 'Bearer oauth_bad' } })
    ).rejects.toBeInstanceOf(McpToolError);
  });

  it('resolves a valid token → user + RLS-scoped client (personal scope, no org claim)', async () => {
    const verifyOAuthToken = vi.fn(async () => ({ userId: 'user_1' }));
    const resolve = createOAuthAuthResolver({ ...base, verifyOAuthToken, scopedClientFactory });

    const ctx = await resolve({ headers: { authorization: 'Bearer oauth_good' } });

    expect(verifyOAuthToken).toHaveBeenCalledWith('oauth_good');
    expect(ctx.userId).toBe('user_1');
    expect(ctx.scopes).toEqual(['read', 'write']);

    const jwt = scopedClientFactory.mock.calls[0][0] as string;
    const payload = decodeJwtPayload(jwt);
    expect(payload).toMatchObject({ sub: 'user_1' });
    // v1 personal scope: no org claim
    expect(payload.o).toBeUndefined();
    expect(ctx.client).toBe(scopedClientFactory.mock.results[0].value);
  });

  it('passes an org claim through when the verifier returns one', async () => {
    const verifyOAuthToken = vi.fn(async () => ({ userId: 'user_2', orgId: 'org_9' }));
    const resolve = createOAuthAuthResolver({ ...base, verifyOAuthToken, scopedClientFactory });

    await resolve({ headers: { authorization: 'Bearer oauth_org' } });

    const jwt = scopedClientFactory.mock.calls[0][0] as string;
    expect(decodeJwtPayload(jwt)).toMatchObject({ sub: 'user_2', o: { id: 'org_9' } });
  });

  it('reads the x-api-key header too', async () => {
    const verifyOAuthToken = vi.fn(async () => ({ userId: 'u' }));
    const resolve = createOAuthAuthResolver({ ...base, verifyOAuthToken, scopedClientFactory });
    await resolve({ headers: { 'x-api-key': 'oauth_x' } });
    expect(verifyOAuthToken).toHaveBeenCalledWith('oauth_x');
  });

  it('honors custom scopes', async () => {
    const resolve = createOAuthAuthResolver({
      ...base,
      verifyOAuthToken: vi.fn(async () => ({ userId: 'u' })),
      scopedClientFactory,
      scopes: ['read'],
    });
    const ctx = await resolve({ headers: { authorization: 'Bearer t' } });
    expect(ctx.scopes).toEqual(['read']);
  });
});
