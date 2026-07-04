// Compact impact summary for board tiles + table cells (CVS-170): status pill +
// target metric + expected delta. Reads a pre-computed ImpactSummary.

import { Target } from 'lucide-react';
import { cn } from '@/shared/utils';
import type { ImpactStatus } from '@/features/strategy/impact/types';
import type { ImpactSummary } from '@/features/strategy/impact/impactContract';

const IMPACT_STATUS_STYLES: Record<ImpactStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  planned: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  measuring: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  won: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  lost: 'bg-red-500/10 text-red-600 dark:text-red-400',
  inconclusive: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400',
};

interface ImpactChipProps {
  summary: ImpactSummary;
  className?: string;
}

export function ImpactChip({ summary, className }: ImpactChipProps) {
  return (
    <span className={cn('flex flex-wrap items-center gap-1.5', className)}>
      <span
        className={cn(
          'rounded px-1.5 py-0.5 text-[10px] font-medium capitalize',
          IMPACT_STATUS_STYLES[summary.status]
        )}
      >
        {summary.status}
      </span>
      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
        <Target className="h-3 w-3 shrink-0" />
        {summary.hasTarget ? (
          <span className="max-w-[120px] truncate">{summary.targetLabel}</span>
        ) : (
          <span className="italic">no target</span>
        )}
      </span>
      {summary.deltaText && (
        <span className="text-[10px] font-medium text-muted-foreground">
          {summary.deltaText}
        </span>
      )}
    </span>
  );
}
