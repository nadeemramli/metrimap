import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Flag } from 'lucide-react';
import { CheckpointManager } from './CheckpointManager';

interface VersionHistoryPanelProps {
  canvasId: string;
  isOpen: boolean;
  onClose: () => void;
}

/** Dialog wrapper around the checkpoint surface — opened from the canvas
 * Controls flag button and the Collaboration panel. The same surface renders
 * inline in Settings → Changelog. */
export default function VersionHistoryPanel({
  canvasId,
  isOpen,
  onClose,
}: VersionHistoryPanelProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="h-4 w-4" />
            Checkpoints
          </DialogTitle>
          <DialogDescription>
            Save the canvas like a game — capture its current state, and load a
            save back anytime. Loading always backs up the present first.
          </DialogDescription>
        </DialogHeader>
        {isOpen && (
          <CheckpointManager canvasId={canvasId} onLoaded={onClose} />
        )}
      </DialogContent>
    </Dialog>
  );
}
