import { MetricChart, type ChartType } from '@/shared/components/charts/MetricChart';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { describeChartNode } from '@/features/dashboard/utils/chartImport';
import {
  resolveWidget,
  type WidgetDataSources,
} from '@/features/dashboard/utils/widgetData';
import type { CanvasNode, GroupNode, MetricCard } from '@/shared/types';
import { ChartSpline, ExternalLink, LayoutGrid, Plus } from 'lucide-react';

// "On Canvas" dashboard view: every chart node living on the canvas, with its
// metadata and a live preview (same series resolution widgets use). Charts can
// be added to the Custom dashboard or any group dashboard from here.

export interface OnCanvasChartsProps {
  chartNodes: CanvasNode[];
  cards: MetricCard[];
  groups: GroupNode[];
  sources: WidgetDataSources;
  onImport: (node: CanvasNode, groupId: string | null) => void;
  onOpenCanvas: () => void;
}

export function OnCanvasCharts({
  chartNodes,
  cards,
  groups,
  sources,
  onImport,
  onOpenCanvas,
}: OnCanvasChartsProps) {
  if (chartNodes.length === 0) {
    return (
      <Card className="p-10">
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <ChartSpline className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="mx-auto max-w-md text-sm text-muted-foreground">
            No chart nodes on this canvas yet. Add a Visualization node on the
            canvas and it will show up here.
          </p>
          <Button size="sm" variant="outline" onClick={onOpenCanvas}>
            <ExternalLink className="mr-2 h-3.5 w-3.5" />
            Open canvas
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {chartNodes.map((node) => {
        const meta = describeChartNode(node, cards, groups);
        const resolved = resolveWidget(
          {
            source: 'card',
            cardIds:
              ((node.data ?? {}) as { seriesCardIds?: string[] })
                .seriesCardIds ?? [],
            display: { showLegend: false },
          },
          sources
        );
        return (
          <Card
            key={node.id}
            className="flex flex-col overflow-hidden transition-all duration-150 ease-out hover:border-primary/30 hover:shadow-md"
          >
            <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 py-3">
              <div className="min-w-0">
                <CardTitle className="truncate text-sm">{meta.title}</CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {meta.chartType} · {meta.seriesCount} series
                  {meta.updatedAt
                    ? ` · updated ${new Date(meta.updatedAt).toLocaleDateString()}`
                    : ''}
                </p>
                {meta.groupNames.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {meta.groupNames.map((name) => (
                      <Badge
                        key={name}
                        variant="secondary"
                        className="px-1.5 py-0 text-[10px]"
                      >
                        {name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline" className="h-7 gap-1">
                      <Plus className="h-3.5 w-3.5" />
                      Add to
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuLabel className="text-xs">
                      Add this chart to
                    </DropdownMenuLabel>
                    <DropdownMenuItem onSelect={() => onImport(node, null)}>
                      <LayoutGrid className="mr-2 h-3.5 w-3.5" />
                      Custom dashboard
                    </DropdownMenuItem>
                    {groups.map((g) => (
                      <DropdownMenuItem
                        key={g.id}
                        onSelect={() => onImport(node, g.id)}
                      >
                        <span
                          className="mr-2 h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: g.color || '#6366f1' }}
                        />
                        <span className="truncate">{g.name}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                  onClick={onOpenCanvas}
                  title="Open on canvas"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 pb-3">
              <div className="h-44">
                <MetricChart
                  chartType={meta.chartType as ChartType}
                  {...resolved}
                  showLegend={false}
                  height="100%"
                  idPrefix={`oncanvas-${node.id}`}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
