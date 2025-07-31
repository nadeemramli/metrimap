import { useEffect, useRef } from 'react';
import { useCanvasStore } from '@/lib/stores/canvasStore';
import { useDebouncedCallback } from './useDebounced';

/**
 * Hook that provides auto-save functionality for canvas changes
 * Debounces save operations to avoid too many API calls
 */
export function useAutoSave(delay: number = 2000) {
  const { 
    pendingChanges, 
    saveAllPendingChanges, 
    isSaving,
    lastSaved 
  } = useCanvasStore();
  
  const isInitialLoad = useRef(true);

  // Debounced save function
  const debouncedSave = useDebouncedCallback(async () => {
    if (pendingChanges.size > 0) {
      console.log('🔄 Auto-saving', pendingChanges.size, 'pending changes...');
      await saveAllPendingChanges();
    }
  }, delay);

  // Trigger auto-save when there are pending changes
  useEffect(() => {
    // Skip initial load to avoid unnecessary save
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    if (pendingChanges.size > 0 && !isSaving) {
      debouncedSave();
    }
  }, [pendingChanges.size, isSaving, debouncedSave]);

  // Return auto-save status for UI feedback
  return {
    hasPendingChanges: pendingChanges.size > 0,
    isSaving,
    lastSaved,
    pendingCount: pendingChanges.size,
  };
}

export default useAutoSave;