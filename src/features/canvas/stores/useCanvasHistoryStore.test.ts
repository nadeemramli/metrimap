import { beforeEach, describe, expect, it } from 'vitest';
import { useCanvasHistoryStore } from './useCanvasHistoryStore';

const store = () => useCanvasHistoryStore.getState();
const noop = { undo: () => {}, redo: () => {} };

beforeEach(() => {
  useCanvasHistoryStore.setState({
    undoStack: [],
    redoStack: [],
    isApplying: false,
  });
});

describe('useCanvasHistoryStore', () => {
  it('moves entries between stacks on undo/redo', async () => {
    const log: string[] = [];
    store().push({
      label: 'a',
      undo: () => void log.push('undo-a'),
      redo: () => void log.push('redo-a'),
    });
    expect(store().canUndo()).toBe(true);
    expect(store().canRedo()).toBe(false);

    await store().undo();
    expect(log).toEqual(['undo-a']);
    expect(store().canUndo()).toBe(false);
    expect(store().canRedo()).toBe(true);

    await store().redo();
    expect(log).toEqual(['undo-a', 'redo-a']);
    expect(store().canUndo()).toBe(true);
  });

  it('clears the redo stack on a fresh push', async () => {
    store().push({ label: 'a', ...noop });
    await store().undo();
    expect(store().canRedo()).toBe(true);
    store().push({ label: 'b', ...noop });
    expect(store().canRedo()).toBe(false);
  });

  it('suppresses capture during an undo apply (no feedback loop)', async () => {
    store().push({
      label: 'x',
      // Reversal that itself tries to record history — must be ignored.
      undo: () => store().push({ label: 'reentrant', ...noop }),
      redo: () => {},
    });
    await store().undo();
    expect(store().redoStack.map((e) => e.label)).toEqual(['x']);
    expect(store().undoStack).toEqual([]);
  });

  it('caps the undo stack at 50', () => {
    for (let i = 0; i < 60; i++) store().push({ label: String(i), ...noop });
    expect(store().undoStack.length).toBe(50);
    expect(store().undoStack[0].label).toBe('10');
  });
});
