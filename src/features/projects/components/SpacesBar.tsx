import { useState } from 'react';
import { Folder, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/shared/utils';
import { useConfirm } from '@/shared/components/ConfirmDialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import type { Space } from '@/shared/lib/supabase/services/spaces';

// A curated palette for space color dots.
const SPACE_COLORS = [
  '#6366f1', '#3b82f6', '#14b8a6', '#22c55e', '#eab308',
  '#f59e0b', '#ef4444', '#ec4899', '#a855f7', '#64748b',
];

interface SpacesBarProps {
  spaces: Space[];
  spaceFilter: string;
  onFilter: (id: string) => void;
  onCreate: (name: string, color: string | null) => Promise<void>;
  onUpdate: (
    spaceId: string,
    patch: { name?: string; color?: string | null }
  ) => Promise<void>;
  onDelete: (spaceId: string) => Promise<void>;
}

export function SpacesBar({
  spaces,
  spaceFilter,
  onFilter,
  onCreate,
  onUpdate,
  onDelete,
}: SpacesBarProps) {
  const confirm = useConfirm();
  // Dialog state: editing an existing space, or null when creating a new one.
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Space | null>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState<string>(SPACE_COLORS[0]);
  const [busy, setBusy] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setName('');
    setColor(SPACE_COLORS[0]);
    setDialogOpen(true);
  };
  const openEdit = (s: Space) => {
    setEditing(s);
    setName(s.name);
    setColor(s.color || SPACE_COLORS[0]);
    setDialogOpen(true);
  };

  const save = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setBusy(true);
    try {
      if (editing) await onUpdate(editing.id, { name: trimmed, color });
      else await onCreate(trimmed, color);
      setDialogOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save space');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (s: Space) => {
    const ok = await confirm({
      title: `Delete "${s.name}"?`,
      description:
        'Canvases in this space move to Uncategorized. They are not deleted.',
      destructive: true,
      actionLabel: 'Delete space',
    });
    if (!ok) return;
    try {
      await onDelete(s.id);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to delete space');
    }
  };

  const staticChips = [
    { id: 'all', label: 'All Canvases' },
    { id: 'uncategorized', label: 'Uncategorized' },
  ];

  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      {staticChips.map((s) => (
        <button
          key={s.id}
          onClick={() => onFilter(s.id)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-sm transition-colors',
            spaceFilter === s.id
              ? 'border-secondary bg-secondary text-secondary-foreground'
              : 'border-border bg-transparent text-muted-foreground hover:bg-muted'
          )}
        >
          <Folder className="h-3.5 w-3.5" />
          {s.label}
        </button>
      ))}

      {spaces.map((s) => (
        <div
          key={s.id}
          className={cn(
            'group inline-flex items-center gap-1 rounded-md border pl-3 pr-1 py-1 text-sm transition-colors',
            spaceFilter === s.id
              ? 'border-secondary bg-secondary text-secondary-foreground'
              : 'border-border bg-transparent text-muted-foreground hover:bg-muted'
          )}
        >
          <button
            onClick={() => onFilter(s.id)}
            className="inline-flex items-center gap-1.5"
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: s.color || '#94a3b8' }}
            />
            {s.name}
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="ml-0.5 rounded p-0.5 opacity-0 transition-opacity hover:bg-black/10 group-hover:opacity-100 data-[state=open]:opacity-100"
                title="Space options"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => openEdit(s)}>
                <Pencil className="mr-2 h-3.5 w-3.5" /> Rename / recolor
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => void remove(s)}
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}

      <button
        onClick={openCreate}
        className="inline-flex items-center gap-1 rounded-md border border-dashed border-border px-3 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted"
      >
        <Plus className="h-3.5 w-3.5" /> New Space
      </button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit space' : 'New space'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              autoFocus
              placeholder="Space name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && void save()}
            />
            <div className="flex flex-wrap gap-2">
              {SPACE_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={cn(
                    'h-6 w-6 rounded-full border-2 transition-transform',
                    color === c
                      ? 'scale-110 border-foreground'
                      : 'border-transparent'
                  )}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={busy}
            >
              Cancel
            </Button>
            <Button onClick={() => void save()} disabled={busy || !name.trim()}>
              {editing ? 'Save' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SpacesBar;
