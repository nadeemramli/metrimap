import { useCallback, useEffect } from 'react';

export interface KeyboardShortcut {
  id: string;
  key: string;
  description: string;
  action: () => void;
  category?: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  preventDefault?: boolean;
}

export function formatShortcut(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];

  if (shortcut.ctrl) parts.push('Ctrl');
  if (shortcut.meta) parts.push('Cmd');
  if (shortcut.shift) parts.push('Shift');
  if (shortcut.alt) parts.push('Alt');

  parts.push(shortcut.key);

  return parts.join('+');
}

export function createShortcut(
  key: string,
  description: string,
  action: () => void,
  options: Partial<KeyboardShortcut> = {}
): KeyboardShortcut {
  return {
    id: `${key}-${Date.now()}`,
    key,
    description,
    action,
    ...options,
  };
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[] = []) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const matchingShortcut = shortcuts.find((shortcut) => {
        if (shortcut.key.toLowerCase() !== event.key.toLowerCase())
          return false;
        if (shortcut.ctrl && !event.ctrlKey) return false;
        if (shortcut.shift && !event.shiftKey) return false;
        if (shortcut.alt && !event.altKey) return false;
        if (shortcut.meta && !event.metaKey) return false;

        return true;
      });

      if (matchingShortcut) {
        if (matchingShortcut.preventDefault !== false) {
          event.preventDefault();
        }
        matchingShortcut.action();
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return { shortcuts };
}




