import {
  Background,
  Controls,
  Panel,
  ReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

// XState integration
import { useCanvasStateMachine } from '@/lib/hooks/useCanvasStateMachine';
import {
  CanvasStateMachineDebug,
  CanvasStateMachineProvider,
  useLegacyCanvasState,
} from './CanvasStateMachineProvider';

// Existing components and hooks
import { PortalContainerProvider } from '@/lib/contexts/PortalContainerContext';
import { useCanvasEvents } from '@/lib/hooks/useCanvasEvents';
import { useCanvasKeyboard } from '@/lib/hooks/useCanvasKeyboard';
import { useCanvasViewportSync } from '@/lib/hooks/useCanvasViewportSync';
import { useClerkSupabase } from '@/lib/hooks/useClerkSupabase';
import { useCanvasStore } from '@/lib/stores';
import { useEvidenceStore } from '@/lib/stores/evidenceStore';
import { isDevelopmentEnvironment } from '@/lib/supabase/client';
import { getProjectById } from '@/lib/supabase/services/projects';
import {
  createExcalidrawInitialData,
  sanitizeExcalidrawData,
} from '@/lib/utils/excalidrawDefaults';
import { getAvailableFilterOptions } from '@/lib/utils/filterUtils';

// Canvas components
import {
  convertToEdge,
  convertToEvidenceNode,
  convertToGroupNode,
  convertToNode,
  edgeTypes,
  nodeTypes,
} from '@/lib/utils/canvasConverters';
import SelectionPanel from './grouping/SelectionPanel';
import CanvasDebugPanels from './layout/CanvasDebugPanels';
import CanvasModals from './layout/CanvasModals';
import TopCanvasToolbar from './mini-control/TopCanvasToolbar';
import QuickSearchCommand from './search/QuickSearchCommand';
import WhiteboardOverlay from './WhiteboardOverlay';

// Auto-save and realtime hooks
import useAutoSave from '@/lib/hooks/useAutoSave';
import { useCanvasRealtime } from '@/lib/hooks/useCanvasRealtime';

// Internal component that uses the legacy state interface
function CanvasPageInnerWithXState() {
  const { canvasId } = useParams();
  const supabaseClient = useClerkSupabase();
  const isDevelopment = isDevelopmentEnvironment();

  // Get canvas state using the refactored stores
  const {
    canvas,
    selectedNodeIds,
    clearSelection,
    loadCanvas,
    setLoading,
    setError,
  } = useCanvasStore();

  const { evidence: evidenceList } = useEvidenceStore();

  // Get legacy state interface from XState (maintains compatibility)
  const legacyState = useLegacyCanvasState();

  // Get direct machine access for advanced features
  const canvasMachine = useCanvasStateMachine();

  // Initialize viewport sync with XState
  const viewportSync = useCanvasViewportSync();

  // Update viewport sync when XState viewport changes
  useEffect(() => {
    if (canvasMachine.viewport) {
      viewportSync.updateViewport(canvasMachine.viewport);
    }
  }, [canvasMachine.viewport, viewportSync]);

  // Initialize event handlers with legacy state for compatibility
  const events = useCanvasEvents({
    state: legacyState,
    canvasMachine,
    viewportSync,
  });

  // Initialize keyboard shortcuts with legacy state
  useCanvasKeyboard({ state: legacyState });

  // Initialize auto-save and realtime
  useAutoSave();
  const currentCanvasId = useCanvasStore((s) => s.canvas?.id);
  useCanvasRealtime(currentCanvasId);

  // Load canvas data from database when component mounts
  useEffect(() => {
    const loadCanvasData = async () => {
      if (!canvasId || canvas?.id === canvasId) return;

      setLoading(true);
      setError(undefined);

      try {
        console.log('🔄 Loading canvas data for:', canvasId);
        const fullProject = await getProjectById(canvasId, supabaseClient);

        if (!fullProject) {
          throw new Error('Canvas not found');
        }

        console.log('✅ Canvas data loaded successfully');
        loadCanvas(fullProject);
      } catch (error) {
        console.error('❌ Failed to load canvas:', error);
        setError(
          error instanceof Error ? error.message : 'Failed to load canvas'
        );
        setLoading(false);
      }
    };

    loadCanvasData();
  }, [canvasId, canvas?.id, supabaseClient, loadCanvas, setLoading, setError]);

  // Convert canvas data to React Flow format
  const { nodes, edges } = useMemo(() => {
    if (!canvas) return { nodes: [], edges: [] };

    const flowNodes = [
      ...canvas.nodes.map(convertToNode),
      ...canvas.groups.map(convertToGroupNode),
      ...evidenceList.map(convertToEvidenceNode),
    ];

    const flowEdges = canvas.edges.map(convertToEdge);

    return { nodes: flowNodes, edges: flowEdges };
  }, [canvas, evidenceList]);

  // Sync React Flow data with XState
  useEffect(() => {
    if (canvas) {
      canvasMachine.updatePracticalData(canvas.nodes, canvas.edges);
    }
  }, [canvas, canvasMachine]);

  // Get filter options for the current canvas
  const filterOptions = useMemo(() => {
    if (!canvas) return null;
    return getAvailableFilterOptions(canvas.nodes, canvas.edges);
  }, [canvas]);

  // Create Excalidraw initial data
  const excalidrawInitialData = useMemo(() => {
    return createExcalidrawInitialData();
  }, []);

  if (!canvas) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">Loading canvas...</div>
          <div className="text-sm text-muted-foreground mt-2">
            Please wait while we load your project data.
          </div>
        </div>
      </div>
    );
  }

  return (
    <PortalContainerProvider>
      <div className="h-full w-full relative bg-background">
        {/* Top Canvas Toolbar - now uses XState for mode switching */}
        <TopCanvasToolbar
          toolbarMode={legacyState.toolbarMode}
          setToolbarMode={legacyState.setToolbarMode}
          navigationTool={legacyState.navigationTool}
          setNavigationTool={legacyState.setNavigationTool}
          isWhiteboardActive={legacyState.isWhiteboardActive}
          drawActiveTool={legacyState.drawActiveTool}
          setDrawActiveTool={legacyState.setDrawActiveTool}
          drawStrokeColor={legacyState.drawStrokeColor}
          setDrawStrokeColor={legacyState.setDrawStrokeColor}
          drawStrokeWidth={legacyState.drawStrokeWidth}
          setDrawStrokeWidth={legacyState.setDrawStrokeWidth}
          keepToolActive={legacyState.keepToolActive}
          setKeepToolActive={legacyState.setKeepToolActive}
          // Enhanced features from XState
          collaborators={canvasMachine.collaborators}
          isCollaborationActive={canvasMachine.isCollaborationActive}
          hasError={canvasMachine.hasError}
          onClearError={canvasMachine.clearError}
        />

        {/* React Flow Canvas */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={events.onNodesChange}
          onEdgesChange={events.onEdgesChange}
          onConnect={events.onConnect}
          onNodeClick={events.onNodeClick}
          onNodeDoubleClick={events.onNodeDoubleClick}
          onEdgeClick={events.onEdgeClick}
          onPaneClick={events.onPaneClick}
          onSelectionChange={events.onSelectionChange}
          onNodeDrag={events.onNodeDrag}
          onNodeDragStop={events.onNodeDragStop}
          className="reactflow-wrapper"
          fitView
          attributionPosition="bottom-left"
        >
          <Background />
          <Controls />

          {/* Selection Panel */}
          {selectedNodeIds.length > 0 && (
            <Panel position="top-right">
              <SelectionPanel
                selectedNodeIds={selectedNodeIds}
                onClearSelection={clearSelection}
                nodes={canvas.nodes}
                groups={canvas.groups}
              />
            </Panel>
          )}
        </ReactFlow>

        {/* Whiteboard Overlay - integrated with XState */}
        <WhiteboardOverlay
          isActive={canvasMachine.isWhiteboardActive}
          excalidrawInitialData={excalidrawInitialData}
          onExcalidrawChange={(elements, appState) => {
            const sanitizedData = sanitizeExcalidrawData(elements, appState);
            canvasMachine.updateDesignData(
              sanitizedData.elements,
              sanitizedData.appState
            );
          }}
          isPassthrough={canvasMachine.isPassthroughMode}
          onPassthroughChange={(passthrough) => {
            if (passthrough) {
              canvasMachine.enablePassthrough();
            } else {
              canvasMachine.disablePassthrough();
            }
          }}
          activeTool={canvasMachine.context.designTool}
          onToolChange={canvasMachine.setDesignTool}
          strokeColor={canvasMachine.strokeColor}
          onStrokeColorChange={canvasMachine.setStrokeColor}
          strokeWidth={canvasMachine.strokeWidth}
          onStrokeWidthChange={canvasMachine.setStrokeWidth}
        />

        {/* Canvas Modals */}
        <CanvasModals />

        {/* Debug Panels */}
        {isDevelopment && (
          <>
            <CanvasDebugPanels />
            <CanvasStateMachineDebug />
          </>
        )}

        {/* Quick Search */}
        <QuickSearchCommand />
      </div>
    </PortalContainerProvider>
  );
}

// Main component with XState provider
function CanvasPageWithXState() {
  return (
    <ReactFlowProvider>
      <CanvasStateMachineProvider
        onEnvironmentChange={(env) => {
          console.log('🔄 Canvas environment changed to:', env);
        }}
        onError={(error) => {
          console.error('❌ Canvas state machine error:', error);
        }}
      >
        <CanvasPageInnerWithXState />
      </CanvasStateMachineProvider>
    </ReactFlowProvider>
  );
}

export default CanvasPageWithXState;
