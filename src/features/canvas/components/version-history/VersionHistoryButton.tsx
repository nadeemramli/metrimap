import { useVersionHistoryStore } from '@/lib/stores/version-history/useVersionHistoryStore';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { Flag } from 'lucide-react';
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
  const snapshots = useVersionHistoryStore((s) => s.snapshots);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            onClick={() => setShowPanel(true)}
            className={className}
          >
            <Flag className="h-4 w-4" />
            {snapshots.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1 text-xs">
                {snapshots.length}
              </Badge>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-center">
            <div className="font-medium">Checkpoints</div>
            <div className="text-xs text-muted-foreground">
              Save and load canvas states
            </div>
          </div>
        </TooltipContent>
      </Tooltip>

      <VersionHistoryPanel
        canvasId={canvasId}
        isOpen={showPanel}
        onClose={() => setShowPanel(false)}
      />
    </TooltipProvider>
  );
}
