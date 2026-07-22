import {
  useCanvasPanelStore,
  type DockSide,
} from '@/features/canvas/stores/useCanvasPanelStore';
import { cn } from '@/shared/utils';
import { useCallback, useState } from 'react';
import { clampDockWidth, saveDockWidth } from './dockWidth';

/**
 * A dock slot in CanvasLayout's content row, below the top bar. It owns the
 * column width; panel content is portaled in by <DockPanel/> from whichever
 * component owns the data (CanvasLayout, CanvasPage, …), preserving their
 * React context (ReactFlowProvider etc.). Panels can never overlap the top
 * bar by construction.
 */
function DockHost({ side }: { side: DockSide }) {
  const setHostEl = useCanvasPanelStore((s) => s.setHostEl);
  // Size by ACTUAL mounted content, not by the open-panel flag: if the page
  // owning the panel unmounts (route change), the column collapses instead
  // of lingering as an empty shell.
  const open = useCanvasPanelStore((s) =>
    side === 'right' ? s.rightContentCount > 0 : s.leftContentCount > 0
  );
  const width = useCanvasPanelStore((s) =>
    side === 'right' ? s.rightWidth : s.leftWidth
  );
  const [resizing, setResizing] = useState(false);

  const registerEl = useCallback(
    (el: HTMLDivElement | null) => setHostEl(side, el),
    [side, setHostEl]
  );

  // Drag-resize (right dock only): live width goes to the store; on release
  // it persists under the open panel's widthStorageKey, if it declared one.
  const startResize = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setResizing(true);
    const onMove = (ev: PointerEvent) => {
      useCanvasPanelStore
        .getState()
        .setPanelWidth('right', clampDockWidth(window.innerWidth - ev.clientX));
    };
    const onUp = () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      setResizing(false);
      const s = useCanvasPanelStore.getState();
      if (s.rightWidthStorageKey) {
        saveDockWidth(s.rightWidthStorageKey, s.rightWidth);
      }
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  }, []);

  return (
    <div
      ref={registerEl}
      data-testid={`dock-host-${side}`}
      className={cn(
        'relative shrink-0 overflow-hidden bg-background',
        open && (side === 'right' ? 'border-l border-border' : 'border-r border-border')
      )}
      style={{
        width: open ? width : 0,
        maxWidth: open ? '45vw' : 0,
      }}
    >
      {side === 'right' && open && (
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize panel"
          onPointerDown={startResize}
          className="absolute inset-y-0 left-0 z-20 w-1.5 cursor-col-resize touch-none hover:bg-primary/20 active:bg-primary/30"
        />
      )}
      {/* Full-screen shield while dragging so iframes/editors can't swallow
          pointermove; also keeps the col-resize cursor everywhere. */}
      {resizing && (
        <div className="fixed inset-0 z-50 cursor-col-resize select-none" />
      )}
    </div>
  );
}

export function RightDockHost() {
  return <DockHost side="right" />;
}

export function LeftDockHost() {
  return <DockHost side="left" />;
}
