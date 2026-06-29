import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';

export interface CanvasHeaderInfo {
  title: string;
  description?: string;
  // Right-aligned per-page action buttons (rendered before Collaborate/UserMenu).
  actions?: ReactNode;
  // When true, the title is rendered with CanvasTitleEditor (rename-on-dbl-click).
  // Only the canvas itself is editable; sub-pages render a static title.
  editableTitle?: boolean;
  // Auto-save indicator — only present on the canvas page.
  autoSaveStatus?: {
    text: string;
    icon: any;
    className: string;
    bgClassName: string;
    dotClassName: string;
  };
  // Canvas mode toggle — only present on the canvas page.
  canvasMode?: {
    mode: 'edit' | 'draw';
    onChangeMode: (mode: 'edit' | 'draw') => void;
  };
}

interface CanvasHeaderContextType {
  headerInfo: CanvasHeaderInfo | null;
  setHeaderInfo: (info: CanvasHeaderInfo | null) => void;
}

const CanvasHeaderContext = createContext<CanvasHeaderContextType | undefined>(
  undefined
);

export function useCanvasHeader() {
  const context = useContext(CanvasHeaderContext);
  if (context === undefined) {
    throw new Error(
      'useCanvasHeader must be used within a CanvasHeaderProvider'
    );
  }
  return context;
}

/**
 * Non-throwing variant: returns null when rendered outside a
 * CanvasHeaderProvider (e.g. a page mounted both inside the canvas shell and
 * at a top-level route). Lets shared hooks degrade to a no-op.
 */
export function useCanvasHeaderOptional() {
  return useContext(CanvasHeaderContext) ?? null;
}

export function CanvasHeaderProvider({ children }: { children: ReactNode }) {
  const [headerInfo, setHeaderInfo] = useState<CanvasHeaderInfo | null>(null);

  return (
    <CanvasHeaderContext.Provider value={{ headerInfo, setHeaderInfo }}>
      {children}
    </CanvasHeaderContext.Provider>
  );
}
