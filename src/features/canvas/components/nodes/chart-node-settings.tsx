'use client';

import type { ChartNodeData, ChartType } from './chart-node';
import { PALETTE } from '@/features/canvas/utils/chartData';
import { useCanvasNodesStore } from '@/features/canvas/stores/useCanvasNodesStore';
import { useCanvasStore } from '@/lib/stores';
import { chartNodeToWidgetInput } from '@/features/dashboard/utils/chartImport';
import {
  createWidget,
  listWidgets,
} from '@/shared/lib/supabase/services/dashboards';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';
import { Switch } from '@/shared/components/ui/switch';
import type { MetricCard } from '@/shared/types';
import {
  AreaChartIcon,
  BarChart3,
  LayoutGrid,
  LineChartIcon,
  PieChartIcon,
} from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

interface ChartNodeSettingsProps {
  nodeId: string;
  data: ChartNodeData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CHART_TYPES: Array<{
  value: ChartType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { value: 'line', label: 'Line', icon: LineChartIcon },
  { value: 'area', label: 'Area', icon: AreaChartIcon },
  { value: 'bar', label: 'Bar', icon: BarChart3 },
  { value: 'pie', label: 'Pie', icon: PieChartIcon },
];

// Only Data/Metric cards carry a plottable series.
function latestValue(card: MetricCard): number | undefined {
  const d = card.data;
  if (!d || !d.length) return undefined;
  const v = d[d.length - 1]?.value;
  return typeof v === 'number' ? v : undefined;
}

export function ChartNodeSettings({
  nodeId,
  data,
  open,
  onOpenChange,
}: ChartNodeSettingsProps) {
  const rawCards = useCanvasStore((s) => s.canvas?.nodes);
  const cards = React.useMemo(
    () => (rawCards || []) as MetricCard[],
    [rawCards]
  );
  const seriesCardIds = data.seriesCardIds ?? [];
  const projectId = useCanvasStore((s) => s.canvas?.id);
  const client = useClerkSupabase();
  const [adding, setAdding] = React.useState(false);

  const addToDashboard = async () => {
    if (!client || !projectId) return;
    setAdding(true);
    try {
      // Drop below the current widgets so nothing overlaps.
      const widgets = await listWidgets(projectId, client);
      const maxY = widgets.reduce(
        (m, w) => Math.max(m, w.layout.y + w.layout.h),
        0
      );
      await createWidget(
        chartNodeToWidgetInput(
          { id: nodeId, projectId, data },
          { sortIndex: widgets.length, y: maxY }
        ),
        client
      );
      toast.success('Chart added to dashboard');
    } catch {
      toast.error('Failed to add chart to dashboard');
    } finally {
      setAdding(false);
    }
  };

  const persist = (patch: Partial<ChartNodeData>) => {
    void useCanvasNodesStore
      .getState()
      .updateNode(nodeId, { data: { ...data, ...patch } });
  };

  const toggleSeries = (cardId: string, checked: boolean) => {
    const next = checked
      ? [...seriesCardIds, cardId]
      : seriesCardIds.filter((id) => id !== cardId);
    persist({ seriesCardIds: next });
  };

  // Cards with a series first, then the rest (still selectable — they just have
  // no data yet). Colour swatch mirrors the chart's palette-by-position.
  const orderedCards = React.useMemo(() => {
    const withData = cards.filter((c) => latestValue(c) !== undefined);
    const without = cards.filter((c) => latestValue(c) === undefined);
    return [...withData, ...without];
  }, [cards]);

  const colorFor = (cardId: string) => {
    const idx = seriesCardIds.indexOf(cardId);
    return idx >= 0 ? PALETTE[idx % PALETTE.length] : undefined;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Chart settings</SheetTitle>
          <SheetDescription>
            Choose a chart type and which metrics to plot.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-4 pb-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="chart-title">Title</Label>
            <Input
              id="chart-title"
              value={data.title ?? ''}
              placeholder="Chart"
              onChange={(e) => persist({ title: e.target.value })}
            />
          </div>

          {/* Chart type */}
          <div className="space-y-2">
            <Label>Chart type</Label>
            <Select
              value={data.chartType ?? 'area'}
              onValueChange={(v) => persist({ chartType: v as ChartType })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CHART_TYPES.map(({ value, label, icon: Icon }) => (
                  <SelectItem key={value} value={value}>
                    <span className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Series */}
          <div className="space-y-2">
            <Label>Series</Label>
            <p className="text-xs text-muted-foreground">
              Each selected metric becomes a series. Connecting a card to this
              node adds it here automatically.
            </p>
            <ScrollArea className="h-[280px] rounded-md border">
              <div className="divide-y">
                {orderedCards.length === 0 && (
                  <div className="p-3 text-sm text-muted-foreground">
                    No metric cards on this canvas yet.
                  </div>
                )}
                {orderedCards.map((card) => {
                  const checked = seriesCardIds.includes(card.id);
                  const color = colorFor(card.id);
                  const value = latestValue(card);
                  return (
                    <label
                      key={card.id}
                      className="flex cursor-pointer items-center gap-3 p-2.5 hover:bg-accent/50"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(c) =>
                          toggleSeries(card.id, c === true)
                        }
                      />
                      <span
                        className="h-3 w-3 flex-shrink-0 rounded-full border"
                        style={{
                          backgroundColor: color ?? 'transparent',
                          borderColor: color ?? 'hsl(var(--border))',
                        }}
                      />
                      <span className="flex-1 truncate text-sm">
                        {card.title || 'Untitled'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {value === undefined ? 'no data' : value.toLocaleString()}
                      </span>
                    </label>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Show legend</Label>
              <p className="text-xs text-muted-foreground">
                Display series names below the chart.
              </p>
            </div>
            <Switch
              checked={data.showLegend ?? true}
              onCheckedChange={(c) => persist({ showLegend: c })}
            />
          </div>

          {/* Dashboard */}
          <div className="space-y-2 border-t pt-4">
            <Button
              variant="outline"
              className="w-full gap-2"
              disabled={adding || !client || !projectId}
              onClick={() => void addToDashboard()}
            >
              <LayoutGrid className="h-4 w-4" />
              {adding ? 'Adding…' : 'Add to dashboard'}
            </Button>
            <p className="text-xs text-muted-foreground">
              Copies this chart to the Dashboard page as a widget. The series
              stay bound to the same cards.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ChartNodeSettings;
