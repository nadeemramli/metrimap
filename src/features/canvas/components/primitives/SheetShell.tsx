import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '@/shared/components/ui/sheet';
import { cn } from '@/shared/utils';
import type { ReactNode } from 'react';

interface SheetShellProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Small label above the title (type/status). */
  eyebrow?: ReactNode;
  /** Right-aligned header controls (e.g. a status pill or menu). */
  headerActions?: ReactNode;
  /** Optional tab bar rendered under the header (pass a <CompactTabs/>). */
  tabs?: ReactNode;
  /** Sticky footer — always visible (save/cancel never scroll off-screen). */
  footer?: ReactNode;
  /** Sheet width in px (default 640). */
  width?: number;
  className?: string;
  children: ReactNode;
}

/**
 * The one right-side detail/settings sheet shell (CVS-158). Generalizes
 * `NodePanelShell`: static header (eyebrow / title / subtitle / actions), an
 * optional tab bar, a scrolling body, and — the key fix — a **sticky footer**
 * so save/cancel are always visible instead of buried at the end of a tab body.
 * Retires the `fixed inset-0` centered-modal variant.
 */
export function SheetShell({
  open,
  onOpenChange,
  title,
  subtitle,
  eyebrow,
  headerActions,
  tabs,
  footer,
  width = 640,
  className,
  children,
}: SheetShellProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        style={{ width, maxWidth: '100vw' }}
        className={cn('flex flex-col gap-0 overflow-hidden p-0', className)}
      >
        <div className="shrink-0 border-b px-5 pb-3 pt-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {eyebrow && (
                <div className="mb-1 text-xs font-medium text-muted-foreground">
                  {eyebrow}
                </div>
              )}
              <SheetTitle className="truncate text-lg font-semibold leading-tight">
                {title || 'Details'}
              </SheetTitle>
              {subtitle ? (
                <SheetDescription className="mt-0.5 text-sm text-muted-foreground">
                  {subtitle}
                </SheetDescription>
              ) : (
                <SheetDescription className="sr-only">
                  Details panel
                </SheetDescription>
              )}
            </div>
            {headerActions && (
              <div className="flex shrink-0 items-center gap-1.5">
                {headerActions}
              </div>
            )}
          </div>
          {tabs && <div className="mt-3">{tabs}</div>}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {footer && (
          <div className="shrink-0 border-t bg-background px-5 py-3">
            {footer}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
