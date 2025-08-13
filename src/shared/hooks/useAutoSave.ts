import { useCallback, useEffect, useRef } from 'react';

interface UseAutoSaveOptions {
  onSave: () => Promise<void> | void;
  delay?: number;
  enabled?: boolean;
}

export function useAutoSave({
  onSave = async () => {},
  delay = 2000,
  enabled = true,
}: Partial<UseAutoSaveOptions> = {}) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const isEnabledRef = useRef(enabled);

  // Update enabled state
  useEffect(() => {
    isEnabledRef.current = enabled;
  }, [enabled]);

  const trigger = useCallback(() => {
    if (!isEnabledRef.current) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onSave();
    }, delay);
  }, [onSave, delay]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, []);

  const saveNow = useCallback(async () => {
    cancel();
    await onSave();
  }, [cancel, onSave]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    trigger,
    cancel,
    saveNow,
  };
}
