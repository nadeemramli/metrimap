import {
  Background,
  Controls,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';

// Extracted utilities and hooks
import { PortalContainerProvider } from '@/lib/contexts/PortalContainerContext';
import { useCanvasEvents } from '@/lib/hooks/useCanvasEvents';
import { useCanvasKeyboard } from '@/lib/hooks/useCanvasKeyboard';
import { useCanvasPageState } from '@/lib/hooks/useCanvasPageState';
import { useCanvasStateMachine } from '@/lib/hooks/useCanvasStateMachine';
import { useCanvasViewportSync } from '@/lib/hooks/useCanvasViewportSync';
import { useClerkSupabase } from '@/lib/hooks/useClerkSupabase';
import { useCanvasStore } from '@/lib/stores';
import { useEvidenceStore } from '@/lib/stores/evidenceStore';
import { isDevelopmentEnvironment } from '@/lib/supabase/client';
import {
  createExcalidrawInitialData,
  sanitizeExcalidrawData,
} from '@/lib/utils/excalidrawDefaults';
import { getAvailableFilterOptions } from '@/lib/utils/filterUtils';

// Extracted converters and types
import {
  convertToEdge,
  convertToEvidenceNode,
  convertToGroupNode,
  convertToNode,
  edgeTypes,
  nodeTypes,
} from '@/lib/utils/canvasConverters';

// Extracted layout components
import CanvasDebugPanels from '@/components/canvas/layout/CanvasDebugPanels';
import CanvasModals from '@/components/canvas/layout/CanvasModals';

// Core components
import WhiteboardOverlay from '@/components/canvas/WhiteboardOverlay';
import SelectionPanel from '@/components/canvas/grouping/SelectionPanel';
import TopCanvasToolbar from '@/components/canvas/mini-control/TopCanvasToolbar';
import QuickSearchCommand from '@/components/canvas/search/QuickSearchCommand';

// Auto-save and realtime hooks
import useAutoSave from '@/lib/hooks/useAutoSave';
import { useCanvasRealtime } from '@/lib/hooks/useCanvasRealtime';

function CanvasPageInner() {
  const { canvasId } = useParams();
  const supabaseClient = useClerkSupabase();
  const isDevelopment = isDevelopmentEnvironment();

  // Initialize state management
  const state = useCanvasPageState();

  // Initialize canvas stores and data
  const {
    canvas,
    selectedNodeIds,
    clearSelection,
    // ... other canvas store functions will be passed to events hook
  } = useCanvasStore();

  const { evidence: evidenceList } = useEvidenceStore();

  // Initialize hooks
  const canvasMachine = useCanvasStateMachine();
  const viewportSync = useCanvasViewportSync();

  // Initialize event handlers
  const events = useCanvasEvents({ state, canvasMachine, viewportSync });

  // Initialize keyboard shortcuts
  useCanvasKeyboard({ state });

  // Initialize auto-save and realtime
  useAutoSave();
  const currentCanvasId = useCanvasStore((s) => s.canvas?.id);
  useCanvasRealtime(currentCanvasId);

  // React Flow hooks
  const { getViewport } = useReactFlow() as any;

  // Memoized data conversions
  const nodes = useMemo(() => {
    const canvasNodes = canvas?.nodes || [];
    const evidenceNodes = evidenceList?.filter((e) => e.position) || [];
    const extraNodes = state.extraNodes || [];

    const convertedCanvasNodes = canvasNodes.map((card) =>
      convertToNode(
        card,
        events.handleOpenSettingsSheet,
        () => console.log('Node clicked:', card.id),
        events.handleSwitchToCard,
        state.isSettingsSheetOpen,
        selectedNodeIds
      )
    );

    const convertedEvidenceNodes = evidenceNodes.map((evidence) =>
      convertToEvidenceNode(
        evidence,
        () => console.log('Update evidence:', evidence.id),
        () => console.log('Delete evidence:', evidence.id)
      )
    );

    const convertedGroupNodes = (canvas?.groups || []).map((group) =>
      convertToGroupNode(
        group,
        () => console.log('Edit group:', group.id),
        () => console.log('Delete group:', group.id),
        events.handleToggleCollapse,
        events.handleUpdateGroupSize
      )
    );

    return [
      ...convertedCanvasNodes,
      ...convertedEvidenceNodes,
      ...convertedGroupNodes,
      ...extraNodes,
    ];
  }, [
    canvas?.nodes,
    canvas?.groups,
    evidenceList,
    state.extraNodes,
    selectedNodeIds,
    state.isSettingsSheetOpen,
    events,
  ]);

  const edges = useMemo(() => {
    const canvasEdges = canvas?.edges || [];
    const extraEdges = state.extraEdges || [];

    const convertedCanvasEdges = canvasEdges.map((relationship) =>
      convertToEdge(
        relationship,
        events.handleOpenRelationshipSheet,
        events.handleSwitchToRelationship,
        state.isRelationshipSheetOpen
      )
    );

    return [...convertedCanvasEdges, ...extraEdges];
  }, [canvas?.edges, state.extraEdges, state.isRelationshipSheetOpen, events]);

  // Memoized filter options
  const availableFilterOptions = useMemo(() => {
    return getAvailableFilterOptions(canvas?.nodes || [], canvas?.edges || []);
  }, [canvas?.nodes, canvas?.edges]);

  // Enable shortcuts (simplified example)
  const enabledShortcuts = useMemo(() => [], []);

  // Mode change handler
  const handleModeChange = useCallback(
    async (mode: 'edit' | 'draw') => {
      state.setIsTransitioning(true);

      try {
        state.setToolbarMode(mode);

        if (mode === 'draw') {
          console.log('🎨 Switching to Draw Mode...');
          canvasMachine.switchToDesign();
          await new Promise((resolve) => setTimeout(resolve, 100));
          state.setIsWhiteboardActive(true);
          await new Promise((resolve) => setTimeout(resolve, 200));

          if (state.whiteboardRef.current) {
            console.log('🎨 Setting freedraw tool...');
            state.whiteboardRef.current.setTool('freedraw');
            canvasMachine.setDesignTool('freedraw');
            state.setDrawActiveTool('freedraw');
          }
        } else {
          console.log('🔧 Switching to Edit Mode...');
          canvasMachine.switchToPractical();
          state.setIsWhiteboardActive(false);
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error('Error during mode transition:', error);
      } finally {
        state.setIsTransitioning(false);
      }
    },
    [state, canvasMachine]
  );

  return (
    <div className="w-full h-full bg-background">
      {/* Layer 1: App Context - Base layer */}
      <div className="h-full relative" style={{ zIndex: 0 }}>
        <PortalContainerProvider container={state.reactFlowRef.current as any}>
          {/* Layer 2: ReactFlow Canvas */}
          <ReactFlow
            ref={state.reactFlowRef}
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onPaneClick={events.handlePaneClick}
            // Enhanced navigation behavior
            panOnDrag={
              state.toolbarMode === 'draw'
                ? state.wbPassthrough
                  ? [0, 1, 2]
                  : false
                : state.navigationTool === 'hand'
                  ? [0, 1, 2]
                  : [1, 2]
            }
            panOnScroll={state.toolbarMode !== 'draw'}
            panOnScrollMode="free"
            zoomOnScroll={false}
            zoomOnPinch={true}
            minZoom={0.05}
            maxZoom={3}
            snapToGrid={true}
            snapGrid={[15, 15]}
            multiSelectionKeyCode={['Shift']}
            selectionKeyCode={['Shift']}
            deleteKeyCode={['Backspace', 'Delete']}
          >
            <Background />
            <Controls />

            {/* Top toolbar */}
            <Panel position="top-center">
              <TopCanvasToolbar
                mode={state.toolbarMode}
                onChangeMode={handleModeChange}
                navigationTool={state.navigationTool}
                onChangeNavigationTool={state.setNavigationTool}
                keepToolActive={state.keepToolActive}
                onToggleKeepToolActive={state.setKeepToolActive}
                drawActiveTool={state.drawActiveTool}
                onSetDrawTool={state.setDrawActiveTool}
                onOpenFilters={events.handleOpenFilters}
                onAddEvidence={events.handleAddEvidence}
                onApplyLayout={events.handleApplyLayout}
                currentLayoutDirection={state.currentLayoutDirection}
              />
            </Panel>

            {/* Selection Panel */}
            <Panel position="bottom-center">
              <SelectionPanel
                selectedNodeIds={selectedNodeIds}
                selectedGroupIds={state.selectedGroupIds}
                onGroupNodes={events.handleGroupSelectedNodes}
                onUngroupNodes={events.handleUngroupSelectedGroups}
                onDeleteNodes={events.handleDeleteSelectedItems}
                onDuplicateNodes={events.handleDuplicateSelectedItems}
                onOpenSettings={events.handleOpenSelectedSettings}
              />
            </Panel>

            {/* Debug Panels */}
            <CanvasDebugPanels
              state={state}
              selectedNodeIds={selectedNodeIds}
              canvas={canvas}
              isDevelopment={isDevelopment}
            />
          </ReactFlow>

          {/* Layer 3: Excalidraw Canvas Overlay */}
          <WhiteboardOverlay
            ref={state.whiteboardRef as any}
            isActive={state.isWhiteboardActive}
            zIndex={2}
            viewport={getViewport?.() || { x: 0, y: 0, zoom: 1 }}
            initialData={
              state.whiteboardScene
                ? sanitizeExcalidrawData(state.whiteboardScene)
                : createExcalidrawInitialData()
            }
            onSceneChange={(scene) => state.setWhiteboardScene(scene)}
            onViewportChange={(viewport) => {
              viewportSync.syncToReactFlow(viewport);
            }}
            topOffset={100}
            passthrough={state.wbPassthrough}
          />
        </PortalContainerProvider>
      </div>

      {/* All Modals and Sheets */}
      <CanvasModals
        state={state}
        enabledShortcuts={enabledShortcuts}
        availableFilterOptions={availableFilterOptions}
        onApplyFilters={events.handleApplyFilters}
        onSwitchToCard={events.handleSwitchToCard}
        onSwitchToRelationship={events.handleSwitchToRelationship}
        onCloseSettingsSheet={events.handleCloseSettingsSheet}
        onCloseRelationshipSheet={events.handleCloseRelationshipSheet}
      />

      {/* Quick Search */}
      <QuickSearchCommand isOpen={false} onClose={() => {}} />
    </div>
  );
}

export default function CanvasPage() {
  return (
    <ReactFlowProvider>
      <CanvasPageInner />
    </ReactFlowProvider>
  );
}
