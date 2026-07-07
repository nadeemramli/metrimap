// Device-local "seen" tracking for canvas annotations (comment threads +
// evidence items). Powers the unread ring/pulse on pins. Deliberately
// localStorage-only for v1 — unread state does not follow the user across
// devices (a comment_thread_reads table is the eventual upgrade path).

type SeenMap = Record<string, string>; // annotation id → ISO last-seen

const storageKey = (userId?: string | null) =>
  `metrimap.annotation-seen.${userId || 'anon'}`;

function readMap(userId?: string | null): SeenMap {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return raw ? (JSON.parse(raw) as SeenMap) : {};
  } catch {
    return {};
  }
}

export function markSeen(userId: string | null | undefined, id: string): void {
  try {
    const map = readMap(userId);
    map[id] = new Date().toISOString();
    localStorage.setItem(storageKey(userId), JSON.stringify(map));
  } catch {
    // Storage unavailable (private mode) — unread simply won't clear.
  }
}

/**
 * True when the annotation has activity newer than the user last saw it.
 * `latestActivityAt` null/undefined → nothing to be unread about.
 */
export function isUnseen(
  userId: string | null | undefined,
  id: string,
  latestActivityAt?: string | null
): boolean {
  if (!latestActivityAt) return false;
  const seen = readMap(userId)[id];
  if (!seen) return true;
  return new Date(latestActivityAt).getTime() > new Date(seen).getTime();
}
