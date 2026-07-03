import type { JourneyStep } from '@/features/strategy/utils/valueJourney';
import { Badge } from '@/shared/components/ui/badge';
import { ChevronRight, Gem, Hammer } from 'lucide-react';

// Horizontal value-chain strip atop the Strategy page: each Core/Value card in
// journey order (canvas left→right), with connected-metric health dots and the
// amount of attached work. Hidden by the page when there are no value cards.

interface ValueJourneyStripProps {
  steps: JourneyStep[];
}

function HealthDots({
  health,
}: {
  health: JourneyStep['metricHealth'];
}) {
  if (health.total === 0) {
    return <span className="text-[10px] text-muted-foreground">no metrics</span>;
  }
  const dot = (count: number, className: string, label: string) =>
    count > 0 && (
      <span className="flex items-center gap-0.5" title={`${count} ${label}`}>
        <span className={`h-2 w-2 rounded-full ${className}`} />
        <span className="text-[10px] text-muted-foreground">{count}</span>
      </span>
    );
  return (
    <span className="flex items-center gap-1.5">
      {dot(health.up, 'bg-emerald-500', 'trending up')}
      {dot(health.down, 'bg-red-500', 'trending down')}
      {dot(health.flat, 'bg-muted-foreground/50', 'flat')}
    </span>
  );
}

export function ValueJourneyStrip({ steps }: ValueJourneyStripProps) {
  return (
    <div className="mb-4 overflow-x-auto">
      <div className="flex min-w-max items-stretch gap-1">
        {steps.map((step, i) => (
          <div key={step.card.id} className="flex items-center gap-1">
            <div className="w-[200px] space-y-1.5 rounded-lg border bg-card p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 truncate text-sm font-medium">
                  <Gem className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
                  <span className="truncate">
                    {step.card.title || 'Untitled'}
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                {step.card.subCategory && (
                  <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
                    {step.card.subCategory}
                  </Badge>
                )}
                <HealthDots health={step.metricHealth} />
              </div>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Hammer className="h-3 w-3" />
                {step.workCount} work item{step.workCount === 1 ? '' : 's'}
              </div>
            </div>
            {i < steps.length - 1 && (
              <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
