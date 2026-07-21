import {
  useCanvasPanelStore,
  type DockSide,
} from '@/features/canvas/stores/useCanvasPanelStore';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { loadDockWidth } from './dockWidth';
import {
  DockPanelShell,
  type DockPanelShellProps,
} from './DockPanelShell';

/** Standard dock widths (px): md for focused panels, lg for dense detail
    panels, xl for writing surfaces (evidence notebook). */
export const DOCK_WIDTHS = { md: 420, lg: 600, xl: 720 } as const;

export interface DockPanelProps extends DockPanelShellProps {
  /** Which dock slot to render into. Default right. */
  side?: DockSide;
  open: boolean;
  /** 'md' (420px), 'lg' (600px), 'xl' (720px), or an explicit pixel width. */
  width?: keyof typeof DOCK_WIDTHS | number;
  /** Opt into persisted, user-resizable width: a stable per-panel-kind key
      (e.g. 'evidenceEdit'). A stored width overrides `width`, and the
      DockHost drag handle persists resizes under this key. Right side only. */
  widthStorageKey?: string;
}

/**
 * Renders a DockPanelShell into the registered dock slot via a portal, so the
 * owning component keeps its React context (stores, ReactFlowProvider,
 * callbacks) while the DOM lands in CanvasLayout's dock column.
 */
export function DockPanel({
  side = 'right',
  open,
  width = 'md',
  widthStorageKey,
  ...shellProps
}: DockPanelProps) {
  const hostEl = useCanvasPanelStore((s) =>
    side === 'right' ? s.rightHostEl : s.leftHostEl
  );
  const widthPx = typeof width === 'number' ? width : DOCK_WIDTHS[width];
  const rendering = open && hostEl !== null;

  // Declare width + register mounted content while rendering. The cleanup on
  // unmount is what lets the host collapse when the owning page navigates
  // away with the panel still "open" in the store.
  useEffect(() => {
    if (!rendering) return;
    const s = useCanvasPanelStore.getState();
    const storageKey = side === 'right' ? widthStorageKey : undefined;
    const stored = storageKey ? loadDockWidth(storageKey) : null;
    s.setPanelWidth(side, stored ?? widthPx);
    if (storageKey) s.setRightWidthStorageKey(storageKey);
    s.registerContent(side);
    return () => {
      const cleanup = useCanvasPanelStore.getState();
      cleanup.unregisterContent(side);
      if (storageKey && cleanup.rightWidthStorageKey === storageKey) {
        cleanup.setRightWidthStorageKey(null);
      }
    };
  }, [rendering, side, widthPx, widthStorageKey]);

  if (!rendering) return null;

  return createPortal(<DockPanelShell {...shellProps} />, hostEl);
}
