import { create } from 'zustand';

export interface RemoteCursor {
  userId: string;
  name: string;
  color: string;
  x: number; // flow coordinates
  y: number;
  at: number; // last update (ms epoch)
}

interface CursorState {
  cursors: Record<string, RemoteCursor>;
  setCursor: (c: RemoteCursor) => void;
  pruneStale: (ttlMs: number) => void;
  clear: () => void;
}

/**
 * Holds remote cursor positions OUTSIDE CanvasPage so the ~20 updates/sec a
 * moving teammate produces only re-render the small CanvasCursorsLayer, not the
 * whole canvas (which recomputes the large node/edge memos and flickers).
 */
export const useCursorStore = create<CursorState>((set) => ({
  cursors: {},
  setCursor: (c) =>
    set((s) => ({ cursors: { ...s.cursors, [c.userId]: c } })),
  pruneStale: (ttlMs) =>
    set((s) => {
      const now = Date.now();
      let changed = false;
      const next: Record<string, RemoteCursor> = {};
      for (const [k, v] of Object.entries(s.cursors)) {
        if (now - v.at < ttlMs) next[k] = v;
        else changed = true;
      }
      return changed ? { cursors: next } : s;
    }),
  clear: () => set({ cursors: {} }),
}));
