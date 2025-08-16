import {
  Background,
  Controls,
  Panel,
  ReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useEffect, useRef } from 'react';

import { useCanvasStateMachine } from '@/features/canvas/hooks/useCanvasStateMachine';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import { cn } from '@/shared/utils';
import {
  ArrowRight,
  Circle,
  Edit3,
  Eraser,
  Hand,
  Image,
  Minus,
  MousePointer2,
  Palette,
  PenTool,
  Square,
  Type,
} from 'lucide-react';

interface EnhancedCanvasPageProps {
  canvasId?: string;
  className?: string;
}

export default function EnhancedCanvasPage({
  canvasId,
  className,
}: EnhancedCanvasPageProps) {
  const {
    currentEnvironment,
    switchToPractical,
    switchToDesign,
    isInPracticalMode,
    isInDesignMode,
    currentTool,
    setDesignTool,
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
    practicalNodes,
    practicalEdges,
    designElements,
    designAppState,
    updateDesignData,
    viewport,
    updateViewport,
    collaborators,
    isCollaborationActive,
    hasError,
    error,
    clearError,
  } = useCanvasStateMachine();

  const reactFlowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        if (isInPracticalMode) switchToDesign();
        else switchToPractical();
        return;
      }
      if (e.code === 'Space' && !e.repeat && isInDesignMode) {
        e.preventDefault();
        enablePassthrough();
        return;
      }
      if (isInDesignMode && !e.ctrlKey && !e.metaKey) {
        switch (e.key) {
          case 'v':
          case '1':
            setDesignTool('selection');
            break;
          case 'h':
          case '2':
            setDesignTool('hand');
            break;
          case 'r':
          case '3':
            setDesignTool('rectangle');
            break;
          case 'o':
          case '4':
            setDesignTool('ellipse');
            break;
          case 'a':
          case '5':
            setDesignTool('arrow');
            break;
          case 'l':
          case '6':
            setDesignTool('line');
            break;
          case 'p':
          case '7':
            setDesignTool('freedraw');
            break;
          case 't':
          case '8':
            setDesignTool('text');
            break;
          case 'e':
            setDesignTool('eraser');
            break;
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' && isInDesignMode) disablePassthrough();
    };
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      window.removeEventListener('keyup', handleKeyUp);
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

  const handleWhiteboardChange = useCallback(
    (scene: { elements: any[]; appState: any; files?: any }) => {
      updateDesignData(scene.elements, scene.appState);
    },
    [updateDesignData]
  );

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
    <div className={cn('w-full h-full bg-background relative', className)}>
      <ReactFlowProvider>
        <ReactFlow
          ref={reactFlowRef as any}
          nodes={practicalNodes}
          edges={practicalEdges}
          nodesDraggable={isInPracticalMode}
          nodesConnectable={isInPracticalMode}
          elementsSelectable={isInPracticalMode}
          panOnDrag={isInPracticalMode ? [1, 2] : false}
          panOnScroll={isInPracticalMode}
          zoomOnScroll={isInPracticalMode}
          zoomOnPinch={true}
          minZoom={0.05}
          maxZoom={3}
          snapToGrid={true}
          snapGrid={[15, 15]}
          onMoveEnd={(_, vp) => updateViewport(vp)}
        >
          <Background />
          <Controls />

          <Panel position="top-left" className="flex items-center gap-4">
            <div className="flex items-center gap-2 p-2 bg-background/80 backdrop-blur-sm rounded-lg border">
              <Badge variant={isInPracticalMode ? 'default' : 'outline'}>
                <Edit3 className="w-3 h-3 mr-1" /> Practical
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={isInPracticalMode ? switchToDesign : switchToPractical}
                className="h-6 px-2"
              >
                ⇄
              </Button>
              <Badge variant={isInDesignMode ? 'default' : 'outline'}>
                <Palette className="w-3 h-3 mr-1" /> Design
              </Badge>
            </div>

            {isInDesignMode && (
              <div className="flex items-center gap-1 p-2 bg-background/80 backdrop-blur-sm rounded-lg border">
                {[
                  { id: 'selection', icon: MousePointer2, label: 'Select (V)' },
                  { id: 'hand', icon: Hand, label: 'Hand (H)' },
                  { id: 'rectangle', icon: Square, label: 'Rectangle (R)' },
                  { id: 'ellipse', icon: Circle, label: 'Ellipse (O)' },
                  { id: 'arrow', icon: ArrowRight, label: 'Arrow (A)' },
                  { id: 'line', icon: Minus, label: 'Line (L)' },
                  { id: 'freedraw', icon: PenTool, label: 'Draw (P)' },
                  { id: 'text', icon: Type, label: 'Text (T)' },
                  { id: 'image', icon: Image, label: 'Image' },
                  { id: 'eraser', icon: Eraser, label: 'Eraser (E)' },
                ].map((tool) => (
                  <Button
                    key={tool.id}
                    variant={currentTool === tool.id ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => {
                      setDesignTool(tool.id as any);
                    }}
                    className="h-8 w-8 p-0"
                    title={tool.label}
                  >
                    <tool.icon className="w-4 h-4" />
                  </Button>
                ))}

                <Separator orientation="vertical" className="h-6 mx-1" />

                <input
                  type="color"
                  value={strokeColor || '#000000'}
                  onChange={(e) => {
                    setStrokeColor(e.target.value);
                  }}
                  className="w-8 h-8 border border-border rounded cursor-pointer"
                  title="Stroke Color"
                />

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
                    }}
                    className="w-16"
                  />
                  <span className="text-xs text-muted-foreground w-6">
                    {strokeWidth || 1}
                  </span>
                </div>

                <Button
                  variant={keepToolActive ? 'default' : 'outline'}
                  size="sm"
                  onClick={toggleKeepToolActive}
                  className="h-8 px-2 text-xs"
                  title="Keep Tool Active"
                >
                  Lock
                </Button>
              </div>
            )}

            {isCollaborationActive && collaborators.length > 0 && (
              <div className="flex items-center gap-2 p-2 bg-background/80 backdrop-blur-sm rounded-lg border">
                <span className="text-xs text-muted-foreground">
                  {collaborators.length} collaborator
                  {collaborators.length !== 1 ? 's' : ''}
                </span>
                {collaborators.map((c) => (
                  <Badge
                    key={c.id}
                    variant={
                      c.environment === currentEnvironment
                        ? 'default'
                        : 'secondary'
                    }
                    className="text-xs"
                  >
                    {c.id.substring(0, 2)}
                  </Badge>
                ))}
              </div>
            )}
          </Panel>

          <Panel position="top-right">
            <div className="flex items-center gap-2 p-2 bg-background/80 backdrop-blur-sm rounded-lg border">
              <div
                className={cn(
                  'w-2 h-2 rounded-full',
                  isInPracticalMode ? 'bg-blue-500' : 'bg-purple-500'
                )}
              />
              <span className="text-xs font-medium">
                {isInPracticalMode ? 'Practical Mode' : 'Design Mode'}
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

      {/* WhiteboardOverlay removed - using ReactFlow directly for canvas operations */}
    </div>
  );
}
