import { useCanvasStore } from '@/lib/stores';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils';
import { Loader2, Save } from 'lucide-react';

interface AutoSaveIndicatorProps {
  className?: string;
}

/**
 * Compact auto-save status pill for the canvas header.
 * - green (pulsing) when auto-save is on / idle / recently saved → "online"
 * - blue + spinner while saving
 * - amber + "Save Now" when there are unsaved changes
 * - red when the last save failed
 */
export default function AutoSaveIndicator({
  className,
}: AutoSaveIndicatorProps) {
  const { saveAllPendingChanges, isSaving, lastSaved, pendingChanges, error } =
    useCanvasStore();

  const pendingCount = pendingChanges?.size || 0;
  const hasPending = pendingCount > 0;
  const hasError = Boolean(error);

  let text: string;
  let dotClass: string;
  let badgeClass: string;

  if (hasError) {
    text = 'Save failed';
    dotClass = 'bg-red-500';
    badgeClass = 'bg-red-50 text-red-700 border-red-200';
  } else if (isSaving) {
    text = 'Saving…';
    dotClass = 'bg-blue-500';
    badgeClass = 'bg-blue-50 text-blue-700 border-blue-200';
  } else if (hasPending) {
    text = `${pendingCount} unsaved`;
    dotClass = 'bg-amber-500';
    badgeClass = 'bg-amber-50 text-amber-800 border-amber-200';
  } else if (lastSaved) {
    text = 'Saved';
    dotClass = 'bg-emerald-500';
    badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else {
    text = 'Auto-save on';
    dotClass = 'bg-emerald-500';
    badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }

  // Pulse the green dot to signal a live/online auto-save connection.
  const live = !hasError && !hasPending && !isSaving;

  return (
    <div
      className={cn('flex items-center gap-1.5', className)}
      aria-live="polite"
    >
      <Badge
        variant="outline"
        className={cn(
          'flex items-center gap-1.5 px-2 h-7 whitespace-nowrap',
          badgeClass
        )}
      >
        {isSaving ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <span
            className={cn(
              'h-2 w-2 rounded-full',
              dotClass,
              live && 'animate-pulse'
            )}
          />
        )}
        <span className="text-xs font-medium">{text}</span>
      </Badge>

      {hasPending && !isSaving && !hasError && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => saveAllPendingChanges()}
          className="h-7 px-2 text-xs"
        >
          <Save className="h-3 w-3 mr-1" />
          Save Now
        </Button>
      )}
    </div>
  );
}
