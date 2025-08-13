import { useCanvasStore } from '@/lib/stores';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils';
import { AlertCircle, CheckCircle, Clock, Save } from 'lucide-react';

interface AutoSaveIndicatorProps {
  className?: string;
}

export default function AutoSaveIndicator({
  className,
}: AutoSaveIndicatorProps) {
  const { saveAllPendingChanges, isSaving, lastSaved, pendingChanges } =
    useCanvasStore();

  const pendingCount = pendingChanges?.size || 0;
  const hasPendingChanges = pendingCount > 0;

  const handleManualSave = () => {
    saveAllPendingChanges();
  };

  const getLastSavedText = () => {
    if (!lastSaved) return 'Not saved yet';

    const diff = Date.now() - new Date(lastSaved).getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    if (minutes > 0) return `Saved ${minutes}m ago`;
    return `Saved ${seconds}s ago`;
  };

  const getStatusIcon = () => {
    if (isSaving) return <Clock className="h-3 w-3 animate-spin" />;
    if (hasPendingChanges) return <AlertCircle className="h-3 w-3" />;
    return <CheckCircle className="h-3 w-3" />;
  };

  const getStatusText = () => {
    if (isSaving) return 'Saving...';
    if (hasPendingChanges) return `${pendingCount} unsaved changes`;
    return 'All changes saved';
  };

  const getStatusVariant = () => {
    if (isSaving) return 'secondary' as const;
    if (hasPendingChanges) return 'outline' as const;
    return 'default' as const;
  };

  return (
    <div className={cn('flex items-center gap-2 min-w-[300px]', className)}>
      <Badge
        variant={getStatusVariant()}
        className="flex items-center gap-1.5 px-2 py-1"
      >
        {getStatusIcon()}
        <span className="text-xs font-medium">{getStatusText()}</span>
      </Badge>

      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {getLastSavedText()}
      </span>

      <div className="w-[70px] flex justify-end">
        {hasPendingChanges && !isSaving && (
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
