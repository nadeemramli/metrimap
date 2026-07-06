import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { useEffect, useRef, useState } from 'react';

interface GroupNameDialogProps {
  open: boolean;
  /** Seed name (e.g. "Group 3") — used as fallback when the input is left empty. */
  defaultName: string;
  /** How many cards are being grouped — shown in the description. */
  count: number;
  onConfirm: (name: string) => void;
  onCancel: () => void;
}

/**
 * Names a group at creation time (Ctrl+G / Group buttons). The input opens
 * focused with the default name preselected so typing replaces it; Enter
 * creates, Esc/Cancel aborts without creating anything.
 */
export function GroupNameDialog({
  open,
  defaultName,
  count,
  onConfirm,
  onCancel,
}: GroupNameDialogProps) {
  const [value, setValue] = useState(defaultName);
  const inputRef = useRef<HTMLInputElement>(null);

  // Re-seed + preselect each time the dialog opens.
  useEffect(() => {
    if (open) {
      setValue(defaultName);
      // Radix moves focus on open; select after that settles.
      requestAnimationFrame(() => inputRef.current?.select());
    }
  }, [open, defaultName]);

  const confirm = () => onConfirm(value.trim() || defaultName);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Name this group</DialogTitle>
          <DialogDescription>
            Grouping {count} selected cards. You can rename or recolor it later
            from the Groups panel.
          </DialogDescription>
        </DialogHeader>
        <Input
          ref={inputRef}
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              confirm();
            }
          }}
          placeholder={defaultName}
        />
        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={confirm}>
            Create group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default GroupNameDialog;
