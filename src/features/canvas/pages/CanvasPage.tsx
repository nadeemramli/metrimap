// @ts-nocheck
// TODO(type-debt): pre-existing type errors quarantined when strict type-checking
// was enabled. See docs/architecture/TYPE_CHECK_DEBT.md. Fix the errors and remove
// this directive — do not add new code here assuming it is type-checked.
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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

// Extracted utilities and hooks
import { useCanvasNodesStore } from '@/features/canvas/stores/useCanvasNodesStore';
import { useNewNodeTypesStore } from '@/features/canvas/stores/useNewNodeTypesStore';
import { useEvidenceStore } from '@/features/evidence/stores/useEvidenceStore';
import { useAppStore, useCanvasStore } from '@/lib/stores';
import { useCanvasHeader } from '@/shared/contexts/CanvasHeaderContext';
import { PortalContainerProvider } from '@/shared/contexts/PortalContainerContext';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import { isDevelopmentEnvironment } from '@/shared/lib/supabase/client';
import { getProjectById } from '@/shared/lib/supabase/services/projects';
import { getClientForEnvironment } from '@/shared/utils/authenticatedClient';
import {
  applyAutoLayout,
  type LayoutDirection,
} from '@/shared/utils/autoLayout';
import { handleNodeConnection } from '@/shared/utils/edgeConnectionHandler';
import { getAvailableFilterOptions } from '@/shared/utils/filterUtils';
import { useCanvasEvents } from '../hooks/useCanvasEvents';
import { useCanvasKeyboard } from '../hooks/useCanvasKeyboard';
import { useCanvasPageState } from '../hooks/useCanvasPageState';
import { useCanvasStateMachine } from '../hooks/useCanvasStateMachine';
import { useCanvasViewportSync } from '../hooks/useCanvasViewportSync';

