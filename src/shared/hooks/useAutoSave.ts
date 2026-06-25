import { useCanvasStore } from '@/lib/stores';
import { useEffect, useRef } from 'react';

interface UseAutoSaveOptions {
  /** Debounce window in ms before pending changes are flushed. */
  delay?: number;
  /** When false, autosave is disabled (e.g. canvas not yet loaded). */
  enabled?: boolean;
}

/**
 * Real autosave for the canvas.
 *
 * Subscribes to the canvas store's `pendingChanges` set and, whenever it grows,
 * debounces a call to `saveAllPendingChanges()`. The store's save path uses the
 * module-level authenticated (Clerk) Supabase client, so writes go out under the
 * signed-in user's JWT and satisfy RLS.
 *
 * Also flushes immediately on `beforeunload` and when the tab is hidden
 * (`visibilitychange`), so edits are not lost on refresh/close.
 *
 * Resilient by design: it never throws, guards against a missing canvas id or an
 * empty pending set, and cleans up its timer/subscription/listeners on unmount.
 */
export function useAutoSave({ delay = 2000, enabled = true }: UseAutoSaveOptions = {}) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enabledRef = useRef(enabled);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    // Fire saveAllPendingChanges; the store internally no-ops when there is
    // nothing to save or a save is already running. Never let it throw.
    const flush = () => {
      try {
        const { canvas, pendingChanges, isSaving, saveAllPendingChanges } =
          useCanvasStore.getState();
        if (!enabledRef.current) return;
        if (!canvas?.id) return;
        if (!pendingChanges || pendingChanges.size === 0) return;
        if (isSaving) return;
        void Promise.resolve(saveAllPendingChanges()).catch((err) => {
          // saveAllPendingChanges already records errors in store state; this
          // is a last-resort guard so a rejected promise never bubbles up.
          console.error('Autosave flush failed:', err);
        });
      } catch (err) {
        console.error('Autosave flush threw:', err);
      }
    };

    const scheduleFlush = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        flush();
      }, delay);
    };

    // Debounced save whenever the set of pending changes grows.
    const unsubscribe = useCanvasStore.subscribe(
      (state) => state.pendingChanges,
      (pendingChanges) => {
        if (!enabledRef.current) return;
        if (pendingChanges && pendingChanges.size > 0) {
          scheduleFlush();
        }
      }
    );

    // Flush on tab close / refresh. We cancel the debounce and attempt an
    // immediate save; the request may not finish, but this captures the common
    // "edit then refresh" case.
    const handleBeforeUnload = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      flush();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        flush();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      unsubscribe();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [delay]);
}
