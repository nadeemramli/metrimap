import type { CardWorkflow, WorkflowStatus } from '@/shared/types';

// Single write path for metric_cards.status — the DB CHECK constraint only
// accepts the canonical snake_case values, so every writer (node creation,
// card settings, kanban drop) must normalize through here.

const STATUS_ALIASES: Record<string, WorkflowStatus> = {
  backlog: 'backlog',
  planning: 'planning',
  planned: 'planning',
  in_progress: 'in_progress',
  active: 'in_progress',
  doing: 'in_progress',
  done: 'done',
  complete: 'done',
  completed: 'done',
  validated: 'done',
  on_hold: 'on_hold',
  paused: 'on_hold',
  blocked: 'on_hold',
};

export function normalizeWorkflowStatus(
  input?: string | null
): WorkflowStatus | null {
  if (!input) return null;
  const key = input.trim().toLowerCase().replace(/[\s-]+/g, '_');
  return STATUS_ALIASES[key] ?? null;
}

/** Pull the jsonb-resident workflow attributes out of loosely-typed node data. */
export function extractCardWorkflow(
  data: Record<string, unknown>
): CardWorkflow {
  const workflow: CardWorkflow = {};
  const copy = <K extends keyof CardWorkflow>(key: K) => {
    const value = data[key];
    if (value !== undefined && value !== null && value !== '') {
      workflow[key] = value as CardWorkflow[K];
    }
  };
  copy('priority');
  copy('dueDate');
  copy('effort');
  copy('confidence');
  copy('testable');
  copy('assumptions');
  copy('successCriteria');
  copy('businessImpact');
  copy('stakeholders');
  return workflow;
}

export const WORKFLOW_STATUSES: Array<{
  value: WorkflowStatus;
  label: string;
}> = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'planning', label: 'Planning' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done / Validated' },
  { value: 'on_hold', label: 'On Hold' },
];

// Soft-tint pill styles per status (matches PRIORITY_STYLES in StrategyCardTile).
export const WORKFLOW_STATUS_STYLES: Record<WorkflowStatus, string> = {
  backlog: 'bg-gray-500/10 text-gray-600 dark:text-gray-300',
  planning: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  in_progress: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  done: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  on_hold: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
};

export type PriorityLevel = 'High' | 'Medium' | 'Low';
export const PRIORITY_LEVELS: PriorityLevel[] = ['High', 'Medium', 'Low'];
export const PRIORITY_STYLES: Record<PriorityLevel, string> = {
  High: 'bg-red-500/10 text-red-600 dark:text-red-400',
  Medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  Low: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
};
