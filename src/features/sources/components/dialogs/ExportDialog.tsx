import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';

export type ExportOptions = { format?: 'json' | 'csv' };

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onExport: (opts: ExportOptions) => void;
}

export default function ExportDialog({ isOpen, onClose, onExport }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-muted-foreground">
          Choose export options.
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onExport({ format: 'json' })}>Export</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
