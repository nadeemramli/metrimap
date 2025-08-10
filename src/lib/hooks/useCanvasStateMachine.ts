// React hook for integrating the Canvas XState machine with React components
// Provides a clean interface for managing dual-environment canvas state

import { useMachine } from "@xstate/react";
import { useCallback, useEffect } from "react";
import {
  canvasMachine,
  selectors,
  type CanvasEvent,
  type CanvasContext,
} from "../machines/canvasMachine";

export interface CanvasStateMachineHook {
  // Current state
  state: any;
  context: CanvasContext;

  // Environment control
  switchToPractical: () => void;
  switchToDesign: () => void;
  isInPracticalMode: boolean;
  isInDesignMode: boolean;
  currentEnvironment: "practical" | "design";

  // Tool management
  setNavigationTool: (tool: "move" | "hand" | "scale") => void;
  setPracticalTool: (tool: "select" | "connect" | "pan" | "zoom") => void;
  setDesignTool: (tool: string) => void;
  currentTool: string;

  // Whiteboard state
  isWhiteboardActive: boolean;
  enablePassthrough: () => void;
  disablePassthrough: () => void;
  isPassthroughMode: boolean;
  toggleKeepToolActive: () => void;
  keepToolActive: boolean;

  // Drawing preferences
  setStrokeColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  strokeColor?: string;
  strokeWidth?: number;

  // Viewport management
  updateViewport: (viewport: { x: number; y: number; zoom: number }) => void;
  viewport: { x: number; y: number; zoom: number };

  // Data management
  updatePracticalData: (nodes: any[], edges: any[]) => void;
  updateDesignData: (elements: any[], appState: any) => void;
  practicalNodes: any[];
  practicalEdges: any[];
  designElements: any[];
  designAppState: any;

  // Collaboration
  addCollaborator: (collaborator: {
    id: string;
    environment: "practical" | "design";
  }) => void;
  removeCollaborator: (collaboratorId: string) => void;
  collaborators: Array<{
    id: string;
    cursor?: { x: number; y: number };
    environment: "practical" | "design";
  }>;
  isCollaborationActive: boolean;

  // Utilities
  synchronizeEnvironments: () => void;
  resetCanvas: () => void;

  // Error handling
  hasError: boolean;
  error?: string;
  clearError: () => void;

  // Raw send function for custom events
  send: (event: CanvasEvent) => void;
}

