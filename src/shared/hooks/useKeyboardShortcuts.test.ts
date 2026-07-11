import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useKeyboardShortcuts, type KeyboardShortcut } from './useKeyboardShortcuts';

function dispatchKey(
  target: EventTarget,
  key: string,
  modifiers: Partial<
    Pick<KeyboardEventInit, 'ctrlKey' | 'shiftKey' | 'altKey' | 'metaKey'>
  > = {}
) {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...modifiers,
  });
  target.dispatchEvent(event);
  return event;
}

describe('useKeyboardShortcuts', () => {
  it('fires a matching shortcut outside inputs', () => {
    const action = vi.fn();
    const shortcuts: KeyboardShortcut[] = [
      { id: 'f', key: 'F', description: 'search', action, shift: true },
    ];
    renderHook(() => useKeyboardShortcuts(shortcuts));

    dispatchKey(document.body, 'F', { shiftKey: true });
    expect(action).toHaveBeenCalledTimes(1);
  });

  it('ignores keydowns originating from editable elements', () => {
    const action = vi.fn();
    const shortcuts: KeyboardShortcut[] = [
      { id: 'f', key: 'F', description: 'search', action, shift: true },
    ];
    renderHook(() => useKeyboardShortcuts(shortcuts));

    const input = document.createElement('input');
    document.body.appendChild(input);
    const event = dispatchKey(input, 'F', { shiftKey: true });
    expect(action).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(false);
    input.remove();
  });

  it('does not fire when extra modifiers are held', () => {
    const action = vi.fn();
    const shortcuts: KeyboardShortcut[] = [
      { id: 'f', key: 'F', description: 'search', action, shift: true },
    ];
    renderHook(() => useKeyboardShortcuts(shortcuts));

    dispatchKey(document.body, 'F', { shiftKey: true, ctrlKey: true });
    expect(action).not.toHaveBeenCalled();
  });

  it('requires declared modifiers to be pressed', () => {
    const action = vi.fn();
    const shortcuts: KeyboardShortcut[] = [
      { id: 'f', key: 'F', description: 'search', action, shift: true },
    ];
    renderHook(() => useKeyboardShortcuts(shortcuts));

    dispatchKey(document.body, 'f');
    expect(action).not.toHaveBeenCalled();
  });
});
