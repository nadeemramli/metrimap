import { useCallback, useRef, useState } from 'react';
import { useCanvasPanelStore } from '../stores/useCanvasPanelStore';
import type { WhiteboardTool } from '../components/whiteboard';

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
    'LR' | 'TB' | 'BT' | 'RL'
  >('TB');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // New React Flow whiteboard tools state
  const [whiteboardTool, setWhiteboardTool] =
    useState<WhiteboardTool>('select');
  const [whiteboardPartialSelection, setWhiteboardPartialSelection] =
    useState<boolean>(false);
  const [whiteboardBrushSize, setWhiteboardBrushSize] = useState<number>(3);
  const [whiteboardBrushColor, setWhiteboardBrushColor] =
    useState<string>('#000000');

  // Style applied to the next drawn shape (rectangle/ellipse/arrow/line/text).
  const [whiteboardShapeStyle, setWhiteboardShapeStyle] = useState<{
    fill: string;
    stroke: string;
    strokeWidth: number;
  }>({ fill: '#dbeafe', stroke: '#3b82f6', strokeWidth: 2 });

  // Whiteboard overlay state
  const [isWhiteboardActive, setIsWhiteboardActive] = useState<boolean>(false);
  const [whiteboardScene, setWhiteboardScene] = useState<any>(null);
  const [wbPassthrough, setWbPassthrough] = useState<boolean>(false);

  // Selections and extras
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [extraNodes, setExtraNodes] = useState<any[]>([]);
  const [extraEdges, setExtraEdges] = useState<any[]>([]);

  // Sheets state — adapter over the docked-panel store. The public shape is
  // unchanged (CanvasPage call sites keep working), but the truth lives in
  // useCanvasPanelStore so all right-dock panels are mutually exclusive.
  const rightPanel = useCanvasPanelStore((s) => s.rightPanel);
  const isSettingsSheetOpen = rightPanel?.kind === 'cardSettings';
  const settingsCardId = isSettingsSheetOpen ? rightPanel.cardId : undefined;
  const settingsInitialTab = isSettingsSheetOpen
    ? rightPanel.initialTab
    : undefined;
  const isRelationshipSheetOpen = rightPanel?.kind === 'relationship';
  const relationshipSheetId = isRelationshipSheetOpen
    ? rightPanel.relationshipId
    : undefined;

  // Callers open first, then set the id/tab (synchronous zustand updates make
  // the sequence safe). Setting an id while a different panel kind is open is
  // ignored — the panel is opened by its own "open" setter.
  const setIsSettingsSheetOpen = useCallback((open: boolean) => {
    const s = useCanvasPanelStore.getState();
    if (open) {
      const cur = s.rightPanel;
      s.openRight(
        cur?.kind === 'cardSettings' ? cur : { kind: 'cardSettings' }
      );
    } else if (s.rightPanel?.kind === 'cardSettings') {
      s.closeRight();
    }
  }, []);
  const setSettingsCardId = useCallback((cardId?: string) => {
    const s = useCanvasPanelStore.getState();
    if (s.rightPanel?.kind === 'cardSettings') {
      s.openRight({ ...s.rightPanel, cardId });
    }
  }, []);
  const setSettingsInitialTab = useCallback((initialTab?: string) => {
    const s = useCanvasPanelStore.getState();
    if (s.rightPanel?.kind === 'cardSettings') {
      s.openRight({ ...s.rightPanel, initialTab });
    }
  }, []);
  const setIsRelationshipSheetOpen = useCallback((open: boolean) => {
    const s = useCanvasPanelStore.getState();
    if (open) {
      const cur = s.rightPanel;
      s.openRight(
        cur?.kind === 'relationship' ? cur : { kind: 'relationship' }
      );
    } else if (s.rightPanel?.kind === 'relationship') {
      s.closeRight();
    }
  }, []);
  const setRelationshipSheetId = useCallback((relationshipId?: string) => {
    const s = useCanvasPanelStore.getState();
    if (s.rightPanel?.kind === 'relationship') {
      s.openRight({ ...s.rightPanel, relationshipId });
    }
  }, []);

  // Help and modals state
  const [showShortcutsHelp, setShowShortcutsHelp] = useState<boolean>(false);

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

    // whiteboard tools
    whiteboardTool,
    setWhiteboardTool,
    whiteboardPartialSelection,
    setWhiteboardPartialSelection,
    whiteboardBrushSize,
    setWhiteboardBrushSize,
    whiteboardBrushColor,
    setWhiteboardBrushColor,
    whiteboardShapeStyle,
    setWhiteboardShapeStyle,

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
    settingsCardId,
    setSettingsCardId,
    relationshipSheetId,
    setRelationshipSheetId,
    settingsInitialTab,
    setSettingsInitialTab,

    // help and modals
    showShortcutsHelp,
    setShowShortcutsHelp,
  };
}

export type CanvasPageState = ReturnType<typeof useCanvasPageState>;
