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
  useNodesState,
  useReactFlow,
  type Connection,
  type Edge,
  type NodeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Eye, Flag, Search } from 'lucide-react';

// Extracted utilities and hooks
import { useCanvasNodesStore } from '@/features/canvas/stores/useCanvasNodesStore';
import { useNewNodeTypesStore } from '@/features/canvas/stores/useNewNodeTypesStore';
import { useCanvasNodeSources } from '@/features/canvas/hooks/useCanvasNodeSources';
import { useEvidenceStore } from '@/features/evidence/stores/useEvidenceStore';
import {
  createEvidenceSynced,
  deleteEvidenceSynced,
  resetEvidenceSync,
  updateEvidenceSynced,
} from '@/features/evidence/services/evidenceSync';
import {
  buildEvidenceLayoutMap,
  hydrateProjectEvidence,
  migrateLegacyEvidence,
} from '@/features/evidence/services/hydrateProjectEvidence';
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
import type { EvidenceItem, MetricCard } from '@/shared/types';
import { listConnections } from '@/shared/lib/supabase/services/sourceConnections';
import { track } from '@/shared/lib/analytics';
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
import { useCanvasExport } from '@/features/canvas/components/export/useCanvasExport';
import {
  getAuthenticatedClient,
  getClientForEnvironment,
  whenAuthenticatedClientReady,
} from '@/shared/utils/authenticatedClient';
import {
  createCommentThread,
  updateCommentThread,
} from '@/shared/lib/supabase/services/collaboration';
import { runPipeline } from '@/features/canvas/utils/runSimulation';
import { normalizeOperatorData } from '@/features/canvas/utils/operatorMigration';
import { resolveZ } from '@/features/canvas/utils/zOrder';
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
import { useNodeIntersection } from '../hooks/useNodeIntersection';
import {
  animateLayout,
  cancelLayoutAnimation,
} from '../utils/layoutAnimation';
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
import GroupNameDialog from '@/features/canvas/components/grouping/GroupNameDialog';
import OffscreenNodeIndicator from '@/features/canvas/components/wayfinding/OffscreenNodeIndicator';
import ControlPanel from '@/features/canvas/components/left-sidepanel/ControlPanel';
import { LayersPanel } from '@/features/canvas/components/dock/layers/LayersPanel';
import { CanvasTourLauncher, DrawModeTip } from '@/features/onboarding';
import { useCanvasPanelStore } from '@/features/canvas/stores/useCanvasPanelStore';
import { useLayersUiStore } from '@/features/canvas/stores/useLayersUiStore';
import TopCanvasToolbar from '@/features/canvas/components/mini-control/TopCanvasToolbar';
import VersionHistoryPanel from '@/features/canvas/components/version-history/VersionHistoryPanel';
import QuickSearchCommand, {
  useQuickSearch,
} from '@/features/canvas/components/search/QuickSearchCommand';
import LayoutDropdownButton from '@/features/canvas/components/mini-control/LayoutDropdownButton';
import FilterControls from '@/features/canvas/components/mini-control/FilterControls';
import {
  DrawWheelZoom,
  EraseToolComponent,
  FreehandDrawComponent,
  LassoSelectionComponent,
  ShapeToolComponent,
  TextToolComponent,
  type WhiteboardTool,
  type FreehandDrawing,
  type ShapeDrawing,
} from '@/features/canvas/components/whiteboard';
import { generateUUID } from '@/shared/utils/validation';
import { uploadCanvasImage } from '@/shared/lib/supabase/services/canvasImages';
import { getViewportCenterPosition } from '@/features/canvas/utils/viewportCenter';

// Auto-save and realtime hooks
import { useAutoSave } from '@/shared/hooks/useAutoSave';
import { useCanvasRealtime } from '@/shared/hooks/useCanvasRealtime';
import { CanvasCursorsLayer } from '@/features/canvas/realtime/CanvasCursorsLayer';
import { useUser } from '@clerk/react-router';
import { createLogger } from '@/shared/utils/logger';

const log = createLogger('canvas');

// Stable empty selection passed to the node converters — selection is owned by
// React Flow now (ADR-008 step 3), so converters must never stamp `selected`.
const EMPTY_SELECTION: string[] = [];

