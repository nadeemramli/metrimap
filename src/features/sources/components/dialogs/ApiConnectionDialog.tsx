import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';

type Mode = 'create' | 'edit';

interface ApiConnection {
  id?: string;
  name: string;
  type?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (connection: ApiConnection) => Promise<void> | void;
  apiConnection?: ApiConnection | null;
  mode?: Mode;
}

export default function ApiConnectionDialog({
  isOpen,
  onClose,
  onSave,
  apiConnection,
  mode = 'create',
}: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Edit API Connection' : 'New API Connection'}
          </DialogTitle>
        </DialogHeader>
        <div className="text-sm text-muted-foreground">
          {apiConnection?.name ?? 'Configure your API connection.'}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(apiConnection ?? { name: 'Untitled' })}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
