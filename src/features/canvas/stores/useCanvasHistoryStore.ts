// Lightweight undo stack for canvas actions. Each entry knows how to reverse
// itself (an inverse closure). Scoped to add / paste / duplicate / delete — the
// "I just did that wrong, take it back" case. Not persisted; cleared per canvas.

import { create } from 'zustand';

export interface HistoryEntry {
  label: string;
  undo: () => void | Promise<void>;
}

interface CanvasHistoryState {
  stack: HistoryEntry[];
  push: (entry: HistoryEntry) => void;
  undo: () => Promise<void>;
  clear: () => void;
}

const MAX = 50;

export const useCanvasHistoryStore = create<CanvasHistoryState>((set, get) => ({
  stack: [],
  push: (entry) =>
    set((s) => ({ stack: [...s.stack, entry].slice(-MAX) })),
  undo: async () => {
    const { stack } = get();
    const entry = stack[stack.length - 1];
    if (!entry) return;
    set({ stack: stack.slice(0, -1) });
    try {
      await entry.undo();
    } catch (err) {
      console.error('❌ Undo failed:', err);
    }
  },
  clear: () => set({ stack: [] }),
}));
