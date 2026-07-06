import { cn } from '@/shared/utils';
import type { ReactNode } from 'react';

/**
 * Standard panel section: a bold section label with an optional right-aligned
 * action, followed by rows/content. The shared visual language for all docked
 * panels (Info / Details / Settings groupings).
 */
export function DockSection({
  title,
  action,
  className,
  children,
}: {
  title: ReactNode;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn('py-3 first:pt-1', className)}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {action}
      </div>
      <div className="space-y-1.5">{children}</div>
    </section>
  );
}

/**
 * Standard label/value row inside a DockSection: label left (muted), value or
 * control right-aligned.
 */
export function DockRow({
  label,
  className,
  children,
}: {
  label: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        'flex min-h-7 items-center justify-between gap-3 text-sm',
        className
      )}
    >
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="min-w-0 truncate text-right font-medium text-foreground">
        {children}
      </span>
    </div>
  );
}
