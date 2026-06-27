// Undo/redo stacks for canvas actions. Each entry knows how to reverse itself
// (undo) and re-apply itself (redo). Scoped to add / paste / duplicate / delete.
// Not persisted; cleared per canvas.

import { create } from 'zustand';

export interface HistoryEntry {
  label: string;
  undo: () => void | Promise<void>;
  redo: () => void | Promise<void>;
}

interface CanvasHistoryState {
  undoStack: HistoryEntry[];
  redoStack: HistoryEntry[];
  push: (entry: HistoryEntry) => void;
  undo: () => Promise<void>;
  redo: () => Promise<void>;
  clear: () => void;
}

const MAX = 50;

export const useCanvasHistoryStore = create<CanvasHistoryState>((set, get) => ({
  undoStack: [],
  redoStack: [],
  // A fresh action invalidates the redo stack.
  push: (entry) =>
    set((s) => ({
      undoStack: [...s.undoStack, entry].slice(-MAX),
      redoStack: [],
    })),
  undo: async () => {
    const { undoStack } = get();
    const entry = undoStack[undoStack.length - 1];
    if (!entry) return;
    set((s) => ({
      undoStack: s.undoStack.slice(0, -1),
      redoStack: [...s.redoStack, entry].slice(-MAX),
    }));
    try {
      await entry.undo();
    } catch (err) {
      console.error('❌ Undo failed:', err);
    }
  },
  redo: async () => {
    const { redoStack } = get();
    const entry = redoStack[redoStack.length - 1];
    if (!entry) return;
    set((s) => ({
      redoStack: s.redoStack.slice(0, -1),
      undoStack: [...s.undoStack, entry].slice(-MAX),
    }));
    try {
      await entry.redo();
    } catch (err) {
      console.error('❌ Redo failed:', err);
    }
  },
  clear: () => set({ undoStack: [], redoStack: [] }),
}));
