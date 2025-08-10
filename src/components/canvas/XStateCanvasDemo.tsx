// Simple demo component that shows XState Canvas Machine in action
// This component is designed to be used with XState Visual Editor

import React from "react";
import { useCanvasStateMachine } from "@/lib/hooks/useCanvasStateMachine";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * XStateCanvasDemo - A simple component demonstrating the dual canvas state machine
 *
 * To use with XState Visual Editor:
 * 1. Open this file in VS Code
 * 2. Place cursor on the canvasMachine variable (line ~15)
 * 3. Run command: "XState: Open Visual Editor"
 */
export function XStateCanvasDemo() {
  // This is the active XState machine that the Visual Editor can detect
  const canvasMachine = useCanvasStateMachine();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">XState Canvas Machine Demo</h1>
        <p className="text-gray-600">
          Interactive demo of the dual-environment canvas state machine
        </p>
      </div>

      {/* Current State Display */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Current State</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span className="text-sm text-gray-500">State:</span>
            <Badge variant="outline" className="ml-2">
              {String(canvasMachine.state.value)}
            </Badge>
          </div>
          <div>
            <span className="text-sm text-gray-500">Environment:</span>
            <Badge
              variant={
                canvasMachine.currentEnvironment === "design"
                  ? "default"
                  : "secondary"
              }
              className="ml-2"
            >
              {canvasMachine.currentEnvironment}
            </Badge>
          </div>
          <div>
            <span className="text-sm text-gray-500">Whiteboard:</span>
            <Badge
              variant={canvasMachine.isWhiteboardActive ? "default" : "outline"}
              className="ml-2"
            >
              {canvasMachine.isWhiteboardActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <div>
            <span className="text-sm text-gray-500">Tool:</span>
            <Badge variant="outline" className="ml-2">
              {canvasMachine.currentTool}
            </Badge>
          </div>
        </div>
      </div>

      {/* Environment Controls */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Environment Control</h2>
        <div className="flex gap-3">
          <Button
            onClick={canvasMachine.switchToPractical}
            variant={canvasMachine.isInPracticalMode ? "default" : "outline"}
          >
            🔧 Practical Mode
          </Button>
          <Button
            onClick={canvasMachine.switchToDesign}
            variant={canvasMachine.isInDesignMode ? "default" : "outline"}
          >
            🎨 Design Mode
          </Button>
        </div>
      </div>

      {/* Tool Controls */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Tool Controls</h2>

        {canvasMachine.isInPracticalMode && (
          <div>
            <h3 className="font-medium mb-2">Practical Tools:</h3>
            <div className="flex gap-2 flex-wrap">
              {["select", "connect", "pan", "zoom"].map((tool) => (
                <Button
                  key={tool}
                  size="sm"
                  onClick={() => canvasMachine.setPracticalTool(tool as any)}
                  variant={
                    canvasMachine.currentTool === tool ? "default" : "outline"
                  }
                >
                  {tool}
                </Button>
              ))}
            </div>
          </div>
        )}

        {canvasMachine.isInDesignMode && (
          <div>
            <h3 className="font-medium mb-2">Design Tools:</h3>
            <div className="flex gap-2 flex-wrap">
              {[
                "hand",
                "selection",
                "rectangle",
                "ellipse",
                "arrow",
                "freedraw",
                "text",
              ].map((tool) => (
                <Button
                  key={tool}
                  size="sm"
                  onClick={() => canvasMachine.setDesignTool(tool)}
                  variant={
                    canvasMachine.currentTool === tool ? "default" : "outline"
                  }
                >
                  {tool}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tools */}
      <div className="bg-purple-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Navigation Tools</h2>
        <div className="flex gap-2">
          {["move", "hand", "scale"].map((tool) => (
            <Button
              key={tool}
              size="sm"
              onClick={() => canvasMachine.setNavigationTool(tool as any)}
              variant="outline"
            >
              {tool}
            </Button>
          ))}
        </div>
      </div>

      {/* Whiteboard Settings */}
      {canvasMachine.isInDesignMode && (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Whiteboard Settings</h2>
          <div className="flex gap-3 items-center">
            <Button
              size="sm"
              onClick={canvasMachine.toggleKeepToolActive}
              variant={canvasMachine.keepToolActive ? "default" : "outline"}
            >
              {canvasMachine.keepToolActive
                ? "🔒 Tool Locked"
                : "🔓 Tool Unlocked"}
            </Button>

            <Button
              size="sm"
              onClick={
                canvasMachine.isPassthroughMode
                  ? canvasMachine.disablePassthrough
                  : canvasMachine.enablePassthrough
              }
              variant={canvasMachine.isPassthroughMode ? "default" : "outline"}
            >
              {canvasMachine.isPassthroughMode
                ? "📱 Passthrough On"
                : "📱 Passthrough Off"}
            </Button>
          </div>
        </div>
      )}

      {/* Viewport Info */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Viewport Sync</h2>
        <div className="text-sm text-gray-600 space-y-1">
          <div>X: {canvasMachine.viewport.x.toFixed(2)}</div>
          <div>Y: {canvasMachine.viewport.y.toFixed(2)}</div>
          <div>Zoom: {canvasMachine.viewport.zoom.toFixed(2)}</div>
        </div>
      </div>

      {/* Utilities */}
      <div className="bg-red-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Utilities</h2>
        <div className="flex gap-3">
          <Button
            size="sm"
            onClick={canvasMachine.synchronizeEnvironments}
            variant="outline"
          >
            🔄 Sync Environments
          </Button>
          <Button
            size="sm"
            onClick={canvasMachine.resetCanvas}
            variant="outline"
          >
            🔄 Reset Canvas
          </Button>
        </div>
      </div>

      {/* Debug Info */}
      <details className="bg-gray-100 p-4 rounded-lg">
        <summary className="cursor-pointer font-semibold">
          Debug Info (Click to expand)
        </summary>
        <pre className="mt-3 text-xs bg-white p-3 rounded overflow-auto">
          {JSON.stringify(canvasMachine.context, null, 2)}
        </pre>
      </details>
    </div>
  );
}

export default XStateCanvasDemo;