// Extracted converters and types
import {
  convertToCanvasNode,
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
import BulkOperationsToolbar from '@/features/canvas/components/bulk/BulkOperationsToolbar';
import SelectionPanel from '@/features/canvas/components/grouping/SelectionPanel';
import ControlPanel from '@/features/canvas/components/left-sidepanel/ControlPanel';
import TopCanvasToolbar from '@/features/canvas/components/mini-control/TopCanvasToolbar';
import QuickSearchCommand from '@/features/canvas/components/search/QuickSearchCommand';
import {
  EraseToolComponent,
  FreehandDrawComponent,
  LassoSelectionComponent,
  RectangleToolComponent,
  type WhiteboardTool,
} from '@/features/canvas/components/whiteboard';
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
  const { setHeaderInfo } = useCanvasHeader();

  // Operator/tools control panel is hidden by default; toggled from the right.
  const [showOperatorPanel, setShowOperatorPanel] = useState(false);

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
    clearNodes: clearCanvasNodes,
    createNode: createCanvasNode,
    updateNode: updateCanvasNode,
    updateNodePosition: updateCanvasNodePosition,
    deleteNode: deleteCanvasNode,
  } = useCanvasNodesStore();

  // New node types store for PRD-based nodes (value, action, hypothesis, metric)
  const { newNodes, clearNewNodes, updateNewNode } = useNewNodeTypesStore();

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

  // Set header info with canvas mode toggle
  useEffect(() => {
    const headerData = {
      title: canvas?.name || 'Untitled Canvas',
      description: canvas?.description,
      autoSaveStatus: {
        text: 'Auto-save enabled',
        icon: () => null,
        className: 'text-gray-600',
        bgClassName: 'bg-gray-100',
        dotClassName: 'bg-gray-400',
      },
      canvasMode: {
        mode: state.toolbarMode,
        onChangeMode: (mode: 'edit' | 'draw') => {
          console.log('🔄 Header mode change:', mode);
          state.setToolbarMode(mode);

          if (mode === 'edit') {
            canvasMachine.switchToPractical();
            // Reset to select tool when switching to edit mode
            state.setWhiteboardTool('select');
          } else {
            canvasMachine.switchToDesign();
            // Don't auto-set drawing tool - let user choose
            console.log('🎨 Switched to draw mode');
          }
        },
      },
    };

    console.log('🎯 Setting header info:', headerData);
    setHeaderInfo(headerData);
  }, [
    canvas?.name,
    canvas?.description,
    state.toolbarMode,
    setHeaderInfo,
    state.setToolbarMode,
    canvasMachine,
  ]);

  // Initialize keyboard shortcuts
  useCanvasKeyboard();

  // Initialize auto-save and realtime
  const currentCanvasId = useCanvasStore((s) => s.canvas?.id);
  useAutoSave({ enabled: Boolean(currentCanvasId) });
  useCanvasRealtime({ canvasId: currentCanvasId || '', supabaseClient });

  // Load canvas data from database when component mounts
  useEffect(() => {
    const loadCanvasData = async () => {
      if (!canvasId || canvas?.id === canvasId) return;

      setLoading(true);
      setError(undefined);

      // Reset client-side global/persisted stores so the previous project's
      // canvas nodes, PRD nodes, and positioned evidence never bleed into this
      // canvas (these stores are global/persisted, not scoped per project).
      clearCanvasNodes();
      clearNewNodes();
      useEvidenceStore.setState((s) => ({
        evidence: s.evidence.map((e) =>
          e.position ? { ...e, position: undefined } : e
        ),
      }));

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

          // Dev convenience: if running in development, auto-bootstrap a minimal project record
          try {
            if (isDevelopmentEnvironment()) {
              const client = supabaseClient || getClientForEnvironment();
              const userId = useAppStore.getState().user?.id || 'dev-user-001';
              const { error: insertErr } = await client
                .from('projects')
                .insert({
                  id: canvasId,
                  name: 'Untitled Canvas',
                  description: '',
                  tags: [],
                  settings: {},
                  created_by: userId,
                } as any);
              if (insertErr) {
                console.warn(
                  '⚠️ Dev bootstrap project insert skipped/failed:',
                  insertErr
                );
              } else {
                console.log('✅ Dev bootstrap project created:', canvasId);
              }
            }
          } catch (e) {
            console.warn(
              '⚠️ Dev bootstrap project creation errored but is non-fatal:',
              e
            );
          }
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
  }, [
    canvasId,
    canvas?.id,
    supabaseClient,
    loadCanvas,
    setLoading,
    setError,
    clearCanvasNodes,
    clearNewNodes,
  ]);

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
        // Lay out everything EXCEPT group frames — frames wrap their cards, so
        // they must not be Dagre-positioned as nodes.
        const groupNodes = currentNodes.filter((n) => n.type === 'groupNode');
        const flowNodes = currentNodes.filter((n) => n.type !== 'groupNode');

        const layoutedFlow = applyAutoLayout(flowNodes, currentEdges, {
          direction: layoutDirection,
          nodeWidth: 320,
          nodeHeight: 200,
          rankSeparation: 150,
          nodeSeparation: 100,
          marginX: 50,
          marginY: 50,
        });

        // Recompute each frame to wrap its (newly laid-out) member cards so
        // grouping and auto-layout coexist.
        const posById = new Map(layoutedFlow.map((n) => [n.id, n.position]));
        const HDR = 56;
        const PAD = 30;
        const CW = 280;
        const CH = 170;
        const adjustedGroups = groupNodes.map((gn) => {
          const ids: string[] = ((gn.data as any)?.group?.nodeIds as string[]) || [];
          const pts = ids
            .map((id) => posById.get(id))
            .filter(Boolean) as { x: number; y: number }[];
          if (pts.length === 0) return gn;
          const minX = Math.min(...pts.map((p) => p.x));
          const maxX = Math.max(...pts.map((p) => p.x));
          const minY = Math.min(...pts.map((p) => p.y));
          const maxY = Math.max(...pts.map((p) => p.y));
          const position = { x: minX - PAD, y: minY - HDR - PAD };
          const size = {
            width: maxX - minX + CW + PAD * 2,
            height: maxY - minY + CH + HDR + PAD * 2,
          };
          void useCanvasStore.getState().updateGroup(gn.id, { position, size });
          return {
            ...gn,
            position,
            style: { ...gn.style, width: size.width, height: size.height },
          };
        });

        // Frames first so they paint behind the cards.
        setNodes([...adjustedGroups, ...layoutedFlow]);

        // Persist the new card/node positions (mirror drag-stop routing) so the
        // layout sticks and the frames match on reload.
        for (const node of layoutedFlow) {
          if (!node?.id || !node?.position) continue;
          if (node.type === 'metricCard') {
            useCanvasStore.getState().updateNodePosition(node.id, node.position);
          } else if (node.type === 'evidenceNode') {
            updateEvidencePosition(node.id, node.position);
          } else if (
            ['sourceNode', 'chartNode', 'operatorNode', 'commentNode', 'whiteboardNode'].includes(
              node.type as string
            )
          ) {
            updateCanvasNodePosition(node.id, node.position);
          } else if (
            ['valueNode', 'actionNode', 'hypothesisNode', 'metricNode'].includes(
              node.type as string
            )
          ) {
            updateNewNode(node.id, { position: node.position });
          }
        }

        state.setCurrentLayoutDirection(layoutDirection);
        setTimeout(() => {
          fitView({ padding: 50, duration: 800 });
        }, 100);
      } catch (error) {
        console.error('❌ Error applying auto-layout:', error);
      }
    },
    [
      getNodes,
      getEdges,
      setNodes,
      fitView,
      state,
      updateEvidencePosition,
      updateCanvasNodePosition,
      updateNewNode,
    ]
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
    const newNodeTypes = newNodes || [];

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
      (canvasNode) => convertToCanvasNode(canvasNode, selectedNodeIds)
    );

    // Convert new node types to ReactFlow nodes
    const convertedNewNodeTypes = newNodeTypes.map((node) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: { node },
      selected: selectedNodeIds.includes(node.id),
      selectable: true,
      draggable: true,
    }));

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
        () => {
          // Delete the frame (cards are kept). Was a console.log stub.
          if (
            typeof window !== 'undefined' &&
            !window.confirm(
              `Delete group "${group.name}"? The cards inside are kept.`
            )
          )
            return;
          void useCanvasStore.getState().deleteGroup(group.id);
        },
        stableEvents.handleToggleCollapse,
        stableEvents.handleUpdateGroupSize
      )
    );

    // UNIFIED: Only use persisted canvas nodes, no more extraNodes
    const allNodes = [
      // Groups first so they paint BEHIND the cards — background frames that
      // don't steal clicks from the cards inside them.
      ...convertedGroupNodes,
      ...convertedMetricCardNodes,
      ...convertedEvidenceNodes,
      ...convertedPersistedCanvasNodes,
      ...convertedNewNodeTypes,
      // Only include temporary nodes if they exist (for immediate UI feedback)
      ...(temporaryExtraNodes.length > 0 ? temporaryExtraNodes : []),
    ];

    console.log('🔄 Nodes computed:', {
      metricCardNodes: convertedMetricCardNodes.length,
      evidenceNodes: convertedEvidenceNodes.length,
      groupNodes: convertedGroupNodes.length,
      persistedCanvasNodes: convertedPersistedCanvasNodes.length,
      newNodeTypes: convertedNewNodeTypes.length,
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
    newNodes, // New node types from Zustand store
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

  // Mode change is now handled in the header toggle

  // Keep nodes in sync while dragging (controlled ReactFlow)
  const handleNodeDrag = useCallback(
    (_: any, node: any) => {
      if (node?.id && node?.position) {
        if (node.type === 'metricCard') {
          useCanvasStore.getState().updateNodePosition(node.id, node.position);
        } else if (node.type === 'evidenceNode') {
          updateEvidencePosition(node.id, node.position);
        } else if (
          [
            'sourceNode',
            'chartNode',
            'operatorNode',
            'commentNode',
            'whiteboardNode',
          ].includes(node.type)
        ) {
          // Persisted canvas nodes live in useCanvasNodesStore.
          updateCanvasNodePosition(node.id, node.position);
        } else if (
          ['valueNode', 'actionNode', 'hypothesisNode', 'metricNode'].includes(
            node.type
          )
        ) {
          // PRD node types live in useNewNodeTypesStore.
          updateNewNode(node.id, { position: node.position });
        } else {
          const current = state.extraNodes || [];
          const next = current.map((n: any) =>
            n.id === node.id ? { ...n, position: node.position } : n
          );
          state.setExtraNodes(next);
        }
      }
    },
    [state, updateEvidencePosition, updateCanvasNodePosition, updateNewNode]
  );

  const handleNodeDragStop = useCallback(
    (_: any, node: any) => {
      // Reuse same logic on drag stop to ensure final commit
      if (node?.id && node?.position) {
        if (node.type === 'metricCard') {
          useCanvasStore.getState().updateNodePosition(node.id, node.position);
        } else if (node.type === 'evidenceNode') {
          updateEvidencePosition(node.id, node.position);
        } else if (
          [
            'sourceNode',
            'chartNode',
            'operatorNode',
            'commentNode',
            'whiteboardNode',
          ].includes(node.type)
        ) {
          // Persisted canvas nodes live in useCanvasNodesStore.
          updateCanvasNodePosition(node.id, node.position);
        } else if (
          ['valueNode', 'actionNode', 'hypothesisNode', 'metricNode'].includes(
            node.type
          )
        ) {
          // PRD node types live in useNewNodeTypesStore.
          updateNewNode(node.id, { position: node.position });
        } else {
          const current = state.extraNodes || [];
          const next = current.map((n: any) =>
            n.id === node.id ? { ...n, position: node.position } : n
          );
          state.setExtraNodes(next);
        }
      }
    },
    [state, updateEvidencePosition, updateCanvasNodePosition, updateNewNode]
  );

  // Enhanced edge connection handler
  const handleConnect = useCallback(
    (connection: Connection) => {
      console.log('🔗 Enhanced connection handler triggered:', connection);

      // Get all existing edges for cycle detection
      const existingEdges = [
        ...(canvas?.edges || []).map((e) => ({
          source: e.sourceId,
          target: e.targetId,
          type: 'relationship',
        })),
        ...(state.extraEdges || []).map((e) => ({
          source: e.source,
          target: e.target,
          type: e.type,
        })),
      ];

      // Use enhanced connection handler
      const result = handleNodeConnection(connection, {
        nodes,
        existingEdges,
        onCreateRelationship: async (relationshipData) => {
          try {
            await useCanvasStore.getState().createEdge(relationshipData);
            console.log('✅ Relationship edge created successfully');
          } catch (error) {
            console.error('❌ Failed to create relationship edge:', error);
          }
        },
        onCreateDataFlow: (edgeData) => {
          const currentEdges = state.extraEdges || [];
          state.setExtraEdges([...currentEdges, edgeData]);
          console.log('✅ Data flow edge created successfully');
        },
        onCreateReference: (edgeData) => {
          const currentEdges = state.extraEdges || [];
          state.setExtraEdges([...currentEdges, edgeData]);
          console.log('✅ Reference edge created successfully');
        },
      });

      if (!result.success) {
        console.error('❌ Connection failed:', result.error);
        // You could show a toast notification here
        alert(`Connection failed: ${result.error}`);
      }
    },
    [nodes, canvas?.edges, state]
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

  // Handle draw tool changes - update state and call the whiteboard API
  const handleSetDrawTool = useCallback(
    (tool: string) => {
      console.log('🎨 Setting draw tool:', tool);
      state.setDrawActiveTool(tool);
      canvasMachine.setDesignTool(tool as any);

      // Also call the whiteboard setTool method if whiteboard is active
      if (state.whiteboardRef.current && state.isWhiteboardActive) {
        try {
          state.whiteboardRef.current.setTool(tool);
          console.log('✅ Whiteboard tool set to:', tool);
        } catch (error) {
          console.warn('⚠️ Failed to set whiteboard tool:', error);
        }
      }
    },
    [state, canvasMachine]
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
        // Clear any temporary nodes since the persisted node was created successfully
        state.setExtraNodes([]);
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
        }, 5000); // Increased timeout to give more time for debugging
      }
    },
    [createCanvasNode, state]
  );

  return (
    <div className="w-full h-full bg-background">
      {/* Layer 1: App Context - Base layer */}
      <div className="h-full relative" style={{ zIndex: 0 }}>
        <PortalContainerProvider container={state.reactFlowRef.current as any}>
          {/* ReactFlow Canvas - Always rendered, with whiteboard tools overlaid in draw mode */}
          <ReactFlow
            ref={(ref) => {
              state.reactFlowRef.current = ref;
              viewportSync.setReactFlowRef(ref);
            }}
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes as any}
            edgeTypes={edgeTypes}
            style={{
              cursor: state.whiteboardTool === 'hand' ? 'grab' : 'default',
            }}
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
            // Enhanced navigation behavior - adjust based on active whiteboard tool
            panOnDrag={
              state.toolbarMode === 'edit' ||
              state.whiteboardTool === 'select' ||
              state.whiteboardTool === 'hand'
                ? [1, 2] // Edit mode, select tool, or hand tool: allow panning
                : false // Draw mode with active drawing tool: disable React Flow panning
            }
            panOnScroll={
              state.toolbarMode === 'edit' ||
              state.whiteboardTool === 'select' ||
              state.whiteboardTool === 'hand'
            }
            zoomOnScroll={
              state.toolbarMode === 'edit' ||
              state.whiteboardTool === 'select' ||
              state.whiteboardTool === 'hand'
            }
            panActivationKeyCode={
              state.toolbarMode === 'edit' ||
              state.whiteboardTool === 'select' ||
              state.whiteboardTool === 'hand'
                ? 'Space'
                : null
            }
            nodesDraggable={
              state.toolbarMode === 'edit' || state.whiteboardTool === 'select'
            }
            nodesConnectable={
              state.toolbarMode === 'edit' || state.whiteboardTool === 'select'
            }
            elementsSelectable={
              state.toolbarMode === 'edit' || state.whiteboardTool === 'select'
            }
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
            <Panel
              position="top-center"
              className="pointer-events-auto"
              style={{ zIndex: 1010 }}
            >
              <TopCanvasToolbar
                mode={state.toolbarMode}
                navigationTool={state.navigationTool}
                onChangeNavigationTool={(tool: string) =>
                  state.setNavigationTool(tool as any)
                }
                keepToolActive={state.keepToolActive}
                onToggleKeepToolActive={(value: boolean) =>
                  state.setKeepToolActive(value)
                }
                drawActiveTool={state.drawActiveTool}
                onSetDrawTool={handleSetDrawTool}
                whiteboardTool={state.whiteboardTool}
                onSetWhiteboardTool={(tool: string) => {
                  console.log('🎨 Whiteboard tool changed to:', tool);
                  // Ensure the tool is a valid WhiteboardTool
                  const validTools = [
                    'select',
                    'hand',
                    'eraser',
                    'lasso',
                    'rectangle',
                    'freehand',
                  ] as const;
                  if (validTools.includes(tool as any)) {
                    state.setWhiteboardTool(tool as WhiteboardTool);
                  } else {
                    console.warn('Invalid whiteboard tool:', tool);
                  }
                }}
                onOpenFilters={events.handleOpenFilters}
                onAddEvidence={events.handleAddEvidence}
                onApplyLayout={events.handleApplyLayout}
                currentLayoutDirection={state.currentLayoutDirection}
                onAddCustomNode={handleAddCustomNode}
              />
            </Panel>

            {/* Operative control panel - top-left - edit mode + toggled on */}
            {state.toolbarMode === 'edit' && showOperatorPanel && (
              <Panel position="top-left">
                <div className="w-80 max-h-[70vh] overflow-auto bg-background/90 backdrop-blur border rounded-lg shadow-lg">
                  <ControlPanel
                    operatorNodes={
                      nodes.filter((n) => n.type === 'operatorNode') as any
                    }
                    onUpdateNode={(nodeId, updates) => {
                      // Persist to the real operator node (useCanvasNodesStore),
                      // not the dead state.extraNodes array.
                      const target = canvasNodes.find((n) => n.id === nodeId);
                      if (target) {
                        updateCanvasNode(nodeId, {
                          data: { ...(target.data || {}), ...updates },
                        });
                      }
                    }}
                    onBulkUpdate={(updates) => {
                      // Apply to every real operator node and persist.
                      canvasNodes
                        .filter((n) => n.nodeType === 'operatorNode')
                        .forEach((n) =>
                          updateCanvasNode(n.id, {
                            data: { ...(n.data || {}), ...updates },
                          })
                        );
                    }}
                    onSimulate={() => {
                      console.log('Simulate operative nodes');
                    }}
                    isSimulating={false}
                  />
                </div>
              </Panel>
            )}

            {/* Tools toggle (top-right) — opens the operator control panel */}
            {state.toolbarMode === 'edit' && (
              <Panel position="top-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowOperatorPanel((v) => !v)}
                  className="h-8 gap-1.5 border bg-background/90 shadow-sm backdrop-blur"
                  title={showOperatorPanel ? 'Hide tools' : 'Show tools'}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {showOperatorPanel ? 'Hide tools' : 'Tools'}
                </Button>
              </Panel>
            )}

            {/* Selection Panel - Only show in edit mode */}
            {state.toolbarMode === 'edit' && (
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
            )}

            {/* React Flow Whiteboard Tools - Only render the active tool */}
            {state.toolbarMode === 'draw' && (
              <>
                {state.whiteboardTool === 'eraser' && (
                  <EraseToolComponent
                    isActive={true}
                    onErase={(nodeIds, edgeIds) => {
                      console.log('Erased items:', { nodeIds, edgeIds });
                    }}
                  />
                )}

                {state.whiteboardTool === 'lasso' && (
                  <LassoSelectionComponent
                    isActive={true}
                    partial={state.whiteboardPartialSelection}
                    onSelection={(nodeIds, edgeIds) => {
                      console.log('Lasso selected items:', {
                        nodeIds,
                        edgeIds,
                      });
                      if (nodeIds.length > 0 || edgeIds.length > 0) {
                        console.log('✅ Lasso selection successful!');
                      } else {
                        console.log('ℹ️ No items selected by lasso');
                      }
                    }}
                  />
                )}

                {state.whiteboardTool === 'rectangle' && (
                  <RectangleToolComponent
                    isActive={true}
                    onRectangleCreate={(rectangle) => {
                      console.log('✅ Rectangle created:', rectangle);
                    }}
                  />
                )}

                {state.whiteboardTool === 'freehand' && (
                  <FreehandDrawComponent
                    isActive={true}
                    brushSize={state.whiteboardBrushSize}
                    brushColor={state.whiteboardBrushColor}
                    onPathCreate={(path) => {
                      console.log('Created freehand path:', path);
                    }}
                  />
                )}
              </>
            )}

            {/* Debug Panels */}
            <CanvasDebugPanels
              state={state}
              selectedNodeIds={selectedNodeIds}
              canvas={canvas}
              isDevelopment={isDevelopment}
            />
          </ReactFlow>
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
