'use client';

import { resolveChartSeries } from '@/features/canvas/utils/chartData';
import { useCanvasStore } from '@/lib/stores';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { MetricChart, type ChartType } from '@/shared/components/charts/MetricChart';
import type { MetricCard } from '@/shared/types';
import { cn } from '@/shared/utils';
import { type NodeProps } from '@xyflow/react';
import { FourSideHandles } from './FourSideHandles';
import {
  AreaChartIcon,
  BarChart3,
  GripVertical,
  LineChartIcon,
  PieChartIcon,
  Settings2,
} from 'lucide-react';
import { memo, useMemo, useState } from 'react';
import { ChartNodeSettings } from './chart-node-settings';

export type { ChartType };

export interface ChartNodeData {
  chartType?: ChartType;
  title?: string;
  seriesCardIds?: string[];
  showLegend?: boolean;
}

const TYPE_ICON: Record<ChartType, React.ComponentType<{ className?: string }>> =
  {
    line: LineChartIcon,
    area: AreaChartIcon,
    bar: BarChart3,
    pie: PieChartIcon,
  };

const ChartNodeInner = memo(({ id, data, selected }: NodeProps) => {
  const nodeData = (data || {}) as ChartNodeData;
  const chartType: ChartType = nodeData.chartType ?? 'area';
  const title = nodeData.title ?? 'Chart';
  const showLegend = nodeData.showLegend ?? true;
  const seriesCardIds = useMemo(
    () => nodeData.seriesCardIds ?? [],
    [nodeData.seriesCardIds]
  );

  const [settingsOpen, setSettingsOpen] = useState(false);

  // Live metric cards — re-renders when an operator sim updates a plotted card.
  const cards = useCanvasStore((s) => s.canvas?.nodes) as
    | MetricCard[]
    | undefined;

  const { config, series, rows, pie, hasData } = useMemo(
    () => resolveChartSeries(cards || [], seriesCardIds),
    [cards, seriesCardIds]
  );

  const TypeIcon = TYPE_ICON[chartType];

  const emptySlot = (
    <div className="h-[200px] flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 text-center">
      <TypeIcon className="h-6 w-6 text-muted-foreground" />
      <p className="text-sm text-muted-foreground px-6">
        Connect a metric card to this node, or pick series in&nbsp;
        <Settings2 className="inline h-3.5 w-3.5 -mt-0.5" /> settings.
      </p>
    </div>
  );

  return (
    <>
      <Card
        className={cn(
          'w-[380px] rounded-xl border-2 bg-card shadow-lg transition-shadow',
          selected ? 'ring-2 ring-primary border-primary/40' : 'border-border'
        )}
      >
        <FourSideHandles />
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between gap-2 text-sm">
            <span className="flex items-center gap-2 truncate">
              <TypeIcon className="h-4 w-4 text-muted-foreground" />
              <span className="truncate font-semibold">{title}</span>
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                setSettingsOpen(true);
              }}
              title="Chart settings"
            >
              <Settings2 className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <MetricChart
            chartType={chartType}
            config={config}
            series={series}
            rows={rows}
            pie={pie}
            hasData={hasData}
            showLegend={showLegend}
            idPrefix={id}
            emptySlot={emptySlot}
          />
        </CardContent>

        {/* Drag handle */}
        <div className="border-t border-border/30 bg-muted/20 p-2">
          <div className="drag-handle__custom flex cursor-grab justify-center active:cursor-grabbing">
            <div className="flex items-center gap-1 rounded-full border border-border/50 bg-muted/80 px-3 py-1.5 text-xs text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-muted/90">
              <GripVertical className="h-3 w-3" />
              <span className="select-none font-medium">Drag</span>
              <GripVertical className="h-3 w-3" />
            </div>
          </div>
        </div>
      </Card>

      <ChartNodeSettings
        nodeId={id}
        data={nodeData}
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />
    </>
  );
});

ChartNodeInner.displayName = 'ChartNode';
export default ChartNodeInner;
