import { useState, useCallback } from 'react';
import { Panel } from '@xyflow/react';
import EraseToolComponent from './EraseToolComponent';
import LassoSelectionComponent from './LassoSelectionComponent';
import RectangleToolComponent from './RectangleToolComponent';
import FreehandDrawComponent from './FreehandDrawComponent';
import WhiteboardToolsPanel, { WhiteboardTool } from './WhiteboardToolsPanel';

interface WhiteboardContainerProps {
  isDrawMode: boolean;
  onToggleDrawMode: () => void;
  onToolChange?: (tool: WhiteboardTool) => void;
}

export function WhiteboardContainer({
  isDrawMode,
  onToggleDrawMode,
  onToolChange,
}: WhiteboardContainerProps) {
  const [activeTool, setActiveTool] = useState<WhiteboardTool>('select');
  const [partialSelection, setPartialSelection] = useState(false);
  const [brushSize, setBrushSize] = useState(3);
  const [brushColor, setBrushColor] = useState('#000000');

  const handleToolChange = useCallback((tool: WhiteboardTool) => {
    setActiveTool(tool);
    onToolChange?.(tool);
  }, [onToolChange]);

  const handleErase = useCallback((nodeIds: string[], edgeIds: string[]) => {
    console.log('Erased items:', { nodeIds, edgeIds });
    // The actual deletion is handled by the EraseToolComponent
    // by setting the toBeDeleted flag on nodes/edges
  }, []);

  const handleSelection = useCallback((nodeIds: string[], edgeIds: string[]) => {
    console.log('Selected items:', { nodeIds, edgeIds });
    // Selection is handled by the LassoSelectionComponent
    // by setting the selected flag on nodes/edges
  }, []);

  const handleRectangleCreate = useCallback((rectangle: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => {
    console.log('Created rectangle:', rectangle);
    // Rectangle creation is handled by the RectangleToolComponent
    // by adding a new whiteboardNode to the canvas
  }, []);

  const handlePathCreate = useCallback((path: string) => {
    console.log('Created freehand path:', path);
    // Path creation is handled by the FreehandDrawComponent
    // by adding a new whiteboardNode to the canvas
  }, []);

  if (!isDrawMode) {
    return (
      <WhiteboardToolsPanel
        activeTool={activeTool}
        onToolChange={handleToolChange}
        isDrawMode={isDrawMode}
        onToggleDrawMode={onToggleDrawMode}
      />
    );
  }

  return (
    <>
      {/* Tools Panel */}
      <WhiteboardToolsPanel
        activeTool={activeTool}
        onToolChange={handleToolChange}
        isDrawMode={isDrawMode}
        onToggleDrawMode={onToggleDrawMode}
        partialSelection={partialSelection}
        onPartialSelectionChange={setPartialSelection}
        brushSize={brushSize}
        brushColor={brushColor}
        onBrushSizeChange={setBrushSize}
        onBrushColorChange={setBrushColor}
      />

      {/* Drawing Tool Components */}
      <EraseToolComponent
        isActive={activeTool === 'eraser'}
        onErase={handleErase}
      />

      <LassoSelectionComponent
        isActive={activeTool === 'lasso'}
        partial={partialSelection}
        onSelection={handleSelection}
      />

      <RectangleToolComponent
        isActive={activeTool === 'rectangle'}
        onRectangleCreate={handleRectangleCreate}
      />

      <FreehandDrawComponent
        isActive={activeTool === 'freehand'}
        brushSize={brushSize}
        brushColor={brushColor}
        onPathCreate={handlePathCreate}
      />

      {/* Instructions Panel */}
      {activeTool !== 'select' && (
        <Panel position="bottom-center" className="whiteboard-instructions">
          <div className="px-4 py-2 bg-black/80 text-white text-sm rounded-lg">
            {activeTool === 'eraser' && 'Draw over elements to erase them'}
            {activeTool === 'lasso' && 'Draw a selection area around elements'}
            {activeTool === 'rectangle' && 'Click and drag to create rectangles'}
            {activeTool === 'freehand' && 'Draw freehand shapes and annotations'}
          </div>
        </Panel>
      )}
    </>
  );
}

export default WhiteboardContainer;
