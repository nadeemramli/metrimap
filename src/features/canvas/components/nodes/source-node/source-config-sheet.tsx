'use client';

// Source Node configuration surface (count.co style). Pick an origin, build the
// series (SQL over a warehouse/file, manual rows, or a generated model), preview
// the result grid, then Save — which persists the config + series on the node and
// feeds the series into every metric card the node is wired to.

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
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
import {
  Tabs,
  TabsList,
  TabsContent,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
import { Textarea } from '@/shared/components/ui/textarea';
import { useCanvasNodesStore } from '@/features/canvas/stores/useCanvasNodesStore';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import {
  resolveSource,
  type SourceConfig,
  type SourceNodeData,
  type SourceOrigin,
} from '@/features/canvas/utils/sourceResolver';
import { feedDownstream } from '@/features/canvas/utils/feedDownstream';
import type { Granularity } from '@/features/canvas/utils/sourceBinding';
import type { MetricValue } from '@/shared/types';
import { useReactFlow } from '@xyflow/react';
import { Database, Loader2, Plus, Sparkles, Trash2, Upload } from 'lucide-react';
import { useState } from 'react';
import { WarehouseSourceDialog } from '@/features/canvas/components/panels/relationship-panel/tabs/warehouse-source-dialog';

interface SourceConfigSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodeId: string;
  data: SourceNodeData;
}

const DEFAULT_GEN = {
  periods: 12,
  granularity: 'Monthly' as Granularity,
  start: 1000,
  growth: 0.05,
  seasonality: 0.15,
  noise: 0.08,
  seed: 7,
};

