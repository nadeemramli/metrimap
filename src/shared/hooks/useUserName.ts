import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/stores';
import { getUsersByIds } from '@/shared/lib/supabase/services/users';
import { getClientForEnvironment } from '@/shared/utils/authenticatedClient';

// Module-level cache + in-flight dedupe so many cards resolving the same editor
// share one lookup and re-renders don't refetch.
const nameCache = new Map<string, string>();
const inflight = new Map<string, Promise<void>>();

function resolve(id: string): Promise<void> {
  if (nameCache.has(id)) return Promise.resolve();
  const existing = inflight.get(id);
  if (existing) return existing;
  const p = getUsersByIds([id], getClientForEnvironment())
    .then((map) => {
      const u = map[id];
      nameCache.set(id, u?.name || u?.email || 'Someone');
    })
    .catch(() => {
      nameCache.set(id, 'Someone');
    })
    .finally(() => {
      inflight.delete(id);
    });
  inflight.set(id, p);
  return p;
}

/**
 * Resolve a Clerk user id to a display name, cached. Returns "you" for the
 * signed-in user and undefined until a lookup completes (caller can hide the
 * label meanwhile).
 */
export function useUserName(id?: string | null): string | undefined {
  const currentUserId = useAppStore((s) => s.user?.id);
  const [, force] = useState(0);
  const isSelf = id && id === currentUserId;

  useEffect(() => {
    if (!id || isSelf || nameCache.has(id)) return;
    let active = true;
    void resolve(id).then(() => active && force((n) => n + 1));
    return () => {
      active = false;
    };
  }, [id, isSelf]);

  if (!id) return undefined;
  if (isSelf) return 'you';
  return nameCache.get(id);
}
