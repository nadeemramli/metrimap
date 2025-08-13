import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';

type Mode = 'create' | 'edit' | 'view';

interface DataSource {
  id?: string;
  metricName: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (source: DataSource) => Promise<void> | void;
  dataSource?: DataSource | null;
  mode?: Mode;
}

export default function DataSourceDialog({
  isOpen,
  onClose,
  onSave,
  dataSource,
  mode = 'create',
}: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Edit Data Source' : 'New Data Source'}
          </DialogTitle>
        </DialogHeader>
        <div className="text-sm text-muted-foreground">
          {dataSource?.metricName ?? 'Configure your data source.'}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => onSave(dataSource ?? { metricName: 'Untitled' })}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
