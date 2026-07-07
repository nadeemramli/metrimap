import { useViewport } from '@xyflow/react';
import { type ReactNode } from 'react';
import { cn } from '@/shared/utils';

/**
 * Zoom counter-scale for canvas annotations (Figma-style): pins/bubbles keep a
 * readable screen size as the user zooms OUT (scale by 1/zoom, clamped), and
 * behave normally at zoom >= 1.
 *
 * #185 guard: apply this to an INNER element only. The React Flow node wrapper
 * must keep a fixed footprint so RF's `measured` dimensions never churn with
 * zoom (CanvasPage's reconcile preserves `measured`; feeding it zoom-dependent
 * sizes would re-arm the update loop).
 */
export function useAnnotationScale(max = 2.5): number {
  const { zoom } = useViewport();
  return Math.min(Math.max(1, 1 / zoom), max);
}

interface AnnotationPinProps {
  /** Pin fill, as a Tailwind bg class (e.g. "bg-rose-500", "bg-emerald-500"). */
  colorClass: string;
  /** Unread activity: colored ring + soft ping + pops slightly bigger. */
  unread?: boolean;
  title?: string;
  onClick?: () => void;
  /** Pin face: an icon, initials, or an avatar image. */
  children: ReactNode;
  className?: string;
}

/**
 * Figma-style annotation pin: an opaque teardrop (circle with a squared
 * bottom-left corner pointing at its anchor) that counter-scales with zoom so
 * it stays visible when zoomed out. Shared by comment + evidence nodes.
 *
 * NOT `nodrag`: a stationary click (below RF's drag threshold) triggers
 * onClick, while a drag still moves the node — the pin is the only grabbable
 * element when collapsed.
 */
export function AnnotationPin({
  colorClass,
  unread = false,
  title,
  onClick,
  children,
  className,
}: AnnotationPinProps) {
  const scale = useAnnotationScale() * (unread ? 1.15 : 1);

  return (
    // Fixed 32px footprint — RF measures this, never the scaled inner.
    <div className={cn('relative h-8 w-8 select-none', className)}>
      <div
        className="absolute bottom-0 left-0"
        style={{ transform: `scale(${scale})`, transformOrigin: 'bottom left' }}
      >
        {unread && (
          <span
            className={cn(
              'absolute inset-0 animate-ping rounded-full rounded-bl-sm opacity-40',
              colorClass
            )}
            aria-hidden
          />
        )}
        <button
          type="button"
          onClick={onClick}
          title={title}
          className={cn(
            'relative flex h-8 w-8 items-center justify-center overflow-hidden',
            'rounded-full rounded-bl-sm text-white shadow-md',
            'border-2 border-background cursor-pointer',
            unread && 'ring-2 ring-offset-1 ring-offset-background',
            colorClass,
            unread && 'ring-current'
          )}
        >
          {children}
        </button>
      </div>
    </div>
  );
}

export default AnnotationPin;
