import { useCanvasStore } from '@/lib/stores';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { usePageHeader } from '@/shared/hooks/usePageHeader';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import {
  getMetricValuesByMetricIds,
  listTrackedMetrics,
} from '@/shared/lib/supabase/services/trackedMetrics';
import {
  createWidget,
  deleteWidget,
  listWidgets,
  updateLayouts,
  updateWidget,
} from '@/shared/lib/supabase/services/dashboards';
import { getProjectById } from '@/shared/lib/supabase/services/projects';
import { getCanvasNodesByProject } from '@/shared/lib/supabase/services/canvasNodes';
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
import { WidgetCard } from '@/features/dashboard/components/WidgetCard';
import { GroupDashboard } from '@/features/dashboard/components/GroupDashboard';
import {
  WidgetConfigSheet,
  type MetricOption,
} from '@/features/dashboard/components/WidgetConfigSheet';
import type { WidgetDataSources } from '@/features/dashboard/utils/widgetData';
import { chartNodeToWidgetInput } from '@/features/dashboard/utils/chartImport';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  ChartSpline,
  Eye,
  LayoutGrid,
  Loader2,
  Pencil,
  Plus,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import GridLayout, { WidthProvider, type Layout } from 'react-grid-layout';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ReactGridLayout = WidthProvider(GridLayout);
const COLS = 12;
const ROW_HEIGHT = 40;

const CUSTOM_VIEW = '__custom__';

