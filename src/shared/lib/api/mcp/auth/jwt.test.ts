import { describe, it, expect } from 'vitest';
import { mintSupabaseJwt, decodeJwtPayload, hashApiKey } from './jwt';

const SECRET = 'test-jwt-secret-please-ignore';

describe('mintSupabaseJwt', () => {
  it('mints an HS256 JWT with Supabase/RLS claims', async () => {
    const token = await mintSupabaseJwt({ sub: 'user_123', orgId: 'org_9' }, SECRET, 300);
    expect(token.split('.')).toHaveLength(3);
    const p = decodeJwtPayload(token);
    expect(p).toMatchObject({
      sub: 'user_123',
      role: 'authenticated',
      aud: 'authenticated',
      iss: 'metrimap-mcp',
      o: { id: 'org_9' },
    });
    expect((p.exp as number) - (p.iat as number)).toBe(300);
  });

  it('omits the org claim when no org', async () => {
    const p = decodeJwtPayload(await mintSupabaseJwt({ sub: 'u1' }, SECRET));
    expect(p.o).toBeUndefined();
  });

  it('throws without a secret', async () => {
    await expect(mintSupabaseJwt({ sub: 'u1' }, '')).rejects.toThrow(/secret/i);
  });

  it('produces a signature that verifies against the secret (HS256)', async () => {
    const token = await mintSupabaseJwt({ sub: 'u1' }, SECRET);
    const [h, pl, sig] = token.split('.');
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const raw = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${h}.${pl}`));
    const expected = btoa(String.fromCharCode(...new Uint8Array(raw)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    expect(sig).toBe(expected);
  });
});

describe('hashApiKey', () => {
  it('is a deterministic 64-char sha-256 hex', async () => {
    const a = await hashApiKey('mk_live_abc');
    const b = await hashApiKey('mk_live_abc');
    expect(a).toBe(b);
    expect(a).toMatch(/^[0-9a-f]{64}$/);
    expect(await hashApiKey('mk_live_xyz')).not.toBe(a);
  });
});
