import {
  useCanvasPanelStore,
  type DockSide,
} from '@/features/canvas/stores/useCanvasPanelStore';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  DockPanelShell,
  type DockPanelShellProps,
} from './DockPanelShell';

/** Standard dock widths (px): md for focused panels, lg for dense detail panels. */
export const DOCK_WIDTHS = { md: 420, lg: 600 } as const;

export interface DockPanelProps extends DockPanelShellProps {
  /** Which dock slot to render into. Default right. */
  side?: DockSide;
  open: boolean;
  /** 'md' (420px), 'lg' (600px), or an explicit pixel width. */
  width?: keyof typeof DOCK_WIDTHS | number;
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
  ...shellProps
}: DockPanelProps) {
  const hostEl = useCanvasPanelStore((s) =>
    side === 'right' ? s.rightHostEl : s.leftHostEl
  );
  const setPanelWidth = useCanvasPanelStore((s) => s.setPanelWidth);
  const widthPx = typeof width === 'number' ? width : DOCK_WIDTHS[width];

  useEffect(() => {
    if (open) setPanelWidth(side, widthPx);
  }, [open, side, widthPx, setPanelWidth]);

  if (!open || !hostEl) return null;

  return createPortal(<DockPanelShell {...shellProps} />, hostEl);
}