export function SourceConfigSheet({
  open,
  onOpenChange,
  nodeId,
  data,
}: SourceConfigSheetProps) {
  const client = useClerkSupabase();
  const { updateNode } = useCanvasNodesStore();
  const rf = useReactFlow();

  const existing = data.config;
  const [origin, setOrigin] = useState<SourceOrigin>(existing?.origin ?? 'generate');

  // Per-origin config state
  const [genOpts, setGenOpts] = useState(
    existing?.origin === 'generate' ? { ...DEFAULT_GEN, ...existing.options } : DEFAULT_GEN
  );
  const [manualText, setManualText] = useState(
    existing?.origin === 'manual'
      ? existing.rows.map((r) => `${r.period},${r.value}`).join('\n')
      : '2026-01,1000\n2026-02,1120\n2026-03,1080'
  );
  const [file, setFile] = useState<File | null>(null);
  const [fileSql, setFileSql] = useState(
    existing?.origin === 'file'
      ? existing.sql
      : 'select period, value from data order by period'
  );
  const [warehouse, setWarehouse] = useState<{ connectionId: string; sql: string } | null>(
    existing?.origin === 'warehouse'
      ? { connectionId: existing.connectionId, sql: existing.sql }
      : null
  );
  const [showWarehouseDialog, setShowWarehouseDialog] = useState(false);

  const [series, setSeries] = useState<MetricValue[] | null>(data.series ?? null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Build the current origin's config object (used for run + save).
  const buildConfig = (): SourceConfig => {
    switch (origin) {
      case 'manual':
        return {
          origin: 'manual',
          rows: manualText
            .split(/\r?\n/)
            .map((l) => l.trim())
            .filter(Boolean)
            .map((l) => {
              const [period, value] = l.split(',');
              return { period: (period ?? '').trim(), value: parseFloat(value) || 0 };
            }),
        };
      case 'generate':
        return { origin: 'generate', options: genOpts };
      case 'file':
        return { origin: 'file', fileName: file?.name, sql: fileSql };
      case 'warehouse':
        return {
          origin: 'warehouse',
          connectionId: warehouse?.connectionId ?? '',
          sql: warehouse?.sql ?? '',
        };
    }
  };

  const handleRun = async () => {
    setBusy(true);
    setError(null);
    try {
      const resolved = await resolveSource(buildConfig(), {
        client: client ?? undefined,
        file: file ?? undefined,
      });
      setSeries(resolved);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to resolve source.');
    } finally {
      setBusy(false);
    }
  };

  const handleSave = async () => {
    if (!series || series.length === 0) {
      setError('Run the source first to produce a series.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const nextData: SourceNodeData = {
        ...data,
        title: data.title,
        config: buildConfig(),
        series,
        refreshedAt: new Date().toISOString(),
      };
      await updateNode(nodeId, { data: nextData } as any);

      const edges = rf
        .getEdges()
        .filter((e) => e.source === nodeId)
        .map((e) => ({ id: e.id, source: e.source, target: e.target, type: e.type }));
      const result = await feedDownstream(nodeId, series, edges);
      if (result.warnings.length) {
        setError(result.warnings.join('; '));
      } else {
        onOpenChange(false);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save.');
    } finally {
      setBusy(false);
    }
  };

  // getEdges() is a cheap synchronous read; recomputed each render while open.
  const downstreamCount = open
    ? rf.getEdges().filter((e) => e.source === nodeId).length
    : 0;

  const setGen = (key: keyof typeof genOpts, value: number | string) =>
    setGenOpts((prev) => ({ ...prev, [key]: value }));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[640px] sm:max-w-[640px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            {data.title || 'Data Source'}
          </SheetTitle>
          <SheetDescription>
            Build a metric series, then feed it to{' '}
            {downstreamCount > 0
              ? `${downstreamCount} wired downstream node${downstreamCount === 1 ? '' : 's'}`
              : 'downstream cards (wire this node to a card first)'}
            .
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          <Tabs value={origin} onValueChange={(v) => setOrigin(v as SourceOrigin)}>
            <TabsList className="w-full">
              <TabsTrigger value="warehouse" className="flex-1">
                Warehouse
              </TabsTrigger>
              <TabsTrigger value="file" className="flex-1">
                File
              </TabsTrigger>
              <TabsTrigger value="manual" className="flex-1">
                Manual
              </TabsTrigger>
              <TabsTrigger value="generate" className="flex-1">
                Generate
              </TabsTrigger>
            </TabsList>

            {/* Warehouse */}
            <TabsContent value="warehouse" className="space-y-3 pt-3">
              <p className="text-sm text-muted-foreground">
                Query a saved warehouse connection. Runs server-side; credentials
                never touch the browser.
              </p>
              {warehouse && (
                <p className="text-xs text-muted-foreground font-mono">
                  Connection set · {warehouse.sql.slice(0, 60)}…
                </p>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowWarehouseDialog(true)}
              >
                <Database className="h-4 w-4 mr-2" />
                {warehouse ? 'Change query' : 'Configure warehouse query'}
              </Button>
            </TabsContent>

            {/* File */}
            <TabsContent value="file" className="space-y-3 pt-3">
              <p className="text-sm text-muted-foreground">
                Query a CSV/Parquet file with DuckDB (in-browser). The file is the{' '}
                <code>data</code> table.
              </p>
              <label className="inline-block">
                <input
                  type="file"
                  accept=".csv,.tsv,.parquet,.json"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
                <Button variant="outline" size="sm" asChild className="cursor-pointer">
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    {file ? file.name : 'Choose file'}
                  </span>
                </Button>
              </label>
              <div className="space-y-1">
                <Label className="text-xs">SQL</Label>
                <Textarea
                  value={fileSql}
                  onChange={(e) => setFileSql(e.target.value)}
                  className="min-h-24 font-mono text-sm"
                />
              </div>
            </TabsContent>

            {/* Manual */}
            <TabsContent value="manual" className="space-y-2 pt-3">
              <p className="text-sm text-muted-foreground">
                One <code>period,value</code> per line.
              </p>
              <Textarea
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                className="min-h-40 font-mono text-sm"
              />
            </TabsContent>

            {/* Generate */}
            <TabsContent value="generate" className="grid grid-cols-2 gap-3 pt-3">
              <div className="space-y-1">
                <Label className="text-xs">Periods</Label>
                <Input
                  type="number"
                  value={genOpts.periods}
                  onChange={(e) => setGen('periods', parseInt(e.target.value) || 12)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Granularity</Label>
                <Select
                  value={genOpts.granularity}
                  onValueChange={(v) => setGen('granularity', v as Granularity)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'].map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Start</Label>
                <Input
                  type="number"
                  value={genOpts.start}
                  onChange={(e) => setGen('start', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Growth/period</Label>
                <Input
                  type="number"
                  step={0.01}
                  value={genOpts.growth}
                  onChange={(e) => setGen('growth', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Seasonality</Label>
                <Input
                  type="number"
                  step={0.05}
                  value={genOpts.seasonality}
                  onChange={(e) => setGen('seasonality', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Noise</Label>
                <Input
                  type="number"
                  step={0.05}
                  value={genOpts.noise}
                  onChange={(e) => setGen('noise', parseFloat(e.target.value) || 0)}
                />
              </div>
            </TabsContent>
          </Tabs>

          {origin !== 'warehouse' && (
            <Button onClick={handleRun} disabled={busy} className="gap-2">
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Run preview
            </Button>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          {/* Result grid */}
          {series && series.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Result ({series.length} points)</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSeries(null)}
                  className="h-7 text-xs"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              </div>
              <div className="max-h-60 overflow-auto rounded border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 sticky top-0">
                    <tr>
                      <th className="text-left p-2 font-medium">Period</th>
                      <th className="text-right p-2 font-medium">Value</th>
                      <th className="text-right p-2 font-medium">Δ%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {series.map((p, i) => (
                      <tr key={i} className="border-t">
                        <td className="p-2 font-mono text-xs">{p.period}</td>
                        <td className="p-2 text-right">{p.value}</td>
                        <td
                          className={`p-2 text-right text-xs ${
                            p.trend === 'up'
                              ? 'text-green-600'
                              : p.trend === 'down'
                                ? 'text-red-600'
                                : 'text-muted-foreground'
                          }`}
                        >
                          {p.change_percent}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={busy || !series}>
              {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Plus className="h-4 w-4 mr-1" />
              Save &amp; feed downstream
            </Button>
          </div>
        </div>

        {/* Warehouse query builder (reused) */}
        <WarehouseSourceDialog
          open={showWarehouseDialog}
          onOpenChange={setShowWarehouseDialog}
          onApply={(resolved, meta) => {
            setSeries(resolved);
            setWarehouse(meta);
          }}
        />
      </SheetContent>
    </Sheet>
  );
}
