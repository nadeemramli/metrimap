import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { cn } from '@/shared/utils';
import { AlertTriangle } from 'lucide-react';
import type { ReactNode } from 'react';

// Shared empty / loading / error states (CVS-158). Sized to fit inside a card
// or sheet body — no fixed heights, so they never create huge blank panels.

interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  compact?: boolean;
}

/** Dashed-border empty slot with an optional primary action. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  compact,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 text-center',
        compact ? 'p-4' : 'p-8',
        className
      )}
    >
      {Icon && <Icon className="h-6 w-6 text-muted-foreground" />}
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description && (
        <p className="max-w-xs text-xs text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}

/** Skeleton rows for loading a card/sheet body. */
export function LoadingState({
  rows = 3,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)} aria-busy="true">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

/** Inline error with an optional retry — states what went wrong, not an apology. */
export function ErrorState({
  title = 'Something went wrong',
  description,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center',
        className
      )}
    >
      <AlertTriangle className="h-6 w-6 text-destructive" />
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description && (
        <p className="max-w-xs text-xs text-muted-foreground">{description}</p>
      )}
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-1" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
