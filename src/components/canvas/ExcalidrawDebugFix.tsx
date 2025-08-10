// Quick fix component to add to your CanvasPage for debugging
import React, { useEffect } from "react";

interface ExcalidrawDebugFixProps {
  toolbarMode: "edit" | "draw";
  isWhiteboardActive: boolean;
  whiteboardRef: React.RefObject<any>;
}

export function ExcalidrawDebugFix({
  toolbarMode,
  isWhiteboardActive,
  whiteboardRef,
}: ExcalidrawDebugFixProps) {
  // Auto-set freedraw tool when entering draw mode
  useEffect(() => {
    if (toolbarMode === "draw" && isWhiteboardActive && whiteboardRef.current) {
      console.log("🎨 Setting Excalidraw to freedraw tool");

      // Wait a bit for Excalidraw to be ready
      setTimeout(() => {
        try {
          whiteboardRef.current?.setTool("freedraw");
          console.log("✅ Successfully set freedraw tool");
        } catch (error) {
          console.error("❌ Failed to set freedraw tool:", error);
        }
      }, 100);
    }
  }, [toolbarMode, isWhiteboardActive, whiteboardRef]);

  // Debug render - remove after fixing
  if (process.env.NODE_ENV === "development") {
    return (
      <div className="fixed bottom-4 left-4 z-50 p-3 bg-red-100 border border-red-300 rounded text-xs">
        <div className="font-bold mb-1">Excalidraw Debug:</div>
        <div>Mode: {toolbarMode}</div>
        <div>Active: {isWhiteboardActive ? "✅" : "❌"}</div>
        <div>Ref: {whiteboardRef.current ? "✅" : "❌"}</div>
      </div>
    );
  }

  return null;
}
