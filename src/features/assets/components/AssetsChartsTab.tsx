import type { ChartNodeData } from '@/features/canvas/components/nodes/chart-node';
import { chartNodeToWidgetInput } from '@/features/dashboard/utils/chartImport';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import { getCanvasNodesByProject } from '@/shared/lib/supabase/services/canvasNodes';
import {
  createWidget,
  listWidgets,
} from '@/shared/lib/supabase/services/dashboards';
import type { CanvasNode } from '@/shared/types';
import { ChartSpline, ExternalLink, LayoutGrid, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Operative view over the canvas's chart (visualization) nodes: see each
// chart's binding at a glance, push it to the Dashboard as a widget, or jump
// back to the canvas.
interface AssetsChartsTabProps {
  canvasId: string;
}

export function AssetsChartsTab({ canvasId }: AssetsChartsTabProps) {
  const client = useClerkSupabase();
  const navigate = useNavigate();
  const [chartNodes, setChartNodes] = useState<CanvasNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);

  useEffect(() => {
    if (!client || !canvasId) return;
    setLoading(true);
    getCanvasNodesByProject(canvasId, client)
      .then((nodes) =>
        setChartNodes(nodes.filter((n) => n.nodeType === 'chartNode'))
      )
      .catch(() => setChartNodes([]))
      .finally(() => setLoading(false));
  }, [client, canvasId]);

  const addToDashboard = async (node: CanvasNode) => {
    if (!client) return;
    setAddingId(node.id);
    try {
      const widgets = await listWidgets(canvasId, client);
      const maxY = widgets.reduce(
        (m, w) => Math.max(m, w.layout.y + w.layout.h),
        0
      );
      await createWidget(
        chartNodeToWidgetInput(node, { sortIndex: widgets.length, y: maxY }),
        client
      );
      toast.success('Chart added to dashboard');
    } catch {
      toast.error('Failed to add chart to dashboard');
    } finally {
      setAddingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (chartNodes.length === 0) {
    return (
      <Card>
        <CardContent className="p-10 text-center">
          <ChartSpline className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="mx-auto max-w-md text-sm text-muted-foreground">
            No chart nodes on this canvas yet. Add a Visualization node on the
            canvas and bind it to metric cards — it shows up here, ready to
            push onto the Dashboard.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="divide-y p-0">
        {chartNodes.map((node) => {
          const data = (node.data ?? {}) as ChartNodeData;
          const seriesCount = data.seriesCardIds?.length ?? 0;
          return (
            <div
              key={node.id}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {data.title || node.title || 'Chart'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {data.chartType ?? 'area'} · {seriesCount} series
                </p>
              </div>
              <div className="flex flex-shrink-0 items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1.5"
                  disabled={addingId === node.id}
                  onClick={() => void addToDashboard(node)}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  {addingId === node.id ? 'Adding…' : 'Add to dashboard'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1.5"
                  onClick={() => navigate(`/canvas/${canvasId}`)}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Canvas
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export default AssetsChartsTab;
