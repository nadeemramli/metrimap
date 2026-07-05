// AES-256-GCM encryption for connector secrets (CVS-141). SERVER-ONLY.
//
// Connector tokens/keys are stored as ciphertext in `connected_account_secrets`.
// The key is 32 raw bytes supplied as base64 in the server env `CONNECTOR_SECRET_KEY`
// and NEVER shipped to the browser. Uses Web Crypto (`crypto.subtle`) so the same
// code runs in Node, in Deno edge functions (OAuth callback / fetch runtime), and
// in tests — the app already mints JWTs this way (MCP CVS-99).
//
// Wire format (base64): [ 12-byte IV ][ ciphertext+GCM-tag ]. A fresh random IV per
// call means the same plaintext encrypts to different ciphertext each time.

const IV_BYTES = 12;

function bytesToBase64(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/** Import a base64 32-byte key into an AES-GCM CryptoKey. Throws if the key is not 32 bytes. */
export async function importSecretKey(base64Key: string): Promise<CryptoKey> {
  const raw = base64ToBytes(base64Key);
  if (raw.length !== 32) {
    throw new Error(`CONNECTOR_SECRET_KEY must be 32 bytes (got ${raw.length}); generate with: openssl rand -base64 32`);
  }
  return crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

/** Encrypt a UTF-8 plaintext secret. Returns base64(iv + ciphertext+tag). */
export async function encryptSecret(plaintext: string, key: CryptoKey): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const data = new TextEncoder().encode(plaintext);
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data));
  const packed = new Uint8Array(iv.length + ct.length);
  packed.set(iv, 0);
  packed.set(ct, iv.length);
  return bytesToBase64(packed);
}

/** Decrypt a base64(iv + ciphertext+tag) payload. Throws if the key is wrong or data is tampered. */
export async function decryptSecret(payload: string, key: CryptoKey): Promise<string> {
  const packed = base64ToBytes(payload);
  if (packed.length <= IV_BYTES) throw new Error('Ciphertext too short');
  const iv = packed.subarray(0, IV_BYTES);
  const ct = packed.subarray(IV_BYTES);
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
  return new TextDecoder().decode(pt);
}
