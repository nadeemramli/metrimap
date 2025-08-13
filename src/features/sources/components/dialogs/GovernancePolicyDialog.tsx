import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';

type Mode = 'create' | 'edit';

interface GovernancePolicy {
  id?: string;
  name: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (policy: GovernancePolicy) => Promise<void> | void;
  governancePolicy?: GovernancePolicy | null;
  mode?: Mode;
}

export default function GovernancePolicyDialog({
  isOpen,
  onClose,
  onSave,
  governancePolicy,
  mode = 'create',
}: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Edit Policy' : 'New Policy'}
          </DialogTitle>
        </DialogHeader>
        <div className="text-sm text-muted-foreground">
          {governancePolicy?.name ?? 'Configure your governance policy.'}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => onSave(governancePolicy ?? { name: 'Untitled' })}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