// Proper-case default titles for freshly added canvas nodes — match the card
// design pattern (was `type.replace('Node','')`, which rendered "source"/"chart").
const NODE_TYPE_TITLES: Record<string, string> = {
  sourceNode: 'Source',
  chartNode: 'Chart',
  operatorNode: 'Operator',
  commentNode: 'Comment',
  whiteboardNode: 'Whiteboard',
};
const defaultNodeTitle = (type: string) =>
  NODE_TYPE_TITLES[type] ?? type.replace('Node', '');

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
  // Layers panel (left dock — absorbs the old Groups fly-out) + focus mode.
  const showLayersPanel = useCanvasPanelStore((s) => s.leftPanel === 'layers');
  const toggleLayersPanel = useCanvasPanelStore((s) => s.toggleLayers);
  // Hide/lock revision — bumps when eye/lock toggles change so nodes rebuild.
  const layersRev = useLayersUiStore((s) => s.rev);
  const [showCheckpoints, setShowCheckpoints] = useState(false);
  const [focusedGroupId, setFocusedGroupId] = useState<string | null>(null);
  // Holding Space temporarily pans the canvas (React Flow's panActivationKeyCode).
  // In Draw mode the tool overlays sit on top and would eat the pointer, so we
  // drop them while Space is held to let the grab-pan through.
  const [spaceHeld, setSpaceHeld] = useState(false);
  // ELK-routed edge polylines keyed by edge id, produced by the last auto-layout
  // so DynamicEdge can draw the no-overlap orthogonal channel ELK reserved.
  const [routedEdgePoints, setRoutedEdgePoints] = useState<
    Record<string, { x: number; y: number }[]>
  >({});
  // Guards the evidence-layout → settings save so it only runs after this
  // canvas's evidence has been hydrated (never persists a pre-load store).
  const evidenceHydratedFor = useRef<string | null>(null);
  // Legacy settings.evidence blob awaiting one-time migration to
  // evidence_items rows — consumed by the migration effect once canEdit.
  const pendingEvidenceMigration = useRef<{
    projectId: string;
    legacy: EvidenceItem[];
    settings: Record<string, unknown>;
  } | null>(null);
  // Bumped when hydration (async) arms pendingEvidenceMigration — a ref write
  // alone can't re-fire the migration effect if canEdit resolved first.
  const [evidenceMigrationArm, setEvidenceMigrationArm] = useState(0);

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
  // Write-through (CVS-337): evidence node edits/deletes go through
  // evidenceSync so content fields land in evidence_items, not just the store.
  const updateEvidence = useCallback(
    (id: string, updates: Partial<EvidenceItem>) =>
      updateEvidenceSynced(id, updates, canvasId),
    [canvasId]
  );
  const deleteEvidence = useCallback(
    (id: string) => deleteEvidenceSynced(id),
    []
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
      // Evidence is hydrated per project (DB rows + settings.evidenceLayout);
      // clear the global store and drop any in-flight sync from the previous
      // canvas so nothing bleeds across projects.
      resetEvidenceSync();
      useEvidenceStore.setState({ evidence: [] });

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

          // Retention signal: returning to an EXISTING canvas (UUID branch only;
          // the "new" bootstrap above returns early, so this never counts creation).
          track('canvas_opened', {
            canvas_id: canvasId,
            node_count: projectData.nodes?.length ?? 0,
            edge_count: projectData.edges?.length ?? 0,
          });

          // Phase B: hydrate persisted data-flow / reference edges (operator
          // pipeline) from projects.settings.dataFlowEdges into the in-memory
          // extraEdges array so the pipeline survives reload.
          const persistedDataFlowEdges =
            (projectData as any).settings?.dataFlowEdges;
          state.setExtraEdges(
            Array.isArray(persistedDataFlowEdges) ? persistedDataFlowEdges : []
          );

          // Hydrate the layout direction from settings so re-applying a layout
          // (and edge anchoring) starts from the persisted direction, not TB.
          const persistedDirection = (projectData as any).settings?.autoLayout
            ?.algorithm;
          if (['TB', 'BT', 'LR', 'RL'].includes(persistedDirection)) {
            state.setCurrentLayoutDirection(persistedDirection);
          }

          // Evidence persistence (CVS-337): hydrate from evidence_items rows
          // overlaid with settings.evidenceLayout. Pre-migration blob items
          // are merged in read-only; the one-time blob→DB migration runs in a
          // separate effect once this user is known to be an editor.
          try {
            const hydrated = await hydrateProjectEvidence(
              canvasId,
              (projectData as any).settings,
              client
            );
            useEvidenceStore.setState({ evidence: hydrated.evidence });
            pendingEvidenceMigration.current = hydrated.pendingLegacy.length
              ? {
                  projectId: canvasId,
                  legacy: hydrated.pendingLegacy,
                  settings: ((projectData as any).settings ?? {}) as Record<
                    string,
                    unknown
                  >,
                }
              : null;
            if (hydrated.pendingLegacy.length) {
              setEvidenceMigrationArm((n) => n + 1);
            }
          } catch (e) {
            console.error('❌ Evidence hydration failed:', e);
            useEvidenceStore.setState({ evidence: [] });
          }
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
    flowToScreenPosition,
  } = useReactFlow() as any;

  // Cross-canvas quick search — opened from the bottom-left Controls (moved out
  // of the top toolbar). Was previously mounted but never openable.
  const quickSearch = useQuickSearch();

  // Canvas export (PNG/PDF/CSV) lives in the Collaboration panel now, which is
  // outside this ReactFlowProvider — it dispatches `canvas:export` and we run it
  // here where the live nodes + viewport are available.
  const { exportAs } = useCanvasExport();
  useEffect(() => {
    const onExport = (e: Event) => {
      const format = (e as CustomEvent).detail?.format;
      if (format === 'png' || format === 'pdf' || format === 'csv') {
        exportAs(format);
      }
    };
    window.addEventListener('canvas:export', onExport as EventListener);
    return () =>
      window.removeEventListener('canvas:export', onExport as EventListener);
  }, [exportAs]);


  // Inline text editor for the Text tool (create) and double-click (re-edit).
  // id present → editing an existing whiteboard text node; absent → creating.
  const [textEditor, setTextEditor] = useState<{
    id?: string;
    data?: any;
    screenX: number;
    screenY: number;
    flow: { x: number; y: number };
    value: string;
    fontSize: number;
    color: string;
  } | null>(null);

  // CVS-38 — drop-target highlight while dragging a node over others.
  const {
    handleDrag: highlightIntersections,
    clear: clearIntersections,
  } = useNodeIntersection();

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

        // Pinned edges (CVS-335) keep their user-chosen handles, so the ELK
        // polyline (routed for the direction handles) would detach from them —
        // drop their routes and let them draw smoothstep from their pins.
        const pinnedIds = new Set<string>();
        for (const e of useCanvasStore.getState().canvas?.edges || []) {
          if (e.sourceHandle != null || e.targetHandle != null) {
            pinnedIds.add(e.id);
          }
        }
        for (const e of (state.extraEdges || []) as any[]) {
          if (e?.pinned) pinnedIds.add(e.id);
        }
        setRoutedEdgePoints(
          Object.fromEntries(
            Object.entries(edgePoints).filter(([id]) => !pinnedIds.has(id))
          )
        );
        // Ease nodes into their new layout positions (CVS-39).
        animateLayout();
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
        // Persist the direction (projects.settings.autoLayout) so un-pinned
        // edges re-anchor to the SAME sides after a reload — previously the
        // direction lived only in page state and reloads reverted to TB while
        // the node positions stayed BT/LR, breaking the tree (CVS-335).
        useCanvasStore.getState().updateCanvasSettings({
          autoLayout: { algorithm: layoutDirection, enabled: true },
        });
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

  // ── Group creation flow: name dialog → create → open panel → focus ──
  // All three entry points (Ctrl+G, SelectionPanel, GroupsPanel) route here so
  // the user always names the group and immediately SEES what got grouped.
  const [groupDialog, setGroupDialog] = useState<{
    defaultName: string;
    count: number;
  } | null>(null);

  const requestGroupSelection = useCallback(() => {
    const { selectedNodeIds, canvas: c } = useCanvasStore.getState();
    if (!selectedNodeIds || selectedNodeIds.length < 2) {
      toast.error('Select at least 2 cards to group');
      return;
    }
    setGroupDialog({
      defaultName: `Group ${(c?.groups?.length ?? 0) + 1}`,
      count: selectedNodeIds.length,
    });
  }, []);

  const handleGroupNameConfirm = useCallback(
    async (name: string) => {
      setGroupDialog(null);
      const { selectedNodeIds, groupSelectedNodes } = useCanvasStore.getState();
      const ids = selectedNodeIds || [];
      if (ids.length < 2) return;
      try {
        const groupId = await groupSelectedNodes(ids, name);
        // Make the result unmistakable: open the Layers panel with the new
        // group focused, dim everything else, and fit-view the members.
        useCanvasPanelStore.setState({ leftPanel: 'layers' });
        setFocusedGroupId(groupId);
        const memberIds = new Set(ids);
        setTimeout(() => {
          const toFit = getNodes().filter((n: any) => memberIds.has(n.id));
          if (toFit.length > 0) {
            fitView({ nodes: toFit as any, padding: 0.35, duration: 600 });
          }
        }, 60);
        toast.success(`Grouped ${ids.length} cards into “${name}”`);
      } catch (err) {
        console.error('Group failed', err);
        toast.error('Could not group selected cards');
      }
    },
    [getNodes, fitView]
  );

  // "Unlinked" cards: nodes with no typed relationship (never a source or target
  // of any edge). Surfaced as a computed muted group in GroupsPanel so users can
  // one-click focus them and wire-or-cull (CVS-76). Memoized so it doesn't add
  // per-render churn to the fragile canvas render path.
  const unlinkedNodeIds = useMemo(() => {
    const allNodes = canvas?.nodes || [];
    if (allNodes.length === 0) return [] as string[];
    const connected = new Set<string>();
    for (const e of canvas?.edges || []) {
      const s = (e as any).sourceId ?? (e as any).source;
      const t = (e as any).targetId ?? (e as any).target;
      if (s) connected.add(s);
      if (t) connected.add(t);
    }
    return allNodes.filter((n) => !connected.has(n.id)).map((n) => n.id);
  }, [canvas?.nodes, canvas?.edges]);

  const handleFocusUnlinked = useCallback(() => {
    if (unlinkedNodeIds.length === 0) return;
    // Select them (highlight + make them actionable) then fit the view to them.
    useCanvasStore.setState({ selectedNodeIds: unlinkedNodeIds });
    setTimeout(() => {
      const ids = new Set(unlinkedNodeIds);
      const toFit = getNodes().filter((n) => ids.has(n.id));
      if (toFit.length > 0) {
        fitView({ nodes: toFit as any, padding: 0.35, duration: 600 });
      }
    }, 60);
  }, [unlinkedNodeIds, getNodes, fitView]);

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

  // Bridge for the per-node toolbar's view/edit/settings actions (CVS-135). Those
  // live in the decoupled `useNodeToolbarActions` hook, which can't reach this
  // page-local settings-sheet state — so it dispatches a window CustomEvent and we
  // open the sheet here (switching to the requested tab when one is given).
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as
        | { nodeId?: string; tab?: string }
        | undefined;
      if (!detail?.nodeId) return;
      if (detail.tab) {
        stableHandleSwitchToCard(detail.nodeId, detail.tab);
      } else {
        stableHandleOpenSettingsSheet(detail.nodeId);
      }
    };
    window.addEventListener('canvas:open-node-settings', handler);
    return () =>
      window.removeEventListener('canvas:open-node-settings', handler);
  }, [stableHandleOpenSettingsSheet, stableHandleSwitchToCard]);

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
  // Memoize so an empty/unchanged value keeps a STABLE reference — otherwise this
  // was a fresh `[]` every render, recomputing the whole `nodes` memo each render
  // and feeding React Flow new node objects continuously (a driver of the
  // controlled-nodes update loop → React #185). See CVS-23/65.
  const temporaryExtraNodes = useMemo(
    () => state.extraNodes || [],
    [state.extraNodes]
  );

  // Step 2 (ADR-008 / CVS-230): the store-backed node sources, gathered once in a
  // reference-stable hook. The `nodes` memo consumes this instead of reading four
  // stores inline — one selector, fewer churny inputs, and the single place step 3
  // will swap to React Flow's useNodesState.
  const nodeSources = useCanvasNodeSources();

  // Memoized data conversions
  // ── ADR-008 step 3 (CVS-23/65): React Flow OWNS node view-state via
  // useNodesState. Stores feed it ONE-WAY through the reconcile effect below;
  // React Flow's own change events (select / drag / dimensions) update rfNodes
  // and never re-derive the array — this breaks the derive↔control loop that
  // caused React #185. Identity is kept stable per source object (`__src`) plus
  // a build-context key (`__ctx`) so an unchanged node keeps its EXACT object
  // reference and React Flow never re-measures it.
  const focusedMembers = useMemo(() => {
    if (!focusedGroupId) return null;
    const fg = (canvas?.groups || []).find((g) => g.id === focusedGroupId);
    return new Set(fg?.nodeIds || []);
  }, [focusedGroupId, canvas?.groups]);

  // Global inputs (besides the source object) that affect a built node. When
  // this changes, every node rebuilds — rare, deliberate UI events only.
  // layersRev covers Layers-panel hide/lock toggles (maps read at build time).
  const nodeCtxKey = `${state.isSettingsSheetOpen}|${focusedGroupId ?? ''}|${layersRev}`;

  // Desired nodes as {id, src, build}. `src` is the SOURCE store object — stable
  // until the store mutates it — which is exactly what keeps RF node identity
  // stable across renders. `selected` is intentionally NOT stamped (RF owns it).
  const desiredItems = useMemo(() => {
    const dim = (id: string, node: any) =>
      focusedMembers && !focusedMembers.has(id)
        ? {
            ...node,
            className: [node.className, 'rf-node-dimmed']
              .filter(Boolean)
              .join(' '),
          }
        : node;
    // Paint order across ALL sources: persisted z_index wins, legacy items
    // resolve by createdAt (see utils/zOrder). Stamped onto RF node.zIndex.
    const effectiveZ = resolveZ(
      [
        ...nodeSources.metricCards,
        ...nodeSources.positionedEvidence,
        ...nodeSources.canvasNodes,
        ...nodeSources.newNodes,
      ].map((s: any) => ({
        id: s.id,
        zIndex: s.zIndex ?? null,
        createdAt: s.createdAt,
      }))
    );
    // Stamp paint order + Layers-panel hide/lock. Maps are read at build()
    // time (reconcile), kept fresh by layersRev in nodeCtxKey.
    const withZ = (id: string, node: any) => {
      const z = effectiveZ.get(id);
      const { hidden, locked } = useLayersUiStore.getState();
      const out = z === undefined ? { ...node } : { ...node, zIndex: z };
      if (hidden[id]) out.hidden = true;
      if (locked[id]) {
        out.draggable = false;
        out.selectable = false;
      }
      return out;
    };
    const items: Array<{ id: string; src: any; build: () => any }> = [];
    for (const card of nodeSources.metricCards) {
      items.push({
        id: card.id,
        src: card,
        build: () =>
          withZ(
            card.id,
            dim(
              card.id,
              convertToNode(
                card,
                stableEvents.handleOpenSettingsSheet,
                () => {},
                stableEvents.handleSwitchToCard,
                state.isSettingsSheetOpen,
                EMPTY_SELECTION
              )
            )
          ),
      });
    }
    for (const evidence of nodeSources.positionedEvidence) {
      items.push({
        id: evidence.id,
        src: evidence,
        build: () =>
          withZ(
            evidence.id,
            dim(
              evidence.id,
              convertToEvidenceNode(
                evidence,
                updateEvidence,
                deleteEvidence,
                EMPTY_SELECTION
              )
            )
          ),
      });
    }
    for (const canvasNode of nodeSources.canvasNodes) {
      items.push({
        id: canvasNode.id,
        src: canvasNode,
        build: () =>
          withZ(
            canvasNode.id,
            dim(canvasNode.id, convertToCanvasNode(canvasNode, EMPTY_SELECTION))
          ),
      });
    }
    for (const node of nodeSources.newNodes) {
      items.push({
        id: node.id,
        src: node,
        build: () =>
          withZ(
            node.id,
            dim(node.id, {
              id: node.id,
              type: node.type,
              position: node.position,
              data: { node },
              selectable: true,
              draggable: true,
            })
          ),
      });
    }
    // Transient optimistic-UI fallback nodes (draw-add before store round-trip).
    for (const tn of temporaryExtraNodes) {
      items.push({ id: tn.id, src: tn, build: () => tn });
    }
    return items;
  }, [
    nodeSources,
    temporaryExtraNodes,
    focusedMembers,
    state.isSettingsSheetOpen,
    stableEvents,
    updateEvidence,
    deleteEvidence,
  ]);

  const [rfNodes, setRfNodes] = useNodesState([]);

  // Ids currently being dragged — reconcile leaves these untouched so store
  // writes (incl. the per-frame drag write, until Phase 4) never snap them.
  const draggingIds = useRef<Set<string>>(new Set());

  // ONE-WAY store → RF reconcile (merge by id). Preserve RF-owned view fields
  // (selected / dragging / measured / dimensions) from the current node and
  // rebuild data+position from the source only when the source object or ctx
  // changed. Return the SAME object when nothing changed so RF never re-measures
  // — this identity stability is what actually kills the #185 loop.
  useEffect(() => {
    setRfNodes((prev) => {
      const prevById = new Map(prev.map((n) => [n.id, n]));
      const nextIds = new Set<string>();
      let changed = prev.length !== desiredItems.length;
      const next = desiredItems.map(({ id, src, build }) => {
        nextIds.add(id);
        const p = prevById.get(id) as any;
        if (p && draggingIds.current.has(id)) return p; // don't touch mid-drag
        if (p && p.__src === src && p.__ctx === nodeCtxKey) return p; // unchanged
        changed = true;
        const built: any = build();
        built.__src = src;
        built.__ctx = nodeCtxKey;
        if (p) {
          // Preserve React Flow-owned view state across a rebuild.
          built.selected = p.selected;
          built.dragging = p.dragging;
          built.measured = p.measured;
          if (p.width != null) built.width = p.width;
          if (p.height != null) built.height = p.height;
          if (p.positionAbsolute) built.positionAbsolute = p.positionAbsolute;
        }
        return built;
      });
      if (!changed) {
        for (const p of prev)
          if (!nextIds.has(p.id)) {
            changed = true;
            break;
          }
      }
      return changed ? next : prev;
    });
  }, [desiredItems, nodeCtxKey, setRfNodes]);

  // Keep the latest composed nodes reachable from the once-per-canvas reconcile
  // effect below without making it re-run on every node change (e.g. drag).
  const latestNodesRef = useRef(rfNodes);
  latestNodesRef.current = rfNodes;

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

    // Persisted direction first (survives reload), then the in-session page
    // state, then TB. All layout controls write settings.autoLayout, so every
    // control and the memo agree on the anchoring direction (CVS-335).
    const layoutDirection =
      (canvas?.settings?.autoLayout?.algorithm as LayoutDirection) ||
      (state.currentLayoutDirection as LayoutDirection) ||
      'TB';
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
    // Pinned edges (CVS-335) keep their user-chosen handles instead.
    const dirHandles = handlesForDirection(layoutDirection);
    const extraEdgesAnchored = extraEdges.map((e: any) =>
      e.pinned
        ? e
        : {
            ...e,
            sourceHandle: dirHandles.sourceHandle ?? e.sourceHandle,
            targetHandle: dirHandles.targetHandle ?? e.targetHandle,
          }
    );

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
    canvas?.settings?.autoLayout?.algorithm,
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

  // Evidence layout persistence (CVS-337): debounce-save canvas presentation
  // (position/expansion/links/comments) to projects.settings.evidenceLayout.
  // Content fields sync to evidence_items via evidenceSync. Gated on
  // hydration so it never clobbers the stored layout with a pre-load store.
  useEffect(() => {
    if (!canvasId || evidenceHydratedFor.current !== canvasId || !canEdit)
      return;
    const t = setTimeout(() => {
      // Skip (not throw) if the authed client isn't ready yet — the next
      // evidence change re-fires this debounced save.
      const client = supabaseClient || getAuthenticatedClient();
      if (!client) return;
      void mergeProjectSettings(
        canvasId,
        { evidenceLayout: buildEvidenceLayoutMap(evidenceList) },
        client
      ).catch((err) =>
        console.error('❌ Failed to persist evidence layout:', err)
      );
    }, 600);
    return () => clearTimeout(t);
  }, [evidenceList, canvasId, supabaseClient, canEdit]);

  // One-time legacy migration: settings.evidence blob → evidence_items rows.
  // Runs only for editors (RLS rejects viewer inserts) and only until the
  // evidenceMigratedAt stamp lands; non-UUID ids are remapped across the
  // store and reference edges.
  useEffect(() => {
    const pending = pendingEvidenceMigration.current;
    if (!canEdit || !pending || pending.projectId !== canvasId) return;
    pendingEvidenceMigration.current = null;
    const client = supabaseClient || getAuthenticatedClient() || undefined;
    void migrateLegacyEvidence({
      projectId: pending.projectId,
      userId: useAppStore.getState().user?.id || 'unknown',
      legacy: pending.legacy,
      settings: pending.settings,
      client,
    })
      .then(({ idRemap, dataFlowEdges }) => {
        if (Object.keys(idRemap).length) {
          // Swap remapped ids in the store so pins keep working seamlessly.
          useEvidenceStore.setState((s) => ({
            evidence: s.evidence.map((e) =>
              idRemap[e.id] ? { ...e, id: idRemap[e.id] } : e
            ),
          }));
          if (dataFlowEdges) state.setExtraEdges(dataFlowEdges);
        }
        log.debug('🧾 Legacy evidence migrated', {
          count: pending.legacy.length,
          remapped: Object.keys(idRemap).length,
        });
      })
      .catch((err) => {
        // Re-arm so a transient failure retries on the next canvas load.
        pendingEvidenceMigration.current = pending;
        console.error('❌ Legacy evidence migration failed:', err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canEdit, canvasId, supabaseClient, evidenceMigrationArm]);

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
      // Esc → in Draw mode, break from the active tool back to Select (CVS-107);
      // in Edit mode, clear the selection (CVS-68).
      if (e.key === 'Escape') {
        const s = useCanvasStore.getState();
        if (state.toolbarMode === 'draw' && state.whiteboardTool !== 'select') {
          // Break from the active drawing tool back to Select (CVS-107).
          state.setWhiteboardTool('select');
        }
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
      // [ → toggle the Layers panel (Figma muscle memory).
      if (e.key === '[' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        useCanvasPanelStore.getState().toggleLayers();
        return;
      }
      // Draw-mode single-key tool hotkeys (CVS-107): V/H/E/L/R/P. No modifier held;
      // typing is already excluded by isEditable above. (T = Text tool → CVS-108.)
      if (
        state.toolbarMode === 'draw' &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        const toolByKey: Record<string, WhiteboardTool> = {
          v: 'select',
          h: 'hand',
          e: 'eraser',
          l: 'lasso',
          r: 'rectangle',
          o: 'ellipse',
          a: 'arrow',
          n: 'line',
          t: 'text',
          p: 'freehand',
        };
        const tool = toolByKey[e.key.toLowerCase()];
        if (tool) {
          e.preventDefault();
          state.setWhiteboardTool(tool);
          return;
        }
      }
      if (!(e.ctrlKey || e.metaKey)) return;
      const k = e.key.toLowerCase();
      if (k === 'c') canvasActions.copySelection();
      else if (k === 'v') canvasActions.paste();
      else if (k === 'd') {
        e.preventDefault();
        canvasActions.duplicateSelection();
      } else if (k === 'g') {
        // Ctrl/Cmd+G groups the current selection (via the name dialog);
        // add Shift to ungroup.
        e.preventDefault();
        if (e.shiftKey) events.handleUngroupSelectedGroups();
        else requestGroupSelection();
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
  }, [
    canvasActions,
    fitView,
    state.toolbarMode,
    state.whiteboardTool,
    state.setWhiteboardTool,
    requestGroupSelection,
    events.handleUngroupSelectedGroups,
  ]);

  // Track Space held → drop Draw-mode tool overlays so React Flow's Space
  // grab-pan (panActivationKeyCode) can pan under an active drawing tool.
  useEffect(() => {
    const isTyping = (t: EventTarget | null) => {
      const el = t as HTMLElement | null;
      return (
        !!el &&
        (el.tagName === 'INPUT' ||
          el.tagName === 'TEXTAREA' ||
          el.isContentEditable)
      );
    };
    const down = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isTyping(e.target)) setSpaceHeld(true);
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === 'Space') setSpaceHeld(false);
    };
    // Releasing focus (alt-tab) can swallow keyup — never leave it stuck on.
    const reset = () => setSpaceHeld(false);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', reset);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', reset);
    };
  }, []);

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
      // A drag must never lag behind a lingering layout transition.
      cancelLayoutAnimation();
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
      // Reconcile must not overwrite these while they're being dragged.
      draggingIds.current = new Set(Object.keys(snap));
      draggingIds.current.add(node.id);
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
    draggingIds.current = new Set(Object.keys(snap));
  }, []);

  // React Flow moves the selected nodes visually via onNodesChange now
  // (useNodesState). Positions are persisted once on drag-stop — no per-frame
  // store writes (they were redundant churn, and per-frame Supabase writes for
  // canvas nodes on top).
  const handleSelectionDrag = useCallback(() => {}, []);

  const handleSelectionDragStop = useCallback(
    (_: any, dragNodes: any[]) => {
      for (const n of dragNodes) applyNodePosition(n.type, n.id, n.position);
      draggingIds.current.clear();
      // A bulk move invalidates ELK-routed channels; drop them all.
      setRoutedEdgePoints({});
      recordMoveUndo();
    },
    [applyNodePosition, recordMoveUndo]
  );

  const handleNodeDrag = useCallback(
    (_: any, node: any) => {
      // React Flow owns node movement now (onNodesChange → rfNodes); we only
      // surface drop-target highlights here. The final position persists on
      // drag-stop — no per-frame store/Supabase writes (the old churn driver).
      highlightIntersections(node);
    },
    [highlightIntersections]
  );

  const handleNodeDragStop = useCallback(
    (_: any, node: any) => {
      // Reconcile may resume owning these nodes now the drag is done.
      draggingIds.current.clear();
      // Clear any drop-target highlights from the drag.
      clearIntersections();
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
      clearIntersections,
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
      // Mirror into the canvas store's settings so a same-canvas remount can
      // rehydrate extraEdges (the store outlives this component; see the
      // rehydration effect below).
      useCanvasStore.setState((s) =>
        s.canvas
          ? {
              canvas: {
                ...s.canvas,
                settings: { ...(s.canvas.settings || {}), dataFlowEdges: nextEdges },
              },
            }
          : {}
      );
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

  // Rehydrate extraEdges on same-canvas remounts. The big load effect skips
  // entirely when the canvas store already holds this canvas (guard at its
  // top), but extraEdges is COMPONENT state — so navigating within the canvas
  // (evidence full page → back, assets → back) used to silently drop every
  // reference/data-flow edge until a hard reload. Only fills an empty local
  // array, so live edits are never clobbered.
  const extraEdgesHydratedFor = useRef<string | null>(null);
  useEffect(() => {
    if (!canvasId || canvas?.id !== canvasId) return;
    if (extraEdgesHydratedFor.current === canvasId) return;
    extraEdgesHydratedFor.current = canvasId;
    const persisted = (canvas?.settings as any)?.dataFlowEdges;
    if (
      Array.isArray(persisted) &&
      persisted.length > 0 &&
      (state.extraEdges || []).length === 0
    ) {
      state.setExtraEdges(persisted);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasId, canvas?.id, canvas?.settings]);

  // Card panel → canvas delegation bridges. The metric-card side panel pins its
  // discussion / evidence onto the canvas; node creation + positioning happen
  // here (the panel has no canvas access). One thread/evidence item, two views.
  useEffect(() => {
    // "Pin discussion to canvas": focus the existing pin for this card's
    // thread, or create one beside the card sharing the SAME thread. The thread
    // keeps source:'node' + context.cardId (Strategy counts + the panel tab key
    // off it); context gains nodeId so both views point at one conversation.
    const onPinDiscussion = async (e: Event) => {
      const { cardId, threadId } = (e as CustomEvent).detail || {};
      const currentCanvas = useCanvasStore.getState().canvas;
      if (!cardId || !currentCanvas?.id) return;
      try {
        if (threadId) {
          const existing = useCanvasNodesStore
            .getState()
            .canvasNodes.find(
              (n) =>
                n.nodeType === 'commentNode' &&
                (n.data as any)?.threadId === threadId
            );
          if (existing) {
            fitView({
              nodes: [{ id: existing.id }],
              duration: 500,
              maxZoom: 1.2,
              padding: 0.4,
            });
            return;
          }
        }
        const card = currentCanvas.nodes.find((n) => n.id === cardId);
        const title = card?.title || 'Discussion';
        const client = getClientForEnvironment();
        let tid: string | null = threadId ?? null;
        if (!tid) {
          const thread = await createCommentThread(
            {
              projectId: currentCanvas.id,
              source: 'node',
              context: { cardId, title },
              createdBy: useAppStore.getState().user?.id ?? null,
            },
            client
          );
          tid = thread.id;
        }
        const position = card?.position
          ? { x: card.position.x + 360, y: card.position.y }
          : screenToFlowPosition({
              x: window.innerWidth / 2,
              y: window.innerHeight / 2,
            });
        const created = await useCanvasNodesStore.getState().createNode({
          projectId: currentCanvas.id,
          nodeType: 'commentNode',
          title: 'Comment',
          position,
          data: { title, threadId: tid, projectId: currentCanvas.id },
          createdBy: useAppStore.getState().user?.id || 'anonymous',
        } as any);
        void updateCommentThread(
          tid!,
          { context: { cardId, nodeId: created?.id, title } as any },
          client
        );
        if (created?.id) {
          setTimeout(
            () =>
              fitView({
                nodes: [{ id: created.id }],
                duration: 500,
                maxZoom: 1.2,
                padding: 0.4,
              }),
            80
          );
        }
        toast.success('Discussion pinned to canvas');
      } catch (err) {
        console.error('Failed to pin discussion', err);
        toast.error('Could not pin the discussion');
      }
    };

    // "Link evidence to card": create (or reuse) an evidence pin beside the
    // card, wire the reference edge, and record the link on the evidence item —
    // the same result as dragging the edge by hand.
    const onLinkEvidence = async (e: Event) => {
      const { cardId, evidenceId } = (e as CustomEvent).detail || {};
      const currentCanvas = useCanvasStore.getState().canvas;
      if (!cardId || !currentCanvas?.id) return;
      try {
        const card = currentCanvas.nodes.find((n) => n.id === cardId);
        const targetName = card?.title || 'node';
        const user = useAppStore.getState().user;
        const store = useEvidenceStore.getState();
        let ev = evidenceId
          ? store.evidence.find((item) => item.id === evidenceId)
          : undefined;
        const isNew = !ev;
        if (!ev) {
          const now = new Date().toISOString();
          const id = generateUUID();
          ev = {
            id,
            title: `Evidence for ${targetName}`,
            type: 'Analysis',
            date: now.slice(0, 10),
            summary: '',
            owner: user?.name || 'You',
            hypothesis: '',
            impactOnConfidence: '',
            link: '',
            createdAt: now,
            updatedAt: now,
            createdBy: user?.id || 'unknown',
            position: card?.position
              ? { x: card.position.x - 80, y: card.position.y + 240 }
              : screenToFlowPosition({
                  x: window.innerWidth / 2,
                  y: window.innerHeight / 2,
                }),
            isVisible: true,
            isExpanded: false,
            comments: [],
            context: { type: 'card', targetId: cardId, targetName },
            links: [{ targetId: cardId, targetName }],
          } as any;
          createEvidenceSynced(ev as any, currentCanvas.id);
        } else {
          // Ensure it's positioned (visible as a pin) and linked to this card.
          const links = [
            ...(ev.links || []).filter((l) => l.targetId !== cardId),
            { targetId: cardId, targetName },
          ];
          updateEvidenceSynced(
            ev.id,
            {
              position:
                ev.position ??
                (card?.position
                  ? { x: card.position.x - 80, y: card.position.y + 240 }
                  : undefined),
              context: { type: 'card', targetId: cardId, targetName },
              links,
            } as any,
            currentCanvas.id
          );
        }
        // Reference edge — identical to what a hand-drawn connection produces.
        const edgeId = `ref-${ev!.id}-${cardId}`;
        const currentEdges = state.extraEdges || [];
        if (!currentEdges.some((edge: any) => edge.id === edgeId)) {
          const edgeData = {
            id: edgeId,
            source: ev!.id,
            target: cardId,
            type: 'referenceEdge',
            data: { label: 'Evidence' },
          };
          const nextEdges = [...currentEdges, edgeData];
          state.setExtraEdges(nextEdges);
          persistDataFlowEdges(nextEdges);
          broadcastCanvasChange({ t: 'extraEdge:create', edge: edgeData });
        }
        if (isNew) {
          useCanvasPanelStore
            .getState()
            .openRight({ kind: 'evidenceEdit', evidenceId: ev!.id });
        }
        toast.success(
          isNew
            ? `Evidence pin created and linked to "${targetName}"`
            : `Evidence linked to "${targetName}"`
        );
      } catch (err) {
        console.error('Failed to link evidence', err);
        toast.error('Could not link evidence');
      }
    };

    window.addEventListener(
      'card:pin-discussion',
      onPinDiscussion as EventListener
    );
    window.addEventListener('card:link-evidence', onLinkEvidence as EventListener);
    return () => {
      window.removeEventListener(
        'card:pin-discussion',
        onPinDiscussion as EventListener
      );
      window.removeEventListener(
        'card:link-evidence',
        onLinkEvidence as EventListener
      );
    };
  }, [fitView, screenToFlowPosition, state, persistDataFlowEdges]);

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
    (connection: Connection) => canConnect(connection, getNodes(), existingEdges),
    [getNodes, existingEdges]
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

      // CVS-335: in 'custom' endpoint mode the dragged handles are saved as a
      // permanent pin; in 'auto' (default) they're stripped so the edge follows
      // the layout direction.
      const pinEndpoints =
        useCanvasStore.getState().canvas?.settings?.edgeAnchorMode === 'custom';

      // Use enhanced connection handler
      const result = handleNodeConnection(connection, {
        nodes: getNodes(),
        existingEdges,
        onCreateRelationship: async (relationshipData) => {
          if (!pinEndpoints) {
            delete (relationshipData as any).sourceHandle;
            delete (relationshipData as any).targetHandle;
          }
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
          if (pinEndpoints) {
            edgeData.pinned = true;
          } else {
            delete edgeData.sourceHandle;
            delete edgeData.targetHandle;
          }
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
          if (pinEndpoints) {
            edgeData.pinned = true;
          } else {
            delete edgeData.sourceHandle;
            delete edgeData.targetHandle;
          }
          const nextEdges = [...(state.extraEdges || []), edgeData];
          state.setExtraEdges(nextEdges);
          persistDataFlowEdges(nextEdges);
          broadcastCanvasChange({ t: 'extraEdge:create', edge: edgeData });
          log.debug('✅ Reference edge created + persisted');
          // Evidence → node link: reflect the connection on the evidence item
          // itself (its whole point is backing a card/hypothesis). The card
          // shows a "Linked to <target>" chip from this context.
          const ev = useEvidenceStore
            .getState()
            .evidence.find((e) => e.id === edgeData.source);
          if (ev) {
            const targetNode = getNodes().find((n) => n.id === edgeData.target);
            const targetName =
              (targetNode?.data as any)?.card?.title ||
              (targetNode?.data as any)?.title ||
              (targetNode?.data as any)?.node?.title ||
              'node';
            const links = [
              ...(ev.links || []).filter(
                (l) => l.targetId !== edgeData.target
              ),
              { targetId: edgeData.target, targetName },
            ];
            updateEvidenceSynced(
              ev.id,
              {
                context: {
                  type: 'card',
                  targetId: edgeData.target,
                  targetName,
                },
                links,
              } as any,
              canvasId
            );
            toast.success(`Evidence linked to "${targetName}"`);
          }
        },
      });

      if (!result.success) {
        console.error('❌ Connection failed:', result.error);
        toast.error(`Connection failed: ${result.error}`);
      }
    },
    [getNodes, existingEdges, state, persistDataFlowEdges, bindOperatorInput]
  );

  // CVS-335: dragging an existing edge's endpoint onto a different handle PINS
  // it there — an explicit user choice that survives reloads and re-layouts.
  // Only same-node endpoint changes are accepted (retargeting to another node
  // would bypass connection validation/cycle checks — just drop it).
  const handleReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      if (
        newConnection.source !== oldEdge.source ||
        newConnection.target !== oldEdge.target
      ) {
        toast.info('Drop the endpoint on another handle of the same card');
        return;
      }
      const isRelationship = (
        useCanvasStore.getState().canvas?.edges || []
      ).some((e) => e.id === oldEdge.id);
      if (isRelationship) {
        void useCanvasStore.getState().persistEdgeUpdate(oldEdge.id, {
          sourceHandle: newConnection.sourceHandle ?? null,
          targetHandle: newConnection.targetHandle ?? null,
        });
      } else {
        const next = (state.extraEdges || []).map((e: any) =>
          e.id === oldEdge.id
            ? {
                ...e,
                sourceHandle: newConnection.sourceHandle ?? undefined,
                targetHandle: newConnection.targetHandle ?? undefined,
                pinned: true,
              }
            : e
        );
        state.setExtraEdges(next);
        persistDataFlowEdges(next);
      }
      // Drop any ELK-routed polyline for this edge — it was routed for the old
      // handles and would visually detach from the new pin.
      setRoutedEdgePoints((prev) => {
        if (!prev[oldEdge.id]) return prev;
        const { [oldEdge.id]: _removed, ...rest } = prev;
        return rest;
      });
      log.debug('📌 Edge endpoints pinned:', oldEdge.id);
    },
    [state, persistDataFlowEdges]
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

  // Persist a finished shape (rectangle/ellipse/arrow/line) as a whiteboardNode,
  // with undo/redo. Uses the store's createNode so it renders immediately (and
  // replaces the old ephemeral Rectangle-via-addNodes path that lost shapes on
  // reload). Mirrors handleFreehandCommit.
  const handleShapeCommit = useCallback(async (shape: ShapeDrawing) => {
    const currentCanvas = useCanvasStore.getState().canvas;
    if (!currentCanvas?.id) return;
    const payload = {
      projectId: currentCanvas.id,
      nodeType: 'whiteboardNode' as const,
      title: 'Shape',
      position: shape.position,
      data: shape.data,
      createdBy: useAppStore.getState().user?.id || 'anonymous',
    };
    try {
      const created = await useCanvasNodesStore
        .getState()
        .createNode(payload as any);
      if (created?.id) {
        let currentId = created.id;
        useCanvasHistoryStore.getState().push({
          label: 'Add shape',
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
      console.error('❌ Failed to persist shape:', error);
    }
  }, []);

  // Persist a new text box as a whiteboardNode {shape:'text'} with undo/redo.
  const handleTextCreate = useCallback(
    async (
      flow: { x: number; y: number },
      text: string,
      fontSize: number,
      color: string
    ) => {
      const currentCanvas = useCanvasStore.getState().canvas;
      if (!currentCanvas?.id) return;
      const width = Math.max(120, text.length * fontSize * 0.62);
      const height = fontSize * 1.5 + 16;
      const payload = {
        projectId: currentCanvas.id,
        nodeType: 'whiteboardNode' as const,
        title: 'Text',
        position: flow,
        data: { shape: 'text', text, fontSize, stroke: color, width, height },
        createdBy: useAppStore.getState().user?.id || 'anonymous',
      };
      try {
        const created = await useCanvasNodesStore
          .getState()
          .createNode(payload as any);
        if (created?.id) {
          let currentId = created.id;
          useCanvasHistoryStore.getState().push({
            label: 'Add text',
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
        console.error('❌ Failed to persist text:', error);
      }
    },
    []
  );

  // Commit the inline text editor: create a new text node or update an existing
  // one (empty text cancels). Closes the editor either way.
  const commitTextEditor = useCallback(async () => {
    const ed = textEditor;
    setTextEditor(null);
    if (!ed) return;
    const value = ed.value.trim();
    if (ed.id) {
      // Edit existing — empty text leaves it unchanged.
      if (!value || value === (ed.data?.text ?? '')) return;
      const prevData = ed.data;
      const nextData = { ...prevData, text: value };
      await useCanvasNodesStore
        .getState()
        .updateNode(ed.id, { data: nextData });
      useCanvasHistoryStore.getState().push({
        label: 'Edit text',
        undo: async () =>
          useCanvasNodesStore.getState().updateNode(ed.id!, { data: prevData }),
        redo: async () =>
          useCanvasNodesStore.getState().updateNode(ed.id!, { data: nextData }),
      });
    } else if (value) {
      await handleTextCreate(ed.flow, value, ed.fontSize, ed.color);
    }
  }, [textEditor, handleTextCreate]);

  // Paste Picture (both Edit and Draw modes): an image on the clipboard is
  // uploaded to Storage and dropped as a whiteboardNode {shape:'image'} at the
  // viewport centre. Non-image pastes are ignored here (the Ctrl+V node
  // clipboard keydown handles those); pastes into a text field are left alone.
  const handlePasteImage = useCallback(
    async (blob: Blob) => {
      const currentCanvas = useCanvasStore.getState().canvas;
      if (!currentCanvas?.id) return;
      const objectUrl = URL.createObjectURL(blob);
      const dims = await new Promise<{ w: number; h: number }>((resolve) => {
        const img = new Image();
        img.onload = () =>
          resolve({ w: img.naturalWidth, h: img.naturalHeight });
        img.onerror = () => resolve({ w: 320, h: 240 });
        img.src = objectUrl;
      });
      URL.revokeObjectURL(objectUrl);

      const maxDim = 600;
      const scale = Math.min(1, maxDim / Math.max(dims.w, dims.h) || 1);
      const width = Math.max(1, Math.round(dims.w * scale)) || 320;
      const height = Math.max(1, Math.round(dims.h * scale)) || 240;

      const toastId = toast.loading('Uploading image…');
      try {
        const url = await uploadCanvasImage(currentCanvas.id, blob);
        const center = screenToFlowPosition({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        });
        const payload = {
          projectId: currentCanvas.id,
          nodeType: 'whiteboardNode' as const,
          title: 'Image',
          position: { x: center.x - width / 2, y: center.y - height / 2 },
          data: { shape: 'image', imageSrc: url, width, height },
          createdBy: useAppStore.getState().user?.id || 'anonymous',
        };
        const created = await useCanvasNodesStore
          .getState()
          .createNode(payload as any);
        if (created?.id) {
          let currentId = created.id;
          useCanvasHistoryStore.getState().push({
            label: 'Paste image',
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
        toast.success('Image added', { id: toastId });
      } catch (error) {
        console.error('❌ Failed to paste image:', error);
        toast.error('Could not upload the image', { id: toastId });
      }
    },
    [screenToFlowPosition]
  );

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      if (!canEdit) return;
      // Let pastes into a text field (incl. the inline text editor) behave.
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === 'INPUT' ||
          t.tagName === 'TEXTAREA' ||
          t.isContentEditable)
      )
        return;
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            void handlePasteImage(file);
          }
          return;
        }
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [canEdit, handlePasteImage]);

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
        // Evidence links: deleting a reference edge drops that target from the
        // evidence item's links; the primary context falls back to the latest
        // remaining link (or general when none are left).
        for (const e of removed) {
          const ev = useEvidenceStore
            .getState()
            .evidence.find(
              (item) =>
                item.id === e.source &&
                (item.context?.targetId === e.target ||
                  (item.links || []).some((l) => l.targetId === e.target))
            );
          if (ev) {
            const links = (ev.links || []).filter(
              (l) => l.targetId !== e.target
            );
            const last = links[links.length - 1];
            updateEvidenceSynced(
              ev.id,
              {
                links,
                context: last
                  ? { type: 'card', targetId: last.targetId, targetName: last.targetName }
                  : { type: 'general' },
              } as any,
              canvasId
            );
          }
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
  // React Flow owns the node array now (ADR-008 step 3): apply ALL of its change
  // events (select / drag position / dimensions) into rfNodes. `remove` is left
  // to onNodesDelete → store delete → reconcile, so RF and the store can't race
  // (applying remove here could let reconcile re-add the node before the async
  // store delete lands). Store position writes stay in the drag-stop handlers.
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const applied = changes.filter((c) => c.type !== 'remove');
      if (applied.length === 0) return;
      setRfNodes((nds) => applyNodeChanges(applied, nds));
    },
    [setRfNodes]
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
          title: defaultNodeTitle(type),
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
            title: defaultNodeTitle(type),
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
      <div
        className="h-full relative"
        style={{ zIndex: 0 }}
        data-tour="canvas-pane"
      >
        <PortalContainerProvider container={state.reactFlowRef.current as any}>
          {/* ReactFlow Canvas - Always rendered, with whiteboard tools overlaid in draw mode */}
          <ReactFlow
            ref={(ref) => {
              state.reactFlowRef.current = ref;
              viewportSync.setReactFlowRef(ref);
            }}
            nodes={rfNodes}
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
              } else if (
                node.type === 'whiteboardNode' &&
                (node.data as any)?.shape === 'text'
              ) {
                // Re-edit a text box inline at its on-screen position.
                const d = node.data as any;
                const screen = flowToScreenPosition({
                  x: node.position.x,
                  y: node.position.y,
                });
                setTextEditor({
                  id: node.id,
                  data: d,
                  screenX: screen.x,
                  screenY: screen.y,
                  flow: node.position,
                  value: d.text || '',
                  fontSize: d.fontSize || 16,
                  color: d.stroke || '#111827',
                });
              }
              // operator / other whiteboard shapes / comment / group: handled
              // inline / by selection — no generic sheet.
            }}
            onEdgeDoubleClick={(_, edge) => {
              log.debug('🔗 Edge double-clicked:', edge.id);
              events.handleOpenRelationshipSheet(edge.id);
            }}
            onConnect={handleConnect}
            onReconnect={handleReconnect}
            isValidConnection={isValidConnection}
            onNodesDelete={(deleted) =>
              void canvasActions.deleteByIds(deleted.map((n) => n.id))
            }
            onEdgesDelete={handleEdgesDelete}
            // Navigation: in edit mode, left-drag is a SELECTION box (marquee)
            // and pan is on middle/right mouse or by holding Space — unless the
            // Hand tool is active, where left-drag pans.
            onSelectionChange={handleSelectionChange}
            // Left-drag marquee whenever the Select tool is active — in Edit
            // OR in Draw mode. (React Flow auto-disables this while panning.)
            selectionOnDrag={
              (state.toolbarMode === 'edit' &&
                state.navigationTool !== 'hand') ||
              (state.toolbarMode === 'draw' &&
                state.whiteboardTool === 'select')
            }
            selectionMode={SelectionMode.Partial}
            // Hand tool (Edit or Draw): left-drag pans. Select tool: middle/right
            // pan so left stays free for the marquee. Active drawing tool: no
            // pane drag (the overlay draws; Space still grab-pans via the key).
            panOnDrag={
              (state.toolbarMode === 'edit' &&
                state.navigationTool === 'hand') ||
              (state.toolbarMode === 'draw' && state.whiteboardTool === 'hand')
                ? true
                : (state.toolbarMode === 'edit' &&
                      state.navigationTool !== 'hand') ||
                    (state.toolbarMode === 'draw' &&
                      state.whiteboardTool === 'select')
                  ? [1, 2]
                  : false
            }
            // Scroll pans, Ctrl/⌘+scroll (and pinch) zooms — in EVERY mode,
            // including Draw with an active drawing tool. React Flow binds its
            // wheel/zoom listener to `.react-flow__renderer` and the drawing
            // overlays render inside it, so the wheel bubbles up and RF handles
            // it (and preventDefault's the browser's page-zoom). When these were
            // false for active draw tools, RF ignored the wheel and Ctrl+scroll
            // fell through to the browser as a page zoom.
            panOnScroll={true}
            zoomOnScroll={true}
            // Space is a hold-to-pan in every mode — including Draw mode with an
            // active drawing tool (temporary hand; releasing returns to the tool).
            // Previously null for active draw tools, so Space didn't pan (CVS-107).
            panActivationKeyCode="Space"
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
            <Controls>
              {/* Layout, Filter & Search join the zoom stack in edit mode only —
                  Draw mode keeps just the native zoom/fit/lock controls. Moved
                  here from the top toolbar. */}
              {state.toolbarMode === 'edit' && (
                <>
                  <LayoutDropdownButton />
                  <FilterControls />
                  <button
                    type="button"
                    className="react-flow__controls-button rf-control-tool"
                    title="Search (/)"
                    aria-label="Search"
                    onClick={quickSearch.open}
                  >
                    <Search />
                  </button>
                  {canEdit && (
                    <button
                      type="button"
                      className="react-flow__controls-button rf-control-tool"
                      title="Checkpoints — save the canvas like a game"
                      aria-label="Checkpoints"
                      onClick={() => setShowCheckpoints(true)}
                    >
                      <Flag />
                    </button>
                  )}
                </>
              )}
            </Controls>
            <OffscreenNodeIndicator />
            <CanvasCursorsLayer sendCursor={sendCursor} />

            {/* Read-only / comment-only banner for restricted collaborators.
                Offset below the now-centered top toolbar so they don't overlap. */}
            {!permission.loading && !canEdit && (
              <Panel position="top-center" style={{ marginTop: 56 }}>
                <div className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 shadow-sm">
                  <Eye className="h-3.5 w-3.5" />
                  {permission.canComment
                    ? 'Comment-only — you can add comments but not edit this canvas'
                    : 'View-only — you don’t have edit access to this canvas'}
                </div>
              </Panel>
            )}

            {/* Top toolbar — anchored top-center of the canvas */}
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
                shapeStyle={state.whiteboardShapeStyle}
                onChangeShapeStyle={state.setWhiteboardShapeStyle}
                onSetWhiteboardTool={(tool: string) => {
                  log.debug('🎨 Whiteboard tool changed to:', tool);
                  // Ensure the tool is a valid WhiteboardTool
                  const validTools = [
                    'select',
                    'hand',
                    'eraser',
                    'lasso',
                    'rectangle',
                    'ellipse',
                    'arrow',
                    'line',
                    'text',
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
                onToggleGroups={toggleLayersPanel}
                groupsActive={showLayersPanel}
                onToggleOperators={() => setShowOperatorPanel((v) => !v)}
                operatorsActive={showOperatorPanel}
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

            {/* Selection Panel - Only show in edit mode */}
            {state.toolbarMode === 'edit' && (
              <Panel position="bottom-center">
                <SelectionPanel
                  selectedNodeIds={selectedNodeIds}
                  selectedGroupIds={state.selectedGroupIds}
                  onGroupNodes={requestGroupSelection}
                  onUngroupNodes={events.handleUngroupSelectedGroups}
                  onDeleteNodes={() => void canvasActions.deleteSelection()}
                  onDuplicateNodes={canvasActions.duplicateSelection}
                  onOpenSettings={events.handleOpenSelectedSettings}
                />
              </Panel>
            )}

            {/* React Flow Whiteboard Tools - Only render the active tool. Wrapped
                so scroll-pan / Ctrl+scroll-zoom still work while a tool overlay
                (which sits on top of React Flow) is capturing pointer events. */}
            {state.toolbarMode === 'draw' && !spaceHeld && (
              <DrawWheelZoom>
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

                {(state.whiteboardTool === 'rectangle' ||
                  state.whiteboardTool === 'ellipse' ||
                  state.whiteboardTool === 'arrow' ||
                  state.whiteboardTool === 'line') && (
                  <ShapeToolComponent
                    isActive={true}
                    shape={
                      state.whiteboardTool as
                        | 'rectangle'
                        | 'ellipse'
                        | 'arrow'
                        | 'line'
                    }
                    style={state.whiteboardShapeStyle}
                    onCommit={handleShapeCommit}
                  />
                )}

                {state.whiteboardTool === 'text' && (
                  <TextToolComponent
                    isActive={!textEditor}
                    onPlace={({ screenX, screenY, flow }) =>
                      setTextEditor({
                        screenX,
                        screenY,
                        flow,
                        value: '',
                        fontSize: 16,
                        color: state.whiteboardShapeStyle.stroke,
                      })
                    }
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
              </DrawWheelZoom>
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

      {/* First-run guided tour: launches once the graph is rendered when the
          welcome flow queued it (CVS-114). */}
      <CanvasTourLauncher ready={rfNodes.length > 0} />
      <DrawModeTip active={state.toolbarMode === 'draw'} />

      {/* Layers panel — left dock (Figma-style tree of all canvas content).
          Rendered here (inside ReactFlowProvider) so select+zoom work; the DOM
          portals into CanvasLayout's left dock column below the top bar. */}
      <LayersPanel
        selectedNodeIds={selectedNodeIds}
        focusedGroupId={focusedGroupId}
        unlinkedCount={unlinkedNodeIds.length}
        onFocusGroup={handleFocusGroup}
        onClearFocus={handleClearFocus}
        onCreateFromSelection={requestGroupSelection}
        onAddSelected={handleAddSelectedToGroup}
        onRemoveSelected={handleRemoveSelectedFromGroup}
        onRenameGroup={handleRenameGroup}
        onRecolorGroup={handleRecolorGroup}
        onDeleteGroup={handleDeleteGroup}
        onFocusUnlinked={handleFocusUnlinked}
      />

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

      {/* Inline text editor — shared by the Text tool (create) and double-click
          (re-edit). Fixed at the target's on-screen position. */}
      {textEditor && (
        <textarea
          autoFocus
          value={textEditor.value}
          onChange={(e) =>
            setTextEditor((prev) =>
              prev ? { ...prev, value: e.target.value } : prev
            )
          }
          onBlur={commitTextEditor}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              setTextEditor(null);
            } else if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              commitTextEditor();
            }
          }}
          placeholder="Type text…"
          className="fixed z-[1100] resize-none rounded-md border border-primary bg-background px-2 py-1 shadow-lg outline-none"
          style={{
            left: textEditor.screenX,
            top: textEditor.screenY,
            minWidth: 140,
            minHeight: 36,
            fontSize: textEditor.fontSize,
            color: textEditor.color,
          }}
        />
      )}

      {/* Name-the-group dialog — Ctrl+G / Group buttons route here. */}
      <GroupNameDialog
        open={!!groupDialog}
        defaultName={groupDialog?.defaultName ?? ''}
        count={groupDialog?.count ?? 0}
        onConfirm={handleGroupNameConfirm}
        onCancel={() => setGroupDialog(null)}
      />

      {/* Quick Search — opened from the bottom-left Controls search button. */}
      <QuickSearchCommand
        isOpen={quickSearch.isOpen}
        onClose={quickSearch.close}
        onResultSelect={(result) => {
          quickSearch.close();
          // Relationships resolve to edges, not nodes — nothing to center on.
          if (result.type === 'relationship') return;
          try {
            setNodes((nds: any[]) =>
              nds.map((n) => ({ ...n, selected: n.id === result.id }))
            );
            fitView({
              nodes: [{ id: result.id }],
              duration: 600,
              maxZoom: 1.2,
              padding: 0.4,
            });
          } catch (e) {
            console.warn('Failed to focus search result', e);
          }
        }}
      />

      {/* Checkpoints — game-style save/load, opened from the Controls flag button. */}
      {currentCanvasId && (
        <VersionHistoryPanel
          canvasId={currentCanvasId}
          isOpen={showCheckpoints}
          onClose={() => setShowCheckpoints(false)}
        />
      )}
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
