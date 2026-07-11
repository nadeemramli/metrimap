import { useCanvasStore } from '@/lib/stores';
import { track } from '@/shared/lib/analytics';
import { usePagePanel } from '@/features/canvas/stores/useCanvasPanelStore';
import { fireTipToast, useOnboardingStore } from '@/features/onboarding';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { usePageHeader } from '@/shared/hooks/usePageHeader';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import { useVisibilityStore } from '@/shared/stores/useVisibilityStore';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/queries/keys';
import {
  useDashboardData,
  useTrackedMetricValues,
} from '@/features/dashboard/hooks/useDashboardData';
import {
  createWidget,
  deleteWidget,
  updateLayouts,
  updateWidget,
} from '@/shared/lib/supabase/services/dashboards';
import {
  linkedStrategyForWidget,
  type WidgetStrategyLink,
} from '@/features/strategy/impact/widgetLinks';
import { measuredByNode } from '@/features/strategy/impact/measurement';
import { ImpactTraceDialog } from '@/features/strategy/components/ImpactTraceDialog';
import type {
  ImpactContract,
  MetricLink,
} from '@/features/strategy/impact/types';
import type {
  CanvasNode,
  GroupNode,
  MetricCard,
  MetricValue,
} from '@/shared/types';
import {
  DEFAULT_WIDGET_LAYOUT,
  type DashboardWidget,
  type WidgetConfig,
  type WidgetType,
} from '@/features/dashboard/types';
import {
  WidgetCard,
  type WidgetMoveTarget,
} from '@/features/dashboard/components/WidgetCard';
import { OnCanvasCharts } from '@/features/dashboard/components/OnCanvasCharts';
import { GroupDashboard } from '@/features/dashboard/components/GroupDashboard';
import { Badge } from '@/shared/components/ui/badge';
import {
  WidgetConfigSheet,
  type MetricOption,
} from '@/features/dashboard/components/WidgetConfigSheet';
import type { WidgetDataSources } from '@/features/dashboard/utils/widgetData';
import {
  chartNodeToWidgetInput,
  describeChartNode,
} from '@/features/dashboard/utils/chartImport';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  ChartSpline,
  Eye,
  LayoutGrid,
  Lock,
  Pencil,
  Plus,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import GridLayout, { WidthProvider, type Layout } from 'react-grid-layout';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ReactGridLayout = WidthProvider(GridLayout);
const COLS = 12;
const ROW_HEIGHT = 40;

const CUSTOM_VIEW = '__custom__';
const ONCANVAS_VIEW = '__oncanvas__';

// Stable empty defaults so derived useMemos don't churn on every render while the query
// resolves (a fresh `[]`/`{}` each render would defeat memoization).
const EMPTY_NAMES: Record<string, string> = {};
const EMPTY_CARDS: MetricCard[] = [];
const EMPTY_GROUPS: GroupNode[] = [];
const EMPTY_NODES: CanvasNode[] = [];
const EMPTY_IMPACT: Array<{ contract: ImpactContract; links: MetricLink[] }> = [];
const EMPTY_VALUES: Record<string, MetricValue[]> = {};

