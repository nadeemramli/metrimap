import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import { useEffect, useRef, useState } from 'react';

export interface PresenceUser {
  userId: string;
  name: string;
  avatar?: string;
  /** Which sub-page the user is currently viewing (e.g. "Dashboard"). */
  page?: string;
}

/**
 * Lightweight multiplayer presence over Supabase Realtime — no table, fully
 * ephemeral. Tracks the current user on a per-project channel and returns the
 * live roster (deduped by userId). Re-tracks when the user's page/name changes.
 *
 * Degrades to an empty roster when the authed client or identity isn't ready.
 */
export function usePresence(
  projectId: string | undefined,
  me: PresenceUser | null
): PresenceUser[] {
  const client = useClerkSupabase();
  const [roster, setRoster] = useState<PresenceUser[]>([]);
  // Keep the latest payload available to the (stable) subscribe callback.
  const meRef = useRef(me);
  meRef.current = me;

  const userId = me?.userId;

  // Subscribe once per (client, project, user). The channel lives across
  // sub-page navigation because CanvasLayout owns this hook.
  useEffect(() => {
    if (!client || !projectId || !userId) {
      setRoster([]);
      return;
    }

    const channel = client.channel(`presence:project:${projectId}`, {
      config: { presence: { key: userId } },
    });

    const sync = () => {
      const state = channel.presenceState<PresenceUser>();
      const seen = new Map<string, PresenceUser>();
      Object.values(state).forEach((metas) => {
        const meta = metas[0];
        if (meta && !seen.has(meta.userId)) seen.set(meta.userId, meta);
      });
      setRoster(Array.from(seen.values()));
    };

    channel
      .on('presence', { event: 'sync' }, sync)
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && meRef.current) {
          await channel.track(meRef.current);
        }
      });

    return () => {
      channel.untrack();
      client.removeChannel(channel);
    };
  }, [client, projectId, userId]);

  // Re-broadcast when the page label (or name/avatar) changes.
  useEffect(() => {
    if (!client || !projectId || !userId || !me) return;
    const channel = client
      .getChannels()
      .find((c) => c.topic === `realtime:presence:project:${projectId}`);
    channel?.track(me);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me?.page, me?.name, me?.avatar]);

  return roster;
}
