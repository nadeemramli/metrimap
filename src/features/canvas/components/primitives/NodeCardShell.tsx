import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/utils';
import type { ReactNode } from 'react';

interface NodeCardShellProps {
  /** Accent hex (e.g. '#3b82f6') — tints the icon chip. Falls back to the primary token. */
  accent?: string;
  icon?: React.ElementType;
  /** Short type label shown as a badge (e.g. "Metric", "Source"). */
  typeLabel?: ReactNode;
  title: ReactNode;
  /** Extra header controls, right-aligned. */
  headerRight?: ReactNode;
  /** Badge/status row under the title. */
  badges?: ReactNode;
  /** Footer metadata (id, owner, timestamps). */
  footer?: ReactNode;
  selected?: boolean;
  onDoubleClick?: () => void;
  /** React Flow <Handle> elements. */
  handles?: ReactNode;
  /** Bottom drag-handle bar (e.g. a `.drag-handle__custom` pill). */
  dragHandle?: ReactNode;
  /** Hover/selection toolbar (caller controls visibility). */
  toolbar?: ReactNode;
  width?: number;
  className?: string;
  children?: ReactNode;
}

/**
 * The one node-card shell (CVS-158). Replaces the four near-identical hand-rolled
 * PRD-node `<div>` shells and normalizes the Operator/Chart/Source widths/radii.
 * Header (accent icon chip + type badge + title) · body slot · optional footer ·
 * consistent selection ring, all on theme tokens (no `gray-*`/`blue-*`). Handles
 * and the hover toolbar are slots so React Flow behavior stays with the node.
 */
export function NodeCardShell({
  accent,
  icon: Icon,
  typeLabel,
  title,
  headerRight,
  badges,
  footer,
  selected,
  onDoubleClick,
  handles,
  dragHandle,
  toolbar,
  width = 300,
  className,
  children,
}: NodeCardShellProps) {
  return (
    <div className="relative" style={{ width }}>
      {toolbar}
      <div
        onDoubleClick={onDoubleClick}
        className={cn(
          'overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow',
          selected
            ? 'border-primary ring-2 ring-primary/40'
            : 'border-border hover:shadow-md',
          className
        )}
      >
        <div className="flex items-center gap-2 border-b border-border/60 px-3 py-2">
          {Icon && (
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
              style={{
                backgroundColor: accent ? `${accent}1a` : 'var(--muted)',
                color: accent || 'var(--primary)',
              }}
            >
              <Icon className="h-4 w-4" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold leading-tight">
              {title}
            </div>
          </div>
          {typeLabel && (
            <Badge variant="secondary" className="shrink-0 font-normal">
              {typeLabel}
            </Badge>
          )}
          {headerRight}
        </div>

        {(children || badges) && (
          <div className="space-y-2 px-3 py-2">
            {children}
            {badges && (
              <div className="flex flex-wrap items-center gap-1.5">{badges}</div>
            )}
          </div>
        )}

        {footer && (
          <div className="flex items-center justify-between gap-2 border-t border-border/60 bg-muted/40 px-3 py-1.5 text-[11px] text-muted-foreground">
            {footer}
          </div>
        )}

        {dragHandle && (
          <div className="border-t border-border/40 bg-muted/20 p-2">
            {dragHandle}
          </div>
        )}
      </div>
      {handles}
    </div>
  );
}
