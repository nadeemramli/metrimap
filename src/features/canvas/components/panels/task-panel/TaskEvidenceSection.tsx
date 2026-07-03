import EvidenceDialog from '@/features/evidence/components/EvidenceDialog';
import { useAppStore } from '@/lib/stores';
import { useConfirm } from '@/shared/components/ConfirmDialog';
import { Button } from '@/shared/components/ui/button';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import {
  createCardEvidence,
  getCardEvidence,
} from '@/shared/lib/supabase/services/evidence';
import { deleteEvidenceItem, updateEvidenceItem } from '@/shared/lib/supabase/services/relationships';
import type { EvidenceItem } from '@/shared/types';
import { FileText, Link2, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Evidence attached to a task card (Action/Hypothesis) — DB-backed via the
// card-scoped evidence service. Reuses the shared EvidenceDialog form.

interface TaskEvidenceSectionProps {
  cardId: string;
  projectId?: string;
  canEdit: boolean;
}

export function TaskEvidenceSection({
  cardId,
  projectId,
  canEdit,
}: TaskEvidenceSectionProps) {
  const client = useClerkSupabase();
  const userId = useAppStore((s) => s.user?.id);
  const confirm = useConfirm();

  const [items, setItems] = useState<EvidenceItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<EvidenceItem | null>(null);

  const load = () => {
    if (!client) return;
    getCardEvidence(cardId, client)
      .then(setItems)
      .catch(() => setItems([]));
  };
  useEffect(load, [client, cardId]);

  const handleSave = async (evidence: EvidenceItem) => {
    if (!client) return;
    try {
      if (editing) {
        await updateEvidenceItem(editing.id, evidence, client);
      } else if (projectId && userId) {
        await createCardEvidence(evidence, cardId, projectId, userId, client);
      }
      setDialogOpen(false);
      setEditing(null);
      load();
    } catch {
      toast.error('Failed to save evidence');
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: 'Remove this evidence?',
      actionLabel: 'Remove',
      destructive: true,
    });
    if (!ok || !client) return;
    try {
      await deleteEvidenceItem(id, client);
      load();
    } catch {
      toast.error('Failed to remove evidence');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Evidence</h4>
        {canEdit && (
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1.5"
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No evidence yet. Attach experiments, analyses, or research that
          supports this {'work'}.
        </p>
      ) : (
        <div className="space-y-2">
          {items.map((e) => (
            <div
              key={e.id}
              className="group flex items-start gap-3 rounded-lg border p-3"
            >
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <button
                className="min-w-0 flex-1 text-left"
                onClick={() => {
                  if (!canEdit) return;
                  setEditing(e);
                  setDialogOpen(true);
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium">
                    {e.title}
                  </span>
                  <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    {e.type}
                  </span>
                </div>
                {e.summary && (
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                    {e.summary}
                  </p>
                )}
                {e.link && (
                  <span className="mt-1 inline-flex items-center gap-1 text-xs text-primary">
                    <Link2 className="h-3 w-3" />
                    source
                  </span>
                )}
              </button>
              {canEdit && (
                <button
                  onClick={() => void handleDelete(e.id)}
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                  title="Remove"
                >
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <EvidenceDialog
        isOpen={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditing(null);
        }}
        onSave={handleSave}
        evidence={editing}
        title={editing ? 'Edit Evidence' : 'Attach Evidence'}
        description={
          editing
            ? 'Update the evidence details.'
            : 'Attach supporting evidence to this task.'
        }
      />
    </div>
  );
}

export default TaskEvidenceSection;
