import type { StrategyBoardData } from '@/features/strategy/utils/groupStrategy';
import { StrategyCardTile } from '@/features/strategy/components/StrategyCardTile';
import type { ImpactSummary } from '@/features/strategy/impact/impactContract';
import type { MeasuredImpact } from '@/features/strategy/impact/measurement';
import type { WorkflowStatus } from '@/shared/types';
import { cn } from '@/shared/utils';
import { useState } from 'react';

// Unified lifecycle kanban for Action + Hypothesis cards. Native HTML5 DnD:
// tiles are draggable, columns are drop targets; the page persists the drop.

interface StrategyBoardProps {
  board: StrategyBoardData;
  onStatusChange: (cardId: string, status: WorkflowStatus) => void;
  onCardClick?: (cardId: string) => void;
  impactSummaries?: Record<string, ImpactSummary>;
  measuredMap?: Record<string, MeasuredImpact>;
}

export function StrategyBoard({
  board,
  onStatusChange,
  onCardClick,
  impactSummaries,
  measuredMap,
}: StrategyBoardProps) {
  const [dragOver, setDragOver] = useState<WorkflowStatus | null>(null);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {board.columns.map((column) => (
        <div
          key={column.status}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            setDragOver(column.status);
          }}
          onDragLeave={() => setDragOver((s) => (s === column.status ? null : s))}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(null);
            const cardId = e.dataTransfer.getData('text/plain');
            if (cardId) onStatusChange(cardId, column.status);
          }}
          className={cn(
            'flex min-h-[240px] flex-col rounded-xl border bg-muted/30 transition-colors',
            dragOver === column.status && 'border-primary bg-primary/5'
          )}
        >
          <div className="flex items-center justify-between px-3 py-2.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {column.label}
            </span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {column.cards.length}
            </span>
          </div>
          <div className="flex-1 space-y-2 px-2 pb-2">
            {column.cards.map((card) => (
              <StrategyCardTile
                key={card.id}
                card={card}
                onClick={onCardClick}
                impact={impactSummaries?.[card.id]}
                measured={measuredMap?.[card.id]}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
