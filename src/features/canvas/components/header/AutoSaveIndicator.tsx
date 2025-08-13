import { useCanvasStore } from '@/lib/stores';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils';
import { Save } from 'lucide-react';

interface AutoSaveIndicatorProps {
  className?: string;
}

export default function AutoSaveIndicator({
  className,
}: AutoSaveIndicatorProps) {
  const { saveAllPendingChanges, isSaving, lastSaved, pendingChanges, error } =
    useCanvasStore();

  const pendingCount = pendingChanges?.size || 0;
  const hasPendingChanges = pendingCount > 0;
  const hasError = Boolean(error);

  const handleManualSave = () => {
    saveAllPendingChanges();
  };

  // Status helpers (4-state design)
  const getStatusText = () => {
    if (hasError) return 'Error saving';
    if (hasPendingChanges)
      return `${pendingCount} unsaved change${pendingCount > 1 ? 's' : ''}`;
    if (lastSaved && !isSaving) return 'Saved just now';
    return 'Auto-save enabled';
  };

  const getDotClass = () => {
    if (hasError) return 'bg-red-500';
    if (hasPendingChanges) return 'bg-amber-500';
    if (lastSaved && !isSaving) return 'bg-emerald-500';
    return 'bg-gray-400';
  };

  const getBadgeClass = () => {
    if (hasError) return 'bg-red-100 text-red-700 border border-red-200';
    if (hasPendingChanges)
      return 'bg-amber-100 text-amber-800 border border-amber-200';
    if (lastSaved && !isSaving)
      return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
    return 'bg-gray-100 text-gray-700 border border-gray-200';
  };

  return (
    <div
      className={cn('flex items-center gap-2 min-w-[300px]', className)}
      aria-live="polite"
    >
      <Badge
        variant="outline"
        className={cn('flex items-center gap-2 px-2 py-1 h-6', getBadgeClass())}
      >
        <span className={cn('h-2 w-2 rounded-full', getDotClass())} />
        <span className="text-xs font-medium">{getStatusText()}</span>
      </Badge>

      <div className="w-[70px] flex justify-end">
        {hasPendingChanges && !isSaving && !hasError && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleManualSave}
            className="h-6 px-2 text-xs"
          >
            <Save className="h-3 w-3 mr-1" />
            Save Now
          </Button>
        )}
      </div>
    </div>
  );
}
