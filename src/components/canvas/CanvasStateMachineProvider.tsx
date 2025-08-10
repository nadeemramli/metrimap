// Canvas State Machine Provider - Drop-in replacement for existing state management
// This component provides a migration path by wrapping the existing CanvasPage

import React, { createContext, useContext, useEffect } from "react";
import {
  useCanvasStateMachine,
  type CanvasStateMachineHook,
} from "@/lib/hooks/useCanvasStateMachine";

// Context for providing the canvas state machine throughout the component tree
const CanvasStateMachineContext = createContext<CanvasStateMachineHook | null>(
  null
);

export interface CanvasStateMachineProviderProps {
  children: React.ReactNode;
  canvasId?: string;
  onEnvironmentChange?: (environment: "practical" | "design") => void;
  onError?: (error: string) => void;
}

export function CanvasStateMachineProvider({
  children,
  canvasId,
  onEnvironmentChange,
  onError,
}: CanvasStateMachineProviderProps) {
  const stateMachine = useCanvasStateMachine();

  // Notify parent component of environment changes
  useEffect(() => {
    if (onEnvironmentChange) {
      onEnvironmentChange(stateMachine.currentEnvironment);
    }
  }, [stateMachine.currentEnvironment, onEnvironmentChange]);

  // Handle errors
  useEffect(() => {
    if (stateMachine.hasError && onError) {
      onError(stateMachine.error || "Unknown canvas error");
    }
  }, [stateMachine.hasError, stateMachine.error, onError]);

  return (
    <CanvasStateMachineContext.Provider value={stateMachine}>
      {children}
    </CanvasStateMachineContext.Provider>
  );
}

// Hook to access the canvas state machine from any child component
export function useCanvasStateMachineContext(): CanvasStateMachineHook {
  const context = useContext(CanvasStateMachineContext);
  if (!context) {
    throw new Error(
      "useCanvasStateMachineContext must be used within a CanvasStateMachineProvider"
    );
  }
  return context;
}

// Legacy compatibility hook - provides the same interface as the old state variables
export function useLegacyCanvasState() {
  const machine = useCanvasStateMachineContext();

  return {
    // Legacy mode mapping
    toolbarMode: machine.currentEnvironment === "practical" ? "edit" : "draw",
    setToolbarMode: (mode: "edit" | "draw") => {
      if (mode === "edit") {
        machine.switchToPractical();
      } else {
        machine.switchToDesign();
      }
    },

    // Legacy whiteboard state
    isWhiteboardActive: machine.isWhiteboardActive,
    setIsWhiteboardActive: (active: boolean) => {
      if (active) {
        machine.switchToDesign();
      } else {
        machine.switchToPractical();
      }
    },

    // Legacy navigation tool
    navigationTool: machine.context.navigationTool,
    setNavigationTool: machine.setNavigationTool,

    // Legacy passthrough
    wbPassthrough: machine.isPassthroughMode,
    setWbPassthrough: (passthrough: boolean) => {
      if (passthrough) {
        machine.enablePassthrough();
      } else {
        machine.disablePassthrough();
      }
    },

    // Legacy draw tools
    drawActiveTool: machine.context.designTool,
    setDrawActiveTool: machine.setDesignTool,

    // Legacy draw preferences
    drawStrokeColor: machine.strokeColor,
    setDrawStrokeColor: machine.setStrokeColor,
    drawStrokeWidth: machine.strokeWidth,
    setDrawStrokeWidth: machine.setStrokeWidth,

    // Legacy keep tool active
    keepToolActive: machine.keepToolActive,
    setKeepToolActive: (active: boolean) => {
      if (active !== machine.keepToolActive) {
        machine.toggleKeepToolActive();
      }
    },

    // Direct access to machine for advanced usage
    machine,
  };
}

// Enhanced toolbar props that work with the state machine
export interface EnhancedToolbarProps {
  // Environment control
  currentEnvironment: "practical" | "design";
  onSwitchEnvironment: (env: "practical" | "design") => void;

  // Tool management
  activeTool: string;
  onSelectTool: (tool: string) => void;

  // Drawing preferences (design mode)
  strokeColor?: string;
  strokeWidth?: number;
  onSetStrokeColor?: (color: string) => void;
  onSetStrokeWidth?: (width: number) => void;

  // Tool locking
  keepToolActive: boolean;
  onToggleKeepToolActive: () => void;

  // Collaboration
  collaborators: Array<{
    id: string;
    environment: "practical" | "design";
  }>;
}

// Hook to provide enhanced toolbar props from the state machine
export function useEnhancedToolbarProps(): EnhancedToolbarProps {
  const machine = useCanvasStateMachineContext();

  return {
    currentEnvironment: machine.currentEnvironment,
    onSwitchEnvironment: (env) => {
      if (env === "practical") {
        machine.switchToPractical();
      } else {
        machine.switchToDesign();
      }
    },

    activeTool: machine.currentTool,
    onSelectTool: (tool) => {
      if (machine.currentEnvironment === "practical") {
        machine.setPracticalTool(tool as any);
      } else {
        machine.setDesignTool(tool);
      }
    },

    strokeColor: machine.strokeColor,
    strokeWidth: machine.strokeWidth,
    onSetStrokeColor: machine.setStrokeColor,
    onSetStrokeWidth: machine.setStrokeWidth,

    keepToolActive: machine.keepToolActive,
    onToggleKeepToolActive: machine.toggleKeepToolActive,

    collaborators: machine.collaborators,
  };
}

// Debug component for development
export function CanvasStateMachineDebug() {
  const machine = useCanvasStateMachineContext();

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-background border rounded-lg shadow-lg max-w-sm">
      <h3 className="font-semibold mb-2">Canvas State Machine (Debug)</h3>
      <div className="space-y-1 text-sm">
        <div>
          Environment: <strong>{machine.currentEnvironment}</strong>
        </div>
        <div>
          Tool: <strong>{machine.currentTool}</strong>
        </div>
        <div>
          Whiteboard:{" "}
          <strong>{machine.isWhiteboardActive ? "Active" : "Inactive"}</strong>
        </div>
        <div>
          Passthrough:{" "}
          <strong>{machine.isPassthroughMode ? "On" : "Off"}</strong>
        </div>
        <div>
          Keep Tool: <strong>{machine.keepToolActive ? "On" : "Off"}</strong>
        </div>
        <div>
          Stroke:{" "}
          <strong>
            {machine.strokeColor} / {machine.strokeWidth}px
          </strong>
        </div>
        <div>
          Collaborators: <strong>{machine.collaborators.length}</strong>
        </div>
        {machine.hasError && (
          <div className="text-destructive">Error: {machine.error}</div>
        )}
      </div>

      <div className="flex gap-2 mt-3">
        <button
          onClick={machine.switchToPractical}
          className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
        >
          Practical
        </button>
        <button
          onClick={machine.switchToDesign}
          className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded"
        >
          Design
        </button>
        {machine.hasError && (
          <button
            onClick={machine.clearError}
            className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded"
          >
            Clear Error
          </button>
        )}
      </div>
    </div>
  );
}
