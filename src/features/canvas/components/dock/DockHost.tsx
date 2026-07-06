import {
  useCanvasPanelStore,
  type DockSide,
} from '@/features/canvas/stores/useCanvasPanelStore';
import { cn } from '@/shared/utils';
import { useCallback } from 'react';

/**
 * A dock slot in CanvasLayout's content row, below the top bar. It owns the
 * column width; panel content is portaled in by <DockPanel/> from whichever
 * component owns the data (CanvasLayout, CanvasPage, …), preserving their
 * React context (ReactFlowProvider etc.). Panels can never overlap the top
 * bar by construction.
 */
function DockHost({ side }: { side: DockSide }) {
  const setHostEl = useCanvasPanelStore((s) => s.setHostEl);
  const open = useCanvasPanelStore((s) =>
    side === 'right' ? s.rightPanel !== null : s.leftPanel !== null
  );
  const width = useCanvasPanelStore((s) =>
    side === 'right' ? s.rightWidth : s.leftWidth
  );

  const registerEl = useCallback(
    (el: HTMLDivElement | null) => setHostEl(side, el),
    [side, setHostEl]
  );

  return (
    <div
      ref={registerEl}
      className={cn(
        'relative shrink-0 overflow-hidden bg-background',
        open && (side === 'right' ? 'border-l border-border' : 'border-r border-border')
      )}
      style={{
        width: open ? width : 0,
        maxWidth: open ? '45vw' : 0,
      }}
    />
  );
}

export function RightDockHost() {
  return <DockHost side="right" />;
}

export function LeftDockHost() {
  return <DockHost side="left" />;
}
