// Example integration of XState with existing CanvasPage
// This shows how to gradually migrate the existing component

import React from "react";
import { useParams } from "react-router-dom";
import {
  CanvasStateMachineProvider,
  CanvasStateMachineDebug,
  useLegacyCanvasState,
  useEnhancedToolbarProps,
} from "./CanvasStateMachineProvider";

// Enhanced version of TopCanvasToolbar that uses the state machine
function EnhancedTopCanvasToolbar() {
  const toolbarProps = useEnhancedToolbarProps();

  return (
    <div className="flex items-center gap-4 p-2 bg-background/80 backdrop-blur-sm rounded-lg border">
      {/* Environment Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => toolbarProps.onSwitchEnvironment("practical")}
          className={`px-3 py-1 rounded text-sm ${
            toolbarProps.currentEnvironment === "practical"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Practical
        </button>
        <button
          onClick={() => toolbarProps.onSwitchEnvironment("design")}
          className={`px-3 py-1 rounded text-sm ${
            toolbarProps.currentEnvironment === "design"
              ? "bg-purple-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Design
        </button>
      </div>

      {/* Tool Selection for Design Mode */}
      {toolbarProps.currentEnvironment === "design" && (
        <>
          <div className="flex items-center gap-1">
            {[
              "selection",
              "hand",
              "rectangle",
              "ellipse",
              "arrow",
              "line",
              "freedraw",
              "text",
            ].map((tool) => (
              <button
                key={tool}
                onClick={() => toolbarProps.onSelectTool(tool)}
                className={`px-2 py-1 rounded text-xs ${
                  toolbarProps.activeTool === tool
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tool.charAt(0).toUpperCase() + tool.slice(1)}
              </button>
            ))}
          </div>

          {/* Drawing Controls */}
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={toolbarProps.strokeColor || "#000000"}
              onChange={(e) => toolbarProps.onSetStrokeColor?.(e.target.value)}
              className="w-8 h-8 border rounded cursor-pointer"
            />
            <input
              type="range"
              min="1"
              max="20"
              value={toolbarProps.strokeWidth || 1}
              onChange={(e) =>
                toolbarProps.onSetStrokeWidth?.(parseInt(e.target.value))
              }
              className="w-16"
            />
            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={toolbarProps.keepToolActive}
                onChange={toolbarProps.onToggleKeepToolActive}
              />
              Lock
            </label>
          </div>
        </>
      )}

      {/* Collaboration Indicators */}
      {toolbarProps.collaborators.length > 0 && (
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500">
            {toolbarProps.collaborators.length} collaborator
            {toolbarProps.collaborators.length !== 1 ? "s" : ""}
          </span>
          {toolbarProps.collaborators.map((collaborator) => (
            <div
              key={collaborator.id}
              className={`w-2 h-2 rounded-full ${
                collaborator.environment === "practical"
                  ? "bg-blue-400"
                  : "bg-purple-400"
              }`}
              title={`${collaborator.id} in ${collaborator.environment} mode`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Migration example: Wrapper that uses both old and new state
function MigrationCanvasPageInner() {
  const { canvasId } = useParams();

  // This hook provides the same interface as the old state variables
  // allowing for gradual migration
  const {
    toolbarMode,
    setToolbarMode,
    isWhiteboardActive,
    navigationTool,
    setNavigationTool,
    wbPassthrough,
    setWbPassthrough,
    drawActiveTool,
    setDrawActiveTool,
    keepToolActive,
    setKeepToolActive,
    machine, // Direct access to the state machine for advanced usage
  } = useLegacyCanvasState();

  // You can now use these exactly as before, but they're powered by XState
  const handleModeChange = (mode: "edit" | "draw") => {
    setToolbarMode(mode);
    // This will automatically trigger the state machine transitions
  };

  const handleKeyboardShortcuts = (e: KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();
      handleModeChange(toolbarMode === "edit" ? "draw" : "edit");
    }

    // Space bar for passthrough in draw mode
    if (e.code === "Space" && toolbarMode === "draw") {
      if (e.type === "keydown" && !e.repeat) {
        setWbPassthrough(true);
      } else if (e.type === "keyup") {
        setWbPassthrough(false);
      }
    }
  };

  // The rest of your component logic stays exactly the same!
  // This is the beauty of the migration approach

  return (
    <div className="w-full h-full bg-background relative">
      {/* Enhanced toolbar with state machine */}
      <div className="absolute top-4 left-4 z-50">
        <EnhancedTopCanvasToolbar />
      </div>

      {/* Your existing React Flow setup */}
      <div className="h-full">
        {/* Existing ReactFlow component with updated props */}
        {/* 
        <ReactFlow
          // Use the state variables exactly as before
          panOnDrag={navigationTool === "hand" && toolbarMode !== "draw" ? [0, 1, 2] : ...}
          nodesDraggable={toolbarMode !== "draw"}
          nodesConnectable={toolbarMode !== "draw"}
          elementsSelectable={toolbarMode !== "draw"}
          // ... all your existing props
        >
        */}
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Canvas with XState</h2>
            <p className="mb-4">
              Current Mode: <strong>{toolbarMode}</strong>
            </p>
            <p className="mb-4">
              Whiteboard:{" "}
              <strong>{isWhiteboardActive ? "Active" : "Inactive"}</strong>
            </p>
            <p className="text-sm text-gray-400">
              Press Tab to switch modes • Use the toolbar above to test tools
            </p>
          </div>
        </div>
      </div>

      {/* Your existing WhiteboardOverlay */}
      {/*
      <WhiteboardOverlay
        isActive={isWhiteboardActive}
        passthrough={wbPassthrough}
        // ... all your existing props
      />
      */}

      {/* Debug panel for development */}
      <CanvasStateMachineDebug />
    </div>
  );
}

// Main component with state machine provider
export default function CanvasPageWithStateMachine() {
  const { canvasId } = useParams();

  const handleEnvironmentChange = (environment: "practical" | "design") => {
    console.log("Environment changed to:", environment);
    // You can add analytics, logging, etc. here
  };

  const handleError = (error: string) => {
    console.error("Canvas error:", error);
    // You can add error reporting here
  };

  return (
    <CanvasStateMachineProvider
      canvasId={canvasId}
      onEnvironmentChange={handleEnvironmentChange}
      onError={handleError}
    >
      <MigrationCanvasPageInner />
    </CanvasStateMachineProvider>
  );
}

// Alternative: Progressive enhancement approach
// You can also wrap just specific components for gradual migration

export function WrappedTopCanvasToolbar() {
  return (
    <CanvasStateMachineProvider>
      <EnhancedTopCanvasToolbar />
      <CanvasStateMachineDebug />
    </CanvasStateMachineProvider>
  );
}

// Usage examples for different migration strategies:

// 1. Full replacement (all at once)
// <CanvasPageWithStateMachine />

// 2. Gradual enhancement (component by component)
// <CanvasPage>
//   <WrappedTopCanvasToolbar />
//   {/* Other existing components */}
// </CanvasPage>

// 3. Feature toggle (A/B testing)
// {useFeatureFlag('xstate-canvas') ? <CanvasPageWithStateMachine /> : <OriginalCanvasPage />}
