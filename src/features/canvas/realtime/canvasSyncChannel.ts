// Outbound half of canvas multiplayer sync. Holds the active Supabase Realtime
// broadcast channel (set by useCanvasRealtime) and exposes broadcastCanvasChange
// for the stores/handlers to emit local mutations to other sessions.
//
// This module deliberately imports NO stores so the stores can import it to
// broadcast without an import cycle. The inbound half (applyRemoteChange) lives
// separately and is used only by the hook.

import type { RealtimeChannel } from '@supabase/supabase-js';
import type { CanvasNode, MetricCard, Relationship } from '@/shared/types';

/** "card" = metric-card node (useCanvasStore.canvas.nodes); "canvasNode" =
 *  operator/source/chart/comment/whiteboard node (useCanvasNodesStore). */
export type NodeFamily = 'card' | 'canvasNode';

export type CanvasChange =
  | { t: 'node:create'; family: NodeFamily; node: MetricCard | CanvasNode }
  | {
      t: 'node:move';
      family: NodeFamily;
      id: string;
      position: { x: number; y: number };
    }
  | { t: 'node:delete'; family: NodeFamily; id: string }
  | { t: 'edge:create'; edge: Relationship }
  | { t: 'edge:delete'; id: string };

export const CANVAS_BROADCAST_EVENT = 'canvas:change';

let activeChannel: RealtimeChannel | null = null;

/** Register (or clear) the channel that broadcastCanvasChange emits on. */
export function setCanvasSyncChannel(channel: RealtimeChannel | null) {
  activeChannel = channel;
}

/**
 * Emit a local canvas mutation to other sessions. No-op when single-player
 * (no channel). The channel is configured with broadcast `self: false`, so the
 * sender never receives its own message — no echo guard needed.
 */
export function broadcastCanvasChange(change: CanvasChange) {
  if (!activeChannel) return;
  void activeChannel.send({
    type: 'broadcast',
    event: CANVAS_BROADCAST_EVENT,
    payload: change,
  });
}