export default function DashboardPage() {
  const { canvasId } = useParams();
  const client = useClerkSupabase();
  const storeCanvas = useCanvasStore((s) => s.canvas);

  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [trackedNames, setTrackedNames] = useState<Record<string, string>>({});
  const [trackedValues, setTrackedValues] = useState<
    Record<string, MetricValue[]>
  >({});
  // Persisted nodes + groups for this canvas (drives the group dashboards).
  const [loadedCards, setLoadedCards] = useState<MetricCard[]>([]);
  const [loadedGroups, setLoadedGroups] = useState<GroupNode[]>([]);
  const [chartNodes, setChartNodes] = useState<CanvasNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [editing, setEditing] = useState<DashboardWidget | null>(null);
  const [view, setView] = useState<string>(CUSTOM_VIEW);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Prefer the live in-canvas store when it matches this canvas (fresher, holds
  // unsaved edits); otherwise fall back to what we persisted from the DB.
  const storeMatches = storeCanvas?.id === canvasId;
  const cards: MetricCard[] = useMemo(
    () => (storeMatches ? (storeCanvas?.nodes ?? []) : loadedCards),
    [storeMatches, storeCanvas?.nodes, loadedCards]
  );
  const groups: GroupNode[] = useMemo(
    () =>
      storeMatches && (storeCanvas?.groups?.length ?? 0) > 0
        ? (storeCanvas?.groups ?? [])
        : loadedGroups,
    [storeMatches, storeCanvas?.groups, loadedGroups]
  );

  // Load widgets + the catalog (names) + the project (nodes/groups) for this canvas.
  useEffect(() => {
    if (!client || !canvasId) return;
    setLoading(true);
    Promise.all([
      listWidgets(canvasId, client),
      listTrackedMetrics(client),
      getProjectById(canvasId, client).catch(() => null),
      getCanvasNodesByProject(canvasId, client).catch(
        () => [] as CanvasNode[]
      ),
    ])
      .then(([w, metrics, project, nodes]) => {
        setWidgets(w);
        setTrackedNames(
          Object.fromEntries(metrics.map((m) => [m.id, m.name]))
        );
        setLoadedCards(project?.nodes ?? []);
        setLoadedGroups(project?.groups ?? []);
        setChartNodes(nodes.filter((n) => n.nodeType === 'chartNode'));
      })
      .catch(() => {
        setWidgets([]);
        setTrackedNames({});
        setLoadedCards([]);
        setLoadedGroups([]);
        setChartNodes([]);
      })
      .finally(() => setLoading(false));
  }, [client, canvasId]);

  // Default to the first group's dashboard when groups exist, else Custom.
  useEffect(() => {
    if (groups.length > 0) {
      setView((prev) =>
        prev === CUSTOM_VIEW && groups[0] ? groups[0].id : prev
      );
    }
  }, [groups]);

  const activeGroup = useMemo(
    () => groups.find((g) => g.id === view) ?? null,
    [groups, view]
  );

  // Fetch the shared series for every tracked metric referenced by a widget.
  const referencedTrackedIds = useMemo(() => {
    const ids = new Set<string>();
    widgets.forEach((w) => {
      if (w.config.source === 'tracked') {
        (w.config.trackedMetricIds ?? []).forEach((id) => ids.add(id));
      }
    });
    return Array.from(ids);
  }, [widgets]);

  useEffect(() => {
    if (!client || referencedTrackedIds.length === 0) {
      setTrackedValues({});
      return;
    }
    getMetricValuesByMetricIds(referencedTrackedIds, client)
      .then(setTrackedValues)
      .catch(() => setTrackedValues({}));
  }, [client, referencedTrackedIds]);

  const sources: WidgetDataSources = useMemo(
    () => ({ cards, trackedValues, trackedNames }),
    [cards, trackedValues, trackedNames]
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
      widgets.map((w) => ({
        i: w.id,
        x: w.layout.x,
        y: w.layout.y,
        w: w.layout.w,
        h: w.layout.h,
        minW: 3,
        minH: 4,
      })),
    [widgets]
  );

  const handleLayoutChange = (layout: Layout[]) => {
    if (!editMode) return;
    // Update local positions immediately, debounce the persistence.
    setWidgets((prev) =>
      prev.map((w) => {
        const l = layout.find((x) => x.i === w.id);
        return l ? { ...w, layout: { x: l.x, y: l.y, w: l.w, h: l.h } } : w;
      })
    );
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      if (!client) return;
      updateLayouts(
        layout.map((l) => ({
          id: l.i,
          layout: { x: l.x, y: l.y, w: l.w, h: l.h },
        })),
        client
      ).catch(() => toast.error('Failed to save layout'));
    }, 700);
  };

  const openAdd = () => {
    setEditing(null);
    setConfigOpen(true);
  };

  const openConfigure = (widget: DashboardWidget) => {
    setEditing(widget);
    setConfigOpen(true);
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
        // Drop the new widget at the bottom of the grid.
        const maxY = widgets.reduce(
          (m, w) => Math.max(m, w.layout.y + w.layout.h),
          0
        );
        const created = await createWidget(
          {
            projectId: canvasId,
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
    } catch {
      setWidgets(prev);
      toast.error('Failed to remove widget');
    }
  };

  // Copy a canvas chart node's config into a new widget; the series binding
  // stays live because widgets resolve `card`-sourced series the same way.
  const handleImportChart = async (node: CanvasNode) => {
    if (!client || !canvasId) return;
    const maxY = widgets.reduce(
      (m, w) => Math.max(m, w.layout.y + w.layout.h),
      0
    );
    try {
      const created = await createWidget(
        chartNodeToWidgetInput(node, { sortIndex: widgets.length, y: maxY }),
        client
      );
      setWidgets((prev) => [...prev, created]);
      toast.success('Chart added to dashboard');
    } catch {
      toast.error('Failed to import chart');
    }
  };

  const isCustom = view === CUSTOM_VIEW;

  usePageHeader({
    title: 'Dashboard',
    description: 'Operational metrics for this canvas',
    actions: isCustom ? (
      <>
        {editMode && chartNodes.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 gap-1.5">
                <ChartSpline className="h-3.5 w-3.5" />
                Import chart
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {chartNodes.map((node) => {
                const data = (node.data ?? {}) as { title?: string };
                return (
                  <DropdownMenuItem
                    key={node.id}
                    onSelect={() => void handleImportChart(node)}
                  >
                    {data.title || node.title || 'Chart'}
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
      </>
    ) : null,
    deps: [editMode, isCustom, chartNodes, widgets],
  });

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
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
      </div>

      {activeGroup ? (
        <GroupDashboard group={activeGroup} cards={cards} />
      ) : widgets.length === 0 ? (
        <Card className="p-10">
          <div className="space-y-3 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <LayoutGrid className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="mx-auto max-w-md text-sm text-muted-foreground">
              No custom widgets yet. Add chart, KPI, and table widgets bound to
              your tracked metrics or in-canvas cards.
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
      ) : (
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
          {widgets.map((w) => (
            <div key={w.id}>
              <WidgetCard
                widget={w}
                sources={sources}
                editMode={editMode}
                onConfigure={openConfigure}
                onRemove={handleRemove}
              />
            </div>
          ))}
        </ReactGridLayout>
      )}

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
