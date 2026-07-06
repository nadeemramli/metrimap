import type { JourneyStep } from '@/features/strategy/utils/valueJourney';
import { Badge } from '@/shared/components/ui/badge';
import { ChevronRight, Gem, Hammer } from 'lucide-react';

// Value-journey rail on the Strategy page: each Core/Value card in journey
// order (canvas left→right) drawn as a compact step on a connected chain, with
// metric-health dots and attached-work counts. Collapsed by default — the page
// toggles it from the toolbar's "Journey" button.

interface ValueJourneyStripProps {
  steps: JourneyStep[];
}

function HealthDots({ health }: { health: JourneyStep['metricHealth'] }) {
  if (health.total === 0) {
    return <span>no metrics</span>;
  }
  const dot = (count: number, className: string, label: string) =>
    count > 0 && (
      <span className="flex items-center gap-1" title={`${count} ${label}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${className}`} />
        {count}
      </span>
    );
  return (
    <span className="flex items-center gap-2">
      {dot(health.up, 'bg-emerald-500', 'trending up')}
      {dot(health.down, 'bg-red-500', 'trending down')}
      {dot(health.flat, 'bg-muted-foreground/50', 'flat')}
    </span>
  );
}

export function ValueJourneyStrip({ steps }: ValueJourneyStripProps) {
  return (
    <div className="mb-4 overflow-x-auto rounded-lg border border-border bg-card/50 px-4 py-2.5">
      <div className="flex min-w-max items-center">
        {steps.map((step, i) => (
          <div key={step.card.id} className="flex items-center">
            {i > 0 && (
              <div className="mx-3 flex shrink-0 items-center text-muted-foreground/60">
                <div className="h-px w-8 bg-border" />
                <ChevronRight className="-ml-1 h-3 w-3" />
              </div>
            )}
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Gem className="h-3.5 w-3.5 text-primary" />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="max-w-[200px] truncate text-sm font-medium leading-tight">
                    {step.card.title || 'Untitled'}
                  </span>
                  {step.card.subCategory && (
                    <Badge
                      variant="outline"
                      className="h-4 px-1 text-[10px] font-normal"
                    >
                      {step.card.subCategory}
                    </Badge>
                  )}
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-[11px] leading-tight text-muted-foreground">
                  <HealthDots health={step.metricHealth} />
                  <span className="text-muted-foreground/40">·</span>
                  <span className="flex items-center gap-1">
                    <Hammer className="h-3 w-3" />
                    {step.workCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
