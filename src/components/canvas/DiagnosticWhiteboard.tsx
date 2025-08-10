// Simplified diagnostic component to test Excalidraw directly
import React, { useState, useRef, Suspense, lazy } from "react";
import { Button } from "@/components/ui/button";
import { createExcalidrawInitialData } from "@/lib/utils/excalidrawDefaults";

// Lazy load Excalidraw like in WhiteboardOverlay
const Excalidraw = lazy(async () => {
  try {
    const mod = await import("@excalidraw/excalidraw");
    return { default: mod.Excalidraw };
  } catch (err) {
    console.error("Failed to load Excalidraw:", err);
    return { default: () => null };
  }
});

export default function DiagnosticWhiteboard() {
  const [diagnostics, setDiagnostics] = useState<string[]>([
    "Component initialized",
  ]);
  const [isLoaded, setIsLoaded] = useState(false);
  const excalidrawRef = useRef<any>(null);

  const addDiagnostic = (message: string) => {
    console.log("[Diagnostic]", message);
    setDiagnostics((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const handleExcalidrawRef = (api: any) => {
    addDiagnostic(
      `Excalidraw ref callback called with: ${api ? "API object" : "null"}`
    );

    if (!api) {
      excalidrawRef.current = null;
      return;
    }

    if (api.readyPromise) {
      addDiagnostic("Found readyPromise, waiting for ready state...");
      api.readyPromise
        .then(() => {
          addDiagnostic("Excalidraw ready promise resolved");
          excalidrawRef.current = api;
          setIsLoaded(true);
        })
        .catch((err: any) => {
          addDiagnostic(`Excalidraw ready promise rejected: ${err}`);
          excalidrawRef.current = api;
          setIsLoaded(true);
        });
    } else {
      addDiagnostic("No readyPromise found, setting ref directly");
      excalidrawRef.current = api;
      setIsLoaded(true);
    }
  };

  const handleChange = (elements: any[], appState: any, files?: any) => {
    addDiagnostic(
      `Scene changed: ${elements.length} elements, appState tool: ${appState?.activeTool?.type || "unknown"}`
    );
  };

  const testTool = (toolName: string) => {
    if (!excalidrawRef.current) {
      addDiagnostic(`Cannot set tool ${toolName}: API not ready`);
      return;
    }

    try {
      addDiagnostic(`Attempting to set tool to: ${toolName}`);
      excalidrawRef.current.setActiveTool?.({ type: toolName });
      addDiagnostic(`Successfully set tool to: ${toolName}`);
    } catch (err) {
      addDiagnostic(`Failed to set tool ${toolName}: ${err}`);
    }
  };

  const getAppState = () => {
    if (!excalidrawRef.current) {
      addDiagnostic("Cannot get app state: API not ready");
      return;
    }

    try {
      const appState = excalidrawRef.current.getAppState?.();
      addDiagnostic(
        `Current app state: ${JSON.stringify({
          activeTool: appState?.activeTool?.type,
          viewBackgroundColor: appState?.viewBackgroundColor,
          pointerType: appState?.pointerType,
        })}`
      );
    } catch (err) {
      addDiagnostic(`Failed to get app state: ${err}`);
    }
  };

  return (
    <div className="w-full h-screen bg-gray-100 relative">
      {/* Controls */}
      <div className="absolute top-4 left-4 z-50 flex flex-wrap gap-2 p-4 bg-white rounded shadow max-w-md">
        <div className="w-full text-sm font-medium mb-2">
          Excalidraw Diagnostics
        </div>

        <Button size="sm" onClick={() => testTool("freedraw")}>
          Set Freedraw
        </Button>
        <Button size="sm" onClick={() => testTool("rectangle")}>
          Set Rectangle
        </Button>
        <Button size="sm" onClick={() => testTool("selection")}>
          Set Selection
        </Button>
        <Button size="sm" onClick={getAppState}>
          Get State
        </Button>
        <Button
          size="sm"
          onClick={() => setDiagnostics(["Diagnostics cleared"])}
        >
          Clear
        </Button>

        <div className="w-full mt-2">
          <div className="text-xs font-medium mb-1">Status:</div>
          <div className="text-xs">
            Loaded: {isLoaded ? "✅" : "❌"} | API:{" "}
            {excalidrawRef.current ? "✅" : "❌"}
          </div>
        </div>
      </div>

      {/* Diagnostics */}
      <div className="absolute top-4 right-4 z-50 w-80 p-4 bg-white rounded shadow">
        <div className="text-sm font-medium mb-2">Console Log:</div>
        <div className="text-xs max-h-60 overflow-y-auto space-y-1">
          {diagnostics.map((diagnostic, i) => (
            <div key={i} className="break-words">
              {diagnostic}
            </div>
          ))}
        </div>
      </div>

      {/* Simple Excalidraw */}
      <div
        className="absolute inset-0"
        style={{
          top: 120, // Leave room for controls
          pointerEvents: "auto",
          background: "transparent",
        }}
      >
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                <div>Loading Excalidraw...</div>
              </div>
            </div>
          }
        >
          <Excalidraw
            ref={handleExcalidrawRef}
            onChange={handleChange}
            initialData={createExcalidrawInitialData({
              activeTool: { type: "freedraw" },
            })}
            UIOptions={{
              canvasActions: {
                changeViewBackgroundColor: false,
                clearCanvas: false,
              },
            }}
          />
        </Suspense>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 z-50 p-4 bg-yellow-100 rounded shadow max-w-md">
        <div className="text-sm">
          <div className="font-medium mb-2">Test Instructions:</div>
          <ol className="list-decimal list-inside space-y-1 text-xs">
            <li>Wait for "Loaded: ✅" status</li>
            <li>Click "Set Freedraw" to enable drawing</li>
            <li>Try to draw on the white area</li>
            <li>Check console log for any errors</li>
            <li>Try different tools (Rectangle, Selection)</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
