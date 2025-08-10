/**
 * Canvas Page State Management
 * Centralized state management for the CanvasPage component
 */

import { useState, useRef } from "react";
import type { Node, Edge } from "@xyflow/react";
import type { WhiteboardOverlayHandle } from "@/components/canvas/WhiteboardOverlay";
import type { FilterOptions } from "@/lib/utils/filterUtils";

export interface CanvasPageState {
  // Sheet and dialog states
  settingsCardId: string | undefined;
  setSettingsCardId: (id: string | undefined) => void;
  settingsInitialTab: string;
  setSettingsInitialTab: (tab: string) => void;
  relationshipSheetId: string | undefined;
  setRelationshipSheetId: (id: string | undefined) => void;
  isSettingsSheetOpen: boolean;
  setIsSettingsSheetOpen: (open: boolean) => void;
  isRelationshipSheetOpen: boolean;
  setIsRelationshipSheetOpen: (open: boolean) => void;
  showShortcutsHelp: boolean;
  setShowShortcutsHelp: (show: boolean) => void;
  showAdvancedSearch: boolean;
  setShowAdvancedSearch: (show: boolean) => void;

  // Node drop and temp nodes
  pendingNodeDrop: {
    position: { x: number; y: number };
    sourceNodeId: string;
  } | null;
  setPendingNodeDrop: (
    drop: { position: { x: number; y: number }; sourceNodeId: string } | null
  ) => void;
  extraNodes: Node[];
  setExtraNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  extraEdges: Edge[];
  setExtraEdges: React.Dispatch<React.SetStateAction<Edge[]>>;

  // Selection and grouping
  selectedGroupIds: string[];
  setSelectedGroupIds: React.Dispatch<React.SetStateAction<string[]>>;

  // Filter state
  filterModalOpen: boolean;
  setFilterModalOpen: (open: boolean) => void;
  currentFilters: FilterOptions;
  setCurrentFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  visibleNodeIds: Set<string>;
  setVisibleNodeIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  visibleEdgeIds: Set<string>;
  setVisibleEdgeIds: React.Dispatch<React.SetStateAction<Set<string>>>;

  // Layout state
  currentLayoutDirection: "TB" | "BT" | "LR" | "RL";
  setCurrentLayoutDirection: React.Dispatch<
    React.SetStateAction<"TB" | "BT" | "LR" | "RL">
  >;

  // Navigation and toolbar
  navigationTool: "move" | "hand" | "scale";
  setNavigationTool: React.Dispatch<
    React.SetStateAction<"move" | "hand" | "scale">
  >;
  prevNavigationToolRef: React.MutableRefObject<"move" | "hand" | "scale">;
  toolbarMode: "edit" | "draw";
  setToolbarMode: React.Dispatch<React.SetStateAction<"edit" | "draw">>;
  isTransitioning: boolean;
  setIsTransitioning: (transitioning: boolean) => void;

  // Whiteboard/Excalidraw state
  isWhiteboardActive: boolean;
  setIsWhiteboardActive: (active: boolean) => void;
  excalidrawReady: boolean;
  setExcalidrawReady: (ready: boolean) => void;
  whiteboardRef: React.MutableRefObject<WhiteboardOverlayHandle | null>;
  wbPassthrough: boolean;
  setWbPassthrough: (passthrough: boolean) => void;
  whiteboardScene: any | null;
  setWhiteboardScene: React.Dispatch<React.SetStateAction<any | null>>;
  keepToolActive: boolean;
  setKeepToolActive: (active: boolean) => void;
  drawActiveTool:
    | "hand"
    | "selection"
    | "rectangle"
    | "diamond"
    | "ellipse"
    | "arrow"
    | "line"
    | "freedraw"
    | "text"
    | "image"
    | "eraser"
    | undefined;
  setDrawActiveTool: React.Dispatch<
    React.SetStateAction<
      | "hand"
      | "selection"
      | "rectangle"
      | "diamond"
      | "ellipse"
      | "arrow"
      | "line"
      | "freedraw"
      | "text"
      | "image"
      | "eraser"
      | undefined
    >
  >;
  drawStrokeColor: string | undefined;
  setDrawStrokeColor: React.Dispatch<React.SetStateAction<string | undefined>>;
  drawStrokeWidth: number | undefined;
  setDrawStrokeWidth: React.Dispatch<React.SetStateAction<number | undefined>>;
  activeWbTool:
    | null
    | "rect"
    | "ellipse"
    | "diamond"
    | "arrow"
    | "line"
    | "freehand"
    | "image";
  setActiveWbTool: React.Dispatch<
    React.SetStateAction<
      | null
      | "rect"
      | "ellipse"
      | "diamond"
      | "arrow"
      | "line"
      | "freehand"
      | "image"
    >
  >;

  // Refs
  reactFlowRef: React.MutableRefObject<HTMLDivElement | null>;
}

