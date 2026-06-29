import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useCanvasHeaderOptional } from '@/shared/contexts/CanvasHeaderContext';

interface PageHeaderOptions {
  title: string;
  description?: string;
  actions?: ReactNode;
  // Extra reactive values that should re-push the header when they change
  // (e.g. action buttons whose disabled state depends on selection).
  deps?: unknown[];
}

/**
 * Registers a canvas sub-page's title/description/actions into the shared
 * CanvasLayout top bar. Sub-pages call this instead of rendering their own
 * in-page <h1>, so the chrome stays consistent across pages.
 *
 * Overwrite-on-mount (no clear-to-null on unmount) keeps the header from
 * flickering blank while navigating between sub-pages — the next page's
 * usePageHeader simply overwrites it. CanvasPage sets the full header
 * (autoSave/canvasMode/editableTitle) directly and is unaffected.
 */
export function usePageHeader({
  title,
  description,
  actions,
  deps = [],
}: PageHeaderOptions) {
  // Optional context: when a page is also mounted at a top-level route outside
  // the canvas shell, there is no provider and this hook becomes a no-op.
  const ctx = useCanvasHeaderOptional();
  const setHeaderInfo = ctx?.setHeaderInfo;

  useEffect(() => {
    setHeaderInfo?.({ title, description, actions, editableTitle: false });
    // setHeaderInfo is stable; title/description/actions plus caller deps drive updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setHeaderInfo, title, description, ...deps]);
}
