import type { SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import {
  CANVAS_BROADCAST_EVENT,
  setCanvasSyncChannel,
  type CanvasChange,
} from '@/features/canvas/realtime/canvasSyncChannel';
import { applyRemoteCanvasChange } from '@/features/canvas/realtime/applyRemoteChange';

interface UseCanvasRealtimeOptions {
  canvasId: string;
  supabaseClient?: SupabaseClient | null;
}

/**
 * Live multiplayer sync of node/edge changes over a Supabase Realtime broadcast
 * channel. Local mutations are emitted by the stores via broadcastCanvasChange
 * (see canvasSyncChannel); this hook subscribes to the same channel and applies
 * remote changes to local state. Presence/cursors are handled separately by
 * usePresence.
 *
 * The channel is re-created when the authed client changes (useClerkSupabase is
 * not a stable singleton), mirroring usePresence.
 */
export function useCanvasRealtime({
  canvasId,
  supabaseClient,
}: UseCanvasRealtimeOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabaseClient || !canvasId) {
      setIsConnected(false);
      return;
    }

    // self: false -> we don't receive our own broadcasts (no echo). ack: false
    // keeps send() fire-and-forget for low latency.
    const channel = supabaseClient.channel(`canvas:project:${canvasId}`, {
      config: { broadcast: { self: false, ack: false } },
    });

    channel
      .on('broadcast', { event: CANVAS_BROADCAST_EVENT }, ({ payload }) => {
        try {
          applyRemoteCanvasChange(payload as CanvasChange);
        } catch (e) {
          console.error('❌ Failed to apply remote canvas change:', e);
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setCanvasSyncChannel(channel);
          setIsConnected(true);
          setError(null);
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setIsConnected(false);
          setError('Realtime connection error');
        }
      });

    return () => {
      setCanvasSyncChannel(null);
      setIsConnected(false);
      void supabaseClient.removeChannel(channel);
    };
  }, [canvasId, supabaseClient]);

  return { isConnected, error };
}
