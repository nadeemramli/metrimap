// Test page to isolate Excalidraw issues
import React, { useState } from "react";
import WhiteboardOverlay, {
  type WhiteboardOverlayHandle,
} from "@/components/canvas/WhiteboardOverlay";
import DiagnosticWhiteboard from "@/components/canvas/DiagnosticWhiteboard";
import { Button } from "@/components/ui/button";

export default function ExcalidrawTestPage() {
  const [isActive, setIsActive] = useState(true);
  const [passthrough, setPassthrough] = useState(false);
  const [testMode, setTestMode] = useState<"overlay" | "direct">("direct");
  const whiteboardRef = React.useRef<WhiteboardOverlayHandle>(null);

  const handleSceneChange = (scene: any) => {
    console.log("Scene changed:", scene);
  };

  if (testMode === "direct") {
    return <DiagnosticWhiteboard />;
  }

  return (
    <div className="w-full h-screen bg-gray-100 relative">
      {/* Controls */}
      <div className="absolute top-4 left-4 z-50 flex gap-2">
        <Button
          onClick={() => setIsActive(!isActive)}
          variant={isActive ? "default" : "outline"}
        >
          {isActive ? "Active" : "Inactive"}
        </Button>
        <Button
          onClick={() => setPassthrough(!passthrough)}
          variant={passthrough ? "default" : "outline"}
        >
          {passthrough ? "Passthrough On" : "Passthrough Off"}
        </Button>
        <Button onClick={() => whiteboardRef.current?.setTool("freedraw")}>
          Set Freedraw
        </Button>
        <Button onClick={() => whiteboardRef.current?.setTool("rectangle")}>
          Set Rectangle
        </Button>
        <Button onClick={() => whiteboardRef.current?.clear()}>Clear</Button>
      </div>

      {/* Status */}
      <div className="absolute top-4 right-4 z-50 p-2 bg-white rounded shadow">
        <div className="text-sm">
          <div>Active: {isActive ? "Yes" : "No"}</div>
          <div>Passthrough: {passthrough ? "Yes" : "No"}</div>
          <div>
            Pointer Events: {isActive && !passthrough ? "auto" : "none"}
          </div>
        </div>
      </div>

      {/* Excalidraw Overlay */}
      <WhiteboardOverlay
        ref={whiteboardRef}
        isActive={isActive}
        passthrough={passthrough}
        zIndex={100}
        onSceneChange={handleSceneChange}
        topOffset={80}
        className="absolute inset-0"
      />

      {/* Background indicator */}
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8 bg-white rounded shadow">
          <h1 className="text-2xl font-bold mb-4">Excalidraw Test</h1>
          <p className="text-gray-600 mb-4">
            If drawing is working, you should be able to draw on this overlay.
          </p>
          <p className="text-sm text-gray-500">
            Check the browser console for any errors.
          </p>
        </div>
      </div>
    </div>
  );
}
