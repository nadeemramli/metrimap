import * as React from 'react';
import { cn } from '@/shared/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  /** Optional primary action, typically a <Button>. */
  action?: React.ReactNode;
  className?: string;
}

/**
 * Unified empty-state used across pages (projects, evidence, assets, sources).
 * Replaces the per-feature variants so spacing, typography and icon sizing are
 * consistent. For context-aware messaging (no data vs. no filter results),
 * callers pass the appropriate title/description/action.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 text-center',
        className
      )}
    >
      {icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground [&>svg]:size-7">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
