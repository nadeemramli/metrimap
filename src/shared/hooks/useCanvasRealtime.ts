import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CANVAS_BROADCAST_EVENT,
  setCanvasSyncChannel,
  type CanvasChange,
} from '@/features/canvas/realtime/canvasSyncChannel';
import { applyRemoteCanvasChange } from '@/features/canvas/realtime/applyRemoteChange';
import {
  useCursorStore,
  type RemoteCursor,
} from '@/features/canvas/realtime/useCursorStore';

export interface RealtimeUser {
  userId: string;
  name: string;
  avatar?: string;
}

const CURSOR_EVENT = 'canvas:cursor';
const CURSOR_TTL_MS = 5000;
const CURSOR_THROTTLE_MS = 50;

/** Deterministic, readable colour per user. */
function colorForUser(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash << 5) - hash + userId.charCodeAt(i);
    hash |= 0;
  }
  return `hsl(${Math.abs(hash) % 360}, 70%, 45%)`;
}

interface UseCanvasRealtimeOptions {
  canvasId: string;
  supabaseClient?: SupabaseClient | null;
  me?: RealtimeUser | null;
}

/**
 * Live multiplayer over a Supabase Realtime broadcast channel per canvas:
 *  - node/edge changes (emitted by the stores via broadcastCanvasChange,
 *    applied through each store's local-only path — no re-persist/echo), and
 *  - ephemeral cursors (throttled, pruned after a TTL).
 *
 * broadcast self:false means we never receive our own messages. The channel is
 * re-created when the authed client changes (useClerkSupabase isn't a stable
 * singleton), mirroring usePresence.
 */
export function useCanvasRealtime({
  canvasId,
  supabaseClient,
  me,
}: UseCanvasRealtimeOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const meRef = useRef(me);
  meRef.current = me;
  const lastCursorSent = useRef(0);

  useEffect(() => {
    if (!supabaseClient || !canvasId) {
      setIsConnected(false);
      return;
    }

    const channel = supabaseClient.channel(`canvas:project:${canvasId}`, {
      config: { broadcast: { self: false, ack: false } },
    });
    channelRef.current = channel;

    channel
      .on('broadcast', { event: CANVAS_BROADCAST_EVENT }, ({ payload }) => {
        try {
          console.log('📡 canvas recv:', (payload as CanvasChange)?.t);
          applyRemoteCanvasChange(payload as CanvasChange);
        } catch (e) {
          console.error('❌ Failed to apply remote canvas change:', e);
        }
      })
      .on('broadcast', { event: CURSOR_EVENT }, ({ payload }) => {
        const c = payload as RemoteCursor;
        if (!c?.userId || c.userId === meRef.current?.userId) return;
        // Into a dedicated store, NOT React state here — otherwise every cursor
        // tick would re-render CanvasPage and flicker the whole canvas.
        useCursorStore.getState().setCursor({ ...c, at: Date.now() });
      })
      .subscribe((status) => {
        // Ignore a superseded channel's late callback (StrictMode double-mount /
        // client churn) so it can't register a channel we've already removed.
        if (channelRef.current !== channel) return;
        console.log(`📡 canvas realtime: ${status} (canvas ${canvasId})`);
        if (status === 'SUBSCRIBED') {
          setCanvasSyncChannel(channel);
          setIsConnected(true);
        } else if (
          status === 'CHANNEL_ERROR' ||
          status === 'TIMED_OUT' ||
          status === 'CLOSED'
        ) {
          setIsConnected(false);
        }
      });

    return () => {
      setCanvasSyncChannel(null);
      channelRef.current = null;
      setIsConnected(false);
      useCursorStore.getState().clear();
      void supabaseClient.removeChannel(channel);
    };
  }, [canvasId, supabaseClient]);

  // Prune cursors that have gone quiet (left / closed tab).
  useEffect(() => {
    const id = setInterval(
      () => useCursorStore.getState().pruneStale(CURSOR_TTL_MS),
      2000
    );
    return () => clearInterval(id);
  }, []);

  const sendCursor = useCallback((x: number, y: number) => {
    const channel = channelRef.current;
    const m = meRef.current;
    if (!channel || !m) return;
    const now = Date.now();
    if (now - lastCursorSent.current < CURSOR_THROTTLE_MS) return;
    lastCursorSent.current = now;
    void channel.send({
      type: 'broadcast',
      event: CURSOR_EVENT,
      payload: { userId: m.userId, name: m.name, color: colorForUser(m.userId), x, y },
    });
  }, []);

  return { isConnected, sendCursor };
}
