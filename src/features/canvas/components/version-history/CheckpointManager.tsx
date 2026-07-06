import { useCanvasStore } from '@/lib/stores';
import { useVersionHistoryStore } from '@/lib/stores/version-history/useVersionHistoryStore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import type { CanvasSnapshot } from '@/shared/types/version-history';
import { Clock, Flag, History, RotateCcw, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

function defaultCheckpointName() {
  return `Checkpoint — ${new Date().toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })}`;
}

interface CheckpointManagerProps {
  canvasId: string;
  /** Called after a checkpoint is loaded (e.g. to close a wrapping dialog). */
  onLoaded?: () => void;
  /** Called after a checkpoint is saved (e.g. to refresh the activity feed). */
  onSaved?: () => void;
}

/**
 * The checkpoint save/load surface — game-style saves of the canvas. Used by
 * the canvas Checkpoints dialog and inline in Settings → Changelog. Saving and
 * loading need the canvas live in the store (open on the canvas route);
 * browsing and deleting work anywhere.
 */
export function CheckpointManager({
  canvasId,
  onLoaded,
  onSaved,
}: CheckpointManagerProps) {
  const {
    snapshots,
    isLoading,
    loadSnapshots,
    createSnapshot,
    restoreSnapshot,
    deleteSnapshot,
  } = useVersionHistoryStore();

  const liveCanvasId = useCanvasStore((s) => s.canvas?.id);
  const canvasIsLive = liveCanvasId === canvasId;

  const [title, setTitle] = useState(() => defaultCheckpointName());
  const [note, setNote] = useState('');
  const [restoreTarget, setRestoreTarget] = useState<CanvasSnapshot | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<CanvasSnapshot | null>(null);

  useEffect(() => {
    if (canvasId) loadSnapshots(canvasId);
  }, [canvasId, loadSnapshots]);

  const handleSave = async () => {
    const name = title.trim();
    if (!name) return;
    try {
      await createSnapshot(canvasId, name, note.trim() || undefined, 'manual');
      toast.success(`Checkpoint “${name}” saved`);
      setTitle(defaultCheckpointName());
      setNote('');
      onSaved?.();
    } catch {
      toast.error('Could not save checkpoint');
    }
  };

  const handleRestore = async (snapshot: CanvasSnapshot) => {
    try {
      await restoreSnapshot(snapshot.id);
      toast.success(`Checkpoint “${snapshot.title}” loaded`);
      onLoaded?.();
    } catch {
      toast.error('Could not load checkpoint');
    }
  };

  const handleDelete = async (snapshot: CanvasSnapshot) => {
    try {
      await deleteSnapshot(snapshot.id);
      toast.success('Checkpoint deleted');
    } catch {
      toast.error('Could not delete checkpoint');
    }
  };

  return (
    <div className="space-y-3">
      {/* Save a new checkpoint — needs the canvas live in the store */}
      {canvasIsLive ? (
        <div className="space-y-2 rounded-md border p-3">
          <div className="flex items-center gap-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              placeholder="Checkpoint name"
            />
            <Button onClick={handleSave} disabled={!title.trim() || isLoading}>
              <Flag className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder="What's worth remembering about this state? (optional)"
          />
        </div>
      ) : (
        <p className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">
          Open the canvas to save a new checkpoint or load one — browsing and
          deleting work from here.
        </p>
      )}

      {/* Saved checkpoints */}
      <div className="max-h-[45vh] space-y-2 overflow-auto">
        {isLoading && snapshots.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            Loading checkpoints…
          </div>
        ) : snapshots.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            <History className="mx-auto mb-2 h-6 w-6 opacity-50" />
            No checkpoints yet. Save one whenever the canvas reaches a state
            worth keeping.
          </div>
        ) : (
          snapshots.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between gap-3 rounded-md border p-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">v{s.version}</Badge>
                  <span className="max-w-[260px] truncate font-medium">
                    {s.title}
                  </span>
                  {s.metadata?.triggerType === 'auto' && (
                    <Badge variant="outline" className="text-xs">
                      auto backup
                    </Badge>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(s.createdAt).toLocaleString()}</span>
                  <span>
                    · {s.metadata?.nodeCount ?? 0} nodes,{' '}
                    {s.metadata?.edgeCount ?? 0} connections
                  </span>
                </div>
                {s.description && (
                  <div className="mt-1 max-w-[420px] truncate text-xs text-muted-foreground">
                    {s.description}
                  </div>
                )}
              </div>
              <div className="flex flex-shrink-0 items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isLoading || !canvasIsLive}
                  title={
                    canvasIsLive
                      ? undefined
                      : 'Open the canvas to load a checkpoint'
                  }
                  onClick={() => setRestoreTarget(s)}
                >
                  <RotateCcw className="mr-1 h-3.5 w-3.5" />
                  Load
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={isLoading}
                  onClick={() => setDeleteTarget(s)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Confirm load */}
      <AlertDialog
        open={!!restoreTarget}
        onOpenChange={(open) => !open && setRestoreTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Load “{restoreTarget?.title}”?</AlertDialogTitle>
            <AlertDialogDescription>
              The canvas will be reset to this save (v{restoreTarget?.version},{' '}
              {restoreTarget?.metadata?.nodeCount ?? 0} nodes). Your current
              state is saved as an automatic backup first, so you can always
              come back.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (restoreTarget) handleRestore(restoreTarget);
                setRestoreTarget(null);
              }}
            >
              Load checkpoint
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirm delete */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{deleteTarget?.title}”?</AlertDialogTitle>
            <AlertDialogDescription>
              This save will be gone for good — it can’t be loaded again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteTarget) handleDelete(deleteTarget);
                setDeleteTarget(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
