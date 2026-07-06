// MCP auth crypto (CVS-99). The server mints a short-lived Supabase JWT for the
// authenticated user so every DB call runs under that user's RLS — the DB derives
// the user from the `sub` claim (requesting_user_id()) and the org from `o.id`
// (requesting_org_id()). Signed HS256 with the Supabase JWT secret (server-only
// env). Uses Web Crypto (Deno/Node/browser) — no extra dependency, and the same
// SHA-256 hashing convention as apiKeys.ts.
const enc = new TextEncoder();

function b64urlFromBytes(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlFromString(s: string): string {
  return b64urlFromBytes(enc.encode(s));
}

/** SHA-256 hex of an API key — matches apiKeys.ts so lookups line up. */
export async function hashApiKey(key: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(key));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export interface SupabaseJwtInput {
  /** Clerk user id → JWT `sub` → requesting_user_id(). */
  sub: string;
  /** Optional org/workspace id → JWT `o.id` → requesting_org_id(). */
  orgId?: string | null;
}

/**
 * Mint a short-lived (default 5 min) Supabase-compatible JWT for a user.
 * @param secret the Supabase JWT secret (server-only). Throws if missing.
 */
export async function mintSupabaseJwt(
  input: SupabaseJwtInput,
  secret: string,
  ttlSec = 300
): Promise<string> {
  if (!secret) throw new Error('mintSupabaseJwt: missing Supabase JWT secret');
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload: Record<string, unknown> = {
    sub: input.sub,
    role: 'authenticated',
    aud: 'authenticated',
    iss: 'metrimap-mcp',
    iat: now,
    exp: now + ttlSec,
  };
  if (input.orgId) payload.o = { id: input.orgId };

  const data = `${b64urlFromString(JSON.stringify(header))}.${b64urlFromString(JSON.stringify(payload))}`;
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return `${data}.${b64urlFromBytes(new Uint8Array(sig))}`;
}

/** Decode (does NOT verify) a JWT's payload — for tests / debugging. */
export function decodeJwtPayload(token: string): Record<string, unknown> {
  const part = token.split('.')[1] ?? '';
  const b64 = part.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(atob(b64));
}
