// Undo/redo command stack for canvas actions. Each entry knows how to reverse
// itself (undo) and re-apply itself (redo). Covers add / paste / duplicate /
// delete / move / edge create+delete. Not persisted; cleared per canvas.
//
// While an undo/redo entry is applying, `push` is suppressed: entries route
// their reversal back through the normal store mutations (so autosave
// re-persists), and those mutations must NOT capture a fresh history entry, or
// undo/redo would feed back on itself (CVS-42, locked decision).

import { create } from 'zustand';

export interface HistoryEntry {
  label: string;
  undo: () => void | Promise<void>;
  redo: () => void | Promise<void>;
}

interface CanvasHistoryState {
  undoStack: HistoryEntry[];
  redoStack: HistoryEntry[];
  /** True while an undo/redo entry is running — capture is suppressed. */
  isApplying: boolean;
  push: (entry: HistoryEntry) => void;
  undo: () => Promise<void>;
  redo: () => Promise<void>;
  clear: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

const MAX = 50;

export const useCanvasHistoryStore = create<CanvasHistoryState>((set, get) => ({
  undoStack: [],
  redoStack: [],
  isApplying: false,
  // A fresh action invalidates the redo stack. Suppressed during an
  // undo/redo apply so reversals don't capture themselves.
  push: (entry) => {
    if (get().isApplying) return;
    set((s) => ({
      undoStack: [...s.undoStack, entry].slice(-MAX),
      redoStack: [],
    }));
  },
  undo: async () => {
    if (get().isApplying) return;
    const { undoStack } = get();
    const entry = undoStack[undoStack.length - 1];
    if (!entry) return;
    set((s) => ({
      undoStack: s.undoStack.slice(0, -1),
      redoStack: [...s.redoStack, entry].slice(-MAX),
      isApplying: true,
    }));
    try {
      await entry.undo();
    } catch (err) {
      console.error('❌ Undo failed:', err);
    } finally {
      set({ isApplying: false });
    }
  },
  redo: async () => {
    if (get().isApplying) return;
    const { redoStack } = get();
    const entry = redoStack[redoStack.length - 1];
    if (!entry) return;
    set((s) => ({
      redoStack: s.redoStack.slice(0, -1),
      undoStack: [...s.undoStack, entry].slice(-MAX),
      isApplying: true,
    }));
    try {
      await entry.redo();
    } catch (err) {
      console.error('❌ Redo failed:', err);
    } finally {
      set({ isApplying: false });
    }
  },
  clear: () => set({ undoStack: [], redoStack: [] }),
  canUndo: () => get().undoStack.length > 0,
  canRedo: () => get().redoStack.length > 0,
}));
