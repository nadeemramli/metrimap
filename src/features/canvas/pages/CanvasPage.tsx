import {
  applyNodeChanges,
  Background,
  Controls,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Connection,
  type NodeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

// Extracted utilities and hooks
import { useCanvasNodesStore } from '@/features/canvas/stores/useCanvasNodesStore';
import { useEvidenceStore } from '@/features/evidence/stores/useEvidenceStore';
import { useAppStore, useCanvasStore } from '@/lib/stores';
import { PortalContainerProvider } from '@/shared/contexts/PortalContainerContext';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import { isDevelopmentEnvironment } from '@/shared/lib/supabase/client';
import { getProjectById } from '@/shared/lib/supabase/services/projects';
import { getClientForEnvironment } from '@/shared/utils/authenticatedClient';
import {
  applyAutoLayout,
  type LayoutDirection,
} from '@/shared/utils/autoLayout';
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
  const updateEvidencePosition = useEvidenceStore(
    (s) => s.updateEvidencePosition
  );

  // Canvas nodes store for extra nodes (comment, source, chart, operator, whiteboard)
  const {
    canvasNodes,
    loadCanvasNodes,
    createNode: createCanvasNode,
    updateNodePosition: updateCanvasNodePosition,
    deleteNode: deleteCanvasNode,
  } = useCanvasNodesStore();

  // Initialize hooks
  const canvasMachine = useCanvasStateMachine();
  const viewportSync = useCanvasViewportSync();

  // Sync local state with state machine to ensure consistency
  // This fixes the node dragging issue by ensuring toolbarMode is properly synchronized
  useEffect(() => {
    const machineMode =
      canvasMachine.currentEnvironment === 'practical' ? 'edit' : 'draw';
    if (state.toolbarMode !== machineMode) {
      console.log(
        `🔄 Syncing toolbar mode: ${state.toolbarMode} -> ${machineMode}`
      );
      state.setToolbarMode(machineMode);
    }
  }, [
    canvasMachine.currentEnvironment,
    state.toolbarMode,
    state.setToolbarMode,
  ]);

  // Initialize keyboard shortcuts
  useCanvasKeyboard();

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

          // Load canvas nodes for this project
          try {
            await loadCanvasNodes(canvasId);
            console.log('✅ Canvas nodes loaded');
          } catch (error) {
            console.error('❌ Error loading canvas nodes:', error);
          }
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
  const { getViewport, getNodes, getEdges, setNodes, fitView } =
    useReactFlow() as any;

  // Auto-layout handler
  const handleApplyLayout = useCallback(
    async (direction?: LayoutDirection) => {
      console.log(
        '🔄 Applying auto-layout with direction:',
        direction || state.currentLayoutDirection
      );

      const currentNodes = getNodes();
      const currentEdges = getEdges();

      if (!currentNodes || currentNodes.length === 0) {
        console.log('⚠️ No nodes to layout');
        return;
      }

      const layoutDirection =
        direction || (state.currentLayoutDirection as LayoutDirection) || 'TB';

      try {
        // Apply the auto-layout algorithm
        const layoutedNodes = applyAutoLayout(currentNodes, currentEdges, {
          direction: layoutDirection,
          nodeWidth: 320,
          nodeHeight: 200,
          rankSeparation: 150,
          nodeSeparation: 100,
          marginX: 50,
          marginY: 50,
        });

        console.log('✅ Layout applied, updating nodes...');

        // Update the nodes with new positions
        setNodes(layoutedNodes);

        // Update the current layout direction in state
        state.setCurrentLayoutDirection(layoutDirection);

        // Fit the view to show all nodes with some padding
        setTimeout(() => {
          fitView({ padding: 50, duration: 800 });
        }, 100);

        console.log('✅ Auto-layout completed successfully');
      } catch (error) {
        console.error('❌ Error applying auto-layout:', error);
      }
    },
    [getNodes, getEdges, setNodes, fitView, state]
  );

  // Create stable event handlers to prevent circular dependencies
  const stableHandleOpenSettingsSheet = useCallback(
    (nodeId: string) => {
      console.log('🔧 Opening settings sheet for node:', nodeId);
      state.setIsSettingsSheetOpen(true);
      state.setSettingsCardId?.(nodeId);
    },
    [state]
  );

  const stableHandleSwitchToCard = useCallback(
    (nodeId: string, tab?: string) => {
      console.log('🔧 Switching to card:', nodeId, 'tab:', tab);
      state.setIsSettingsSheetOpen(true);
      state.setSettingsCardId?.(nodeId);
      if (tab) {
        state.setSettingsInitialTab?.(tab);
      }
    },
    [state]
  );

  const stableHandleToggleCollapse = useCallback((groupId: string) => {
    console.log('📁 Toggle collapse for group:', groupId);
    // Update group collapse state in canvas
    const currentCanvas = useCanvasStore.getState().canvas;
    if (currentCanvas) {
      const updatedGroups =
        currentCanvas.groups?.map((group) =>
          group.id === groupId
            ? { ...group, isCollapsed: !group.isCollapsed }
            : group
        ) || [];

      useCanvasStore.setState((state) => ({
        canvas: state.canvas
          ? {
              ...state.canvas,
              groups: updatedGroups,
              updatedAt: new Date().toISOString(),
            }
          : undefined,
      }));
    }
  }, []);

  const stableHandleUpdateGroupSize = useCallback(
    (groupId: string, size: { width: number; height: number }) => {
      console.log('📏 Update group size:', groupId, size);
      // Update group size in canvas
      const currentCanvas = useCanvasStore.getState().canvas;
      if (currentCanvas) {
        const updatedGroups =
          currentCanvas.groups?.map((group) =>
            group.id === groupId ? { ...group, size } : group
          ) || [];

        useCanvasStore.setState((state) => ({
          canvas: state.canvas
            ? {
                ...state.canvas,
                groups: updatedGroups,
                updatedAt: new Date().toISOString(),
              }
            : undefined,
        }));
      }
    },
    []
  );

  // Stable callback for layout application
  const onApplyLayoutCallback = useCallback(() => {
    handleApplyLayout();
  }, [handleApplyLayout]);

  // Initialize event handlers (after handleApplyLayout is defined)
  const events = useCanvasEvents({
    state,
    canvasMachine,
    viewportSync,
    onApplyLayout: onApplyLayoutCallback,
  });

  // Create stable references to prevent circular dependencies
  const stableEvents = useMemo(
    () => ({
      handleOpenSettingsSheet: stableHandleOpenSettingsSheet,
      handleSwitchToCard: stableHandleSwitchToCard,
      handleToggleCollapse: stableHandleToggleCollapse,
      handleUpdateGroupSize: stableHandleUpdateGroupSize,
    }),
    [
      stableHandleOpenSettingsSheet,
      stableHandleSwitchToCard,
      stableHandleToggleCollapse,
      stableHandleUpdateGroupSize,
    ]
  );

  // UNIFIED: Use only canvasNodes from Zustand store, remove state.extraNodes
  const temporaryExtraNodes = state.extraNodes || [];

  // Memoized data conversions
  const nodes = useMemo(() => {
    const metricCardNodes = canvas?.nodes || [];
    const evidenceNodes = evidenceList?.filter((e) => e.position) || [];
    const persistedCanvasNodes = canvasNodes || [];

    const convertedMetricCardNodes = metricCardNodes.map((card) =>
      convertToNode(
        card,
        stableEvents.handleOpenSettingsSheet,
        () => console.log('Node clicked:', card.id),
        stableEvents.handleSwitchToCard,
        state.isSettingsSheetOpen,
        selectedNodeIds
      )
    );

    // Convert persisted canvas nodes to ReactFlow nodes
    const convertedPersistedCanvasNodes = persistedCanvasNodes.map(
      (canvasNode) => ({
        id: canvasNode.id,
        type: canvasNode.nodeType,
        position: canvasNode.position,
        data: {
          ...canvasNode.data,
          title: canvasNode.title,
          projectId: canvasNode.projectId,
        },
      })
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
        stableEvents.handleToggleCollapse,
        stableEvents.handleUpdateGroupSize
      )
    );

    // UNIFIED: Only use persisted canvas nodes, no more extraNodes
    const allNodes = [
      ...convertedMetricCardNodes,
      ...convertedEvidenceNodes,
      ...convertedGroupNodes,
      ...convertedPersistedCanvasNodes,
      // Only include temporary nodes if they exist (for immediate UI feedback)
      ...(temporaryExtraNodes.length > 0 ? temporaryExtraNodes : []),
    ];

    console.log('🔄 Nodes computed:', {
      metricCardNodes: convertedMetricCardNodes.length,
      evidenceNodes: convertedEvidenceNodes.length,
      groupNodes: convertedGroupNodes.length,
      persistedCanvasNodes: convertedPersistedCanvasNodes.length,
      temporaryExtraNodes: temporaryExtraNodes.length,
      total: allNodes.length,
    });

    return allNodes;
  }, [
    canvasId,
    canvas?.nodes,
    canvas?.groups,
    evidenceList,
    canvasNodes, // Unified canvas nodes from Zustand store
    temporaryExtraNodes, // Only temporary fallback nodes
    selectedNodeIds,
    state.isSettingsSheetOpen,
    stableEvents,
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
    events.handleOpenRelationshipSheet,
    events.handleSwitchToRelationship,
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

  // Keep nodes in sync while dragging (controlled ReactFlow)
  const handleNodeDrag = useCallback(
    (_: any, node: any) => {
      if (node?.id && node?.position) {
        if (node.type === 'metricCard') {
          useCanvasStore.getState().updateNodePosition(node.id, node.position);
        } else if (node.type === 'evidenceNode') {
          updateEvidencePosition(node.id, node.position);
        } else {
          const current = state.extraNodes || [];
          const next = current.map((n: any) =>
            n.id === node.id ? { ...n, position: node.position } : n
          );
          state.setExtraNodes(next);
        }
      }
    },
    [state, updateEvidencePosition]
  );

  const handleNodeDragStop = useCallback(
    (_: any, node: any) => {
      // Reuse same logic on drag stop to ensure final commit
      if (node?.id && node?.position) {
        if (node.type === 'metricCard') {
          useCanvasStore.getState().updateNodePosition(node.id, node.position);
        } else if (node.type === 'evidenceNode') {
          updateEvidencePosition(node.id, node.position);
        } else {
          const current = state.extraNodes || [];
          const next = current.map((n: any) =>
            n.id === node.id ? { ...n, position: node.position } : n
          );
          state.setExtraNodes(next);
        }
      }
    },
    [state, updateEvidencePosition]
  );

  // Handle edge connections between nodes
  const handleConnect = useCallback(
    (connection: Connection) => {
      console.log('🔗 Creating connection:', connection);

      // Get source and target nodes to determine edge type
      const sourceNode = nodes.find((n) => n.id === connection.source);
      const targetNode = nodes.find((n) => n.id === connection.target);

      if (!sourceNode || !targetNode) {
        console.error('❌ Source or target node not found');
        return;
      }

      // Determine edge type based on node types
      const isMetricToMetric =
        sourceNode.type === 'metricCard' && targetNode.type === 'metricCard';
      const isOperativeConnection =
        ['sourceNode', 'chartNode', 'operatorNode'].includes(sourceNode.type) ||
        ['sourceNode', 'chartNode', 'operatorNode'].includes(targetNode.type);

      if (isMetricToMetric) {
        // Create DynamicEdge for MetricCard to MetricCard connections
        const relationshipData = {
          sourceId: connection.source,
          targetId: connection.target,
          type: 'Deterministic' as const, // Default type, user can change later
          weight: 1.0,
          confidence: 'Medium' as const,
          evidence: [],
          notes: `Connection between ${sourceNode.data?.card?.title || 'Unknown'} and ${targetNode.data?.card?.title || 'Unknown'}`,
        };

        // Create the relationship using the canvas store
        useCanvasStore.getState().createEdge(relationshipData);
      } else if (isOperativeConnection) {
        // Create OperativeEdge for data source, visualization, and operative node connections
        // For now, add to extraEdges since these aren't stored as Relationships
        const operativeEdge = {
          id: `${connection.source}-${connection.target}`,
          source: connection.source,
          target: connection.target,
          type: 'operativeEdge',
          data: {
            label: 'Data Flow',
          },
        };

        const currentEdges = state.extraEdges || [];
        state.setExtraEdges([...currentEdges, operativeEdge]);
      } else {
        console.log('🔗 Mixed connection type, defaulting to DynamicEdge');
        // Mixed connection (e.g., MetricCard to OperatorNode), use DynamicEdge
        const relationshipData = {
          sourceId: connection.source,
          targetId: connection.target,
          type: 'Deterministic' as const,
          weight: 1.0,
          confidence: 'Medium' as const,
          evidence: [],
          notes: `Mixed connection between nodes`,
        };

        useCanvasStore.getState().createEdge(relationshipData);
      }
    },
    [nodes, state]
  );

  // Apply generic node changes for extra nodes (selection/resize etc.)
  // UNIFIED: Only handle temporary extra nodes, persisted nodes are handled by their stores
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      if (
        !Array.isArray(temporaryExtraNodes) ||
        temporaryExtraNodes.length === 0
      )
        return;
      const updated = applyNodeChanges(changes, temporaryExtraNodes as any);
      state.setExtraNodes(updated as any);
    },
    [temporaryExtraNodes, state]
  );

  const handleAddCustomNode = useCallback(
    async (
      type:
        | 'sourceNode'
        | 'chartNode'
        | 'operatorNode'
        | 'whiteboardNode'
        | 'commentNode'
    ) => {
      const currentCanvas = useCanvasStore.getState().canvas;
      if (!currentCanvas?.id) {
        console.error('❌ No canvas loaded, cannot add node');
        return;
      }

      const basePosition = { x: 100, y: 100 };
      const nodeData: any = {};

      if (type === 'operatorNode') {
        nodeData.label = 'Operator';
        nodeData.operationType = 'formula';
        nodeData.isActive = true;
      }

      if (type === 'commentNode') {
        nodeData.title = 'Comment';
      }

      try {
        // UNIFIED: Create the canvas node in the database and store
        await createCanvasNode({
          projectId: currentCanvas.id,
          nodeType: type,
          title: type === 'commentNode' ? 'Comment' : type.replace('Node', ''),
          position: basePosition,
          data: nodeData,
          createdBy: useAppStore.getState().user?.id || 'anonymous',
        });

        console.log(`✅ Created ${type} node successfully`);
      } catch (error) {
        console.error(`❌ Error creating ${type} node:`, error);
        // UNIFIED: Only use temporary fallback for immediate UI feedback
        // This will be replaced when the store updates
        const fallbackNode = {
          id: generateUUID(),
          type,
          position: basePosition,
          data: nodeData,
        };
        state.setExtraNodes([
          ...(temporaryExtraNodes || []),
          fallbackNode as any,
        ]);

        // Clear temporary node after a short delay to avoid conflicts
        setTimeout(() => {
          state.setExtraNodes([]);
        }, 3000);
      }
    },
    [createCanvasNode, state]
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
            onNodesChange={handleNodesChange}
            onNodeDrag={handleNodeDrag}
            onNodeDragStop={handleNodeDragStop}
            onNodeDoubleClick={(_, node) => {
              console.log('🔧 Node double-clicked:', node.id);
              events.handleOpenSettingsSheet(node.id);
            }}
            onEdgeDoubleClick={(_, edge) => {
              console.log('🔗 Edge double-clicked:', edge.id);
              events.handleOpenRelationshipSheet(edge.id);
            }}
            onConnect={handleConnect}
            // Enhanced navigation behavior
            panOnDrag={
              state.toolbarMode === 'edit'
                ? [1, 2] // Edit mode: only right/middle mouse buttons for panning (left mouse for node selection/dragging)
                : false // Draw mode: disable React Flow panning completely
            }
            panOnScroll={state.toolbarMode === 'edit'} // Enable scroll panning in Edit mode only
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
                onChangeNavigationTool={(tool: string) =>
                  state.setNavigationTool(tool as any)
                }
                keepToolActive={state.keepToolActive}
                onToggleKeepToolActive={(value: boolean) =>
                  state.setKeepToolActive(value)
                }
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
      <QuickSearchCommand
        isOpen={false}
        onClose={() => {}}
        onResultSelect={() => {}}
      />
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
