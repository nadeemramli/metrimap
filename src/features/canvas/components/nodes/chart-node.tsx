'use client';

import { resolveChartSeries } from '@/features/canvas/utils/chartData';
import { useCanvasStore } from '@/lib/stores';
import { Button } from '@/shared/components/ui/button';
import { MetricChart, type ChartType } from '@/shared/components/charts/MetricChart';
import {
  EmptyState,
  NodeCardShell,
} from '@/features/canvas/components/primitives';
import type { MetricCard } from '@/shared/types';
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
import { memo, useCallback, useMemo } from 'react';
import { useCanvasPanelStore } from '@/features/canvas/stores/useCanvasPanelStore';
import { useOpenConfigOnDoubleClick } from '@/features/canvas/hooks/useOpenConfigOnDoubleClick';
import { ChartNodeSettings } from './chart-node-settings';

// Bottom drag pill — the node's React Flow drag handle (.drag-handle__custom).
const DragPill = () => (
  <div className="drag-handle__custom flex cursor-grab justify-center active:cursor-grabbing">
    <div className="flex items-center gap-1 rounded-full border border-border/50 bg-muted/80 px-3 py-1.5 text-xs text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-muted/90">
      <GripVertical className="h-3 w-3" />
      <span className="select-none font-medium">Drag</span>
      <GripVertical className="h-3 w-3" />
    </div>
  </div>
);

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

  // Open state lives in the shared panel store so chart settings are
  // mutually exclusive with every other right-dock panel.
  const settingsOpen = useCanvasPanelStore(
    (s) => s.rightPanel?.kind === 'chartSettings' && s.rightPanel.nodeId === id
  );
  const setSettingsOpen = useCallback(
    (open: boolean) => {
      const s = useCanvasPanelStore.getState();
      if (open) s.openRight({ kind: 'chartSettings', nodeId: id });
      else if (
        s.rightPanel?.kind === 'chartSettings' &&
        s.rightPanel.nodeId === id
      )
        s.closeRight();
    },
    [id]
  );
  useOpenConfigOnDoubleClick(id, () => setSettingsOpen(true));

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
    <EmptyState
      icon={TypeIcon}
      title="No data yet"
      description="Connect a metric card to this node, or pick series in settings."
      className="h-[200px]"
    />
  );

  return (
    <>
      <NodeCardShell
        icon={TypeIcon}
        title={title}
        width={380}
        selected={!!selected}
        handles={<FourSideHandles />}
        dragHandle={<DragPill />}
        headerRight={
          <Button
            variant="ghost"
            size="sm"
            className="nodrag h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              setSettingsOpen(true);
            }}
            title="Chart settings"
          >
            <Settings2 className="h-4 w-4" />
          </Button>
        }
      >
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
      </NodeCardShell>

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
