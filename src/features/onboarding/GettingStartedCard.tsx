import { Button } from '@/shared/components/ui/button';
import { track } from '@/shared/lib/analytics';
import { cn } from '@/shared/utils';
import type { CanvasProject } from '@/shared/types';
import { Check, Circle, ListChecks, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOnboardingStore } from './useOnboardingStore';

// Getting-started checklist (CVS-114 slice 3). Auto-completes from state the
// app already loads (project list aggregate counts + onboarding store) — no
// new eventing. Disappears once every item is done or the user dismisses it.

interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
  onGo?: () => void;
}

export function GettingStartedCard({
  projects,
  onCreateCanvas,
}: {
  projects: CanvasProject[];
  onCreateCanvas: () => void;
}) {
  const navigate = useNavigate();
  const tourCompletedAt = useOnboardingStore((s) => s.tourCompletedAt);
  const visitedDashboard = useOnboardingStore((s) => s.visitedDashboard);
  const checklistDismissed = useOnboardingStore((s) => s.checklistDismissed);
  const firstRunSeen = useOnboardingStore((s) => s.firstRunSeen);
  const demoCopyProjectId = useOnboardingStore((s) => s.demoCopyProjectId);

  const firstProject = projects[0];
  const replayTour = () => {
    const target =
      (demoCopyProjectId &&
        projects.find((p) => p.id === demoCopyProjectId)?.id) ||
      firstProject?.id;
    if (!target) return;
    useOnboardingStore.getState().setTourPending(true);
    navigate(`/canvas/${target}`);
  };

  const items: ChecklistItem[] = [
    {
      id: 'tour',
      label: 'Take the product tour',
      done: tourCompletedAt !== null,
      onGo: firstProject ? replayTour : undefined,
    },
    {
      id: 'canvas',
      label: 'Create your first canvas',
      done: projects.length > 0,
      onGo: onCreateCanvas,
    },
    {
      id: 'metrics',
      label: 'Add metrics to a canvas',
      done: projects.some((p) => (p.nodeCount ?? 0) > 0),
      onGo: firstProject ? () => navigate(`/canvas/${firstProject.id}`) : undefined,
    },
    {
      id: 'connect',
      label: 'Connect two metrics',
      done: projects.some((p) => (p.edgeCount ?? 0) > 0),
      onGo: firstProject ? () => navigate(`/canvas/${firstProject.id}`) : undefined,
    },
    {
      id: 'dashboard',
      label: 'Open your dashboard',
      done: visitedDashboard,
      onGo: firstProject
        ? () => navigate(`/canvas/${firstProject.id}/dashboard`)
        : undefined,
    },
  ];

  const doneCount = items.filter((i) => i.done).length;
  const allDone = doneCount === items.length;
  if (!firstRunSeen || checklistDismissed || allDone) return null;

  return (
    <section
      aria-label="Getting started"
      className="mb-4 rounded-xl border border-border bg-card p-4"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Getting started</h2>
          <span className="text-xs tabular-nums text-muted-foreground">
            {doneCount}/{items.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          onClick={() => {
            useOnboardingStore.getState().dismissChecklist();
            track('checklist_dismissed', { completed: doneCount });
          }}
          aria-label="Dismiss getting started"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Progress */}
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${(doneCount / items.length) * 100}%` }}
        />
      </div>

      <ul className="mt-3 grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.id}>
            <button
              onClick={item.done ? undefined : item.onGo}
              disabled={item.done || !item.onGo}
              className={cn(
                'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors',
                item.done
                  ? 'text-muted-foreground line-through'
                  : item.onGo
                    ? 'text-foreground hover:bg-accent/50'
                    : 'text-muted-foreground'
              )}
            >
              {item.done ? (
                <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
              ) : (
                <Circle className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
              )}
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
