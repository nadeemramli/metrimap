// Dashboard widget impact badge + overlay (CVS-172). Shows how many Strategy
// bets target this widget's metric(s), colour-coded by the most attention-worthy
// status, and lists them (owner, expected delta, window, roles) with jump-outs.

import { useState } from 'react';
import { Target } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { cn } from '@/shared/utils';
import { describeExpectedDelta } from '@/features/strategy/impact/impactContract';
import {
  dominantStatus,
  effectiveStatus,
  type EffectiveStatus,
  type WidgetStrategyLink,
} from '@/features/strategy/impact/widgetLinks';
import type { MeasuredImpact } from '@/features/strategy/impact/measurement';

const STATUS_STYLES: Record<EffectiveStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  planned: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  measuring: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  review_ready: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  won: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  lost: 'bg-red-500/10 text-red-600 dark:text-red-400',
  inconclusive: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400',
};

const STATUS_LABELS: Record<EffectiveStatus, string> = {
  draft: 'draft',
  planned: 'planned',
  measuring: 'measuring',
  review_ready: 'review ready',
  won: 'won',
  lost: 'lost',
  inconclusive: 'inconclusive',
};

interface WidgetImpactBadgeProps {
  links: WidgetStrategyLink[];
  currentPeriod: string;
  onOpenStrategy: (nodeId: string) => void;
  onOpenTrace?: (nodeId: string) => void;
  measuredMap?: Record<string, MeasuredImpact>;
}

export function WidgetImpactBadge({
  links,
  currentPeriod,
  onOpenStrategy,
  onOpenTrace,
  measuredMap,
}: WidgetImpactBadgeProps) {
  const [open, setOpen] = useState(false);
  if (links.length === 0) return null;

  const dominant = dominantStatus(links, currentPeriod) ?? 'planned';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-medium',
            STATUS_STYLES[dominant]
          )}
          aria-label={`${links.length} strategy ${links.length === 1 ? 'bet' : 'bets'} — ${STATUS_LABELS[dominant]}`}
          title={`${links.length} strategy ${links.length === 1 ? 'bet' : 'bets'} — ${STATUS_LABELS[dominant]}`}
        >
          <Target className="h-3 w-3" />
          {links.length}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b px-3 py-2 text-xs font-semibold text-muted-foreground">
          Linked strategy ({links.length})
        </div>
        <div className="max-h-80 divide-y overflow-auto">
          {links.map(({ contract, node, roles }) => {
            const status = effectiveStatus(contract, currentPeriod);
            const delta = describeExpectedDelta(contract);
            const window =
              contract.measureStart || contract.measureEnd
                ? `${contract.measureStart ?? '…'} – ${contract.measureEnd ?? '…'}`
                : null;
            return (
              <div key={contract.id} className="space-y-1.5 px-3 py-2 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <button
                    onClick={() => {
                      setOpen(false);
                      if (node) onOpenStrategy(node.id);
                    }}
                    className="text-left font-medium hover:text-primary hover:underline"
                  >
                    {node?.title || 'Strategy item'}
                  </button>
                  <span
                    className={cn(
                      'shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium',
                      STATUS_STYLES[status]
                    )}
                  >
                    {STATUS_LABELS[status]}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
                  {roles.map((r) => (
                    <span key={r} className="capitalize">
                      {r}
                    </span>
                  ))}
                  {delta && <span>expect {delta}</span>}
                  {measuredMap?.[contract.strategyNodeId]?.hasData && (
                    <span
                      className={cn(
                        'font-medium',
                        measuredMap[contract.strategyNodeId].met === 'met'
                          ? 'text-emerald-600'
                          : measuredMap[contract.strategyNodeId].met === 'missed'
                            ? 'text-red-600'
                            : 'text-muted-foreground'
                      )}
                    >
                      actual {measuredMap[contract.strategyNodeId].deltaText}
                    </span>
                  )}
                  {contract.confidence && <span>{contract.confidence} conf.</span>}
                  {window && <span>{window}</span>}
                  {contract.ownerLabel && <span>· {contract.ownerLabel}</span>}
                </div>
                <div className="flex gap-3 pt-0.5">
                  {node && (
                    <button
                      onClick={() => {
                        setOpen(false);
                        onOpenStrategy(node.id);
                      }}
                      className="text-[11px] text-primary hover:underline"
                    >
                      Open in Strategy
                    </button>
                  )}
                  {node && onOpenTrace && (
                    <button
                      onClick={() => {
                        setOpen(false);
                        onOpenTrace(node.id);
                      }}
                      className="text-[11px] text-primary hover:underline"
                    >
                      Trace
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
