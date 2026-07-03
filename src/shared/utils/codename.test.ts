import { describe, it, expect } from 'vitest';
import { userCodename, codenameInitials } from './codename';

describe('userCodename', () => {
  const id = 'user_30uQARGozqSApAChPSGSwFyUiy85';

  it('is deterministic + stable for the same id', () => {
    expect(userCodename(id)).toBe(userCodename(id));
    expect(userCodename(id)).toMatch(/^[A-Z][a-z]+ [A-Z][a-z]+$/);
  });

  it('never leaks the raw id', () => {
    const name = userCodename(id);
    expect(name).not.toContain('user_');
    expect(name).not.toBe(id);
  });

  it('differs across different ids (no trivial collision on a small set)', () => {
    const ids = Array.from({ length: 20 }, (_, i) => `user_${i}abcXYZ`);
    const names = new Set(ids.map(userCodename));
    expect(names.size).toBeGreaterThan(15); // mostly unique
  });

  it('handles null/empty', () => {
    expect(userCodename(null)).toBe('Unknown');
    expect(userCodename(undefined)).toBe('Unknown');
    expect(userCodename('')).toBe('Unknown');
  });
});

describe('codenameInitials', () => {
  it('derives two uppercase letters from the codename', () => {
    const init = codenameInitials('user_abc');
    expect(init).toMatch(/^[A-Z]{2}$/);
    // stable + derived from the codename, not the id
    const [a, b] = userCodename('user_abc').split(' ');
    expect(init).toBe((a[0] + b[0]).toUpperCase());
  });
});