export function useCanvasStateMachine(): CanvasStateMachineHook {
  const [state, send] = useMachine(canvasMachine);
  const { context } = state;

  // Environment control
  const switchToPractical = useCallback(() => {
    send({ type: "SWITCH_TO_PRACTICAL" });
  }, [send]);

  const switchToDesign = useCallback(() => {
    send({ type: "SWITCH_TO_DESIGN" });
  }, [send]);

  // Tool management
  const setNavigationTool = useCallback(
    (tool: "move" | "hand" | "scale") => {
      send({ type: "SET_NAVIGATION_TOOL", tool });
    },
    [send]
  );

  const setPracticalTool = useCallback(
    (tool: "select" | "connect" | "pan" | "zoom") => {
      send({ type: "SET_PRACTICAL_TOOL", tool });
    },
    [send]
  );

  const setDesignTool = useCallback(
    (tool: string) => {
      send({
        type: "SET_DESIGN_TOOL",
        tool: tool as any, // Type assertion since we know the valid tools
      });
    },
    [send]
  );

  // Whiteboard state
  const enablePassthrough = useCallback(() => {
    send({ type: "ENABLE_PASSTHROUGH" });
  }, [send]);

  const disablePassthrough = useCallback(() => {
    send({ type: "DISABLE_PASSTHROUGH" });
  }, [send]);

  const toggleKeepToolActive = useCallback(() => {
    send({ type: "TOGGLE_KEEP_TOOL_ACTIVE" });
  }, [send]);

  // Drawing preferences
  const setStrokeColor = useCallback(
    (color: string) => {
      send({ type: "SET_STROKE_COLOR", color });
    },
    [send]
  );

  const setStrokeWidth = useCallback(
    (width: number) => {
      send({ type: "SET_STROKE_WIDTH", width });
    },
    [send]
  );

  // Viewport management
  const updateViewport = useCallback(
    (viewport: { x: number; y: number; zoom: number }) => {
      send({ type: "UPDATE_VIEWPORT", viewport });
    },
    [send]
  );

  // Data management
  const updatePracticalData = useCallback(
    (nodes: any[], edges: any[]) => {
      send({ type: "UPDATE_PRACTICAL_DATA", nodes, edges });
    },
    [send]
  );

  const updateDesignData = useCallback(
    (elements: any[], appState: any) => {
      send({ type: "UPDATE_DESIGN_DATA", elements, appState });
    },
    [send]
  );

  // Collaboration
  const addCollaborator = useCallback(
    (collaborator: { id: string; environment: "practical" | "design" }) => {
      send({ type: "ADD_COLLABORATOR", collaborator });
    },
    [send]
  );

  const removeCollaborator = useCallback(
    (collaboratorId: string) => {
      send({ type: "REMOVE_COLLABORATOR", collaboratorId });
    },
    [send]
  );

  // Utilities
  const synchronizeEnvironments = useCallback(() => {
    send({ type: "SYNCHRONIZE_ENVIRONMENTS" });
  }, [send]);

  const resetCanvas = useCallback(() => {
    send({ type: "RESET_CANVAS" });
  }, [send]);

  // Error handling
  const clearError = useCallback(() => {
    send({ type: "CLEAR_ERROR" });
  }, [send]);

  // Computed values using selectors
  const isInPracticalMode = selectors.isInPracticalMode(state);
  const isInDesignMode = selectors.isInDesignMode(state);
  const currentEnvironment = selectors.getCurrentEnvironment(state);
  const isWhiteboardActive = selectors.isWhiteboardActive(state);
  const isPassthroughMode = selectors.isPassthroughMode(state);
  const currentTool = selectors.getCurrentTool(state);
  const viewport = selectors.getViewport(state);
  const collaborators = selectors.getCollaborators(state);
  const hasError = selectors.hasError(state);
  const error = selectors.getError(state);

  return {
    // State
    state,
    context,

    // Environment control
    switchToPractical,
    switchToDesign,
    isInPracticalMode,
    isInDesignMode,
    currentEnvironment,

    // Tool management
    setNavigationTool,
    setPracticalTool,
    setDesignTool,
    currentTool,

    // Whiteboard state
    isWhiteboardActive,
    enablePassthrough,
    disablePassthrough,
    isPassthroughMode,
    toggleKeepToolActive,
    keepToolActive: context.keepToolActive,

    // Drawing preferences
    setStrokeColor,
    setStrokeWidth,
    strokeColor: context.strokeColor,
    strokeWidth: context.strokeWidth,

    // Viewport management
    updateViewport,
    viewport,

    // Data management
    updatePracticalData,
    updateDesignData,
    practicalNodes: context.practicalNodes,
    practicalEdges: context.practicalEdges,
    designElements: context.designElements,
    designAppState: context.designAppState,

    // Collaboration
    addCollaborator,
    removeCollaborator,
    collaborators,
    isCollaborationActive: context.isCollaborationActive,

    // Utilities
    synchronizeEnvironments,
    resetCanvas,

    // Error handling
    hasError,
    error,
    clearError,

    // Raw send function
    send,
  };
}

// Convenience hooks for specific functionality
export function useCanvasEnvironment() {
  const {
    currentEnvironment,
    switchToPractical,
    switchToDesign,
    isInPracticalMode,
    isInDesignMode,
  } = useCanvasStateMachine();

  return {
    currentEnvironment,
    switchToPractical,
    switchToDesign,
    isInPracticalMode,
    isInDesignMode,
  };
}

export function useCanvasTools() {
  const {
    currentTool,
    setNavigationTool,
    setPracticalTool,
    setDesignTool,
    currentEnvironment,
  } = useCanvasStateMachine();

  return {
    currentTool,
    setNavigationTool,
    setPracticalTool,
    setDesignTool,
    currentEnvironment,
  };
}

export function useCanvasWhiteboard() {
  const {
    isWhiteboardActive,
    isPassthroughMode,
    enablePassthrough,
    disablePassthrough,
    toggleKeepToolActive,
    keepToolActive,
    setStrokeColor,
    setStrokeWidth,
    strokeColor,
    strokeWidth,
  } = useCanvasStateMachine();

  return {
    isWhiteboardActive,
    isPassthroughMode,
    enablePassthrough,
    disablePassthrough,
    toggleKeepToolActive,
    keepToolActive,
    setStrokeColor,
    setStrokeWidth,
    strokeColor,
    strokeWidth,
  };
}

export function useCanvasCollaboration() {
  const {
    collaborators,
    isCollaborationActive,
    addCollaborator,
    removeCollaborator,
  } = useCanvasStateMachine();

  return {
    collaborators,
    isCollaborationActive,
    addCollaborator,
    removeCollaborator,
  };
}
