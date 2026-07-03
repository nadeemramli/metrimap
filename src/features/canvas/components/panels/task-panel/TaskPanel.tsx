import { CommentsTab } from '@/features/canvas/components/panels/relationship-panel/tabs/comments-tab';
import { NodePanelShell } from '@/features/canvas/components/panels/shared/NodePanelShell';
import { WorkflowSection } from '@/features/canvas/components/panels/metric-panel/WorkflowSection';
import { TaskEvidenceSection } from '@/features/canvas/components/panels/task-panel/TaskEvidenceSection';
import { useCanvasPermission } from '@/features/canvas/hooks/useCanvasPermission';
import { useProjectMembers } from '@/features/canvas/hooks/useProjectMembers';
import { AssigneeCell } from '@/features/strategy/components/AssigneeCell';
import { useCanvasStore } from '@/lib/stores';
import { useConfirm } from '@/shared/components/ConfirmDialog';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import { notifyCardAssigned } from '@/shared/lib/supabase/services/collaboration';
import {
  getUsersByIds,
  type UserLite,
} from '@/shared/lib/supabase/services/users';
import type { MetricCard } from '@/shared/types';
import { FlaskConical, Hammer, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

// Detail panel for Work/Action and Ideas/Hypothesis nodes — a Monday-style
// task view: status/priority/assignees/due fields, then discussion. No data
// entry. Single-scroll layout.

interface TaskPanelProps {
  cardId?: string;
  isOpen: boolean;
  onClose: () => void;
  // Off-canvas callers (e.g. the Strategy page, where the canvas store may not
  // be loaded) can inject the card + persistence directly. Defaults to the
  // canvas store, which also gives live node refresh on the canvas.
  card?: MetricCard;
  projectId?: string;
  onPersist?: (updates: Partial<MetricCard>) => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
}

export function TaskPanel({
  cardId,
  isOpen,
  onClose,
  card: cardOverride,
  projectId: projectIdOverride,
  onPersist,
  onDelete,
}: TaskPanelProps) {
  const storeCard = useCanvasStore((s) =>
    cardId ? s.canvas?.nodes.find((n) => n.id === cardId) : undefined
  ) as MetricCard | undefined;
  const storeProjectId = useCanvasStore((s) => s.canvas?.id);
  const persistNodeUpdate = useCanvasStore((s) => s.persistNodeUpdate);
  const persistNodeDelete = useCanvasStore((s) => s.persistNodeDelete);
  const card = cardOverride ?? storeCard;
  const projectId = projectIdOverride ?? storeProjectId;
  const { canEdit } = useCanvasPermission(projectId);
  const { members } = useProjectMembers(projectId, Boolean(projectId));
  const client = useClerkSupabase();
  const confirm = useConfirm();

  const assignees = useMemo(() => card?.assignees ?? [], [card?.assignees]);

  // Resolve assignee display info (members carry avatars; fetch fills the rest).
  const [fetchedUsers, setFetchedUsers] = useState<Record<string, UserLite>>({});
  const idsKey = assignees.join(',');
  useEffect(() => {
    if (!client || assignees.length === 0) return;
    getUsersByIds(assignees, client)
      .then(setFetchedUsers)
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, idsKey]);

  const userMap = useMemo(() => {
    const m: Record<string, UserLite> = {};
    for (const mm of members) {
      m[mm.id] = {
        id: mm.id,
        name: mm.name,
        email: mm.email,
        avatar_url: mm.avatarUrl ?? null,
      };
    }
    return { ...m, ...fetchedUsers };
  }, [members, fetchedUsers]);

  if (!card) return null;

  const isHypothesis = card.category === 'Ideas/Hypothesis';

  const persist = (updates: Partial<MetricCard>): Promise<void> => {
    const patch = { ...updates, updatedAt: new Date().toISOString() };
    return Promise.resolve(
      onPersist ? onPersist(patch) : persistNodeUpdate(cardId!, patch)
    );
  };

  const handleDelete = async () => {
    const ok = await confirm({
      title: isHypothesis ? 'Delete this hypothesis?' : 'Delete this action?',
      description: 'It is removed from the canvas. This cannot be undone.',
      actionLabel: 'Delete',
      destructive: true,
    });
    if (!ok) return;
    try {
      if (onDelete) await onDelete();
      else await persistNodeDelete(cardId!);
      onClose();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <NodePanelShell
      open={isOpen}
      onOpenChange={(o) => !o && onClose()}
      title={card.title || ''}
      description={card.description || ''}
      readOnly={!canEdit}
      onTitleChange={(v) => void persist({ title: v })}
      onDescriptionChange={(v) => void persist({ description: v })}
      eyebrow={
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium ${
            isHypothesis ? 'text-purple-600 dark:text-purple-400' : 'text-blue-600 dark:text-blue-400'
          }`}
        >
          {isHypothesis ? (
            <FlaskConical className="h-3.5 w-3.5" />
          ) : (
            <Hammer className="h-3.5 w-3.5" />
          )}
          {isHypothesis ? 'Hypothesis' : 'Action'}
          {card.subCategory ? ` · ${card.subCategory}` : ''}
        </span>
      }
      footer={
        canEdit ? (
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => void handleDelete()}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete {isHypothesis ? 'hypothesis' : 'action'}
          </Button>
        ) : undefined
      }
    >
      <div className="space-y-6">
        {/* Assignees */}
        <div className="flex items-center gap-4">
          <Label className="w-24 shrink-0 text-muted-foreground">People</Label>
          <AssigneeCell
            assigneeIds={assignees}
            userMap={userMap}
            members={members}
            disabled={!canEdit}
            onChange={(ids) => {
              // Notify only the NEWLY-added assignees (the RPC skips the caller).
              const added = ids.filter((id) => !assignees.includes(id));
              void persist({ assignees: ids });
              if (added.length > 0 && card && client) {
                void notifyCardAssigned(card.id, added, client).catch((e) =>
                  console.error('assigned notification failed', e)
                );
              }
            }}
          />
        </div>

        {/* Status / priority / due / effort / confidence / testable */}
        <WorkflowSection card={card} onPersist={persist} />

        {/* Evidence */}
        {cardId && (
          <TaskEvidenceSection
            cardId={cardId}
            projectId={projectId}
            canEdit={canEdit}
          />
        )}

        {/* Discussion */}
        {cardId && <CommentsTab cardId={cardId} />}
      </div>
    </NodePanelShell>
  );
}

export default TaskPanel;
