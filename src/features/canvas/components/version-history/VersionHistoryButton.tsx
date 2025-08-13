import { useVersionHistoryStore } from '@/lib/stores/version-history/useVersionHistoryStore';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { Camera, History } from 'lucide-react';
import { useState } from 'react';
import VersionHistoryPanel from './VersionHistoryPanel';

interface VersionHistoryButtonProps {
  canvasId: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

export default function VersionHistoryButton({
  canvasId,
  className,
  variant = 'outline',
  size = 'default',
}: VersionHistoryButtonProps) {
  const [showPanel, setShowPanel] = useState(false);
  const { snapshots, config, createSnapshot } = useVersionHistoryStore();

  const handleQuickSnapshot = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const title = `Quick snapshot ${new Date().toLocaleTimeString()}`;
    try {
      await createSnapshot(
        canvasId,
        title,
        'Quick snapshot created from toolbar'
      );
    } catch (error) {
      console.error('Failed to create quick snapshot:', error);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={variant}
              size={size}
              onClick={() => setShowPanel(true)}
              className={className}
            >
              <History className="h-4 w-4" />
              {snapshots.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1 text-xs">
                  {snapshots.length}
                </Badge>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-center">
              <div className="font-medium">Version History</div>
              <div className="text-xs text-muted-foreground">
                {snapshots.length} snapshots
                {config.autoSnapshotEnabled && ' • Auto-save ON'}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={handleQuickSnapshot}
              className="h-8 w-8 p-0"
            >
              <Camera className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-center">
              <div className="font-medium">Quick Snapshot</div>
              <div className="text-xs text-muted-foreground">
                Save current state instantly
              </div>
            </div>
          </TooltipContent>
        </Tooltip>

        <VersionHistoryPanel
          canvasId={canvasId}
          isOpen={showPanel}
          onClose={() => setShowPanel(false)}
        />
      </div>
    </TooltipProvider>
  );
}
