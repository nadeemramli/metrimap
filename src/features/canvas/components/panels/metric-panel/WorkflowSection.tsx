'use client';

import {
  WORKFLOW_STATUSES,
  normalizeWorkflowStatus,
} from '@/features/canvas/utils/workflow';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Switch } from '@/shared/components/ui/switch';
import type { CardWorkflow, MetricCard } from '@/shared/types';
import { toast } from 'sonner';

// Workflow (Strategy board) editor for Work/Action and Ideas/Hypothesis cards.
// Persists immediately per field — status into the metric_cards.status column,
// everything else merged into the workflow jsonb.

interface WorkflowSectionProps {
  card: MetricCard;
  onPersist: (updates: Partial<MetricCard>) => Promise<void>;
}

const LEVELS = ['High', 'Medium', 'Low'] as const;

export function WorkflowSection({ card, onPersist }: WorkflowSectionProps) {
  const isAction = card.category === 'Work/Action';
  const isHypothesis = card.category === 'Ideas/Hypothesis';
  if (!isAction && !isHypothesis) return null;

  const workflow = card.workflow ?? {};

  const persist = (updates: Partial<MetricCard>) => {
    onPersist({ ...updates, updatedAt: new Date().toISOString() }).catch(() =>
      toast.error('Failed to save workflow settings')
    );
  };

  const patchWorkflow = (patch: Partial<CardWorkflow>) => {
    persist({ workflow: { ...workflow, ...patch } });
  };

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div>
        <h4 className="text-sm font-semibold">Workflow</h4>
        <p className="text-xs text-muted-foreground">
          Drives this card's position on the Strategy board.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={card.status ?? 'backlog'}
            onValueChange={(v) =>
              persist({ status: normalizeWorkflowStatus(v) })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WORKFLOW_STATUSES.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Priority</Label>
          <Select
            value={workflow.priority ?? ''}
            onValueChange={(v) =>
              patchWorkflow({ priority: v as CardWorkflow['priority'] })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              {LEVELS.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isAction && (
          <>
            <div className="space-y-2">
              <Label htmlFor="workflow-due">Due date</Label>
              <Input
                id="workflow-due"
                type="date"
                value={workflow.dueDate ?? ''}
                onChange={(e) =>
                  patchWorkflow({ dueDate: e.target.value || undefined })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workflow-effort">Effort (days)</Label>
              <Input
                id="workflow-effort"
                type="number"
                min={0}
                value={workflow.effort ?? ''}
                onChange={(e) =>
                  patchWorkflow({
                    effort:
                      e.target.value === '' ? undefined : Number(e.target.value),
                  })
                }
              />
            </div>
          </>
        )}

        {isHypothesis && (
          <>
            <div className="space-y-2">
              <Label>Confidence</Label>
              <Select
                value={workflow.confidence ?? ''}
                onValueChange={(v) =>
                  patchWorkflow({
                    confidence: v as CardWorkflow['confidence'],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between pt-6">
              <Label htmlFor="workflow-testable">Testable</Label>
              <Switch
                id="workflow-testable"
                checked={workflow.testable ?? false}
                onCheckedChange={(c) => patchWorkflow({ testable: c })}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default WorkflowSection;
