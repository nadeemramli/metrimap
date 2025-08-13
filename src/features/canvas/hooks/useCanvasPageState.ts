import { useRef, useState } from 'react';

// Canvas page state hook - minimal implementation to satisfy current CanvasPage needs
export function useCanvasPageState() {
  // Load/error flags
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // React Flow and Whiteboard refs
  const reactFlowRef = useRef<any>(null);
  const whiteboardRef = useRef<any>(null);

  // UI state
  const [toolbarMode, setToolbarMode] = useState<'edit' | 'draw'>('edit');
  const [navigationTool, setNavigationTool] = useState<'select' | 'hand'>(
    'select'
  );
  const [keepToolActive, setKeepToolActive] = useState<boolean>(false);
  const [drawActiveTool, setDrawActiveTool] = useState<string>('freedraw');
  const [currentLayoutDirection, setCurrentLayoutDirection] = useState<
    'LR' | 'TB'
  >('LR');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Whiteboard overlay state
  const [isWhiteboardActive, setIsWhiteboardActive] = useState<boolean>(false);
  const [whiteboardScene, setWhiteboardScene] = useState<any>(null);
  const [wbPassthrough, setWbPassthrough] = useState<boolean>(false);

  // Selections and extras
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [extraNodes, setExtraNodes] = useState<any[]>([]);
  const [extraEdges, setExtraEdges] = useState<any[]>([]);

  // Sheets state
  const [isSettingsSheetOpen, setIsSettingsSheetOpen] =
    useState<boolean>(false);
  const [isRelationshipSheetOpen, setIsRelationshipSheetOpen] =
    useState<boolean>(false);

  return {
    // flags
    loading,
    error,
    setLoading,
    setError,

    // refs
    reactFlowRef,
    whiteboardRef,

    // ui
    toolbarMode,
    setToolbarMode,
    navigationTool,
    setNavigationTool,
    keepToolActive,
    setKeepToolActive,
    drawActiveTool,
    setDrawActiveTool,
    currentLayoutDirection,
    setCurrentLayoutDirection,
    isTransitioning,
    setIsTransitioning,

    // whiteboard overlay
    isWhiteboardActive,
    setIsWhiteboardActive,
    whiteboardScene,
    setWhiteboardScene,
    wbPassthrough,
    setWbPassthrough,

    // selections/extras
    selectedGroupIds,
    setSelectedGroupIds,
    extraNodes,
    setExtraNodes,
    extraEdges,
    setExtraEdges,

    // sheets
    isSettingsSheetOpen,
    setIsSettingsSheetOpen,
    isRelationshipSheetOpen,
    setIsRelationshipSheetOpen,
  };
}

export type CanvasPageState = ReturnType<typeof useCanvasPageState>;
