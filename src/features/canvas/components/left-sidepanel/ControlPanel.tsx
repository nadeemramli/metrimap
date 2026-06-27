// Contextual operator tooling. Three tabs:
//  - Operator: edit ONLY the selected operator (type + per-type controls + named
//    inputs + live output).
//  - Pipeline: Run + last-run results (cards changed, before→after) + warnings.
//  - Global: simulation period, run-all, and bulk "apply to all" actions (in
//    tooltips). See docs/backlog/operator-revamp-feature.md (Phase D/F).

import { useEffect, useState } from 'react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { Play, Power, PowerOff, Sigma } from 'lucide-react';
import { cn } from '@/shared/utils';
import type { CanvasNode } from '@/shared/types';
import type {
  AggregateOp,
  CompareOp,
  OperatorInput,
  OperatorNodeData,
  OperatorOperationType,
  StatisticMethod,
} from '@/features/canvas/types/operator';
import type { CardChange } from '@/features/canvas/utils/runSimulation';
import { normalizeOperatorData } from '@/features/canvas/utils/operatorMigration';

interface ControlPanelProps {
  operators: CanvasNode[];
  selectedOperatorId: string | null;
  onSelectOperator: (id: string) => void;
  previewOperatorValues: Record<string, number>;
  onUpdateOperator: (id: string, partial: Partial<OperatorNodeData>) => void;
  onBulkUpdate: (partial: Partial<OperatorNodeData>) => void;
  onRun: () => void;
  isRunning: boolean;
  lastRun: { changes: CardChange[]; warnings: string[] } | null;
  globalPeriod: string;
  onChangePeriod: (period: string) => void;
}

const OP_TYPES: { value: OperatorOperationType; label: string }[] = [
  { value: 'formula', label: 'Formula' },
  { value: 'aggregate', label: 'Aggregate' },
  { value: 'gate', label: 'Gate / Threshold' },
  { value: 'toggle', label: 'Toggle' },
  { value: 'statistical', label: 'Statistical' },
];

const AGG_OPS: AggregateOp[] = ['sum', 'avg', 'min', 'max', 'product', 'count'];
const COMPARES: CompareOp[] = ['>', '>=', '<', '<=', '==', '!='];
const STAT_METHODS: StatisticMethod[] = [
  'correlation',
  'regression',
  'movingAverage',
];

function fmt(v: number | undefined): string {
  if (v === undefined || !isFinite(v)) return '—';
  const abs = Math.abs(v);
  if (abs >= 1000)
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(v);
  return Number(v.toFixed(abs < 100 ? 2 : 0)).toLocaleString();
}

