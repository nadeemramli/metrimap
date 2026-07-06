import { PRIORITY_STYLES } from '@/features/canvas/utils/workflow';
import { Badge } from '@/shared/components/ui/badge';
import { ImpactChip } from '@/features/strategy/components/ImpactChip';
import type { ImpactSummary } from '@/features/strategy/impact/impactContract';
import type { MeasuredImpact } from '@/features/strategy/impact/measurement';
import type { MetricCard } from '@/shared/types';
import { cn } from '@/shared/utils';
import { CalendarDays, FlaskConical, Hammer } from 'lucide-react';

// One card on the Strategy board. Draggable via native HTML5 DnD — the board
// column handles the drop.

interface StrategyCardTileProps {
  card: MetricCard;
  onClick?: (cardId: string) => void;
  impact?: ImpactSummary;
  measured?: MeasuredImpact;
}

export function StrategyCardTile({ card, onClick, impact, measured }: StrategyCardTileProps) {
  const isHypothesis = card.category === 'Ideas/Hypothesis';
  const workflow = card.workflow ?? {};
  const KindIcon = isHypothesis ? FlaskConical : Hammer;

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', card.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
      onClick={() => onClick?.(card.id)}
      className="cursor-grab space-y-2 rounded-lg border bg-card p-3 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-snug">
          {card.title || 'Untitled'}
        </p>
        <KindIcon
          className={cn(
            'h-3.5 w-3.5 flex-shrink-0 mt-0.5',
            isHypothesis ? 'text-purple-500' : 'text-blue-500'
          )}
        />
      </div>

      {card.description && (
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {card.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-1.5">
        {card.subCategory && (
          <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
            {card.subCategory}
          </Badge>
        )}
        {workflow.priority && (
          <span
            className={cn(
              'rounded px-1.5 py-0.5 text-[10px] font-medium',
              PRIORITY_STYLES[workflow.priority]
            )}
          >
            {workflow.priority}
          </span>
        )}
        {isHypothesis && workflow.confidence && (
          <span className="rounded bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-medium text-purple-600 dark:text-purple-400">
            {workflow.confidence} confidence
          </span>
        )}
        {workflow.dueDate && (
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <CalendarDays className="h-3 w-3" />
            {workflow.dueDate}
          </span>
        )}
        {typeof workflow.effort === 'number' && (
          <span className="text-[10px] text-muted-foreground">
            {workflow.effort}d
          </span>
        )}
      </div>

      {impact && (
        <div className="border-t pt-2">
          <ImpactChip summary={impact} measured={measured} />
        </div>
      )}
    </div>
  );
}
