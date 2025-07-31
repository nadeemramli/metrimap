import { createContext, useContext, ReactNode, useState } from "react";

export interface CanvasHeaderInfo {
  title: string;
  description?: string;
  autoSaveStatus: {
    text: string;
    icon: any;
    className: string;
    bgClassName: string;
    dotClassName: string;
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
      "useCanvasHeader must be used within a CanvasHeaderProvider"
    );
  }
  return context;
}

export function CanvasHeaderProvider({ children }: { children: ReactNode }) {
  const [headerInfo, setHeaderInfo] = useState<CanvasHeaderInfo | null>(null);

  return (
    <CanvasHeaderContext.Provider value={{ headerInfo, setHeaderInfo }}>
      {children}
    </CanvasHeaderContext.Provider>
  );
}
