import { Info } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { cn } from '@/shared/utils';

interface InfoHintProps {
  /** Help content shown on hover/focus. */
  content: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  iconClassName?: string;
  /** Accessible label for the trigger. */
  label?: string;
}

/**
 * Small `(!)` info affordance with a tooltip. Self-contained (ships its own
 * TooltipProvider) so it can be dropped anywhere — labels, settings rows,
 * relationship-type pickers, drift-factor explanations, etc.
 *
 * Source the `content` from docs/reference/metric-tree-methodology.md (via the
 * canonical metadata maps) so in-app help stays in sync with the methodology.
 */
export function InfoHint({
  content,
  side = 'top',
  className,
  iconClassName,
  label = 'More information',
}: InfoHintProps) {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={label}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'inline-flex items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              className
            )}
          >
            <Info className={cn('h-3.5 w-3.5', iconClassName)} />
          </button>
        </TooltipTrigger>
        <TooltipContent
          side={side}
          className="max-w-xs text-xs leading-relaxed"
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default InfoHint;
