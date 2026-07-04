'use client';

import { memo } from 'react';
import { type NodeProps } from '@xyflow/react';
import { FourSideHandles } from './FourSideHandles';
import {
  NodeCardShell,
  EmptyState,
} from '@/features/canvas/components/primitives';
import {
  Activity,
  Calculator,
  Filter,
  GripVertical,
  Sigma,
  ToggleLeft,
} from 'lucide-react';
import { useOperatorPreviewStore } from '@/features/canvas/stores/useOperatorPreviewStore';
import { normalizeOperatorData } from '@/features/canvas/utils/operatorMigration';
import type { OperatorNodeData } from '@/features/canvas/types/operator';

const TYPE_META: Record<
  OperatorNodeData['operationType'],
  { icon: typeof Calculator; accent: string; label: string }
> = {
  formula: { icon: Calculator, accent: '#3b82f6', label: 'Formula' },
  aggregate: { icon: Sigma, accent: '#6366f1', label: 'Aggregate' },
  gate: { icon: Filter, accent: '#f59e0b', label: 'Gate' },
  toggle: { icon: ToggleLeft, accent: '#22c55e', label: 'Toggle' },
  statistical: { icon: Activity, accent: '#a855f7', label: 'Statistical' },
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

const DragPill = () => (
  <div className="drag-handle__custom flex cursor-grab justify-center active:cursor-grabbing">
    <div className="flex items-center gap-1 rounded-full border border-border/50 bg-muted/80 px-3 py-1.5 text-xs text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-muted/90">
      <GripVertical className="h-3 w-3" />
      <span className="select-none font-medium">Drag</span>
      <GripVertical className="h-3 w-3" />
    </div>
  </div>
);

const OperatorNodeInner = memo(({ id, data, selected }: NodeProps) => {
  const op = normalizeOperatorData(data as any) as OperatorNodeData;
  const output = useOperatorPreviewStore((s) => s.operatorValues[id]);

  const meta = TYPE_META[op.operationType] ?? TYPE_META.formula;
  const inputs = op.inputs || [];

  return (
    <NodeCardShell
      icon={meta.icon}
      accent={meta.accent}
      title={op.label || 'Operator'}
      typeLabel={meta.label}
      width={248}
      selected={!!selected}
      className={op.isActive ? undefined : 'opacity-60'}
      handles={<FourSideHandles />}
      dragHandle={<DragPill />}
    >
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
        <EmptyState
          compact
          title="No inputs"
          description="Connect a card or source"
        />
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
    </NodeCardShell>
  );
});

OperatorNodeInner.displayName = 'OperatorNode';
export default OperatorNodeInner;
