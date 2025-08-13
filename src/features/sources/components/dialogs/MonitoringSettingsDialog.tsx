import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';

export type MonitoringSettings = { enabled?: boolean };

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: MonitoringSettings) => void;
}

export default function MonitoringSettingsDialog({
  isOpen,
  onClose,
  onSave,
}: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Monitoring Settings</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-muted-foreground">
          Configure monitoring options.
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave({ enabled: true })}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
