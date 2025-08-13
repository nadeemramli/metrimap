import {
  Background,
  Controls,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

// Extracted utilities and hooks
import { useEvidenceStore } from '@/features/evidence/stores/useEvidenceStore';
import { useCanvasStore } from '@/lib/stores';
import { PortalContainerProvider } from '@/shared/contexts/PortalContainerContext';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import { isDevelopmentEnvironment } from '@/shared/lib/supabase/client';
import { getProjectById } from '@/shared/lib/supabase/services/projects';
import { getClientForEnvironment } from '@/shared/utils/authenticatedClient';
import {
  createExcalidrawInitialData,
  sanitizeExcalidrawData,
} from '@/shared/utils/excalidrawDefaults';
import { getAvailableFilterOptions } from '@/shared/utils/filterUtils';
import { useCanvasEvents } from '../hooks/useCanvasEvents';
import { useCanvasKeyboard } from '../hooks/useCanvasKeyboard';
import { useCanvasPageState } from '../hooks/useCanvasPageState';
import { useCanvasStateMachine } from '../hooks/useCanvasStateMachine';
import { useCanvasViewportSync } from '../hooks/useCanvasViewportSync';

// Extracted converters and types
import {
  convertToEdge,
  convertToEvidenceNode,
  convertToGroupNode,
  convertToNode,
  edgeTypes,
  nodeTypes,
} from '@/shared/utils/canvasConverters';

// Extracted layout components
import CanvasDebugPanels from '@/features/canvas/components/layout/CanvasDebugPanels';
import CanvasModals from '@/features/canvas/components/layout/CanvasModals';

// Core components
import WhiteboardOverlay from '@/features/canvas/components/WhiteboardOverlay';
import BulkOperationsToolbar from '@/features/canvas/components/bulk/BulkOperationsToolbar';
import SelectionPanel from '@/features/canvas/components/grouping/SelectionPanel';
import ControlPanel from '@/features/canvas/components/left-sidepanel/ControlPanel';
import TopCanvasToolbar from '@/features/canvas/components/mini-control/TopCanvasToolbar';
import QuickSearchCommand from '@/features/canvas/components/search/QuickSearchCommand';
import { generateUUID } from '@/shared/utils/validation';
import type { Node } from '@xyflow/react';

// Auto-save and realtime hooks
import { useAutoSave } from '@/shared/hooks/useAutoSave';
import { useCanvasRealtime } from '@/shared/hooks/useCanvasRealtime';

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
    loadCanvas,
    setLoading,
    setError,
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
  useCanvasRealtime({ canvasId: currentCanvasId || '', supabaseClient });

  // Load canvas data from database when component mounts
  useEffect(() => {
    const loadCanvasData = async () => {
      if (!canvasId || canvas?.id === canvasId) return;

      setLoading(true);
      setError(undefined);

      try {
        console.log('🔄 Loading canvas data for:', canvasId);

        // If canvasId is not a UUID (e.g., "new"), bootstrap local canvas and skip remote fetch
        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(canvasId)) {
          const now = new Date().toISOString();
          loadCanvas({
            id: canvasId,
            name: 'Untitled Canvas',
            description: '',
            tags: [],
            collaborators: [],
            nodes: [],
            edges: [],
            groups: [],
            settings: {},
            createdAt: now,
            updatedAt: now,
            lastModifiedBy: 'system',
          } as any);
          return;
        }

        // Use the appropriate client for the environment
        const client = supabaseClient || getClientForEnvironment();
        const projectData = await getProjectById(canvasId, client);

        if (projectData) {
          console.log('✅ Canvas data loaded:', {
            nodes: projectData.nodes?.length || 0,
            edges: projectData.edges?.length || 0,
            groups: projectData.groups?.length || 0,
          });
          loadCanvas(projectData);
        } else {
          console.error('❌ No project data returned for canvas:', canvasId);
          // Initialize a local skeleton canvas so the UI stays interactive
          const now = new Date().toISOString();
          loadCanvas({
            id: canvasId,
            name: 'Untitled Canvas',
            description: '',
            tags: [],
            collaborators: [],
            nodes: [],
            edges: [],
            groups: [],
            settings: {},
            createdAt: now,
            updatedAt: now,
            lastModifiedBy: 'system',
          } as any);
        }
      } catch (error) {
        console.error('❌ Error loading canvas data:', error);
        // Initialize a local skeleton canvas on error as well
        if (canvasId) {
          const now = new Date().toISOString();
          loadCanvas({
            id: canvasId,
            name: 'Untitled Canvas',
            description: '',
            tags: [],
            collaborators: [],
            nodes: [],
            edges: [],
            groups: [],
            settings: {},
            createdAt: now,
            updatedAt: now,
            lastModifiedBy: 'system',
          } as any);
        } else {
          setError('Failed to load canvas data');
        }
      } finally {
        setLoading(false);
      }
    };

    loadCanvasData();
  }, [canvasId, canvas?.id, supabaseClient, loadCanvas, setLoading, setError]);

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

    const allNodes = [
      ...convertedCanvasNodes,
      ...convertedEvidenceNodes,
      ...convertedGroupNodes,
      ...extraNodes,
    ];

    return allNodes;
  }, [
    canvasId,
    canvas?.nodes,
    canvas?.groups,
    evidenceList,
    state.extraNodes,
    selectedNodeIds,
    state.isSettingsSheetOpen,
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

    const allEdges = [...convertedCanvasEdges, ...extraEdges];

    return allEdges;
  }, [
    canvasId,
    canvas?.edges,
    state.extraEdges,
    state.isRelationshipSheetOpen,
  ]);

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
          state.setWbPassthrough(false); // Ensure drawing is enabled
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

  const handleAddCustomNode = useCallback(
    (
      type:
        | 'sourceNode'
        | 'chartNode'
        | 'operatorNode'
        | 'whiteboardNode'
        | 'commentNode'
    ) => {
      const id = generateUUID();
      const basePosition = { x: 100, y: 100 };
      const node: Partial<Node> = {
        id,
        type,
        position: basePosition,
      };
      if (type === 'operatorNode') {
        node.data = {
          label: 'Operator',
          operationType: 'formula',
          isActive: true,
        } as any;
      }
      if (type === 'commentNode') {
        node.data = {
          title: 'Comment',
          projectId: useCanvasStore.getState().canvas?.id,
        } as any;
      }
      state.setExtraNodes([...(state.extraNodes || []), node as Node]);
    },
    [state]
  );

  return (
    <div className="w-full h-full bg-background">
      {/* Layer 1: App Context - Base layer */}
      <div className="h-full relative" style={{ zIndex: 0 }}>
        <PortalContainerProvider container={state.reactFlowRef.current as any}>
          {/* Layer 2: ReactFlow Canvas */}
          <ReactFlow
            ref={(ref) => {
              state.reactFlowRef.current = ref;
              viewportSync.setReactFlowRef(ref);
            }}
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onPaneClick={events.handlePaneClick}
            // Enhanced navigation behavior
            panOnDrag={
              state.toolbarMode === 'edit'
                ? [1, 2] // Edit mode: only right/middle mouse buttons for panning (left mouse for node selection/dragging)
                : false // Draw mode: disable React Flow panning completely
            }
            panOnScroll={state.toolbarMode === 'edit'} // Enable scroll panning in Edit mode only
            panOnScrollMode="free"
            zoomOnScroll={state.toolbarMode === 'edit'} // Enable zoom in Edit mode only
            panActivationKeyCode={state.toolbarMode === 'edit' ? 'Space' : null} // Space panning in Edit mode only
            nodesDraggable={state.toolbarMode === 'edit'}
            nodesConnectable={state.toolbarMode === 'edit'}
            elementsSelectable={state.toolbarMode === 'edit'}
            zoomOnPinch={true}
            minZoom={0.05}
            maxZoom={3}
            snapToGrid={true}
            snapGrid={[15, 15]}
            multiSelectionKeyCode={['Shift']}
            selectionKeyCode={['Shift']}
            deleteKeyCode={['Backspace', 'Delete']}
            onMoveEnd={(_, viewport) =>
              viewportSync.syncFromReactFlow(viewport)
            }
          >
            <Background />
            <Controls />

            {/* Top toolbar */}
            <Panel position="top-center" className="pointer-events-auto">
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
                onAddCustomNode={handleAddCustomNode}
              />
            </Panel>

            {/* Operative control panel - top-left */}
            <Panel position="top-left">
              <div className="w-80 max-h-[70vh] overflow-auto bg-background/90 backdrop-blur border rounded-lg shadow-lg">
                <ControlPanel
                  operatorNodes={
                    nodes.filter((n) => n.type === 'operatorNode') as any
                  }
                  onUpdateNode={(nodeId, updates) => {
                    // Update local operator node data in state.extraNodes for simplicity
                    const target = (state.extraNodes || []).find(
                      (n) => n.id === nodeId
                    );
                    if (target) {
                      target.data = { ...target.data, ...updates } as any;
                      state.setExtraNodes([...(state.extraNodes || [])]);
                    }
                  }}
                  onBulkUpdate={(updates) => {
                    const opNodes = nodes.filter(
                      (n) => n.type === 'operatorNode'
                    );
                    opNodes.forEach((n: any) => {
                      n.data = { ...n.data, ...updates };
                    });
                    state.setExtraNodes([...(state.extraNodes || [])]);
                  }}
                  onSimulate={() => {
                    console.log('Simulate operative nodes');
                  }}
                  isSimulating={false}
                />
              </div>
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

          {/* Layer 3: Excalidraw Canvas Overlay - Only render in Draw mode */}
          {state.toolbarMode === 'draw' && (
            <WhiteboardOverlay
              ref={state.whiteboardRef as any}
              isActive={state.isWhiteboardActive}
              zIndex={2}
              viewport={viewportSync.getViewport()}
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
          )}
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

      {/* Bulk operations toolbar (appears when items are selected) */}
      <BulkOperationsToolbar />

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
