// @ts-nocheck
// TODO(type-debt): pre-existing type errors quarantined when strict type-checking
// was enabled. See docs/architecture/TYPE_CHECK_DEBT.md. Fix the errors and remove
// this directive — do not add new code here assuming it is type-checked.
import {
  applyNodeChanges,
  Background,
  ConnectionMode,
  Controls,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  SelectionMode,
  useReactFlow,
  type Connection,
  type NodeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Eye } from 'lucide-react';

// Extracted utilities and hooks
import { useCanvasNodesStore } from '@/features/canvas/stores/useCanvasNodesStore';
import { useNewNodeTypesStore } from '@/features/canvas/stores/useNewNodeTypesStore';
import { useEvidenceStore } from '@/features/evidence/stores/useEvidenceStore';
import { useAppStore, useCanvasStore } from '@/lib/stores';
import { useCanvasHeader } from '@/shared/contexts/CanvasHeaderContext';
import { PortalContainerProvider } from '@/shared/contexts/PortalContainerContext';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import {
  getProjectById,
  mergeProjectSettings,
} from '@/shared/lib/supabase/services/projects';
import {
  getMetricValuesByMetricIds,
  getTrackedMetricsByIds,
} from '@/shared/lib/supabase/services/trackedMetrics';
import type { MetricCard } from '@/shared/types';
import { listConnections } from '@/shared/lib/supabase/services/sourceConnections';
import { findOrphanedSourceBindings } from '@/features/canvas/utils/sourceResolver';
import {
  broadcastCanvasChange,
  registerExtraEdgesApply,
} from '@/features/canvas/realtime/canvasSyncChannel';
import { useAlertRulesStore } from '@/features/canvas/stores/useAlertRulesStore';
import { useCatalogRealtime } from '@/features/canvas/realtime/useCatalogRealtime';
import { TimeTravelControl } from '@/features/canvas/components/TimeTravelControl';
import { useTimeTravelStore } from '@/features/canvas/stores/useTimeTravelStore';
import { useCanvasPermission } from '@/features/canvas/hooks/useCanvasPermission';
import { CatalogMetricPicker } from '@/features/catalog/components/CatalogMetricPicker';
import { CanvasExportMenu } from '@/features/canvas/components/export/CanvasExportMenu';
import {
  getAuthenticatedClient,
  whenAuthenticatedClientReady,
} from '@/shared/utils/authenticatedClient';
import { runPipeline } from '@/features/canvas/utils/runSimulation';
import { normalizeOperatorData } from '@/features/canvas/utils/operatorMigration';
import {
  addInput,
  deriveInputsFromEdges,
  removeInputBySource,
} from '@/features/canvas/utils/operatorInputs';
import { useLivePreview } from '@/features/canvas/hooks/useLivePreview';
import { useOperatorPreviewStore } from '@/features/canvas/stores/useOperatorPreviewStore';
import { useCanvasActions } from '@/features/canvas/hooks/useCanvasActions';
import { useCanvasHistoryStore } from '@/features/canvas/stores/useCanvasHistoryStore';
import { toast } from 'sonner';
import { useConfirm } from '@/shared/components/ConfirmDialog';
import { type LayoutDirection } from '@/shared/utils/autoLayout';
import { elkLayout } from '@/shared/utils/elkLayout';
import {
  canConnect,
  handleNodeConnection,
} from '@/shared/utils/edgeConnectionHandler';
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
  convertToNode,
  edgeTypes,
  handlesForDirection,
  nodeTypes,
} from '@/shared/utils/canvasConverters';

// Extracted layout components
import CanvasDebugPanels from '@/features/canvas/components/layout/CanvasDebugPanels';
import CanvasModals from '@/features/canvas/components/layout/CanvasModals';

// Core components
import SelectionPanel from '@/features/canvas/components/grouping/SelectionPanel';
import OffscreenNodeIndicator from '@/features/canvas/components/wayfinding/OffscreenNodeIndicator';
import ControlPanel from '@/features/canvas/components/left-sidepanel/ControlPanel';
import GroupsPanel from '@/features/canvas/components/left-sidepanel/GroupsPanel';
import TopCanvasToolbar from '@/features/canvas/components/mini-control/TopCanvasToolbar';
import QuickSearchCommand from '@/features/canvas/components/search/QuickSearchCommand';
import {
  EraseToolComponent,
  FreehandDrawComponent,
  LassoSelectionComponent,
  RectangleToolComponent,
  type WhiteboardTool,
  type FreehandDrawing,
} from '@/features/canvas/components/whiteboard';
import { generateUUID } from '@/shared/utils/validation';
import { getViewportCenterPosition } from '@/features/canvas/utils/viewportCenter';

// Auto-save and realtime hooks
import { useAutoSave } from '@/shared/hooks/useAutoSave';
import { useCanvasRealtime } from '@/shared/hooks/useCanvasRealtime';
import { CanvasCursorsLayer } from '@/features/canvas/realtime/CanvasCursorsLayer';
import { useUser } from '@clerk/react-router';
import { createLogger } from '@/shared/utils/logger';

const log = createLogger('canvas');

