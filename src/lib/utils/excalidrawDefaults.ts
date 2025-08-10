// Utility functions for Excalidraw default configurations
// Ensures consistent appState structure to prevent runtime errors

export interface ExcalidrawAppState {
  viewBackgroundColor: string;
  collaborators: Map<string, any>;
  currentChartType?: string;
  currentItemBackgroundColor?: string;
  currentItemEndArrowhead?: string;
  currentItemFillStyle?: string;
  currentItemFontFamily?: number;
  currentItemFontSize?: number;
  currentItemLinearStrokeSharpness?: string;
  currentItemOpacity?: number;
  currentItemRoughness?: number;
  currentItemStartArrowhead?: string | null;
  currentItemStrokeColor?: string;
  currentItemStrokeSharpness?: string;
  currentItemStrokeStyle?: string;
  currentItemStrokeWidth?: number;
  currentItemTextAlign?: string;
  cursorButton?: string;
  draggingElement?: any;
  editingElement?: any;
  editingGroupId?: any;
  errorMessage?: any;
  exportBackground?: boolean;
  exportEmbedScene?: boolean;
  exportScale?: number;
  exportWithDarkMode?: boolean;
  gridSize?: any;
  isBindingEnabled?: boolean;
  isLoading?: boolean;
  lastPointerDownWith?: string;
  multiElement?: any;
  name?: string;
  openMenu?: any;
  penDetected?: boolean;
  penMode?: boolean;
  previousSelectedElementIds?: Record<string, any>;
  resizingElement?: any;
  scrolledOutside?: boolean;
  scrollX?: number;
  scrollY?: number;
  selectedElementIds?: Record<string, any>;
  selectedGroupIds?: Record<string, any>;
  shouldCacheIgnoreZoom?: boolean;
  showStats?: boolean;
  suggestedBindings?: any[];
  toast?: any;
  width?: number;
  height?: number;
  zoom?: { value: number };
  activeTool?: { type: string };
  [key: string]: any;
}

export interface ExcalidrawInitialData {
  appState: ExcalidrawAppState;
  elements: any[];
}

/**
 * Creates a minimal, safe default appState for Excalidraw
 * Includes all required fields to prevent runtime errors
 */
export function createMinimalAppState(
  overrides: Partial<ExcalidrawAppState> = {}
): ExcalidrawAppState {
  return {
    viewBackgroundColor: "transparent",
    collaborators: new Map(),
    scrollX: 0,
    scrollY: 0,
    zoom: { value: 1 },
    selectedElementIds: {},
    selectedGroupIds: {},
    ...overrides,
  };
}

/**
 * Creates a comprehensive default appState for Excalidraw
 * Includes all standard properties to ensure compatibility
 */
export function createFullAppState(
  overrides: Partial<ExcalidrawAppState> = {}
): ExcalidrawAppState {
  return {
    viewBackgroundColor: "transparent",
    collaborators: new Map(),
    currentChartType: "bar",
    currentItemBackgroundColor: "transparent",
    currentItemEndArrowhead: "arrow",
    currentItemFillStyle: "solid",
    currentItemFontFamily: 1,
    currentItemFontSize: 20,
    currentItemLinearStrokeSharpness: "round",
    currentItemOpacity: 100,
    currentItemRoughness: 1,
    currentItemStartArrowhead: null,
    currentItemStrokeColor: "#1e1e1e",
    currentItemStrokeSharpness: "round",
    currentItemStrokeStyle: "solid",
    currentItemStrokeWidth: 1,
    currentItemTextAlign: "left",
    cursorButton: "up",
    draggingElement: null,
    editingElement: null,
    editingGroupId: null,
    errorMessage: null,
    exportBackground: true,
    exportEmbedScene: false,
    exportScale: 1,
    exportWithDarkMode: false,
    gridSize: null,
    isBindingEnabled: true,
    isLoading: false,
    lastPointerDownWith: "mouse",
    multiElement: null,
    name: "Untitled",
    openMenu: null,
    penDetected: false,
    penMode: false,
    previousSelectedElementIds: {},
    resizingElement: null,
    scrolledOutside: false,
    scrollX: 0,
    scrollY: 0,
    selectedElementIds: {},
    selectedGroupIds: {},
    shouldCacheIgnoreZoom: false,
    showStats: false,
    suggestedBindings: [],
    toast: null,
    width: 0,
    height: 0,
    zoom: { value: 1 },
    ...overrides,
  };
}

/**
 * Creates default initial data for Excalidraw component
 */
export function createExcalidrawInitialData(
  appStateOverrides: Partial<ExcalidrawAppState> = {},
  elements: any[] = []
): ExcalidrawInitialData {
  return {
    appState: createMinimalAppState(appStateOverrides),
    elements,
  };
}

/**
 * Creates viewport-sync safe appState update
 * Only includes the essential fields needed for viewport synchronization
 */
export function createViewportSyncAppState(
  scrollX: number,
  scrollY: number,
  zoom: number
): Partial<ExcalidrawAppState> {
  return {
    scrollX,
    scrollY,
    zoom: { value: zoom },
    viewBackgroundColor: "transparent",
    collaborators: new Map(), // Always ensure collaborators is a Map
  };
}

/**
 * Sanitizes loaded Excalidraw data to ensure proper types
 * Fixes common issues like collaborators not being a Map
 */
export function sanitizeExcalidrawData(data: any): ExcalidrawInitialData {
  if (!data) {
    return createExcalidrawInitialData();
  }

  // Ensure we have basic structure
  const sanitized: ExcalidrawInitialData = {
    appState: data.appState || {},
    elements: Array.isArray(data.elements) ? data.elements : [],
  };

  // Fix collaborators field - must be a Map
  if (
    !sanitized.appState.collaborators ||
    !(sanitized.appState.collaborators instanceof Map)
  ) {
    sanitized.appState.collaborators = new Map();
  }

  // Ensure other critical fields exist
  if (!sanitized.appState.viewBackgroundColor) {
    sanitized.appState.viewBackgroundColor = "transparent";
  }

  if (!sanitized.appState.zoom) {
    sanitized.appState.zoom = { value: 1 };
  }

  if (typeof sanitized.appState.scrollX !== "number") {
    sanitized.appState.scrollX = 0;
  }

  if (typeof sanitized.appState.scrollY !== "number") {
    sanitized.appState.scrollY = 0;
  }

  if (!sanitized.appState.selectedElementIds) {
    sanitized.appState.selectedElementIds = {};
  }

  if (!sanitized.appState.selectedGroupIds) {
    sanitized.appState.selectedGroupIds = {};
  }

  return sanitized;
}
