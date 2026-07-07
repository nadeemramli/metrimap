import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils';
import { Lightbulb, X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { toast } from 'sonner';
import { useOnboardingStore } from './useOnboardingStore';

// One-shot feature-discovery tips (CVS-114 slice 4). A tip renders inline the
// first time a surface is encountered and never again once dismissed
// (persisted in useOnboardingStore.dismissedTips).

/**
 * Fire a one-shot toast tip for transient surfaces (mode switches) where an
 * inline card has nowhere to live. Marks the tip dismissed immediately so it
 * only ever fires once per browser.
 */
export function fireTipToast(id: string, message: string) {
  const s = useOnboardingStore.getState();
  if (s.dismissedTips[id]) return;
  s.dismissTip(id);
  toast.info(message, { duration: 8000 });
}

/** Fires the draw-mode keyboard-hints toast the first time draw mode opens. */
export function DrawModeTip({ active }: { active: boolean }) {
  useEffect(() => {
    if (active)
      fireTipToast(
        'draw-mode',
        'Draw mode — P freehand · R rectangle · O ellipse · A arrow · T text · Esc returns to select. Drawings become layers you can reorder.'
      );
  }, [active]);
  return null;
}

/** Whether tip `id` should show, and a dismisser that persists. */
export function useFeatureTip(id: string) {
  const dismissed = useOnboardingStore((s) => !!s.dismissedTips[id]);
  return {
    show: !dismissed,
    dismiss: () => useOnboardingStore.getState().dismissTip(id),
  };
}

/**
 * Inline dismissible tip card. Renders nothing once its id was dismissed —
 * safe to leave permanently mounted at the top of a panel/section.
 */
export function FeatureTipCard({
  id,
  children,
  className,
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  const { show, dismiss } = useFeatureTip(id);
  if (!show) return null;
  return (
    <div
      role="note"
      className={cn(
        'flex items-start gap-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-xs leading-relaxed text-foreground',
        className
      )}
    >
      <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
      <div className="min-w-0 flex-1">{children}</div>
      <Button
        variant="ghost"
        size="sm"
        className="h-5 w-5 shrink-0 p-0 text-muted-foreground hover:text-foreground"
        onClick={dismiss}
        aria-label="Dismiss tip"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}
