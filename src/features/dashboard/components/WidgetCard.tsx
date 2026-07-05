import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { MetricChart, type ChartType } from '@/shared/components/charts/MetricChart';
import { formatCompact } from '@/features/canvas/utils/chartData';
import type { DashboardWidget } from '@/features/dashboard/types';
import {
  resolveKpi,
  resolveWidget,
  type WidgetDataSources,
} from '@/features/dashboard/utils/widgetData';
import { WidgetImpactBadge } from '@/features/dashboard/components/WidgetImpactBadge';
import type { WidgetStrategyLink } from '@/features/strategy/impact/widgetLinks';
import type { MeasuredImpact } from '@/features/strategy/impact/measurement';
import {
  GripVertical,
  Settings2,
  TrendingDown,
  TrendingUp,
  Trash2,
} from 'lucide-react';

interface WidgetCardProps {
  widget: DashboardWidget;
  sources: WidgetDataSources;
  editMode: boolean;
  onConfigure: (widget: DashboardWidget) => void;
  onRemove: (id: string) => void;
  strategyLinks?: WidgetStrategyLink[];
  measuredMap?: Record<string, MeasuredImpact>;
  currentPeriod?: string;
  onOpenStrategy?: (nodeId: string) => void;
  onOpenTrace?: (nodeId: string) => void;
}

const CHART_TYPES: ChartType[] = ['line', 'area', 'bar', 'pie'];

export function WidgetCard({
  widget,
  sources,
  editMode,
  onConfigure,
  onRemove,
  strategyLinks,
  measuredMap,
  currentPeriod,
  onOpenStrategy,
  onOpenTrace,
}: WidgetCardProps) {
  const isChart = (CHART_TYPES as string[]).includes(widget.widget_type);

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 py-2">
        <CardTitle className="flex min-w-0 items-center gap-1.5 text-sm">
          {editMode && (
            <GripVertical className="widget-drag-handle h-3.5 w-3.5 shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing" />
          )}
          <span className="truncate">{widget.title || 'Untitled'}</span>
        </CardTitle>
        <div className="flex shrink-0 items-center gap-1">
          {strategyLinks && strategyLinks.length > 0 && onOpenStrategy && (
            <WidgetImpactBadge
              links={strategyLinks}
              measuredMap={measuredMap}
              currentPeriod={currentPeriod ?? new Date().toISOString().slice(0, 7)}
              onOpenStrategy={onOpenStrategy}
              onOpenTrace={onOpenTrace}
            />
          )}
          {editMode && (
            <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => onConfigure(widget)}
              title="Configure widget"
            >
              <Settings2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => onRemove(widget.id)}
              title="Remove widget"
            >
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto pb-3">
        <WidgetBody widget={widget} sources={sources} isChart={isChart} />
      </CardContent>
    </Card>
  );
}

function WidgetBody({
  widget,
  sources,
  isChart,
}: {
  widget: DashboardWidget;
  sources: WidgetDataSources;
  isChart: boolean;
}) {
  if (widget.widget_type === 'kpi') {
    const kpi = resolveKpi(widget.config, sources);
    const Trend =
      kpi.trend === 'down'
        ? TrendingDown
        : kpi.trend === 'up'
          ? TrendingUp
          : null;
    return (
      <div className="flex h-full flex-col justify-center">
        <div className="text-3xl font-bold tabular-nums">
          {kpi.value == null ? '—' : formatCompact(kpi.value)}
        </div>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          {Trend && (
            <Trend
              className={
                kpi.trend === 'up'
                  ? 'h-3.5 w-3.5 text-emerald-600'
                  : 'h-3.5 w-3.5 text-red-600'
              }
            />
          )}
          {kpi.changePercent != null && (
            <span>{kpi.changePercent > 0 ? '+' : ''}{kpi.changePercent}%</span>
          )}
          <span className="truncate">{kpi.label}</span>
        </div>
      </div>
    );
  }

  if (widget.widget_type === 'table') {
    const { series, rows, hasData } = resolveWidget(widget.config, sources);
    if (!hasData) {
      return (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No data to display.
        </p>
      );
    }
    return (
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th className="py-1.5 pr-2 font-medium">Period</th>
              {series.map((s) => (
                <th key={s.key} className="py-1.5 pr-2 font-medium">
                  {s.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-border/50">
                <td className="py-1.5 pr-2 text-muted-foreground">
                  {String(row.period)}
                </td>
                {series.map((s) => (
                  <td key={s.key} className="py-1.5 pr-2 tabular-nums">
                    {typeof row[s.key] === 'number'
                      ? formatCompact(row[s.key] as number)
                      : '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // chart widget
  if (isChart) {
    const resolved = resolveWidget(widget.config, sources);
    return (
      <div className="h-full min-h-[160px]">
        <MetricChart
          chartType={widget.widget_type as ChartType}
          {...resolved}
          showLegend={widget.config.display?.showLegend ?? true}
          height="100%"
          idPrefix={widget.id}
        />
      </div>
    );
  }

  return null;
}
