'use client';

import { memo } from 'react';
import { type NodeProps } from '@xyflow/react';
import { FourSideHandles } from './FourSideHandles';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import {
  Activity,
  Calculator,
  Filter,
  GripVertical,
  Sigma,
  ToggleLeft,
} from 'lucide-react';
import { cn } from '@/shared/utils';
import { useOperatorPreviewStore } from '@/features/canvas/stores/useOperatorPreviewStore';
import { normalizeOperatorData } from '@/features/canvas/utils/operatorMigration';
import type { OperatorNodeData } from '@/features/canvas/types/operator';

const TYPE_META: Record<
  OperatorNodeData['operationType'],
  { icon: typeof Calculator; color: string; label: string }
> = {
  formula: { icon: Calculator, color: 'bg-blue-500', label: 'Formula' },
  aggregate: { icon: Sigma, color: 'bg-indigo-500', label: 'Aggregate' },
  gate: { icon: Filter, color: 'bg-amber-500', label: 'Gate' },
  toggle: { icon: ToggleLeft, color: 'bg-green-500', label: 'Toggle' },
  statistical: { icon: Activity, color: 'bg-purple-500', label: 'Statistical' },
};

function formatValue(v: number | undefined): string {
  if (v === undefined || !isFinite(v)) return '—';
  const abs = Math.abs(v);
  if (abs >= 1000)
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(v);
  return Number(v.toFixed(abs < 100 ? 2 : 0)).toLocaleString();
}

// A short expression summary for the node body, by operation type.
function opSummary(data: OperatorNodeData): string {
  switch (data.operationType) {
    case 'formula':
      return data.formula || 'x';
    case 'aggregate':
      return `${(data.aggregateOp || 'sum').toUpperCase()}(inputs)`;
    case 'gate':
      return data.gate
        ? `pass if ${data.gate.inputKey || 'x'} ${data.gate.compare} ${data.gate.threshold}`
        : 'gate';
    case 'toggle':
      return data.toggleValue ? 'on → x' : 'off → 0';
    case 'statistical':
      return data.statistic?.method || 'statistic';
    default:
      return '';
  }
}

const OperatorNodeInner = memo(({ id, data, selected }: NodeProps) => {
  const op = normalizeOperatorData(data as any) as OperatorNodeData;
  const output = useOperatorPreviewStore((s) => s.operatorValues[id]);

  const meta = TYPE_META[op.operationType] ?? TYPE_META.formula;
  const Icon = meta.icon;
  const inputs = op.inputs || [];

  return (
    <Card
      className={cn(
        'min-w-[230px] bg-white dark:bg-white-300 border-2 rounded-lg shadow-lg transition-all duration-200',
        selected && 'ring-2 ring-blue-500',
        op.isActive ? 'opacity-100' : 'opacity-60'
      )}
    >
      <FourSideHandles />

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm font-medium truncate">
            {op.label || 'Operator'}
          </CardTitle>
          <Badge variant="secondary" className="shrink-0 text-xs">
            <span className={cn('mr-1 inline-block h-2 w-2 rounded-full', meta.color)} />
            <Icon className="mr-1 h-3 w-3" />
            {meta.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-2">
        {/* Named input chips */}
        {inputs.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {inputs.map((inp) => (
              <span
                key={inp.key}
                className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                title={inp.label}
              >
                <span className="font-semibold text-foreground">{inp.key}</span>
                <span className="max-w-[90px] truncate">{inp.label}</span>
              </span>
            ))}
          </div>
        ) : (
          <div className="text-[10px] text-muted-foreground/70 italic">
            No inputs — connect a card or source
          </div>
        )}

        {/* Operation summary */}
        <div className="rounded bg-muted/50 px-2 py-1 font-mono text-[11px] text-foreground/80 truncate">
          {opSummary(op)}
        </div>

        {/* Live output */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Output
          </span>
          <span className="text-sm font-bold tabular-nums">
            {formatValue(output)}
          </span>
        </div>
      </CardContent>

      {/* Drag handle */}
      <div className="p-2 border-t border-border/30 bg-muted/20">
        <div className="drag-handle__custom flex justify-center cursor-grab active:cursor-grabbing">
          <div className="flex items-center gap-1 px-3 py-1.5 bg-muted/80 backdrop-blur-sm rounded-full text-xs text-muted-foreground hover:bg-muted/90 transition-colors border border-border/50 shadow-sm">
            <GripVertical className="w-3 h-3" />
            <span className="font-medium select-none">Drag</span>
            <GripVertical className="w-3 h-3" />
          </div>
        </div>
      </div>
    </Card>
  );
});

OperatorNodeInner.displayName = 'OperatorNode';
export default OperatorNodeInner;
