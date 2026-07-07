import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { DockPanel } from '@/features/canvas/components/dock';
import type {
  DashboardWidget,
  WidgetConfig,
  WidgetSource,
  WidgetType,
} from '@/features/dashboard/types';
import { useEffect, useMemo, useState } from 'react';

export interface MetricOption {
  id: string;
  label: string;
}

interface WidgetConfigSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Editing an existing widget, or null/undefined to create a new one. */
  widget?: DashboardWidget | null;
  trackedOptions: MetricOption[];
  cardOptions: MetricOption[];
  onSave: (draft: {
    title: string;
    widgetType: WidgetType;
    config: WidgetConfig;
  }) => void;
}

const WIDGET_TYPES: { value: WidgetType; label: string }[] = [
  { value: 'line', label: 'Line chart' },
  { value: 'area', label: 'Area chart' },
  { value: 'bar', label: 'Bar chart' },
  { value: 'pie', label: 'Pie chart' },
  { value: 'kpi', label: 'KPI (single value)' },
  { value: 'table', label: 'Table' },
];

export function WidgetConfigSheet({
  open,
  onOpenChange,
  widget,
  trackedOptions,
  cardOptions,
  onSave,
}: WidgetConfigSheetProps) {
  const [title, setTitle] = useState('');
  const [widgetType, setWidgetType] = useState<WidgetType>('line');
  const [source, setSource] = useState<WidgetSource>('tracked');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showLegend, setShowLegend] = useState(true);

  // Re-seed the form whenever the sheet opens (for add) or target changes (edit).
  useEffect(() => {
    if (!open) return;
    if (widget) {
      setTitle(widget.title ?? '');
      setWidgetType(widget.widget_type);
      setSource(widget.config.source);
      setSelectedIds(
        widget.config.source === 'tracked'
          ? (widget.config.trackedMetricIds ?? [])
          : (widget.config.cardIds ?? [])
      );
      setShowLegend(widget.config.display?.showLegend ?? true);
    } else {
      setTitle('');
      setWidgetType('line');
      setSource(trackedOptions.length ? 'tracked' : 'card');
      setSelectedIds([]);
      setShowLegend(true);
    }
  }, [open, widget, trackedOptions.length]);

  const options = source === 'tracked' ? trackedOptions : cardOptions;
  const isKpi = widgetType === 'kpi';

  const canSave = useMemo(
    () => title.trim().length > 0 && selectedIds.length > 0,
    [title, selectedIds]
  );

  const toggle = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      // KPI uses a single series — replace rather than append.
      return isKpi ? [id] : [...prev, id];
    });
  };

  const save = () => {
    const config: WidgetConfig = {
      source,
      ...(source === 'tracked'
        ? { trackedMetricIds: selectedIds }
        : { cardIds: selectedIds }),
      display: { showLegend },
    };
    onSave({ title: title.trim(), widgetType, config });
    onOpenChange(false);
  };

  return (
    <DockPanel
      open={open}
      onClose={() => onOpenChange(false)}
      width="md"
      eyebrow="Dashboard"
      title={widget ? 'Edit widget' : 'Add widget'}
      subtitle="Chart a tracked metric or in-canvas cards."
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save} disabled={!canSave}>
            {widget ? 'Save' : 'Add widget'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Revenue trend"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select
              value={widgetType}
              onValueChange={(v) => setWidgetType(v as WidgetType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WIDGET_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Data source</Label>
            <Select
              value={source}
              onValueChange={(v) => {
                setSource(v as WidgetSource);
                setSelectedIds([]);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tracked">Tracked metrics (catalog)</SelectItem>
                <SelectItem value="card">In-canvas cards</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>
              {isKpi ? 'Metric' : 'Metrics'}
              {selectedIds.length > 0 && (
                <span className="ml-1 text-xs text-muted-foreground">
                  ({selectedIds.length} selected)
                </span>
              )}
            </Label>
            <div className="max-h-64 space-y-1 overflow-auto rounded-md border border-border p-2">
              {options.length === 0 ? (
                <p className="px-1 py-3 text-center text-xs text-muted-foreground">
                  {source === 'tracked'
                    ? 'No tracked metrics yet — catalog one from the Data hub.'
                    : 'No metric cards on this canvas yet.'}
                </p>
              ) : (
                options.map((o) => (
                  <label
                    key={o.id}
                    className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-sm hover:bg-muted"
                  >
                    <Checkbox
                      checked={selectedIds.includes(o.id)}
                      onCheckedChange={() => toggle(o.id)}
                    />
                    <span className="truncate">{o.label}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          {!isKpi && widgetType !== 'table' && (
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                checked={showLegend}
                onCheckedChange={(v) => setShowLegend(!!v)}
              />
              Show legend
            </label>
          )}
      </div>
    </DockPanel>
  );
}
