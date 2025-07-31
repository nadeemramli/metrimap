import { useEffect, useCallback, useRef } from 'react';

export interface KeyboardShortcut {
  key: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
  category: string;
  preventDefault?: boolean;
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
  target?: Element | Window;
}

export const useKeyboardShortcuts = (
  shortcuts: KeyboardShortcut[],
  options: UseKeyboardShortcutsOptions = {}
) => {
  const { enabled = true, target = window } = options;
  const shortcutsRef = useRef(shortcuts);
  
  // Update shortcuts ref when shortcuts change
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const { key, metaKey, ctrlKey, shiftKey, altKey } = event;
    
    // Find matching shortcut
    const matchingShortcut = shortcutsRef.current.find(shortcut => {
      const keyMatches = shortcut.key.toLowerCase() === key.toLowerCase();
      const metaMatches = !!shortcut.metaKey === metaKey;
      const ctrlMatches = !!shortcut.ctrlKey === ctrlKey;
      const shiftMatches = !!shortcut.shiftKey === shiftKey;
      const altMatches = !!shortcut.altKey === altKey;
      
      return keyMatches && metaMatches && ctrlMatches && shiftMatches && altMatches;
    });

    if (matchingShortcut) {
      if (matchingShortcut.preventDefault !== false) {
        event.preventDefault();
      }
      matchingShortcut.action();
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const element = target === window ? window : target as Element;
    element.addEventListener('keydown', handleKeyDown as EventListener);

    return () => {
      element.removeEventListener('keydown', handleKeyDown as EventListener);
    };
  }, [enabled, target, handleKeyDown]);

  return {
    shortcuts: shortcutsRef.current,
    enabled
  };
};

// Utility function to format keyboard shortcut for display
export const formatShortcut = (shortcut: KeyboardShortcut): string => {
  const parts: string[] = [];
  
  if (shortcut.metaKey) parts.push('⌘');
  if (shortcut.ctrlKey) parts.push('Ctrl');
  if (shortcut.altKey) parts.push('Alt');
  if (shortcut.shiftKey) parts.push('⇧');
  
  // Format special keys
  const keyMap: Record<string, string> = {
    ' ': 'Space',
    'ArrowUp': '↑',
    'ArrowDown': '↓',
    'ArrowLeft': '←',
    'ArrowRight': '→',
    'Enter': '↵',
    'Escape': 'Esc',
    'Backspace': '⌫',
    'Delete': '⌦',
    'Tab': '⇥'
  };
  
  const formattedKey = keyMap[shortcut.key] || shortcut.key.toUpperCase();
  parts.push(formattedKey);
  
  return parts.join(' + ');
};

// Common shortcut patterns
export const createShortcut = {
  cmd: (key: string, action: () => void, description: string, category: string = 'General'): KeyboardShortcut => ({
    key,
    metaKey: true,
    action,
    description,
    category
  }),
  
  ctrl: (key: string, action: () => void, description: string, category: string = 'General'): KeyboardShortcut => ({
    key,
    ctrlKey: true,
    action,
    description,
    category
  }),
  
  alt: (key: string, action: () => void, description: string, category: string = 'General'): KeyboardShortcut => ({
    key,
    altKey: true,
    action,
    description,
    category
  }),
  
  shift: (key: string, action: () => void, description: string, category: string = 'General'): KeyboardShortcut => ({
    key,
    shiftKey: true,
    action,
    description,
    category
  }),
  
  key: (key: string, action: () => void, description: string, category: string = 'General'): KeyboardShortcut => ({
    key,
    action,
    description,
    category,
    preventDefault: false
  })
};