export default function DashboardPage() {
  const { canvasId } = useParams();
  const navigate = useNavigate();
  const client = useClerkSupabase();
  const storeCanvas = useCanvasStore((s) => s.canvas);
  const queryClient = useQueryClient();

  // Server state via TanStack Query (CVS-70): cached + stale-while-revalidate, so
  // revisiting the dashboard is instant instead of refetching behind a spinner.
  // isPending (not isLoading): a disabled query — e.g. while the Clerk client is
  // still initializing — has isLoading=false but no data, which would flash the
  // empty state; isPending stays true until data actually exists.
  const { data: dashboardData, isPending } = useDashboardData(canvasId);
  const trackedNames = dashboardData?.trackedNames ?? EMPTY_NAMES;
  // Persisted nodes + groups for this canvas (drives the group dashboards).
  const loadedCards = dashboardData?.cards ?? EMPTY_CARDS;
  const loadedGroups = dashboardData?.groups ?? EMPTY_GROUPS;
  const chartNodes = dashboardData?.chartNodes ?? EMPTY_NODES;
  const impactEntries = dashboardData?.impactEntries ?? EMPTY_IMPACT;

  // Widgets stay in local state so drag/resize/create/remove feel instant; seeded from the
  // query and re-seeded whenever a mutation invalidates and the bundle refetches.
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  useEffect(() => {
    if (dashboardData) setWidgets(dashboardData.widgets);
  }, [dashboardData]);

  const invalidateDashboard = () => {
    if (canvasId) void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.data(canvasId) });
  };

  // Onboarding checklist signal (CVS-114): "Open your dashboard".
  useEffect(() => {
    useOnboardingStore.getState().markVisitedDashboard();
  }, []);

  // Retention signal: a genuine dashboard view (once per canvas, only after the
  // data resolves — not on the loading spinner or on every re-render).
  const trackedDashboardView = useRef<string | null>(null);
  useEffect(() => {
    if (!isPending && canvasId && trackedDashboardView.current !== canvasId) {
      trackedDashboardView.current = canvasId;
      track('dashboard_viewed', { dashboard_id: canvasId });
    }
  }, [isPending, canvasId]);

  const [editMode, setEditMode] = useState(false);
  // One-shot dashboard-editing tip on first Edit (CVS-114 slice 4).
  useEffect(() => {
    if (editMode)
      fireTipToast(
        'dashboard-edit',
        'Editing: drag widgets by their handle, Import chart pulls canvas charts into this view, and Move to sends a widget to another dashboard.'
      );
  }, [editMode]);
  // Widget config docks into the shared right slot (one open panel app-wide);
  // the store owns the open flag, `editing` carries the payload.
  const pagePanel = usePagePanel();
  const configOpen = pagePanel.openId?.startsWith('widget:') ?? false;
  const setConfigOpen = (open: boolean) => {
    if (!open) pagePanel.close();
  };
  const [editing, setEditing] = useState<DashboardWidget | null>(null);
  const [view, setView] = useState<string>(CUSTOM_VIEW);
  const [traceNodeId, setTraceNodeId] = useState<string | null>(null);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingLayout = useRef<Layout[] | null>(null);

  // Prefer the live in-canvas store when it matches this canvas (fresher, holds
  // unsaved edits); otherwise fall back to what we persisted from the DB.
  const storeMatches = storeCanvas?.id === canvasId;
  const cards: MetricCard[] = useMemo(
    () => (storeMatches ? (storeCanvas?.nodes ?? []) : loadedCards),
    [storeMatches, storeCanvas?.nodes, loadedCards]
  );

  // Node-level visibility (CVS-123): a dashboard surfaces only what the viewer
  // may see. hide_node cards are already RLS-filtered from the project load;
  // this masks hide_value cards from widgets + the group view, and tells the
  // owner how many are hidden. Reuses the same resolver as the canvas (CVS-122).
  const ensureVisibility = useVisibilityStore((s) => s.ensureLoaded);
  const restrictedSet = useVisibilityStore(
    (s) => s.restrictedByProject[canvasId ?? '']
  );
  useEffect(() => {
    if (client && canvasId) ensureVisibility(canvasId, client);
  }, [client, canvasId, ensureVisibility]);
  const visibleCards: MetricCard[] = useMemo(
    () => (restrictedSet ? cards.filter((c) => !restrictedSet.has(c.id)) : cards),
    [cards, restrictedSet]
  );
  const restrictedCount = cards.length - visibleCards.length;
  // Trust the live store's list outright when it matches (including an empty
  // one, so deleting the last group doesn't resurrect it from the stale query).
  const groups: GroupNode[] = useMemo(
    () => (storeMatches ? (storeCanvas?.groups ?? []) : loadedGroups),
    [storeMatches, storeCanvas?.groups, loadedGroups]
  );

  // Default to the first group's dashboard when groups exist, else Custom.
  // One-shot per canvas: later groups-array identity changes (e.g. a
  // collaborator's edit updating the store) must not yank the user off Custom.
  const defaultViewApplied = useRef<string | null>(null);
  useEffect(() => {
    if (groups.length > 0 && canvasId && defaultViewApplied.current !== canvasId) {
      defaultViewApplied.current = canvasId;
      setView((prev) =>
        prev === CUSTOM_VIEW && groups[0] ? groups[0].id : prev
      );
    }
  }, [groups, canvasId]);

  const activeGroup = useMemo(
    () => groups.find((g) => g.id === view) ?? null,
    [groups, view]
  );
  const isOnCanvas = view === ONCANVAS_VIEW;

  // Widgets scoped to the current dashboard. Widgets pointing at a deleted
  // group fall back to Custom so nothing silently disappears.
  const liveGroupIds = useMemo(() => new Set(groups.map((g) => g.id)), [groups]);
  const widgetGroupId = useMemo(
    () => (w: DashboardWidget) =>
      w.group_id && liveGroupIds.has(w.group_id) ? w.group_id : null,
    [liveGroupIds]
  );
  const viewGroupId = activeGroup?.id ?? null;
  const viewWidgets = useMemo(
    () =>
      isOnCanvas
        ? []
        : widgets.filter((w) => widgetGroupId(w) === viewGroupId),
    [widgets, widgetGroupId, viewGroupId, isOnCanvas]
  );

  // Fetch the shared series for every tracked metric referenced by a widget.
  const referencedTrackedIds = useMemo(() => {
    const ids = new Set<string>();
    widgets.forEach((w) => {
      if (w.config.source === 'tracked') {
        (w.config.trackedMetricIds ?? []).forEach((id) => ids.add(id));
      }
    });
    // Also the metrics referenced by impact contracts, so measured deltas resolve.
    for (const { links } of impactEntries) {
      for (const l of links) if (l.refSource === 'tracked' && l.trackedMetricId) ids.add(l.trackedMetricId);
    }
    return Array.from(ids);
  }, [widgets, impactEntries]);

  const { data: trackedValues = EMPTY_VALUES } = useTrackedMetricValues(referencedTrackedIds);

  const sources: WidgetDataSources = useMemo(
    () => ({ cards: visibleCards, trackedValues, trackedNames }),
    [visibleCards, trackedValues, trackedNames]
  );

  // Linked Strategy bets per widget (CVS-172). currentPeriod drives review-ready.
  // Both maps use visibleCards (like `sources`) so hide_value cards never leak
  // their series into impact badges or strategy-link matching (CVS-123).
  const currentPeriod = useMemo(() => new Date().toISOString().slice(0, 7), []);
  const strategyLinksByWidget = useMemo(() => {
    const map: Record<string, WidgetStrategyLink[]> = {};
    for (const w of widgets) {
      map[w.id] = linkedStrategyForWidget(w, impactEntries, visibleCards);
    }
    return map;
  }, [widgets, impactEntries, visibleCards]);

  // Measured deltas per strategy node (CVS-176), for the badge overlay.
  const measuredMap = useMemo(
    () => measuredByNode(impactEntries, visibleCards, trackedValues),
    [impactEntries, visibleCards, trackedValues]
  );

  const openStrategyItem = useMemo(
    () => () => {
      if (canvasId) navigate(`/canvas/${canvasId}/strategy`);
    },
    [canvasId, navigate]
  );

  const trackedOptions: MetricOption[] = useMemo(
    () =>
      Object.entries(trackedNames).map(([id, label]) => ({ id, label })),
    [trackedNames]
  );
  const cardOptions: MetricOption[] = useMemo(
    () =>
      cards
        .filter((c) => c && c.title)
        .map((c) => ({ id: c.id, label: c.title })),
    [cards]
  );

  const gridLayout: Layout[] = useMemo(
    () =>
      viewWidgets.map((w) => ({
        i: w.id,
        x: w.layout.x,
        y: w.layout.y,
        w: w.layout.w,
        h: w.layout.h,
        minW: 3,
        minH: 4,
      })),
    [viewWidgets]
  );

  // Persist whatever layout is pending right now (debounce flush). Kept
  // separate from the timer so a view switch can flush instead of discard.
  const flushLayoutSave = () => {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
    const layout = pendingLayout.current;
    pendingLayout.current = null;
    if (!layout || !client) return;
    updateLayouts(
      layout.map((l) => ({
        id: l.i,
        layout: { x: l.x, y: l.y, w: l.w, h: l.h },
      })),
      client
    ).catch(() => toast.error('Failed to save layout'));
  };

  const handleLayoutChange = (layout: Layout[]) => {
    if (!editMode) return;
    // Update local positions immediately, debounce the persistence.
    setWidgets((prev) =>
      prev.map((w) => {
        const l = layout.find((x) => x.i === w.id);
        return l ? { ...w, layout: { x: l.x, y: l.y, w: l.w, h: l.h } } : w;
      })
    );
    // react-grid-layout also fires onLayoutChange when the layout prop swaps
    // (e.g. switching view pills). If a save is still pending for a different
    // widget set, flush it first so the previous view's drag isn't lost.
    const pending = pendingLayout.current;
    if (pending) {
      const pendingIds = new Set(pending.map((l) => l.i));
      const sameSet =
        pendingIds.size === layout.length &&
        layout.every((l) => pendingIds.has(l.i));
      if (!sameSet) flushLayoutSave();
    }
    pendingLayout.current = layout;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(flushLayoutSave, 700);
  };

  const openAdd = () => {
    setEditing(null);
    pagePanel.open('widget:new');
  };

  const openConfigure = (widget: DashboardWidget) => {
    setEditing(widget);
    pagePanel.open(`widget:${widget.id}`);
  };

  const handleSave = async (draft: {
    title: string;
    widgetType: WidgetType;
    config: WidgetConfig;
  }) => {
    if (!client || !canvasId) return;
    try {
      if (editing) {
        await updateWidget(
          editing.id,
          {
            title: draft.title,
            widgetType: draft.widgetType,
            config: draft.config,
          },
          client
        );
        setWidgets((prev) =>
          prev.map((w) =>
            w.id === editing.id
              ? {
                  ...w,
                  title: draft.title,
                  widget_type: draft.widgetType,
                  config: draft.config,
                }
              : w
          )
        );
      } else {
        // Drop the new widget at the bottom of the current dashboard's grid.
        const maxY = viewWidgets.reduce(
          (m, w) => Math.max(m, w.layout.y + w.layout.h),
          0
        );
        const created = await createWidget(
          {
            projectId: canvasId,
            groupId: viewGroupId,
            title: draft.title,
            widgetType: draft.widgetType,
            config: draft.config,
            layout: { ...DEFAULT_WIDGET_LAYOUT, y: maxY },
            sortIndex: widgets.length,
          },
          client
        );
        setWidgets((prev) => [...prev, created]);
      }
      invalidateDashboard();
    } catch {
      toast.error('Failed to save widget');
    }
  };

  const handleRemove = async (id: string) => {
    if (!client) return;
    const prev = widgets;
    setWidgets((w) => w.filter((x) => x.id !== id));
    try {
      await deleteWidget(id, client);
      invalidateDashboard();
    } catch {
      setWidgets(prev);
      toast.error('Failed to remove widget');
    }
  };

  // Copy a canvas chart node's config into a new widget; the series binding
  // stays live because widgets resolve `card`-sourced series the same way.
  // Lands on the given dashboard (null = Custom, default = the current view).
  const handleImportChart = async (
    node: CanvasNode,
    groupId: string | null = viewGroupId
  ) => {
    if (!client || !canvasId) return;
    const targetWidgets = widgets.filter(
      (w) => widgetGroupId(w) === groupId
    );
    const maxY = targetWidgets.reduce(
      (m, w) => Math.max(m, w.layout.y + w.layout.h),
      0
    );
    try {
      const created = await createWidget(
        chartNodeToWidgetInput(node, {
          sortIndex: widgets.length,
          y: maxY,
          groupId,
        }),
        client
      );
      setWidgets((prev) => [...prev, created]);
      invalidateDashboard();
      const dest = groupId
        ? groups.find((g) => g.id === groupId)?.name || 'group dashboard'
        : 'Custom';
      toast.success(`Chart added to ${dest}`);
    } catch {
      toast.error('Failed to import chart');
    }
  };

  // Transfer a widget to another dashboard (null = Custom). Optimistic.
  const handleMoveWidget = async (
    widget: DashboardWidget,
    groupId: string | null
  ) => {
    if (!client) return;
    const prev = widgets;
    setWidgets((ws) =>
      ws.map((w) => (w.id === widget.id ? { ...w, group_id: groupId } : w))
    );
    try {
      await updateWidget(widget.id, { groupId }, client);
      invalidateDashboard();
      const dest = groupId
        ? groups.find((g) => g.id === groupId)?.name || 'group dashboard'
        : 'Custom';
      toast.success(`Moved "${widget.title || 'widget'}" to ${dest}`);
    } catch {
      setWidgets(prev);
      toast.error('Failed to move widget');
    }
  };

  // Move targets = every dashboard except the widget's current one.
  const moveTargetsFor = (w: DashboardWidget): WidgetMoveTarget[] => {
    const current = widgetGroupId(w);
    const targets: WidgetMoveTarget[] = groups
      .filter((g) => g.id !== current)
      .map((g) => ({ id: g.id, label: g.name, color: g.color }));
    if (current !== null)
      targets.unshift({ id: null, label: 'Custom', color: '#94a3b8' });
    return targets;
  };

  const isCustom = view === CUSTOM_VIEW;

  // The shared top bar stays clean and consistent across pages: title +
  // description only. Custom-view actions live on the view-selector row below.
  usePageHeader({
    title: 'Dashboard',
    description: 'Operational metrics for this canvas',
  });

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  // Nothing to show at all: no groups on the canvas and no custom widgets.
  if (groups.length === 0 && widgets.length === 0) {
    return (
      <div className="p-6">
        <Card className="p-12">
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <LayoutGrid className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Build your dashboard</h3>
              <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                Group nodes together on the canvas to auto-generate a dashboard
                for that subflow — or add chart, KPI, and table widgets bound to
                your tracked metrics or in-canvas cards.
              </p>
            </div>
            <Button
              onClick={() => {
                setEditMode(true);
                openAdd();
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add your first widget
            </Button>
          </div>
        </Card>

        <WidgetConfigSheet
          open={configOpen}
          onOpenChange={setConfigOpen}
          widget={editing}
          trackedOptions={trackedOptions}
          cardOptions={cardOptions}
          onSave={handleSave}
        />
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* View selector: one dashboard per canvas group, plus custom widgets. */}
      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        {groups.map((g) => (
          <button
            key={g.id}
            onClick={() => setView(g.id)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors ${
              view === g.id
                ? 'border-transparent bg-primary text-primary-foreground'
                : 'border-border bg-background hover:bg-muted'
            }`}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: g.color || '#6366f1' }}
            />
            {g.name}
          </button>
        ))}
        <button
          onClick={() => setView(CUSTOM_VIEW)}
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors ${
            isCustom
              ? 'border-transparent bg-primary text-primary-foreground'
              : 'border-border bg-background hover:bg-muted'
          }`}
        >
          <LayoutGrid className="h-3.5 w-3.5" />
          Custom
        </button>
        <button
          onClick={() => setView(ONCANVAS_VIEW)}
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors ${
            isOnCanvas
              ? 'border-transparent bg-primary text-primary-foreground'
              : 'border-border bg-background hover:bg-muted'
          }`}
        >
          <ChartSpline className="h-3.5 w-3.5" />
          On Canvas
        </button>

        {/* Per-dashboard actions — every dashboard (group or Custom) has its
            own editable widget grid; On Canvas is a read-only gallery. */}
        {!isOnCanvas && (
          <div className="ml-auto flex items-center gap-1.5">
            {editMode && chartNodes.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 gap-1.5">
                    <ChartSpline className="h-3.5 w-3.5" />
                    Import chart
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuLabel className="text-xs">
                    Add a canvas chart to{' '}
                    {activeGroup ? `“${activeGroup.name}”` : 'Custom'}
                  </DropdownMenuLabel>
                  {chartNodes.map((node) => {
                    const meta = describeChartNode(node, cards, groups);
                    return (
                      <DropdownMenuItem
                        key={node.id}
                        onSelect={() => void handleImportChart(node)}
                        className="flex-col items-start gap-0.5 py-2"
                      >
                        <span className="flex w-full items-center gap-2">
                          <ChartSpline className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          <span className="min-w-0 flex-1 truncate text-sm font-medium">
                            {meta.title}
                          </span>
                        </span>
                        <span className="pl-5.5 text-xs text-muted-foreground">
                          {meta.chartType} · {meta.seriesCount} series
                          {meta.updatedAt
                            ? ` · updated ${new Date(meta.updatedAt).toLocaleDateString()}`
                            : ''}
                        </span>
                        {meta.groupNames.length > 0 && (
                          <span className="flex flex-wrap gap-1 pl-5.5">
                            {meta.groupNames.map((name) => (
                              <Badge
                                key={name}
                                variant="secondary"
                                className="px-1.5 py-0 text-[10px]"
                              >
                                {name}
                              </Badge>
                            ))}
                          </span>
                        )}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {editMode && (
              <Button size="sm" className="h-7 gap-1.5" onClick={openAdd}>
                <Plus className="h-3.5 w-3.5" />
                Add widget
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1.5"
              onClick={() => setEditMode((e) => !e)}
            >
              {editMode ? (
                <>
                  <Eye className="h-3.5 w-3.5" />
                  Done
                </>
              ) : (
                <>
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {restrictedCount > 0 && (
        <div className="mb-3 flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-700">
          <Lock className="h-3.5 w-3.5" />
          {restrictedCount} restricted metric{restrictedCount === 1 ? '' : 's'}{' '}
          hidden from this view.
        </div>
      )}

      {isOnCanvas ? (
        <OnCanvasCharts
          chartNodes={chartNodes}
          cards={cards}
          groups={groups}
          sources={sources}
          onImport={(node, groupId) => void handleImportChart(node, groupId)}
          onOpenCanvas={() => canvasId && navigate(`/canvas/${canvasId}`)}
        />
      ) : (
        <>
          {activeGroup && (
            <GroupDashboard group={activeGroup} cards={visibleCards} />
          )}

          {viewWidgets.length === 0 ? (
            isCustom ? (
              <Card className="p-10">
                <div className="space-y-3 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                    <LayoutGrid className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <p className="mx-auto max-w-md text-sm text-muted-foreground">
                    No custom widgets yet. Add chart, KPI, and table widgets
                    bound to your tracked metrics or in-canvas cards.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditMode(true);
                      openAdd();
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add widget
                  </Button>
                </div>
              </Card>
            ) : editMode ? (
              <p className="mt-4 rounded-md border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
                No widgets on this group's dashboard yet — use Import chart or
                Add widget above, or move one here from another dashboard.
              </p>
            ) : null
          ) : (
            <div className={activeGroup ? 'mt-4' : undefined}>
              <ReactGridLayout
                className="layout"
                layout={gridLayout}
                cols={COLS}
                rowHeight={ROW_HEIGHT}
                margin={[16, 16]}
                isDraggable={editMode}
                isResizable={editMode}
                draggableHandle=".widget-drag-handle"
                onLayoutChange={handleLayoutChange}
                compactType="vertical"
              >
                {viewWidgets.map((w) => (
                  <div key={w.id}>
                    <WidgetCard
                      widget={w}
                      sources={sources}
                      editMode={editMode}
                      onConfigure={openConfigure}
                      onRemove={handleRemove}
                      moveTargets={moveTargetsFor(w)}
                      onMove={(widget, groupId) =>
                        void handleMoveWidget(widget, groupId)
                      }
                      strategyLinks={strategyLinksByWidget[w.id]}
                      measuredMap={measuredMap}
                      currentPeriod={currentPeriod}
                      onOpenStrategy={openStrategyItem}
                      onOpenTrace={setTraceNodeId}
                    />
                  </div>
                ))}
              </ReactGridLayout>
            </div>
          )}
        </>
      )}

      <WidgetConfigSheet
        open={configOpen}
        onOpenChange={setConfigOpen}
        widget={editing}
        trackedOptions={trackedOptions}
        cardOptions={cardOptions}
        onSave={handleSave}
      />

      <ImpactTraceDialog
        nodeId={traceNodeId}
        projectId={canvasId}
        open={Boolean(traceNodeId)}
        onOpenChange={(o) => !o && setTraceNodeId(null)}
      />
    </div>
  );
}
