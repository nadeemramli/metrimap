// Enhanced Canvas Page with XState-powered dual environment management
// Demonstrates how to integrate the canvas state machine with existing components

import React, { useEffect, useCallback, useRef } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  Panel,
} from "@xyflow/react";
import WhiteboardOverlay, {
  type WhiteboardOverlayHandle,
} from "./WhiteboardOverlay";
import { useCanvasStateMachine } from "@/lib/hooks/useCanvasStateMachine";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Edit3,
  Palette,
  Hand,
  MousePointer2,
  Square,
  Circle,
  ArrowRight,
  Minus,
  PenTool,
  Type,
  Image,
  Eraser,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedCanvasPageProps {
  canvasId?: string;
  className?: string;
}

export default function EnhancedCanvasPage({
  canvasId,
  className,
}: EnhancedCanvasPageProps) {
  // XState machine for canvas management
  const {
    // Environment control
    currentEnvironment,
    switchToPractical,
    switchToDesign,
    isInPracticalMode,
    isInDesignMode,

    // Tools and state
    currentTool,
    setNavigationTool,
    setPracticalTool,
    setDesignTool,

    // Whiteboard
    isWhiteboardActive,
    isPassthroughMode,
    enablePassthrough,
    disablePassthrough,
    toggleKeepToolActive,
    keepToolActive,

    // Drawing preferences
    setStrokeColor,
    setStrokeWidth,
    strokeColor,
    strokeWidth,

    // Data
    practicalNodes,
    practicalEdges,
    designElements,
    designAppState,
    updatePracticalData,
    updateDesignData,

    // Viewport
    viewport,
    updateViewport,

    // Collaboration
    collaborators,
    isCollaborationActive,

    // Error handling
    hasError,
    error,
    clearError,
  } = useCanvasStateMachine();

  const whiteboardRef = useRef<WhiteboardOverlayHandle>(null);
  const reactFlowRef = useRef<HTMLDivElement>(null);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Global shortcuts
      if (e.key === "Tab") {
        e.preventDefault();
        if (isInPracticalMode) {
          switchToDesign();
        } else {
          switchToPractical();
        }
        return;
      }

      // Space bar for panning in design mode
      if (e.code === "Space" && !e.repeat && isInDesignMode) {
        e.preventDefault();
        enablePassthrough();
        return;
      }

      // Design mode shortcuts
      if (isInDesignMode && !e.ctrlKey && !e.metaKey) {
        switch (e.key) {
          case "v":
          case "1":
            setDesignTool("selection");
            whiteboardRef.current?.setTool?.("selection");
            break;
          case "h":
          case "2":
            setDesignTool("hand");
            whiteboardRef.current?.setTool?.("hand");
            break;
          case "r":
          case "3":
            setDesignTool("rectangle");
            whiteboardRef.current?.setTool?.("rectangle");
            break;
          case "o":
          case "4":
            setDesignTool("ellipse");
            whiteboardRef.current?.setTool?.("ellipse");
            break;
          case "a":
          case "5":
            setDesignTool("arrow");
            whiteboardRef.current?.setTool?.("arrow");
            break;
          case "l":
          case "6":
            setDesignTool("line");
            whiteboardRef.current?.setTool?.("line");
            break;
          case "p":
          case "7":
            setDesignTool("freedraw");
            whiteboardRef.current?.setTool?.("freedraw");
            break;
          case "t":
          case "8":
            setDesignTool("text");
            whiteboardRef.current?.setTool?.("text");
            break;
          case "e":
            setDesignTool("eraser");
            whiteboardRef.current?.setTool?.("eraser");
            break;
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space" && isInDesignMode) {
        disablePassthrough();
      }
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    isInPracticalMode,
    isInDesignMode,
    switchToPractical,
    switchToDesign,
    enablePassthrough,
    disablePassthrough,
    setDesignTool,
  ]);

  // Handle whiteboard scene changes
  const handleWhiteboardChange = useCallback(
    (scene: { elements: any[]; appState: any; files?: any }) => {
      updateDesignData(scene.elements, scene.appState);
    },
    [updateDesignData]
  );

  // Handle React Flow changes
  const handleNodesChange = useCallback((changes: any[]) => {
    // Apply changes to nodes and update state machine
    // This would integrate with your existing node change logic
    console.log("Nodes changed:", changes);
  }, []);

  const handleEdgesChange = useCallback((changes: any[]) => {
    // Apply changes to edges and update state machine
    console.log("Edges changed:", changes);
  }, []);

  // Render environment toggle
  const renderEnvironmentToggle = () => (
    <div className="flex items-center gap-2 p-2 bg-background/80 backdrop-blur-sm rounded-lg border">
      <Badge variant={isInPracticalMode ? "default" : "outline"}>
        <Edit3 className="w-3 h-3 mr-1" />
        Practical
      </Badge>
      <Button
        variant="ghost"
        size="sm"
        onClick={isInPracticalMode ? switchToDesign : switchToPractical}
        className="h-6 px-2"
      >
        ⇄
      </Button>
      <Badge variant={isInDesignMode ? "default" : "outline"}>
        <Palette className="w-3 h-3 mr-1" />
        Design
      </Badge>
    </div>
  );

  // Render design tools
  const renderDesignTools = () => {
    if (!isInDesignMode) return null;

    const tools = [
      { id: "selection", icon: MousePointer2, label: "Select (V)" },
      { id: "hand", icon: Hand, label: "Hand (H)" },
      { id: "rectangle", icon: Square, label: "Rectangle (R)" },
      { id: "ellipse", icon: Circle, label: "Ellipse (O)" },
      { id: "arrow", icon: ArrowRight, label: "Arrow (A)" },
      { id: "line", icon: Minus, label: "Line (L)" },
      { id: "freedraw", icon: PenTool, label: "Draw (P)" },
      { id: "text", icon: Type, label: "Text (T)" },
      { id: "image", icon: Image, label: "Image" },
      { id: "eraser", icon: Eraser, label: "Eraser (E)" },
    ];

    return (
      <div className="flex items-center gap-1 p-2 bg-background/80 backdrop-blur-sm rounded-lg border">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            variant={currentTool === tool.id ? "default" : "ghost"}
            size="sm"
            onClick={() => {
              setDesignTool(tool.id);
              whiteboardRef.current?.setTool?.(tool.id);
            }}
            className="h-8 w-8 p-0"
            title={tool.label}
          >
            <tool.icon className="w-4 h-4" />
          </Button>
        ))}

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Stroke color picker */}
        <input
          type="color"
          value={strokeColor || "#000000"}
          onChange={(e) => {
            setStrokeColor(e.target.value);
            whiteboardRef.current?.setStrokeColor?.(e.target.value);
          }}
          className="w-8 h-8 border border-border rounded cursor-pointer"
          title="Stroke Color"
        />

        {/* Stroke width */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">W:</span>
          <input
            type="range"
            min="1"
            max="20"
            value={strokeWidth || 1}
            onChange={(e) => {
              const width = parseInt(e.target.value);
              setStrokeWidth(width);
              whiteboardRef.current?.setStrokeWidth?.(width);
            }}
            className="w-16"
          />
          <span className="text-xs text-muted-foreground w-6">
            {strokeWidth || 1}
          </span>
        </div>

        {/* Keep tool active toggle */}
        <Button
          variant={keepToolActive ? "default" : "outline"}
          size="sm"
          onClick={toggleKeepToolActive}
          className="h-8 px-2 text-xs"
          title="Keep Tool Active"
        >
          Lock
        </Button>
      </div>
    );
  };

  // Render collaboration indicators
  const renderCollaborationIndicators = () => {
    if (!isCollaborationActive || collaborators.length === 0) return null;

    return (
      <div className="flex items-center gap-2 p-2 bg-background/80 backdrop-blur-sm rounded-lg border">
        <span className="text-xs text-muted-foreground">
          {collaborators.length} collaborator
          {collaborators.length !== 1 ? "s" : ""}
        </span>
        {collaborators.map((collaborator) => (
          <Badge
            key={collaborator.id}
            variant={
              collaborator.environment === currentEnvironment
                ? "default"
                : "secondary"
            }
            className="text-xs"
          >
            {collaborator.id.substring(0, 2)}
          </Badge>
        ))}
      </div>
    );
  };

  // Error handling
  if (hasError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-destructive mb-2">Canvas Error</p>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button onClick={clearError}>Clear Error</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full h-full bg-background relative", className)}>
      {/* React Flow - Practical Environment */}
      <ReactFlowProvider>
        <ReactFlow
          ref={reactFlowRef}
          nodes={practicalNodes}
          edges={practicalEdges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          // Environment-based interaction settings
          nodesDraggable={isInPracticalMode}
          nodesConnectable={isInPracticalMode}
          elementsSelectable={isInPracticalMode}
          // Panning and zooming
          panOnDrag={isInPracticalMode ? [1, 2] : false}
          panOnScroll={isInPracticalMode}
          zoomOnScroll={isInPracticalMode}
          zoomOnPinch={true}
          minZoom={0.05}
          maxZoom={3}
          snapToGrid={true}
          snapGrid={[15, 15]}
          // Callbacks
          onMoveEnd={(_, viewport) => updateViewport(viewport)}
        >
          <Background />
          <Controls />

          {/* Top toolbar panel */}
          <Panel position="top-left" className="flex items-center gap-4">
            {renderEnvironmentToggle()}
            {renderDesignTools()}
            {renderCollaborationIndicators()}
          </Panel>

          {/* Environment indicator */}
          <Panel position="top-right">
            <div className="flex items-center gap-2 p-2 bg-background/80 backdrop-blur-sm rounded-lg border">
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  isInPracticalMode ? "bg-blue-500" : "bg-purple-500"
                )}
              />
              <span className="text-xs font-medium">
                {isInPracticalMode ? "Practical Mode" : "Design Mode"}
              </span>
              {isPassthroughMode && (
                <Badge variant="outline" className="text-xs">
                  Passthrough
                </Badge>
              )}
            </div>
          </Panel>
        </ReactFlow>
      </ReactFlowProvider>

      {/* Excalidraw Overlay - Design Environment */}
      <WhiteboardOverlay
        ref={whiteboardRef}
        isActive={isWhiteboardActive}
        className="absolute inset-0"
        zIndex={100}
        viewport={viewport}
        initialData={{
          elements: designElements,
          appState: {
            ...designAppState,
            viewBackgroundColor: "transparent",
          },
        }}
        onSceneChange={handleWhiteboardChange}
        topOffset={80} // Account for toolbar
        passthrough={isPassthroughMode}
      />

      {/* Debug panel in development */}
      {process.env.NODE_ENV === "development" && (
        <Panel position="bottom-right">
          <details className="p-2 bg-background/80 backdrop-blur-sm rounded-lg border text-xs">
            <summary className="cursor-pointer font-medium mb-2">
              Canvas State (Debug)
            </summary>
            <div className="space-y-1 text-muted-foreground">
              <div>Environment: {currentEnvironment}</div>
              <div>Tool: {currentTool}</div>
              <div>
                Whiteboard: {isWhiteboardActive ? "Active" : "Inactive"}
              </div>
              <div>Passthrough: {isPassthroughMode ? "On" : "Off"}</div>
              <div>Practical Nodes: {practicalNodes.length}</div>
              <div>Design Elements: {designElements.length}</div>
              <div>Collaborators: {collaborators.length}</div>
            </div>
          </details>
        </Panel>
      )}
    </div>
  );
}
