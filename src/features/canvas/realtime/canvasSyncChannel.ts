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
  | {
      t: 'node:update';
      family: NodeFamily;
      id: string;
      // A partial of the family's node (MetricCard or CanvasNode); applied
      // verbatim by applyRemoteCanvasChange, which casts to the right type.
      updates: Record<string, unknown>;
    }
  | { t: 'edge:create'; edge: Relationship }
  | { t: 'edge:delete'; id: string }
  // Data-flow / reference (operator-pipeline) edges. These live in CanvasPage
  // React state, not a store, so applying them goes through a registered setter.
  | { t: 'extraEdge:create'; edge: ExtraEdge }
  | { t: 'extraEdge:delete'; id: string };

export interface ExtraEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  data?: Record<string, unknown>;
}

export const CANVAS_BROADCAST_EVENT = 'canvas:change';

let activeChannel: RealtimeChannel | null = null;

/** Register (or clear) the channel that broadcastCanvasChange emits on. */
export function setCanvasSyncChannel(channel: RealtimeChannel | null) {
  activeChannel = channel;
}

/** Apply hooks for extra (data-flow/reference) edges, owned by CanvasPage state. */
export interface ExtraEdgesApply {
  get: () => ExtraEdge[];
  set: (edges: ExtraEdge[]) => void;
}

let extraEdgesApply: ExtraEdgesApply | null = null;

export function registerExtraEdgesApply(api: ExtraEdgesApply | null) {
  extraEdgesApply = api;
}

export function getExtraEdgesApply() {
  return extraEdgesApply;
}

/**
 * Emit a local canvas mutation to other sessions. No-op when single-player
 * (no channel). The channel is configured with broadcast `self: false`, so the
 * sender never receives its own message — no echo guard needed.
 */
export function broadcastCanvasChange(change: CanvasChange) {
  if (!activeChannel) {
    console.warn('📡 canvas change NOT sent (no active channel):', change.t);
    return;
  }
  console.log('📡 canvas send:', change.t);
  void activeChannel.send({
    type: 'broadcast',
    event: CANVAS_BROADCAST_EVENT,
    payload: change,
  });
}
