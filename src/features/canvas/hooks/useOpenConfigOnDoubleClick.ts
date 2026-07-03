import { useEffect } from 'react';

// Utility nodes (source, chart) keep their config inside the node component.
// CanvasPage's onNodeDoubleClick dispatches a `node:open-config` window event
// so double-clicking the node opens its own config instead of the generic
// metric sheet. Each such node listens for its own id here.
export function useOpenConfigOnDoubleClick(nodeId: string, open: () => void) {
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ id?: string }>).detail;
      if (detail?.id === nodeId) open();
    };
    window.addEventListener('node:open-config', handler);
    return () => window.removeEventListener('node:open-config', handler);
  }, [nodeId, open]);
}