function CanvasPageInner() {
  const { canvasId } = useParams();
  const supabaseClient = useClerkSupabase();
  const isDevelopment = import.meta.env.DEV;

  // Initialize state management
  const state = useCanvasPageState();
  const { setHeaderInfo } = useCanvasHeader();
  const confirm = useConfirm();

  // Operator/tools control panel is hidden by default; toggled from the right.
  const [showOperatorPanel, setShowOperatorPanel] = useState(false);
  // Run pipeline in-flight flag + last-run summary + selected operator + period.
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedOperatorId, setSelectedOperatorId] = useState<string | null>(
    null
  );
  const [lastRun, setLastRun] = useState<{
    changes: any[];
    warnings: string[];
  } | null>(null);
  const [globalPeriod, setGlobalPeriod] = useState(() =>
    new Date().toISOString().slice(0, 7)
  );
  // Each canvas starts in "live" view — reset any time-travel from a prior canvas.
  useEffect(() => {
    useTimeTravelStore.getState().reset();
  }, [canvasId]);
  // Groups side list + focus mode (grouping redesign).
  const [showGroupsPanel, setShowGroupsPanel] = useState(false);
  const [focusedGroupId, setFocusedGroupId] = useState<string | null>(null);
  // ELK-routed edge polylines keyed by edge id, produced by the last auto-layout
  // so DynamicEdge can draw the no-overlap orthogonal channel ELK reserved.
  const [routedEdgePoints, setRoutedEdgePoints] = useState<
    Record<string, { x: number; y: number }[]>
  >({});
  // Guards the evidence → settings save so it only runs after this canvas's
  // evidence has been hydrated (never persists stale localStorage evidence).
  const evidenceHydratedFor = useRef<string | null>(null);

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
  const updateEvidence = useEvidenceStore((s) => s.updateEvidence);
  const deleteEvidence = useEvidenceStore((s) => s.deleteEvidence);

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
      log.debug(
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
      editableTitle: true,
      actions: <TimeTravelControl />,
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
          log.debug('🔄 Header mode change:', mode);
          state.setToolbarMode(mode);

          if (mode === 'edit') {
            canvasMachine.switchToPractical();
            // Reset to select tool when switching to edit mode
            state.setWhiteboardTool('select');
          } else {
            canvasMachine.switchToDesign();
            // Don't auto-set drawing tool - let user choose
            log.debug('🎨 Switched to draw mode');
          }
        },
      },
    };

    log.debug('🎯 Setting header info:', headerData);
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
  const { user: clerkUser } = useUser();
  const me = useMemo(
    () =>
      clerkUser
        ? {
            userId: clerkUser.id,
            name: clerkUser.fullName || clerkUser.firstName || 'Someone',
            avatar: clerkUser.imageUrl,
          }
        : null,
    [clerkUser]
  );
  const { sendCursor } = useCanvasRealtime({
    canvasId: currentCanvasId || '',
    supabaseClient,
    me,
  });
  // Live cross-canvas catalog propagation (metric_values / tracked_metrics).
  useCatalogRealtime(currentCanvasId, supabaseClient);

  // Effective permission on this canvas — gates edit affordances so viewers/
  // commenters don't get an editor whose writes silently fail at RLS.
  const permission = useCanvasPermission(currentCanvasId);
  const canEdit = permission.canEdit;

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
        log.debug('🔄 Loading canvas data for:', canvasId);

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

        // Wait for the Clerk-authenticated client instead of throwing on the
        // first render before AuthenticatedSupabaseProvider has set it (the
        // "Authenticated client not available" race). Same pattern as
        // initializeProjects — gates the load on auth readiness.
        const client = supabaseClient || (await whenAuthenticatedClientReady());
        const projectData = await getProjectById(canvasId, client);

        if (projectData) {
          log.debug('✅ Canvas data loaded:', {
            nodes: projectData.nodes?.length || 0,
            edges: projectData.edges?.length || 0,
            groups: projectData.groups?.length || 0,
          });
          loadCanvas(projectData);

          // Phase B: hydrate persisted data-flow / reference edges (operator
          // pipeline) from projects.settings.dataFlowEdges into the in-memory
          // extraEdges array so the pipeline survives reload.
          const persistedDataFlowEdges =
            (projectData as any).settings?.dataFlowEdges;
          state.setExtraEdges(
            Array.isArray(persistedDataFlowEdges) ? persistedDataFlowEdges : []
          );

          // Evidence persistence: hydrate this project's evidence from
          // projects.settings.evidence (jsonb) into the evidence store, scoping
          // it to the current project. Gates the debounced save below.
          const persistedEvidence = (projectData as any).settings?.evidence;
          useEvidenceStore.setState({
            evidence: Array.isArray(persistedEvidence) ? persistedEvidence : [],
          });
          evidenceHydratedFor.current = canvasId;

          // Read-share: cards that reference a catalogued Tracked Metric read
          // BOTH their series (from metric_values) AND their definition
          // (name/formula from tracked_metrics) from the shared catalog, so the
          // same metric shows the same numbers and definition on every canvas.
          // The catalog is the single source of truth for referenced cards.
          try {
            const trackedCards = (projectData.nodes || []).filter(
              (n: any) => n.trackedMetricId
            );
            if (trackedCards.length) {
              const ids = [
                ...new Set(
                  trackedCards.map((c: any) => c.trackedMetricId as string)
                ),
              ];
              const [byMetric, defs] = await Promise.all([
                getMetricValuesByMetricIds(ids, client),
                getTrackedMetricsByIds(ids, client),
              ]);
              for (const card of trackedCards) {
                const metricId = (card as any).trackedMetricId as string;
                const series = byMetric[metricId];
                const def = defs[metricId];
                const updates: Partial<MetricCard> = {};
                if (series && series.length) updates.data = series;
                if (def) {
                  if (def.name && def.name !== card.title)
                    updates.title = def.name;
                  if ((def.formula ?? undefined) !== card.formula)
                    updates.formula = def.formula ?? undefined;
                }
                if (Object.keys(updates).length) {
                  useCanvasStore.getState().updateNode(card.id, updates);
                }
              }
            }
          } catch (err) {
            console.error('❌ Failed to hydrate tracked-metric cards:', err);
          }

          // Load canvas nodes for this project
          try {
            await loadCanvasNodes(canvasId);
            log.debug('✅ Canvas nodes loaded');
          } catch (error) {
            console.error('❌ Error loading canvas nodes:', error);
          }

          // Load alert rules for the project so metric cards can show a
          // monitored/breached badge (one query, not per-card).
          if (client) {
            void useAlertRulesStore
              .getState()
              .loadForProject(canvasId, client)
              .catch(() => {});
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
  const {
    getViewport,
    getNodes,
    getEdges,
    setNodes,
    fitView,
    screenToFlowPosition,
  } = useReactFlow() as any;

  // Auto-layout handler
  const handleApplyLayout = useCallback(
    async (direction?: LayoutDirection) => {
      log.debug(
        '🔄 Applying auto-layout with direction:',
        direction || state.currentLayoutDirection
      );

      const currentNodes = getNodes();
      const currentEdges = getEdges();

      if (!currentNodes || currentNodes.length === 0) {
        log.debug('⚠️ No nodes to layout');
        return;
      }

      const layoutDirection =
        direction || (state.currentLayoutDirection as LayoutDirection) || 'TB';

      try {
        // ELK 'layered' layout with ORTHOGONAL edge routing: positions nodes as
        // a tree AND returns routed edge channels so edges don't overlap. The
        // routed points feed DynamicEdge via the edges memo.
        const { nodes: layoutedFlow, edgePoints } = await elkLayout(
          currentNodes,
          currentEdges,
          { direction: layoutDirection }
        );

        setRoutedEdgePoints(edgePoints);
        setNodes(layoutedFlow);

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

  // ── Grouping redesign: focus mode + group CRUD (driven by GroupsPanel) ──

  // Focus a group: dim everything else (handled in the nodes/edges memos) and
  // fit the view to the group's members wherever they sit in the tree.
  const handleFocusGroup = useCallback(
    (groupId: string) => {
      const group = (canvas?.groups || []).find((g) => g.id === groupId);
      if (!group) return;
      setFocusedGroupId(groupId);
      const memberIds = new Set(group.nodeIds || []);
      setTimeout(() => {
        const toFit = getNodes().filter((n) => memberIds.has(n.id));
        if (toFit.length > 0) {
          fitView({ nodes: toFit as any, padding: 0.35, duration: 600 });
        }
      }, 60);
    },
    [canvas?.groups, getNodes, fitView]
  );

  const handleClearFocus = useCallback(() => setFocusedGroupId(null), []);

  const handleAddSelectedToGroup = useCallback(
    (groupId: string) => {
      const group = (canvas?.groups || []).find((g) => g.id === groupId);
      if (!group || selectedNodeIds.length === 0) return;
      const next = Array.from(
        new Set([...(group.nodeIds || []), ...selectedNodeIds])
      );
      void useCanvasStore.getState().updateGroup(groupId, { nodeIds: next });
      toast.success(`Added ${selectedNodeIds.length} to "${group.name}"`);
    },
    [canvas?.groups, selectedNodeIds]
  );

  const handleRemoveSelectedFromGroup = useCallback(
    (groupId: string) => {
      const group = (canvas?.groups || []).find((g) => g.id === groupId);
      if (!group || selectedNodeIds.length === 0) return;
      const next = (group.nodeIds || []).filter(
        (id) => !selectedNodeIds.includes(id)
      );
      void useCanvasStore.getState().updateGroup(groupId, { nodeIds: next });
      toast.success(`Removed from "${group.name}"`);
    },
    [canvas?.groups, selectedNodeIds]
  );

  const handleRenameGroup = useCallback((groupId: string, name: string) => {
    void useCanvasStore.getState().updateGroup(groupId, { name });
  }, []);

  const handleRecolorGroup = useCallback((groupId: string, color: string) => {
    void useCanvasStore.getState().updateGroup(groupId, { color });
  }, []);

  const handleDeleteGroup = useCallback(
    async (groupId: string) => {
      const group = (canvas?.groups || []).find((g) => g.id === groupId);
      const name = group?.name || 'this group';
      const confirmed = await confirm({
        title: `Delete "${name}"?`,
        description: 'The cards inside are kept.',
        actionLabel: 'Delete Group',
        destructive: true,
      });
      if (!confirmed) return;
      setFocusedGroupId((cur) => (cur === groupId ? null : cur));
      void useCanvasStore.getState().deleteGroup(groupId);
    },
    [canvas?.groups, confirm]
  );

  // Esc exits focus mode.
  useEffect(() => {
    if (!focusedGroupId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFocusedGroupId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [focusedGroupId]);

  // Create stable event handlers to prevent circular dependencies
  // Depend on the concrete (stable) useState setters, NOT the whole `state`
  // object — `state` from useCanvasPageState is a fresh object every render, so
  // `[state]` made these "stable" handlers churn each render, rebuilding the
  // `nodes` memo and feeding React Flow new nodes every render (React #185 loop).
  const stableHandleOpenSettingsSheet = useCallback(
    (nodeId: string) => {
      log.debug('🔧 Opening settings sheet for node:', nodeId);
      state.setIsSettingsSheetOpen(true);
      state.setSettingsCardId?.(nodeId);
    },
    [state.setIsSettingsSheetOpen, state.setSettingsCardId]
  );

  const stableHandleSwitchToCard = useCallback(
    (nodeId: string, tab?: string) => {
      log.debug('🔧 Switching to card:', nodeId, 'tab:', tab);
      state.setIsSettingsSheetOpen(true);
      state.setSettingsCardId?.(nodeId);
      if (tab) {
        state.setSettingsInitialTab?.(tab);
      }
    },
    [
      state.setIsSettingsSheetOpen,
      state.setSettingsCardId,
      state.setSettingsInitialTab,
    ]
  );

  const stableHandleToggleCollapse = useCallback((groupId: string) => {
    log.debug('📁 Toggle collapse for group:', groupId);
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
      log.debug('📏 Update group size:', groupId, size);
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
        () => log.debug('Node clicked:', card.id),
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
        updateEvidence,
        deleteEvidence,
        selectedNodeIds
      )
    );

    // Grouping redesign: the on-canvas group frame is gone. Group data still
    // lives in canvas.groups (used by the Groups side panel + dashboard scope);
    // it just no longer renders as a rectangle node here.
    const allNodes = [
      ...convertedMetricCardNodes,
      ...convertedEvidenceNodes,
      ...convertedPersistedCanvasNodes,
      ...convertedNewNodeTypes,
      // Only include temporary nodes if they exist (for immediate UI feedback)
      ...(temporaryExtraNodes.length > 0 ? temporaryExtraNodes : []),
    ];

    // Focus mode: dim every node that isn't a member of the focused group to
    // faint context (members stay bright). Edges are dimmed in the edges memo.
    if (focusedGroupId) {
      const fg = (canvas?.groups || []).find((g) => g.id === focusedGroupId);
      const members = new Set(fg?.nodeIds || []);
      return allNodes.map((n) =>
        members.has(n.id)
          ? n
          : {
              ...n,
              className: [(n as any).className, 'rf-node-dimmed']
                .filter(Boolean)
                .join(' '),
            }
      );
    }

    return allNodes;
  }, [
    canvasId,
    canvas?.nodes,
    canvas?.groups,
    focusedGroupId,
    evidenceList,
    updateEvidence,
    deleteEvidence,
    canvasNodes, // Unified canvas nodes from Zustand store
    newNodes, // New node types from Zustand store
    temporaryExtraNodes, // Only temporary fallback nodes
    selectedNodeIds,
    state.isSettingsSheetOpen,
    stableEvents,
  ]);

  // Keep the latest composed nodes reachable from the once-per-canvas reconcile
  // effect below without making it re-run on every node change (e.g. drag).
  const latestNodesRef = useRef(nodes);
  latestNodesRef.current = nodes;

  // One-time per canvas: flag warehouse source nodes whose connection has been
  // removed as stale, so the canvas shows a "disconnected" badge proactively.
  // The node keeps its last persisted series (see findOrphanedSourceBindings) —
  // data is never silently zeroed; only the badge is added.
  const reconciledCanvasRef = useRef<string | null>(null);
  useEffect(() => {
    if (!canvasId || !supabaseClient) return;
    if (reconciledCanvasRef.current === canvasId) return;

    const warehouseNodes = latestNodesRef.current.filter(
      (n) =>
        n.type === 'sourceNode' &&
        (n.data as any)?.config?.origin === 'warehouse'
    );
    if (warehouseNodes.length === 0) return; // nodes not loaded yet, or none to check

    reconciledCanvasRef.current = canvasId;
    let cancelled = false;
    (async () => {
      try {
        const conns = await listConnections(supabaseClient);
        if (cancelled) return;
        const liveIds = new Set(conns.map((c) => c.id));
        const orphans = findOrphanedSourceBindings(
          latestNodesRef.current as any,
          liveIds
        );
        for (const orphan of orphans) {
          await updateCanvasNode(orphan.id, { data: orphan.data } as any);
        }
        if (orphans.length > 0) {
          log.debug(
            `⚠️ Source reconcile: flagged ${orphans.length} node(s) with removed connections as stale`
          );
        }
      } catch (error) {
        console.error('❌ Failed to reconcile source bindings:', error);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [canvasId, supabaseClient, canvasNodes, updateCanvasNode]);

  const edges = useMemo(() => {
    const canvasEdges = canvas?.edges || [];
    const extraEdges = state.extraEdges || [];

    const layoutDirection =
      (state.currentLayoutDirection as LayoutDirection) || 'TB';
    const convertedCanvasEdges = canvasEdges.map((relationship) =>
      convertToEdge(
        relationship,
        events.handleOpenRelationshipSheet,
        events.handleSwitchToRelationship,
        state.isRelationshipSheetOpen,
        layoutDirection
      )
    );

    // Anchor data-flow (operative/reference) edges to the same direction-aware
    // handles relationship edges use, so source/operator/chart connections enter
    // and leave from the layout-appropriate side instead of one fixed handle.
    const dirHandles = handlesForDirection(layoutDirection);
    const extraEdgesAnchored = extraEdges.map((e: any) => ({
      ...e,
      sourceHandle: dirHandles.sourceHandle ?? e.sourceHandle,
      targetHandle: dirHandles.targetHandle ?? e.targetHandle,
    }));

    // Attach the ELK-routed polyline (from the last auto-layout) so DynamicEdge
    // draws the no-overlap orthogonal channel instead of a handle-to-handle
    // curve. Edges without a routed entry fall back to smoothstep.
    const allEdges = [...convertedCanvasEdges, ...extraEdgesAnchored].map((e) => {
      const pts = routedEdgePoints[e.id];
      return pts
        ? { ...e, data: { ...((e as any).data || {}), routedPoints: pts } }
        : e;
    });

    // Focus mode: dim any edge that isn't fully inside the focused group. Must
    // be done via className — DynamicEdge hardcodes its own path opacity, so an
    // inline edge style.opacity would be ignored.
    if (focusedGroupId) {
      const fg = (canvas?.groups || []).find((g) => g.id === focusedGroupId);
      const members = new Set(fg?.nodeIds || []);
      return allEdges.map((e) =>
        members.has(e.source) && members.has(e.target)
          ? e
          : {
              ...e,
              className: [(e as any).className, 'rf-edge-dimmed']
                .filter(Boolean)
                .join(' '),
            }
      );
    }

    return allEdges;
  }, [
    canvasId,
    routedEdgePoints,
    canvas?.edges,
    canvas?.groups,
    focusedGroupId,
    state.extraEdges,
    state.isRelationshipSheetOpen,
    state.currentLayoutDirection,
    events.handleOpenRelationshipSheet,
    events.handleSwitchToRelationship,
  ]);

  // Live preview: recompute the operator pipeline (no writes) whenever operator
  // config, card latest-values, or data-flow edges change. A primitive digest is
  // the effect trigger so display reads can't feed back into compute (loop-safe).
  const previewDigest = useMemo(() => {
    const ops = (canvasNodes || [])
      .filter((n) => n.nodeType === 'operatorNode')
      .map((n) => `${n.id}:${JSON.stringify(n.data)}`)
      .join('|');
    const cards = (canvas?.nodes || [])
      .map(
        (c) =>
          `${c.id}:${
            Array.isArray(c.data) && c.data.length
              ? c.data[c.data.length - 1].value
              : ''
          }`
      )
      .join('|');
    const e = (state.extraEdges || []).map((x: any) => x.id).join(',');
    return `${ops}#${cards}#${e}`;
  }, [canvasNodes, canvas?.nodes, state.extraEdges]);

  useLivePreview(state.extraEdges || [], previewDigest);
  const previewOperatorValues = useOperatorPreviewStore(
    (s) => s.operatorValues
  );

  // Clipboard / duplicate / delete + undo.
  const canvasActions = useCanvasActions(
    canvasId,
    useAppStore.getState().user?.id || 'anonymous'
  );

  // Reset undo history when switching canvases.
  useEffect(() => {
    useCanvasHistoryStore.getState().clear();
  }, [canvasId]);

  // Evidence persistence: debounce-save this project's evidence to
  // projects.settings.evidence. Gated on hydration so it never clobbers the
  // stored evidence with stale (pre-load) localStorage state.
  useEffect(() => {
    if (!canvasId || evidenceHydratedFor.current !== canvasId) return;
    const t = setTimeout(() => {
      // Skip (not throw) if the authed client isn't ready yet — the next
      // evidence change re-fires this debounced save.
      const client = supabaseClient || getAuthenticatedClient();
      if (!client) return;
      void mergeProjectSettings(
        canvasId,
        { evidence: evidenceList },
        client
      ).catch((err) =>
        console.error('❌ Failed to persist evidence:', err)
      );
    }, 600);
    return () => clearTimeout(t);
  }, [evidenceList, canvasId, supabaseClient]);

  // Keyboard: Esc clears selection; Ctrl/Cmd + C / V / D / Z (ignored while
  // typing in a field).
  useEffect(() => {
    const isEditable = (el: EventTarget | null) => {
      const n = el as HTMLElement | null;
      if (!n) return false;
      return (
        n.tagName === 'INPUT' ||
        n.tagName === 'TEXTAREA' ||
        n.tagName === 'SELECT' ||
        n.isContentEditable
      );
    };
    const onKey = (e: KeyboardEvent) => {
      if (isEditable(e.target)) return;
      // Esc → back to "nothing selected" (CVS-68).
      if (e.key === 'Escape') {
        const s = useCanvasStore.getState();
        if (s.selectedNodeIds.length || s.selectedEdgeIds.length) {
          s.clearSelection();
        }
        return;
      }
      // Shift+1 → fit view to content / recenter (CVS-30 wayfinding).
      if (e.shiftKey && e.code === 'Digit1') {
        e.preventDefault();
        fitView({ padding: 0.2, duration: 800 });
        return;
      }
      if (!(e.ctrlKey || e.metaKey)) return;
      const k = e.key.toLowerCase();
      if (k === 'c') canvasActions.copySelection();
      else if (k === 'v') canvasActions.paste();
      else if (k === 'd') {
        e.preventDefault();
        canvasActions.duplicateSelection();
      } else if (k === 'z') {
        e.preventDefault();
        if (e.shiftKey) canvasActions.redo();
        else canvasActions.undo();
      } else if (k === 'y') {
        e.preventDefault();
        canvasActions.redo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [canvasActions, fitView]);

  // Memoized filter options
  const availableFilterOptions = useMemo(() => {
    return getAvailableFilterOptions(canvas?.nodes || [], canvas?.edges || []);
  }, [canvas?.nodes, canvas?.edges]);

  // Enable shortcuts (simplified example)
  const enabledShortcuts = useMemo(() => [], []);

  // Mode change is now handled in the header toggle

  // Keep nodes in sync while dragging (controlled ReactFlow)
  // Set a node's position via the right store for its type (used by move undo).
  const applyNodePosition = useCallback(
    (type: string, id: string, position: { x: number; y: number }) => {
      if (type === 'metricCard')
        useCanvasStore.getState().updateNodePosition(id, position);
      else if (type === 'evidenceNode')
        useEvidenceStore.getState().updateEvidencePosition(id, position);
      else if (
        [
          'sourceNode',
          'chartNode',
          'operatorNode',
          'commentNode',
          'whiteboardNode',
        ].includes(type)
      )
        useCanvasNodesStore.getState().updateNodePosition(id, position);
      else if (
        ['valueNode', 'actionNode', 'hypothesisNode', 'metricNode'].includes(
          type
        )
      )
        useNewNodeTypesStore.getState().updateNewNode(id, { position });
    },
    []
  );

  // Snapshot the drag group's start positions so a drag becomes an undo entry.
  const dragStart = useRef<
    Record<string, { type: string; position: { x: number; y: number } }>
  >({});
  const handleNodeDragStart = useCallback(
    (_: any, node: any) => {
      const sel = new Set(useCanvasStore.getState().selectedNodeIds || []);
      const snap: Record<
        string,
        { type: string; position: { x: number; y: number } }
      > = {};
      for (const n of getNodes()) {
        if (n.id === node.id || sel.has(n.id)) {
          snap[n.id] = { type: n.type as string, position: { ...n.position } };
        }
      }
      dragStart.current = snap;
    },
    [getNodes]
  );

  // Push a group-aware Move entry (undo restores start, redo restores end) from
  // the dragStart snapshot vs the current positions. Shared by single-node and
  // multi-selection drag stop.
  const recordMoveUndo = useCallback(() => {
    const starts = dragStart.current;
    const ids = Object.keys(starts);
    if (!ids.length) return;
    const ends: Record<string, { x: number; y: number }> = {};
    for (const n of getNodes()) if (starts[n.id]) ends[n.id] = { ...n.position };
    const moved = ids
      .filter((id) => {
        const s = starts[id].position;
        const e = ends[id];
        return (
          e &&
          (Math.round(s.x) !== Math.round(e.x) ||
            Math.round(s.y) !== Math.round(e.y))
        );
      })
      .map((id) => ({
        id,
        type: starts[id].type,
        from: starts[id].position,
        to: ends[id],
      }));
    if (moved.length) {
      useCanvasHistoryStore.getState().push({
        label: `Move ${moved.length}`,
        undo: async () => {
          for (const m of moved) applyNodePosition(m.type, m.id, m.from);
        },
        redo: async () => {
          for (const m of moved) applyNodePosition(m.type, m.id, m.to);
        },
      });
    }
    dragStart.current = {};
  }, [getNodes, applyNodePosition]);

  // Multi-selection drag: React Flow fires these (not onNodeDrag) when dragging a
  // group of selected nodes. We must apply positions for the non-grabbed nodes
  // ourselves (they're controlled), then record one Move undo for the group.
  const handleSelectionDragStart = useCallback((_: any, dragNodes: any[]) => {
    const snap: Record<
      string,
      { type: string; position: { x: number; y: number } }
    > = {};
    for (const n of dragNodes)
      snap[n.id] = { type: n.type as string, position: { ...n.position } };
    dragStart.current = snap;
  }, []);

  const handleSelectionDrag = useCallback(
    (_: any, dragNodes: any[]) => {
      for (const n of dragNodes) applyNodePosition(n.type, n.id, n.position);
    },
    [applyNodePosition]
  );

  const handleSelectionDragStop = useCallback(
    (_: any, dragNodes: any[]) => {
      for (const n of dragNodes) applyNodePosition(n.type, n.id, n.position);
      // A bulk move invalidates ELK-routed channels; drop them all.
      setRoutedEdgePoints({});
      recordMoveUndo();
    },
    [applyNodePosition, recordMoveUndo]
  );

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
      // A moved node invalidates the ELK-routed channels of its incident edges —
      // drop those so they fall back to smoothstep until the next auto-layout.
      if (node?.id) {
        setRoutedEdgePoints((prev) => {
          if (Object.keys(prev).length === 0) return prev;
          const incident = new Set(
            [
              ...(canvas?.edges || []),
              ...((state.extraEdges || []) as any[]),
            ]
              .filter((e: any) => {
                const s = e.sourceId ?? e.source;
                const t = e.targetId ?? e.target;
                return s === node.id || t === node.id;
              })
              .map((e: any) => e.id)
          );
          if (incident.size === 0) return prev;
          const next: Record<string, { x: number; y: number }[]> = {};
          for (const [id, pts] of Object.entries(prev)) {
            if (!incident.has(id)) next[id] = pts;
          }
          return next;
        });
      }
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

        // Mirror the finished move to other sessions. Cards + persisted canvas
        // nodes have local-apply paths in applyRemoteCanvasChange; evidence/PRD
        // node families aren't synced yet.
        const moveFamily: 'card' | 'canvasNode' | null =
          node.type === 'metricCard'
            ? 'card'
            : [
                  'sourceNode',
                  'chartNode',
                  'operatorNode',
                  'commentNode',
                  'whiteboardNode',
                ].includes(node.type)
              ? 'canvasNode'
              : null;
        if (moveFamily) {
          broadcastCanvasChange({
            t: 'node:move',
            family: moveFamily,
            id: node.id,
            position: node.position,
          });
        }
      }

      // Record the move (group-aware) for undo/redo.
      recordMoveUndo();
    },
    [
      state,
      canvas?.edges,
      recordMoveUndo,
      updateEvidencePosition,
      updateCanvasNodePosition,
      updateNewNode,
    ]
  );

  // Phase B: persist data-flow / reference edges (operator pipeline) in
  // projects.settings.dataFlowEdges (jsonb) so they survive reload. The local
  // state.extraEdges array stays the in-memory source of truth.
  const persistDataFlowEdges = useCallback(
    (nextEdges: any[]) => {
      if (!canvasId) return;
      // Skip (not throw) if the authed client isn't ready yet — a later edge
      // change re-persists, and this previously threw synchronously past the
      // .catch during the auth-startup window.
      const client = supabaseClient || getAuthenticatedClient();
      if (!client) return;
      void mergeProjectSettings(
        canvasId,
        { dataFlowEdges: nextEdges },
        client
      ).catch((err) =>
        console.error('❌ Failed to persist data-flow edges:', err)
      );
    },
    [canvasId, supabaseClient]
  );

  // Enhanced edge connection handler
  // Phase B: resolve a node's display title (card title / source title / operator
  // label) for default input labels.
  const nodeTitleOf = useCallback(
    (nodeId: string): string => {
      const card = (canvas?.nodes || []).find((n) => n.id === nodeId);
      if (card) return card.title || 'Card';
      const cn = canvasNodes.find((n) => n.id === nodeId);
      if (cn)
        return (
          (cn.data as any)?.label ||
          (cn.data as any)?.title ||
          cn.title ||
          'Node'
        );
      return nodeId.slice(0, 8);
    },
    [canvas?.nodes, canvasNodes]
  );

  // Phase B: when a data-flow edge lands on an operator, bind the source as the
  // operator's next named input (a, b, c…), defaulting the label to the source's
  // title. Persisted on the operator's data.
  const bindOperatorInput = useCallback(
    (operatorId: string, sourceId: string, edgesForDerive: any[]) => {
      const op = canvasNodes.find((n) => n.id === operatorId);
      if (!op || op.nodeType !== 'operatorNode') return;
      const data = normalizeOperatorData(op.data as any);
      const baseInputs =
        data.inputs && data.inputs.length
          ? data.inputs
          : deriveInputsFromEdges(edgesForDerive, operatorId, nodeTitleOf);
      const nextInputs = addInput(baseInputs, sourceId, nodeTitleOf(sourceId));
      if (nextInputs === baseInputs && data.inputs) return; // already bound
      void updateCanvasNode(operatorId, {
        data: { ...data, inputs: nextInputs },
      });
    },
    [canvasNodes, nodeTitleOf, updateCanvasNode]
  );

  // When a data-flow edge lands on a chart node, add the source as one of the
  // chart's plotted series (data.seriesCardIds). Edge + picker converge here.
  const bindChartSeries = useCallback(
    (chartId: string, sourceId: string) => {
      const chart = canvasNodes.find((n) => n.id === chartId);
      if (!chart || chart.nodeType !== 'chartNode') return;
      const data = (chart.data || {}) as { seriesCardIds?: string[] };
      const current = data.seriesCardIds || [];
      if (current.includes(sourceId)) return; // already plotted
      void updateCanvasNode(chartId, {
        data: { ...data, seriesCardIds: [...current, sourceId] },
      });
    },
    [canvasNodes, updateCanvasNode]
  );

  // Sync React Flow's selection into the canvas store so grouping / the
  // selection panel / operator panel see it. (The store's selectNodes delegates
  // to a different store than the component reads, so set it directly here.)
  const handleSelectionChange = useCallback(
    ({ nodes: selNodes }: { nodes: { id: string; type?: string }[] }) => {
      const ids = selNodes.map((n) => n.id);
      const cur = useCanvasStore.getState().selectedNodeIds || [];
      const a = [...ids].sort().join(',');
      const b = [...cur].sort().join(',');
      if (a !== b) useCanvasStore.setState({ selectedNodeIds: ids });
      // Reflect a single selected operator in the contextual panel.
      if (ids.length === 1) {
        const only = selNodes[0];
        if (only?.type === 'operatorNode') setSelectedOperatorId(only.id);
      }
    },
    []
  );

  // Flattened edge list (relationship + data-flow/reference) used for cycle
  // detection by both the connect handler and the live isValidConnection check.
  const existingEdges = useMemo(
    () => [
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
    ],
    [canvas?.edges, state.extraEdges]
  );

  // Block invalid drags (wrong node types or cycle-forming) visually before drop.
  const isValidConnection = useCallback(
    (connection: Connection) => canConnect(connection, nodes, existingEdges),
    [nodes, existingEdges]
  );

  // Let the realtime layer apply remote data-flow/reference edge changes into
  // CanvasPage React state (these edges aren't in a store). A ref keeps the
  // getter current without re-registering on every extraEdges change.
  const latestExtraEdgesRef = useRef(state.extraEdges);
  latestExtraEdgesRef.current = state.extraEdges;
  useEffect(() => {
    registerExtraEdgesApply({
      get: () => (latestExtraEdgesRef.current || []) as any,
      set: (edges) => state.setExtraEdges(edges as any),
    });
    return () => registerExtraEdgesApply(null);
    // setExtraEdges is a stable useState setter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConnect = useCallback(
    (connection: Connection) => {
      log.debug('🔗 Enhanced connection handler triggered:', connection);

      // Use enhanced connection handler
      const result = handleNodeConnection(connection, {
        nodes,
        existingEdges,
        onCreateRelationship: async (relationshipData) => {
          try {
            const idsOf = () =>
              new Set(
                (useCanvasStore.getState().canvas?.edges || []).map((e) => e.id)
              );
            const before = idsOf();
            await useCanvasStore.getState().createEdge(relationshipData);
            const created = (
              useCanvasStore.getState().canvas?.edges || []
            ).find((e) => !before.has(e.id));
            if (created) {
              let currentId = created.id;
              useCanvasHistoryStore.getState().push({
                label: 'Add relationship',
                undo: async () =>
                  useCanvasStore.getState().persistEdgeDelete(currentId),
                redo: async () => {
                  const b2 = idsOf();
                  await useCanvasStore.getState().createEdge(relationshipData);
                  const c2 = (
                    useCanvasStore.getState().canvas?.edges || []
                  ).find((e) => !b2.has(e.id));
                  if (c2) currentId = c2.id;
                },
              });
            }
            log.debug('✅ Relationship edge created successfully');
          } catch (error) {
            console.error('❌ Failed to create relationship edge:', error);
          }
        },
        onCreateDataFlow: (edgeData) => {
          const prevEdges = state.extraEdges || [];
          const nextEdges = [...prevEdges, edgeData];
          state.setExtraEdges(nextEdges);
          persistDataFlowEdges(nextEdges);
          // If this edge feeds an operator, bind the source as a named input.
          bindOperatorInput(edgeData.target, edgeData.source, prevEdges);
          // If this edge feeds a chart, add the source as a plotted series.
          bindChartSeries(edgeData.target, edgeData.source);
          broadcastCanvasChange({ t: 'extraEdge:create', edge: edgeData });
          log.debug('✅ Data flow edge created + persisted');
        },
        onCreateReference: (edgeData) => {
          const nextEdges = [...(state.extraEdges || []), edgeData];
          state.setExtraEdges(nextEdges);
          persistDataFlowEdges(nextEdges);
          broadcastCanvasChange({ t: 'extraEdge:create', edge: edgeData });
          log.debug('✅ Reference edge created + persisted');
        },
      });

      if (!result.success) {
        console.error('❌ Connection failed:', result.error);
        toast.error(`Connection failed: ${result.error}`);
      }
    },
    [nodes, existingEdges, state, persistDataFlowEdges, bindOperatorInput]
  );

  // Persist a finished freehand stroke as a whiteboardNode (replaces the old
  // ephemeral addNodes path so drawings survive reload), with undo/redo.
  const handleFreehandCommit = useCallback(
    async (drawing: FreehandDrawing) => {
      const currentCanvas = useCanvasStore.getState().canvas;
      if (!currentCanvas?.id) return;
      const payload = {
        projectId: currentCanvas.id,
        nodeType: 'whiteboardNode' as const,
        title: 'Drawing',
        position: drawing.position,
        data: drawing.data,
        createdBy: useAppStore.getState().user?.id || 'anonymous',
      };
      try {
        const created = await createCanvasNode(payload as any);
        if (created?.id) {
          let currentId = created.id;
          useCanvasHistoryStore.getState().push({
            label: 'Add drawing',
            undo: async () =>
              useCanvasNodesStore.getState().deleteNode(currentId),
            redo: async () => {
              const re = await useCanvasNodesStore
                .getState()
                .createNode(payload as any);
              if (re?.id) currentId = re.id;
            },
          });
        }
      } catch (error) {
        console.error('❌ Failed to persist freehand drawing:', error);
      }
    },
    [createCanvasNode]
  );

  // Phase B: when data-flow / reference edges are deleted from the canvas, drop
  // them from state.extraEdges and re-persist. Relationship edges (not in
  // extraEdges) are untouched here — they're managed via the Relationship sheet.
  const handleEdgesDelete = useCallback(
    (deleted: Array<{ id: string }>) => {
      const current = state.extraEdges || [];
      const deletedIds = new Set(deleted.map((e) => e.id));
      const removed = current.filter((e: any) => deletedIds.has(e.id));
      const next = current.filter((e: any) => !deletedIds.has(e.id));
      if (next.length !== current.length) {
        state.setExtraEdges(next);
        persistDataFlowEdges(next);
        for (const e of removed) {
          broadcastCanvasChange({ t: 'extraEdge:delete', id: e.id });
        }
        // Drop the operator input bindings for any removed inbound-to-operator
        // edges (don't re-key the rest — that would break formulas).
        for (const e of removed) {
          const target = canvasNodes.find((n) => n.id === e.target);
          if (!target) continue;
          if (target.nodeType === 'operatorNode') {
            const data = normalizeOperatorData(target.data as any);
            const nextInputs = removeInputBySource(data.inputs || [], e.source);
            if (nextInputs !== (data.inputs || [])) {
              void updateCanvasNode(target.id, {
                data: { ...data, inputs: nextInputs },
              });
            }
          } else if (target.nodeType === 'chartNode') {
            // Drop only the just-removed edge's source; picker-added series stay.
            const data = (target.data || {}) as { seriesCardIds?: string[] };
            const current = data.seriesCardIds || [];
            if (current.includes(e.source)) {
              void updateCanvasNode(target.id, {
                data: {
                  ...data,
                  seriesCardIds: current.filter((id) => id !== e.source),
                },
              });
            }
          }
        }
        log.debug('✅ Data-flow edge(s) deleted + persisted');
      }

      // Relationship edges (canvas.edges): persist the delete and record an undo
      // that recreates them. (Previously the Delete key didn't remove these.)
      const rels = (canvas?.edges || []).filter((e) => deletedIds.has(e.id));
      if (rels.length) {
        for (const r of rels)
          void useCanvasStore.getState().persistEdgeDelete(r.id);
        let recreated: string[] = [];
        useCanvasHistoryStore.getState().push({
          label: `Delete ${rels.length} relationship(s)`,
          undo: async () => {
            recreated = [];
            for (const r of rels) {
              const before = new Set(
                (useCanvasStore.getState().canvas?.edges || []).map((e) => e.id)
              );
              const { id, createdAt, updatedAt, ...rest } = r as any;
              await useCanvasStore.getState().createEdge(rest);
              const c = (
                useCanvasStore.getState().canvas?.edges || []
              ).find((e) => !before.has(e.id));
              if (c) recreated.push(c.id);
            }
          },
          redo: async () => {
            for (const id of recreated)
              await useCanvasStore.getState().persistEdgeDelete(id);
            recreated = [];
          },
        });
      }
    },
    [
      state,
      persistDataFlowEdges,
      canvasNodes,
      updateCanvasNode,
      canvas?.edges,
    ]
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
      log.debug('🎨 Setting draw tool:', tool);
      state.setDrawActiveTool(tool);
      canvasMachine.setDesignTool(tool as any);

      // Also call the whiteboard setTool method if whiteboard is active
      if (state.whiteboardRef.current && state.isWhiteboardActive) {
        try {
          state.whiteboardRef.current.setTool(tool);
          log.debug('✅ Whiteboard tool set to:', tool);
        } catch (error) {
          console.warn('⚠️ Failed to set whiteboard tool:', error);
        }
      }
    },
    [state, canvasMachine]
  );

  // ── Operator tooling handlers (Phase D/F) ──
  const handleUpdateOperator = useCallback(
    (opId: string, partial: Record<string, any>) => {
      const op = canvasNodes.find((n) => n.id === opId);
      if (!op) return;
      const data = normalizeOperatorData(op.data as any);
      void updateCanvasNode(opId, { data: { ...data, ...partial } });
    },
    [canvasNodes, updateCanvasNode]
  );

  const handleBulkUpdateOperators = useCallback(
    (partial: Record<string, any>) => {
      canvasNodes
        .filter((n) => n.nodeType === 'operatorNode')
        .forEach((n) => {
          const data = normalizeOperatorData(n.data as any);
          void updateCanvasNode(n.id, { data: { ...data, ...partial } });
        });
    },
    [canvasNodes, updateCanvasNode]
  );

  const handleRunPipeline = useCallback(async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    try {
      const dfEdges = (state.extraEdges || []).filter(
        (e: any) => e?.source && e?.target
      );
      const { updated, warnings, changes } = await runPipeline(dfEdges, {
        period: globalPeriod,
      });
      setLastRun({ changes, warnings });
      if (updated > 0)
        toast.success(`${updated} card${updated === 1 ? '' : 's'} updated`);
      else toast.info('No cards updated — wire an operator to an output card.');
      if (warnings.length) toast.warning(warnings[0]);
    } catch (err) {
      toast.error(
        `Run failed: ${err instanceof Error ? err.message : 'unknown error'}`
      );
    } finally {
      setIsSimulating(false);
    }
  }, [isSimulating, state.extraEdges, globalPeriod]);

  // Add-from-catalog picker (place a tracked metric on this canvas).
  const [catalogPickerOpen, setCatalogPickerOpen] = useState(false);
  const [catalogPickerPos, setCatalogPickerPos] = useState({ x: 200, y: 200 });
  const handleAddFromCatalog = useCallback(
    (position?: { x: number; y: number }) => {
      let pos = position;
      if (!pos) {
        try {
          pos = screenToFlowPosition({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
          });
        } catch {
          pos = { x: 200, y: 200 };
        }
      }
      setCatalogPickerPos(pos);
      setCatalogPickerOpen(true);
    },
    [screenToFlowPosition]
  );

  const handleAddCustomNode = useCallback(
    async (
      type:
        | 'sourceNode'
        | 'chartNode'
        | 'operatorNode'
        | 'whiteboardNode'
        | 'commentNode',
      position?: { x: number; y: number }
    ) => {
      const currentCanvas = useCanvasStore.getState().canvas;
      if (!currentCanvas?.id) {
        console.error('❌ No canvas loaded, cannot add node');
        return;
      }

      // Drop the node at the center of what the user is currently viewing.
      const basePosition =
        position ??
        getViewportCenterPosition(
          screenToFlowPosition,
          state.reactFlowRef.current
        );
      const nodeData: any = {};

      if (type === 'operatorNode') {
        nodeData.label = 'Operator';
        nodeData.operationType = 'formula';
        nodeData.isActive = true;
        nodeData.formula = 'x';
        nodeData.inputs = [];
      }

      if (type === 'commentNode') {
        nodeData.title = 'Comment';
      }

      if (type === 'chartNode') {
        nodeData.title = 'Chart';
        nodeData.chartType = 'area';
        nodeData.seriesCardIds = [];
        nodeData.showLegend = true;
      }

      try {
        // UNIFIED: Create the canvas node in the database and store
        const created = await createCanvasNode({
          projectId: currentCanvas.id,
          nodeType: type,
          title: type === 'commentNode' ? 'Comment' : type.replace('Node', ''),
          position: basePosition,
          data: nodeData,
          createdBy: useAppStore.getState().user?.id || 'anonymous',
        });

        log.debug(`✅ Created ${type} node successfully`);
        // Record undo (Ctrl+Z removes it) + redo (re-creates it).
        if (created?.id) {
          let currentId = created.id;
          const payload = {
            projectId: currentCanvas.id,
            nodeType: type,
            title:
              type === 'commentNode' ? 'Comment' : type.replace('Node', ''),
            position: basePosition,
            data: nodeData,
            createdBy: useAppStore.getState().user?.id || 'anonymous',
          };
          useCanvasHistoryStore.getState().push({
            label: `Add ${type}`,
            undo: async () =>
              useCanvasNodesStore.getState().deleteNode(currentId),
            redo: async () => {
              const re = await useCanvasNodesStore
                .getState()
                .createNode(payload as any);
              if (re?.id) currentId = re.id;
            },
          });
        }
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
    [createCanvasNode, state, screenToFlowPosition]
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
            // Loose mode: every handle works as BOTH source and target, so a
            // connection can start/end on any side (top/bottom/left/right) — not
            // just bottom/right-out and top/left-in. The connection handler then
            // normalizes direction (it swaps to the valid rule orientation).
            connectionMode={ConnectionMode.Loose}
            style={{
              cursor: state.whiteboardTool === 'hand' ? 'grab' : 'default',
            }}
            onPaneClick={events.handlePaneClick}
            onNodesChange={handleNodesChange}
            onNodeDragStart={handleNodeDragStart}
            onNodeDrag={handleNodeDrag}
            onNodeDragStop={handleNodeDragStop}
            onSelectionDragStart={handleSelectionDragStart}
            onSelectionDrag={handleSelectionDrag}
            onSelectionDragStop={handleSelectionDragStop}
            onNodeClick={(_, node) => {
              // Selecting an operator drives the contextual Operator tab.
              if (node.type === 'operatorNode') setSelectedOperatorId(node.id);
            }}
            onNodeDoubleClick={(_, node) => {
              log.debug('🔧 Node double-clicked:', node.id, node.type);
              // Metric cards (incl. Action/Value/Hypothesis, all persisted as
              // metricCard) open the category-routed detail panel. Utility nodes
              // open their OWN config instead of the generic sheet.
              if (node.type === 'metricCard') {
                events.handleOpenSettingsSheet(node.id);
              } else if (
                node.type === 'sourceNode' ||
                node.type === 'chartNode'
              ) {
                window.dispatchEvent(
                  new CustomEvent('node:open-config', {
                    detail: { id: node.id },
                  })
                );
              }
              // operator / whiteboard / comment / group: handled inline / by
              // selection — no generic sheet.
            }}
            onEdgeDoubleClick={(_, edge) => {
              log.debug('🔗 Edge double-clicked:', edge.id);
              events.handleOpenRelationshipSheet(edge.id);
            }}
            onConnect={handleConnect}
            isValidConnection={isValidConnection}
            onNodesDelete={(deleted) =>
              void canvasActions.deleteByIds(deleted.map((n) => n.id))
            }
            onEdgesDelete={handleEdgesDelete}
            // Navigation: in edit mode, left-drag is a SELECTION box (marquee)
            // and pan is on middle/right mouse or by holding Space — unless the
            // Hand tool is active, where left-drag pans.
            onSelectionChange={handleSelectionChange}
            selectionOnDrag={
              state.toolbarMode === 'edit' && state.navigationTool !== 'hand'
            }
            selectionMode={SelectionMode.Partial}
            panOnDrag={
              state.toolbarMode === 'edit'
                ? state.navigationTool === 'hand'
                  ? true // Hand tool: left-drag pans
                  : [1, 2] // Select tool: middle/right pan; left-drag selects
                : state.whiteboardTool === 'select' ||
                    state.whiteboardTool === 'hand'
                  ? [1, 2]
                  : false // Draw mode with an active drawing tool
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
              canEdit &&
              (state.toolbarMode === 'edit' ||
                state.whiteboardTool === 'select')
            }
            nodesConnectable={
              canEdit &&
              (state.toolbarMode === 'edit' ||
                state.whiteboardTool === 'select')
            }
            elementsSelectable={
              state.toolbarMode === 'edit' || state.whiteboardTool === 'select'
            }
            zoomOnPinch={true}
            minZoom={0.05}
            maxZoom={3}
            snapToGrid={true}
            snapGrid={[15, 15]}
            // Marquee needs no modifier (selectionOnDrag); Shift adds to an
            // existing selection / click-selects additional nodes.
            multiSelectionKeyCode={['Shift', 'Meta', 'Control']}
            selectionKeyCode={null}
            deleteKeyCode={canEdit ? ['Backspace', 'Delete'] : null}
            onMoveEnd={(_, viewport) =>
              viewportSync.syncFromReactFlow(viewport)
            }
          >
            <Background />
            <Controls />
            <OffscreenNodeIndicator />
            <CanvasCursorsLayer sendCursor={sendCursor} />

            {/* Read-only / comment-only banner for restricted collaborators. */}
            {!permission.loading && !canEdit && (
              <Panel position="top-center">
                <div className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 shadow-sm">
                  <Eye className="h-3.5 w-3.5" />
                  {permission.canComment
                    ? 'Comment-only — you can add comments but not edit this canvas'
                    : 'View-only — you don’t have edit access to this canvas'}
                </div>
              </Panel>
            )}

            {/* Top toolbar — anchored top-right (CVS-32) */}
            <Panel
              position="top-right"
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
                  log.debug('🎨 Whiteboard tool changed to:', tool);
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
                onAddFromCatalog={handleAddFromCatalog}
                onToggleGroups={() => setShowGroupsPanel((v) => !v)}
                groupsActive={showGroupsPanel}
                onToggleOperators={() => setShowOperatorPanel((v) => !v)}
                operatorsActive={showOperatorPanel}
                exportSlot={<CanvasExportMenu />}
              />
            </Panel>

            {/* Operative control panel - top-left - edit mode + toggled on */}
            {state.toolbarMode === 'edit' && showOperatorPanel && (
              <Panel position="top-left">
                <ControlPanel
                  operators={
                    (canvasNodes || []).filter(
                      (n) => n.nodeType === 'operatorNode'
                    ) as any
                  }
                  selectedOperatorId={selectedOperatorId}
                  onSelectOperator={setSelectedOperatorId}
                  previewOperatorValues={previewOperatorValues}
                  onUpdateOperator={handleUpdateOperator}
                  onBulkUpdate={handleBulkUpdateOperators}
                  onRun={handleRunPipeline}
                  isRunning={isSimulating}
                  lastRun={lastRun}
                  globalPeriod={globalPeriod}
                  onChangePeriod={setGlobalPeriod}
                />
              </Panel>
            )}

            {/* Groups fly-out — toggled from the consolidated toolbar; offset
                below the now top-right toolbar so they don't overlap (CVS-32) */}
            {state.toolbarMode === 'edit' && showGroupsPanel && (
              <Panel position="top-right" style={{ marginTop: 72 }}>
                <div className="flex flex-col items-end gap-2">
                  {showGroupsPanel && (
                    <GroupsPanel
                      groups={canvas?.groups || []}
                      selectedNodeIds={selectedNodeIds}
                      focusedGroupId={focusedGroupId}
                      onFocus={handleFocusGroup}
                      onClearFocus={handleClearFocus}
                      onCreateFromSelection={events.handleGroupSelectedNodes}
                      onAddSelected={handleAddSelectedToGroup}
                      onRemoveSelected={handleRemoveSelectedFromGroup}
                      onRename={handleRenameGroup}
                      onRecolor={handleRecolorGroup}
                      onDelete={handleDeleteGroup}
                    />
                  )}
                </div>
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
                  onDeleteNodes={() => void canvasActions.deleteSelection()}
                  onDuplicateNodes={canvasActions.duplicateSelection}
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
                      log.debug('Erased items:', { nodeIds, edgeIds });
                    }}
                  />
                )}

                {state.whiteboardTool === 'lasso' && (
                  <LassoSelectionComponent
                    isActive={true}
                    partial={state.whiteboardPartialSelection}
                    onSelection={(nodeIds, edgeIds) => {
                      log.debug('Lasso selected items:', {
                        nodeIds,
                        edgeIds,
                      });
                      if (nodeIds.length > 0 || edgeIds.length > 0) {
                        log.debug('✅ Lasso selection successful!');
                      } else {
                        log.debug('ℹ️ No items selected by lasso');
                      }
                    }}
                  />
                )}

                {state.whiteboardTool === 'rectangle' && (
                  <RectangleToolComponent
                    isActive={true}
                    onRectangleCreate={(rectangle) => {
                      log.debug('✅ Rectangle created:', rectangle);
                    }}
                  />
                )}

                {state.whiteboardTool === 'freehand' && (
                  <FreehandDrawComponent
                    isActive={true}
                    brushSize={state.whiteboardBrushSize}
                    brushColor={state.whiteboardBrushColor}
                    onCommit={handleFreehandCommit}
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

          {/* Add a catalogued Tracked Metric to this canvas */}
          <CatalogMetricPicker
            open={catalogPickerOpen}
            onOpenChange={setCatalogPickerOpen}
            canvasId={currentCanvasId || canvasId || ''}
            position={catalogPickerPos}
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