export function useCanvasPageState(): CanvasPageState {
  // Sheet and dialog states
  const [settingsCardId, setSettingsCardId] = useState<string | undefined>();
  const [settingsInitialTab, setSettingsInitialTab] = useState<string>("data");
  const [relationshipSheetId, setRelationshipSheetId] = useState<
    string | undefined
  >();
  const [isSettingsSheetOpen, setIsSettingsSheetOpen] = useState(false);
  const [isRelationshipSheetOpen, setIsRelationshipSheetOpen] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  // Node drop and temp nodes
  const [pendingNodeDrop, setPendingNodeDrop] = useState<{
    position: { x: number; y: number };
    sourceNodeId: string;
  } | null>(null);
  const [extraNodes, setExtraNodes] = useState<Node[]>([]);
  const [extraEdges, setExtraEdges] = useState<Edge[]>([]);

  // Selection and grouping
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);

  // Filter state
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<FilterOptions>({});
  const [visibleNodeIds, setVisibleNodeIds] = useState<Set<string>>(new Set());
  const [visibleEdgeIds, setVisibleEdgeIds] = useState<Set<string>>(new Set());

  // Layout state
  const [currentLayoutDirection, setCurrentLayoutDirection] = useState<
    "TB" | "BT" | "LR" | "RL"
  >("TB");

  // Navigation and toolbar
  const [navigationTool, setNavigationTool] = useState<
    "move" | "hand" | "scale"
  >("move");
  const prevNavigationToolRef = useRef<"move" | "hand" | "scale">("move");
  const [toolbarMode, setToolbarMode] = useState<"edit" | "draw">("edit");
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Whiteboard/Excalidraw state
  const [isWhiteboardActive, setIsWhiteboardActive] = useState(false);
  const [excalidrawReady, setExcalidrawReady] = useState(false);
  const whiteboardRef = useRef<WhiteboardOverlayHandle | null>(null);
  const [wbPassthrough, setWbPassthrough] = useState(false);
  const [whiteboardScene, setWhiteboardScene] = useState<any | null>(null);
  const [keepToolActive, setKeepToolActive] = useState(false);
  const [drawActiveTool, setDrawActiveTool] = useState<
    | "hand"
    | "selection"
    | "rectangle"
    | "diamond"
    | "ellipse"
    | "arrow"
    | "line"
    | "freedraw"
    | "text"
    | "image"
    | "eraser"
    | undefined
  >(undefined);
  const [drawStrokeColor, setDrawStrokeColor] = useState<string | undefined>(
    undefined
  );
  const [drawStrokeWidth, setDrawStrokeWidth] = useState<number | undefined>(
    undefined
  );
  const [activeWbTool, setActiveWbTool] = useState<
    | null
    | "rect"
    | "ellipse"
    | "diamond"
    | "arrow"
    | "line"
    | "freehand"
    | "image"
  >(null);

  // Refs
  const reactFlowRef = useRef<HTMLDivElement>(null);

  return {
    // Sheet and dialog states
    settingsCardId,
    setSettingsCardId,
    settingsInitialTab,
    setSettingsInitialTab,
    relationshipSheetId,
    setRelationshipSheetId,
    isSettingsSheetOpen,
    setIsSettingsSheetOpen,
    isRelationshipSheetOpen,
    setIsRelationshipSheetOpen,
    showShortcutsHelp,
    setShowShortcutsHelp,
    showAdvancedSearch,
    setShowAdvancedSearch,

    // Node drop and temp nodes
    pendingNodeDrop,
    setPendingNodeDrop,
    extraNodes,
    setExtraNodes,
    extraEdges,
    setExtraEdges,

    // Selection and grouping
    selectedGroupIds,
    setSelectedGroupIds,

    // Filter state
    filterModalOpen,
    setFilterModalOpen,
    currentFilters,
    setCurrentFilters,
    visibleNodeIds,
    setVisibleNodeIds,
    visibleEdgeIds,
    setVisibleEdgeIds,

    // Layout state
    currentLayoutDirection,
    setCurrentLayoutDirection,

    // Navigation and toolbar
    navigationTool,
    setNavigationTool,
    prevNavigationToolRef,
    toolbarMode,
    setToolbarMode,
    isTransitioning,
    setIsTransitioning,

    // Whiteboard/Excalidraw state
    isWhiteboardActive,
    setIsWhiteboardActive,
    excalidrawReady,
    setExcalidrawReady,
    whiteboardRef,
    wbPassthrough,
    setWbPassthrough,
    whiteboardScene,
    setWhiteboardScene,
    keepToolActive,
    setKeepToolActive,
    drawActiveTool,
    setDrawActiveTool,
    drawStrokeColor,
    setDrawStrokeColor,
    drawStrokeWidth,
    setDrawStrokeWidth,
    activeWbTool,
    setActiveWbTool,

    // Refs
    reactFlowRef,
  };
}
