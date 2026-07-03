// Deterministic, stable, pseudonymous codename for a user id (CVS-33).
// Comment/collaboration UI must not leak raw Clerk ids (`user_…`) or real
// names/emails. Given a user id we derive a readable "Adjective Noun" handle
// from a hash of the id — the SAME id always yields the SAME codename, across
// sessions and comments, with no PII and no network lookup.
//
// Shared utility: reuse this everywhere author identity is shown (comments,
// avatars, mentions, notifications). Do not reimplement per surface.

const ADJECTIVES = [
  'Swift', 'Bright', 'Calm', 'Bold', 'Keen', 'Brave', 'Quiet', 'Nimble',
  'Lucid', 'Merry', 'Noble', 'Amber', 'Cosmic', 'Golden', 'Silver', 'Crimson',
  'Azure', 'Jade', 'Rapid', 'Gentle', 'Clever', 'Vivid', 'Mellow', 'Steady',
  'Sunny', 'Frosty', 'Lively', 'Solar', 'Lunar', 'Wild', 'Zesty', 'Curious',
];

const NOUNS = [
  'Falcon', 'Otter', 'Cedar', 'Comet', 'Heron', 'Maple', 'Willow', 'Lynx',
  'Sparrow', 'Badger', 'Coral', 'Ember', 'Harbor', 'Meadow', 'Quartz', 'Raven',
  'Sable', 'Thistle', 'Vale', 'Wren', 'Aspen', 'Birch', 'Cobalt', 'Delta',
  'Fable', 'Grove', 'Halo', 'Iris', 'Juniper', 'Koi', 'Larch', 'Onyx',
];

/** FNV-1a — small, fast, deterministic string hash. */
function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Stable "Adjective Noun" handle for a user id (never the raw id or real name). */
export function userCodename(id: string | null | undefined): string {
  if (!id) return 'Unknown';
  const h = hash(id);
  const adj = ADJECTIVES[h % ADJECTIVES.length];
  const noun = NOUNS[Math.floor(h / ADJECTIVES.length) % NOUNS.length];
  return `${adj} ${noun}`;
}

/** Two-letter avatar initials derived from the codename (e.g. "SF"). */
export function codenameInitials(id: string | null | undefined): string {
  return userCodename(id)
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
