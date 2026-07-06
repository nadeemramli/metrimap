import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils';
import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';

export interface DockPanelShellProps {
  title: ReactNode;
  /** Small leading icon rendered beside the title. */
  icon?: ReactNode;
  subtitle?: ReactNode;
  /** Small label above the title (type/status). */
  eyebrow?: ReactNode;
  /** Right-aligned header controls (status pill, export menu, …). */
  headerActions?: ReactNode;
  /** Optional tab bar rendered under the header. */
  tabs?: ReactNode;
  /** Sticky footer — save/cancel never scroll off-screen. */
  footer?: ReactNode;
  onClose?: () => void;
  /** Close on Escape (skipped while typing in inputs). Default true. */
  closeOnEscape?: boolean;
  /** Body scrolls by default; disable for panels that manage their own scroll areas. */
  scrollBody?: boolean;
  /** Default body padding; disable for edge-to-edge content. */
  padded?: boolean;
  className?: string;
  children: ReactNode;
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT' ||
    target.isContentEditable
  );
}

/**
 * The one docked-panel shell (successor to SheetShell/NodePanelShell): static
 * header (eyebrow / icon+title / subtitle / actions / close), optional tab
 * bar, scrolling body, sticky footer. A plain non-modal column — no Radix
 * focus trap or overlay — sized by its DockHost slot, always below the top bar.
 */
export function DockPanelShell({
  title,
  icon,
  subtitle,
  eyebrow,
  headerActions,
  tabs,
  footer,
  onClose,
  closeOnEscape = true,
  scrollBody = true,
  padded = true,
  className,
  children,
}: DockPanelShellProps) {
  useEffect(() => {
    if (!closeOnEscape || !onClose) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      if (isTypingTarget(e.target)) return;
      onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closeOnEscape, onClose]);

  return (
    <div
      role="complementary"
      aria-label={typeof title === 'string' ? title : 'Details panel'}
      className={cn('flex h-full w-full flex-col bg-background', className)}
    >
      <div className="shrink-0 border-b border-border px-4 pb-3 pt-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {eyebrow && (
              <div className="mb-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {eyebrow}
              </div>
            )}
            <div className="flex items-center gap-2">
              {icon && (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground [&>svg]:h-3.5 [&>svg]:w-3.5">
                  {icon}
                </span>
              )}
              <h2 className="truncate text-sm font-semibold leading-tight text-foreground">
                {title || 'Details'}
              </h2>
            </div>
            {subtitle && (
              <div className="mt-0.5 truncate text-xs text-muted-foreground">
                {subtitle}
              </div>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {headerActions}
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                onClick={onClose}
                aria-label="Close panel"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        {tabs && <div className="mt-3">{tabs}</div>}
      </div>

      <div
        className={cn(
          'flex-1 min-h-0',
          scrollBody ? 'overflow-y-auto' : 'flex flex-col overflow-hidden',
          padded && 'px-4 py-3'
        )}
      >
        {children}
      </div>

      {footer && (
        <div className="shrink-0 border-t border-border bg-background px-4 py-3">
          {footer}
        </div>
      )}
    </div>
  );
}
