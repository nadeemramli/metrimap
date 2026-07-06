// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { decryptSecret, encryptSecret, importSecretKey } from './crypto';
import { needsRefresh } from './secrets';

const keyA = btoa(String.fromCharCode(...new Array(32).fill(7)));
const keyB = btoa(String.fromCharCode(...new Array(32).fill(9)));

describe('connector secret crypto (AES-256-GCM)', () => {
  it('round-trips a secret', async () => {
    const key = await importSecretKey(keyA);
    const enc = await encryptSecret('ya29.super-secret-token', key);
    expect(enc).not.toContain('super-secret'); // ciphertext, not plaintext
    expect(await decryptSecret(enc, key)).toBe('ya29.super-secret-token');
  });

  it('produces different ciphertext each call (random IV)', async () => {
    const key = await importSecretKey(keyA);
    const a = await encryptSecret('same', key);
    const b = await encryptSecret('same', key);
    expect(a).not.toBe(b);
    expect(await decryptSecret(a, key)).toBe('same');
    expect(await decryptSecret(b, key)).toBe('same');
  });

  it('fails to decrypt with the wrong key', async () => {
    const enc = await encryptSecret('secret', await importSecretKey(keyA));
    await expect(decryptSecret(enc, await importSecretKey(keyB))).rejects.toBeTruthy();
  });

  it('rejects a key that is not 32 bytes', async () => {
    await expect(importSecretKey(btoa('too-short'))).rejects.toThrow(/32 bytes/);
  });

  it('rejects a truncated ciphertext', async () => {
    await expect(decryptSecret('AAAA', await importSecretKey(keyA))).rejects.toBeTruthy();
  });
});

describe('needsRefresh', () => {
  const now = Date.parse('2026-07-06T12:00:00Z');

  it('is false for a non-expiring credential', () => {
    expect(needsRefresh(null, 60, now)).toBe(false);
    expect(needsRefresh(undefined, 60, now)).toBe(false);
  });

  it('is false when the token is comfortably valid', () => {
    expect(needsRefresh('2026-07-06T13:00:00Z', 60, now)).toBe(false);
  });

  it('is true within the skew window', () => {
    expect(needsRefresh('2026-07-06T12:00:30Z', 60, now)).toBe(true);
  });

  it('is true once expired', () => {
    expect(needsRefresh('2026-07-06T11:00:00Z', 60, now)).toBe(true);
  });

  it('is true for an unparseable expiry', () => {
    expect(needsRefresh('not-a-date', 60, now)).toBe(true);
  });
});
