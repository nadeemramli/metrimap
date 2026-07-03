import { useMemo } from 'react';
import { History, X } from 'lucide-react';
import { cn } from '@/shared/utils';
import { Button } from '@/shared/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { useCanvasStore } from '@/lib/stores';
import { useTimeTravelStore } from '@/features/canvas/stores/useTimeTravelStore';
import { availablePeriods } from '@/features/canvas/utils/timeTravel';

const LIVE = '__live__';
const NONE = '__none__';

/**
 * Canvas header control for time-travel: view every card's value AS OF a past
 * period, and optionally show the delta vs a compare period. Read-only — it
 * never changes persisted data. Lives in the CanvasHeader actions slot.
 */
export function TimeTravelControl() {
  const nodes = useCanvasStore((s) => s.canvas?.nodes);
  const { asOfPeriod, comparePeriod, setAsOf, setCompare, reset } =
    useTimeTravelStore();

  const periods = useMemo(
    () => availablePeriods((nodes || []).map((n) => n.data)).reverse(), // newest first
    [nodes]
  );

  // No time-series on this canvas → nothing to time-travel.
  if (periods.length === 0) return null;

  const active = asOfPeriod !== null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={active ? 'secondary' : 'ghost'}
          size="sm"
          className={cn('h-8 gap-1.5', active && 'text-amber-700')}
          title="Time-travel: view values as of a past period"
        >
          <History className="h-4 w-4" />
          {active ? `As of ${asOfPeriod}` : 'Live'}
          {comparePeriod && (
            <span className="text-xs text-muted-foreground">
              vs {comparePeriod}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 space-y-3">
        <div>
          <div className="mb-1 text-xs font-medium text-muted-foreground">
            View as of
          </div>
          <Select
            value={asOfPeriod ?? LIVE}
            onValueChange={(v) => setAsOf(v === LIVE ? null : v)}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={LIVE}>Latest (live)</SelectItem>
              {periods.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="mb-1 text-xs font-medium text-muted-foreground">
            Compare with
          </div>
          <Select
            value={comparePeriod ?? NONE}
            onValueChange={(v) => setCompare(v === NONE ? null : v)}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>None</SelectItem>
              {periods.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(active || comparePeriod) && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-full gap-1 text-muted-foreground"
            onClick={reset}
          >
            <X className="h-3.5 w-3.5" /> Reset to live
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default TimeTravelControl;
