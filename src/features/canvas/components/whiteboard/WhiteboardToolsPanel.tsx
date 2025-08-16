import { Panel } from '@xyflow/react';
import {
  Eraser,
  Lasso,
  MousePointer,
  PenTool,
  Settings,
  Square,
} from 'lucide-react';
import { useState } from 'react';

export type WhiteboardTool =
  | 'select'
  | 'hand'
  | 'eraser'
  | 'lasso'
  | 'rectangle'
  | 'freehand';

interface WhiteboardToolsPanelProps {
  activeTool: WhiteboardTool;
  onToolChange: (tool: WhiteboardTool) => void;
  isDrawMode: boolean;
  onToggleDrawMode: () => void;
  // Lasso options
  partialSelection?: boolean;
  onPartialSelectionChange?: (partial: boolean) => void;
  // Freehand options
  brushSize?: number;
  brushColor?: string;
  onBrushSizeChange?: (size: number) => void;
  onBrushColorChange?: (color: string) => void;
}

export function WhiteboardToolsPanel({
  activeTool,
  onToolChange,
  isDrawMode,
  onToggleDrawMode,
  partialSelection = false,
  onPartialSelectionChange,
  brushSize = 3,
  brushColor = '#000000',
  onBrushSizeChange,
  onBrushColorChange,
}: WhiteboardToolsPanelProps) {
  const [showSettings, setShowSettings] = useState(false);

  const tools = [
    {
      id: 'select' as const,
      icon: MousePointer,
      label: 'Select',
      description: 'Select and move elements',
    },
    {
      id: 'eraser' as const,
      icon: Eraser,
      label: 'Eraser',
      description: 'Erase elements by drawing over them',
    },
    {
      id: 'lasso' as const,
      icon: Lasso,
      label: 'Lasso',
      description: 'Select multiple elements with freehand selection',
    },
    {
      id: 'rectangle' as const,
      icon: Square,
      label: 'Rectangle',
      description: 'Draw rectangular shapes',
    },
    {
      id: 'freehand' as const,
      icon: PenTool,
      label: 'Draw',
      description: 'Freehand drawing',
    },
  ];

  return (
    <Panel position="top-left" className="whiteboard-tools-panel">
      <div className="flex flex-col gap-2 p-2 bg-white rounded-lg shadow-lg border">
        {/* Mode Toggle */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded">
          <button
            className={`px-3 py-1 text-sm rounded transition-colors ${
              !isDrawMode
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => !isDrawMode && onToggleDrawMode()}
            title="Edit Mode"
          >
            Edit
          </button>
          <button
            className={`px-3 py-1 text-sm rounded transition-colors ${
              isDrawMode
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => isDrawMode && onToggleDrawMode()}
            title="Draw Mode"
          >
            Draw
          </button>
        </div>

        {/* Drawing Tools (only show in draw mode) */}
        {isDrawMode && (
          <>
            <div className="h-px bg-gray-200" />

            <div className="flex flex-col gap-1">
              {tools.map((tool) => {
                const Icon = tool.icon;
                const isActive = activeTool === tool.id;

                return (
                  <button
                    key={tool.id}
                    className={`flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-900 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => onToolChange(tool.id)}
                    title={tool.description}
                  >
                    <Icon size={16} />
                    <span className="hidden sm:inline">{tool.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tool Settings */}
            <div className="h-px bg-gray-200" />

            <button
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors ${
                showSettings
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setShowSettings(!showSettings)}
              title="Tool Settings"
            >
              <Settings size={16} />
              <span className="hidden sm:inline">Settings</span>
            </button>

            {/* Settings Panel */}
            {showSettings && (
              <div className="p-3 bg-gray-50 rounded border-t">
                {/* Lasso Settings */}
                {activeTool === 'lasso' && onPartialSelectionChange && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-gray-700">
                      Lasso Selection
                    </h4>
                    <label className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={partialSelection}
                        onChange={(e) =>
                          onPartialSelectionChange(e.target.checked)
                        }
                        className="rounded"
                      />
                      Partial selection
                    </label>
                  </div>
                )}

                {/* Freehand Settings */}
                {activeTool === 'freehand' && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-medium text-gray-700">
                      Drawing Settings
                    </h4>

                    {onBrushSizeChange && (
                      <div className="space-y-1">
                        <label className="text-xs text-gray-600">
                          Brush Size: {brushSize}px
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="20"
                          value={brushSize}
                          onChange={(e) =>
                            onBrushSizeChange(Number(e.target.value))
                          }
                          className="w-full"
                        />
                      </div>
                    )}

                    {onBrushColorChange && (
                      <div className="space-y-1">
                        <label className="text-xs text-gray-600">Color</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={brushColor}
                            onChange={(e) => onBrushColorChange(e.target.value)}
                            className="w-8 h-8 rounded border"
                          />
                          <input
                            type="text"
                            value={brushColor}
                            onChange={(e) => onBrushColorChange(e.target.value)}
                            className="flex-1 px-2 py-1 text-xs border rounded"
                            placeholder="#000000"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Eraser Settings */}
                {activeTool === 'eraser' && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-gray-700">
                      Eraser
                    </h4>
                    <p className="text-xs text-gray-500">
                      Draw over elements to erase them
                    </p>
                  </div>
                )}

                {/* Rectangle Settings */}
                {activeTool === 'rectangle' && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-gray-700">
                      Rectangle
                    </h4>
                    <p className="text-xs text-gray-500">
                      Click and drag to create rectangles
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Panel>
  );
}

export default WhiteboardToolsPanel;
