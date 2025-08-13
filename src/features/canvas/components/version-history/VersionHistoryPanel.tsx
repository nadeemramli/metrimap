import { useVersionHistoryStore } from '@/lib/stores/version-history/useVersionHistoryStore';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Clock, Download, RefreshCw, Trash2, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';

interface VersionHistoryPanelProps {
  canvasId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function VersionHistoryPanel({
  canvasId,
  isOpen,
  onClose,
}: VersionHistoryPanelProps) {
  const {
    snapshots,
    isLoading,
    loadSnapshots,
    createSnapshot,
    restoreSnapshot,
    deleteSnapshot,
  } = useVersionHistoryStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isOpen && canvasId) {
      loadSnapshots(canvasId);
    }
  }, [isOpen, canvasId, loadSnapshots]);

  const handleCreate = async () => {
    if (!title.trim()) return;
    await createSnapshot(
      canvasId,
      title.trim(),
      description.trim() || undefined,
      'manual'
    );
    setTitle('');
    setDescription('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>Version History</DialogTitle>
          <DialogDescription>
            Snapshots of your canvas that you can restore or export.
          </DialogDescription>
        </DialogHeader>

        {/* Create snapshot */}
        <div className="space-y-2 border rounded-md p-3 mb-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Snapshot title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Button
              onClick={handleCreate}
              disabled={!title.trim() || isLoading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Create
            </Button>
            <Button
              variant="outline"
              onClick={() => loadSnapshots(canvasId)}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
          <Input
            placeholder="Optional description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Snapshots list */}
        <div className="space-y-2 max-h-[50vh] overflow-auto">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading snapshots...
            </div>
          ) : snapshots.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No snapshots yet.
            </div>
          ) : (
            snapshots.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 border rounded-md"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">v{s.version}</Badge>
                    <span className="font-medium truncate max-w-[280px]">
                      {s.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(s.createdAt).toLocaleString()}</span>
                  </div>
                  {s.description && (
                    <div className="text-xs text-muted-foreground mt-1 truncate max-w-[480px]">
                      {s.description}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={() => restoreSnapshot(s.id)}>
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Restore
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteSnapshot(s.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