export default function ControlPanel({
  operators,
  selectedOperatorId,
  onSelectOperator,
  previewOperatorValues,
  onUpdateOperator,
  onBulkUpdate,
  onRun,
  isRunning,
  lastRun,
  globalPeriod,
  onChangePeriod,
}: ControlPanelProps) {
  const selected = operators.find((o) => o.id === selectedOperatorId) || null;
  const data: OperatorNodeData | null = selected
    ? normalizeOperatorData(selected.data as any)
    : null;
  const inputs: OperatorInput[] = data?.inputs || [];

  // Local mirrors for text fields → persist on blur (avoid a write per keystroke).
  const [formulaDraft, setFormulaDraft] = useState('');
  const [thresholdDraft, setThresholdDraft] = useState('');
  const [windowDraft, setWindowDraft] = useState('');
  const [labelDrafts, setLabelDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!data) return;
    setFormulaDraft(data.formula ?? 'x');
    setThresholdDraft(String(data.gate?.threshold ?? 0));
    setWindowDraft(String(data.statistic?.window ?? 3));
    setLabelDrafts(
      Object.fromEntries((data.inputs || []).map((i) => [i.key, i.label]))
    );
    // re-init only when switching operator or its type
  }, [selectedOperatorId, data?.operationType]); // eslint-disable-line react-hooks/exhaustive-deps

  const update = (partial: Partial<OperatorNodeData>) => {
    if (selectedOperatorId) onUpdateOperator(selectedOperatorId, partial);
  };

  const commitLabel = (key: string) => {
    const next = inputs.map((i) =>
      i.key === key ? { ...i, label: labelDrafts[key] ?? i.label } : i
    );
    update({ inputs: next });
  };

  return (
    <div className="w-80 max-h-[72vh] overflow-hidden bg-background/95 backdrop-blur border rounded-lg shadow-lg">
      <Tabs defaultValue={selected ? 'operator' : 'pipeline'} className="w-full">
        <TabsList className="grid w-full grid-cols-3 rounded-none">
          <TabsTrigger value="operator">Operator</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="global">Global</TabsTrigger>
        </TabsList>

        {/* ── Operator tab ─────────────────────────────────────────── */}
        <TabsContent
          value="operator"
          className="m-0 max-h-[64vh] overflow-auto p-3 space-y-3"
        >
          {/* Operator picker */}
          {operators.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {operators.map((o) => {
                const od = normalizeOperatorData(o.data as any);
                return (
                  <button
                    key={o.id}
                    onClick={() => onSelectOperator(o.id)}
                    className={cn(
                      'rounded border px-2 py-0.5 text-xs transition-colors',
                      o.id === selectedOperatorId
                        ? 'border-primary bg-primary/10 font-medium'
                        : 'border-border hover:bg-muted'
                    )}
                  >
                    {od.label || 'Operator'}
                  </button>
                );
              })}
            </div>
          )}

          {!data ? (
            <p className="px-1 py-8 text-center text-xs text-muted-foreground">
              {operators.length === 0
                ? 'No operators yet. Add an Operator node and connect cards to it.'
                : 'Select an operator above (or click one on the canvas).'}
            </p>
          ) : (
            <div className="space-y-3">
              {/* Active + live output */}
              <div className="flex items-center justify-between rounded-md border bg-muted/30 px-2 py-1.5">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={data.isActive}
                    onCheckedChange={(c) => update({ isActive: c })}
                  />
                  <span className="text-xs">{data.isActive ? 'Active' : 'Inactive'}</span>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase text-muted-foreground">
                    Output
                  </div>
                  <div className="text-sm font-bold tabular-nums">
                    {fmt(previewOperatorValues[selectedOperatorId!])}
                  </div>
                </div>
              </div>

              {/* Operation type */}
              <div className="space-y-1">
                <Label className="text-xs">Operation</Label>
                <Select
                  value={data.operationType}
                  onValueChange={(v: OperatorOperationType) =>
                    update({ operationType: v })
                  }
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OP_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Per-type controls */}
              {data.operationType === 'formula' && (
                <div className="space-y-1">
                  <Label className="text-xs">Formula</Label>
                  <Input
                    className="h-8 font-mono text-xs"
                    placeholder="a + b"
                    value={formulaDraft}
                    onChange={(e) => setFormulaDraft(e.target.value)}
                    onBlur={() => update({ formula: formulaDraft })}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && update({ formula: formulaDraft })
                    }
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Vars: {inputs.map((i) => i.key).join(', ') || '(none)'} ·{' '}
                    <span className="font-mono">x</span> = sum of inputs
                  </p>
                </div>
              )}

              {data.operationType === 'aggregate' && (
                <div className="space-y-1">
                  <Label className="text-xs">Aggregation</Label>
                  <Select
                    value={data.aggregateOp || 'sum'}
                    onValueChange={(v: AggregateOp) => update({ aggregateOp: v })}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AGG_OPS.map((a) => (
                        <SelectItem key={a} value={a}>
                          {a.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {data.operationType === 'gate' && (
                <div className="space-y-1">
                  <Label className="text-xs">Pass input if…</Label>
                  <div className="flex items-center gap-1">
                    <Select
                      value={data.gate?.inputKey || inputs[0]?.key || 'x'}
                      onValueChange={(v) =>
                        update({
                          gate: {
                            compare: data.gate?.compare || '>',
                            threshold: data.gate?.threshold ?? 0,
                            inputKey: v,
                          },
                        })
                      }
                    >
                      <SelectTrigger className="h-8 w-16">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[...inputs.map((i) => i.key), 'x'].map((k) => (
                          <SelectItem key={k} value={k}>
                            {k}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={data.gate?.compare || '>'}
                      onValueChange={(v: CompareOp) =>
                        update({
                          gate: {
                            compare: v,
                            threshold: data.gate?.threshold ?? 0,
                            inputKey: data.gate?.inputKey,
                          },
                        })
                      }
                    >
                      <SelectTrigger className="h-8 w-16">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COMPARES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      className="h-8 flex-1 text-xs"
                      value={thresholdDraft}
                      onChange={(e) => setThresholdDraft(e.target.value)}
                      onBlur={() =>
                        update({
                          gate: {
                            compare: data.gate?.compare || '>',
                            threshold: Number(thresholdDraft) || 0,
                            inputKey: data.gate?.inputKey,
                          },
                        })
                      }
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    else outputs 0
                  </p>
                </div>
              )}

              {data.operationType === 'toggle' && (
                <div className="flex items-center gap-2">
                  <Switch
                    checked={!!data.toggleValue}
                    onCheckedChange={(c) => update({ toggleValue: c })}
                  />
                  <span className="text-xs">
                    {data.toggleValue ? 'On → passes x' : 'Off → outputs 0'}
                  </span>
                </div>
              )}

              {data.operationType === 'statistical' && (
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Method</Label>
                    <Select
                      value={data.statistic?.method || 'correlation'}
                      onValueChange={(v: StatisticMethod) =>
                        update({
                          statistic: { ...(data.statistic || {}), method: v },
                        })
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STAT_METHODS.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {data.statistic?.method === 'movingAverage' ? (
                    <div className="space-y-1">
                      <Label className="text-xs">Window</Label>
                      <Input
                        type="number"
                        className="h-8 text-xs"
                        value={windowDraft}
                        onChange={(e) => setWindowDraft(e.target.value)}
                        onBlur={() =>
                          update({
                            statistic: {
                              ...(data.statistic || { method: 'movingAverage' }),
                              window: Number(windowDraft) || 3,
                            },
                          })
                        }
                      />
                    </div>
                  ) : (
                    <p className="text-[10px] text-muted-foreground">
                      Uses inputs a (x-series) &amp; b (y-series).
                    </p>
                  )}
                </div>
              )}

              {/* Named inputs editor */}
              <div className="space-y-1">
                <Label className="text-xs">Inputs</Label>
                {inputs.length === 0 ? (
                  <p className="text-[10px] text-muted-foreground italic">
                    Connect cards/sources to this operator to add inputs.
                  </p>
                ) : (
                  <div className="space-y-1">
                    {inputs.map((inp) => (
                      <div key={inp.key} className="flex items-center gap-2">
                        <Badge variant="secondary" className="font-mono">
                          {inp.key}
                        </Badge>
                        <Input
                          className="h-7 flex-1 text-xs"
                          value={labelDrafts[inp.key] ?? inp.label}
                          onChange={(e) =>
                            setLabelDrafts((d) => ({
                              ...d,
                              [inp.key]: e.target.value,
                            }))
                          }
                          onBlur={() => commitLabel(inp.key)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        {/* ── Pipeline tab ─────────────────────────────────────────── */}
        <TabsContent
          value="pipeline"
          className="m-0 max-h-[64vh] overflow-auto p-3 space-y-3"
        >
          <Button
            onClick={onRun}
            disabled={isRunning}
            className="w-full gap-1.5"
          >
            <Play className="h-4 w-4" />
            {isRunning ? 'Running…' : 'Run pipeline'}
          </Button>
          <p className="text-[11px] text-muted-foreground">
            Computes every operator and writes the result into each downstream
            card's history.
          </p>

          {lastRun && (
            <div className="space-y-2">
              {lastRun.changes.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="h-7 text-xs">Card</TableHead>
                      <TableHead className="h-7 text-right text-xs">Before</TableHead>
                      <TableHead className="h-7 text-right text-xs">After</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lastRun.changes.map((c) => (
                      <TableRow key={c.cardId}>
                        <TableCell className="py-1 text-xs">{c.title}</TableCell>
                        <TableCell className="py-1 text-right text-xs tabular-nums text-muted-foreground">
                          {c.before == null ? '—' : fmt(c.before)}
                        </TableCell>
                        <TableCell className="py-1 text-right text-xs font-semibold tabular-nums">
                          {fmt(c.after)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-xs text-muted-foreground">
                  No cards updated. Wire an operator to an output card.
                </p>
              )}
              {lastRun.warnings.length > 0 && (
                <div className="rounded border border-amber-200 bg-amber-50 p-2 text-[11px] text-amber-800">
                  {lastRun.warnings.map((w, i) => (
                    <div key={i}>⚠ {w}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* ── Global tab ───────────────────────────────────────────── */}
        <TabsContent
          value="global"
          className="m-0 max-h-[64vh] overflow-auto p-3 space-y-3"
        >
          <div className="space-y-1">
            <Label className="text-xs">Simulation period</Label>
            <Input
              className="h-8 text-xs"
              placeholder="YYYY-MM"
              value={globalPeriod}
              onChange={(e) => onChangePeriod(e.target.value)}
            />
            <p className="text-[10px] text-muted-foreground">
              The period stamped on points written by Run.
            </p>
          </div>

          <Button
            onClick={onRun}
            disabled={isRunning}
            variant="outline"
            className="w-full gap-1.5"
          >
            <Play className="h-4 w-4" />
            Run all
          </Button>

          <div className="space-y-1">
            <Label className="text-xs">Bulk (all operators)</Label>
            <TooltipProvider>
              <div className="flex gap-1.5">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => onBulkUpdate({ operationType: 'aggregate', aggregateOp: 'sum' })}
                    >
                      <Sigma className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Set all to SUM aggregate</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => onBulkUpdate({ isActive: true })}
                    >
                      <Power className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Enable all operators</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => onBulkUpdate({ isActive: false })}
                    >
                      <PowerOff className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Disable all operators</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
