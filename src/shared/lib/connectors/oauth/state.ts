// Signed OAuth `state` tokens (CVS-322). The connect flow round-trips
// `<base64url(payload)>.<base64url(hmac)>` through the provider's consent screen;
// the callback only proceeds if the signature verifies and the token hasn't expired.
// Signed with HMAC-SHA256 keyed by CONNECTOR_SECRET_KEY (same server env the secret
// store uses — one key to provision). Payload is metadata only, never a secret.

const encoder = new TextEncoder();

function toB64url(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64(base64: string): Uint8Array {
  const bin = atob(base64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmacKey(base64Key: string): Promise<CryptoKey> {
  const raw = fromB64(base64Key);
  if (raw.length !== 32) throw new Error('CONNECTOR_SECRET_KEY must be 32 bytes (base64)');
  return crypto.subtle.importKey('raw', raw as BufferSource, { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
    'verify',
  ]);
}

export interface OAuthState {
  accountId: string;
  connectorId: string;
  /** CSRF nonce — unique per connect attempt. */
  nonce: string;
  /** Unix seconds; the callback rejects expired states. */
  exp: number;
}

const DEFAULT_TTL_SECONDS = 600;

/** Sign a connect attempt into an opaque `state` token. */
export async function signState(
  payload: { accountId: string; connectorId: string },
  base64Key: string,
  ttlSeconds = DEFAULT_TTL_SECONDS,
  nowMs: number = Date.now()
): Promise<string> {
  const state: OAuthState = {
    ...payload,
    nonce: crypto.randomUUID(),
    exp: Math.floor(nowMs / 1000) + ttlSeconds,
  };
  const body = toB64url(encoder.encode(JSON.stringify(state)));
  const key = await hmacKey(base64Key);
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(body) as BufferSource);
  return `${body}.${toB64url(new Uint8Array(sig))}`;
}

/** Verify + decode a `state` token. Returns null on tamper, malformation, or expiry. */
export async function verifyState(
  token: string,
  base64Key: string,
  nowMs: number = Date.now()
): Promise<OAuthState | null> {
  const dot = token.indexOf('.');
  if (dot <= 0) return null;
  const body = token.slice(0, dot);
  const sigB64 = token.slice(dot + 1).replace(/-/g, '+').replace(/_/g, '/');
  let sig: Uint8Array;
  try {
    sig = fromB64(sigB64 + '='.repeat((4 - (sigB64.length % 4)) % 4));
  } catch {
    return null;
  }
  const key = await hmacKey(base64Key);
  const ok = await crypto.subtle.verify(
    'HMAC',
    key,
    sig as BufferSource,
    encoder.encode(body) as BufferSource
  );
  if (!ok) return null;
  try {
    const padded = body.replace(/-/g, '+').replace(/_/g, '/');
    const parsed = JSON.parse(
      new TextDecoder().decode(fromB64(padded + '='.repeat((4 - (padded.length % 4)) % 4)))
    ) as OAuthState;
    if (typeof parsed.accountId !== 'string' || typeof parsed.connectorId !== 'string') return null;
    if (typeof parsed.exp !== 'number' || parsed.exp * 1000 <= nowMs) return null;
    return parsed;
  } catch {
    return null;
  }
}
