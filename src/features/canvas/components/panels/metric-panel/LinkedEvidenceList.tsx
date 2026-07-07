// Evidence tab body — thin, delegated view. The card panel no longer owns an
// evidence editor: it lists the evidence LINKED to this card (the evidence-node
// system's links[]/context model) and delegates creation/editing to evidence
// pins + the docked EvidenceEditPanel via the `card:link-evidence` bridge that
// CanvasPage handles (create pin + reference edge + open editor).
import { useEvidenceStore } from '@/features/evidence/stores/useEvidenceStore';
import { useCanvasPanelStore } from '@/features/canvas/stores/useCanvasPanelStore';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import type { EvidenceItem } from '@/shared/types';
import {
  BookOpen,
  Calendar,
  FileText,
  FlaskConical,
  Globe,
  Link2,
  Plus,
  Users,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const TYPE_ICON: Record<string, React.ElementType> = {
  Experiment: FlaskConical,
  Analysis: FileText,
  Notebook: BookOpen,
  'External Research': Globe,
  'User Interview': Users,
};

function isLinkedToCard(e: EvidenceItem, cardId: string): boolean {
  if ((e.links || []).some((l) => l.targetId === cardId)) return true;
  return e.context?.type === 'card' && e.context.targetId === cardId;
}

export function LinkedEvidenceList({ cardId }: { cardId: string }) {
  const evidence = useEvidenceStore((s) => s.evidence);
  const openRight = useCanvasPanelStore((s) => s.openRight);

  // Canvas-only actions (pin/link creation runs in CanvasPage) — hidden on
  // non-canvas surfaces like the Assets page.
  const [onCanvas, setOnCanvas] = useState(false);
  useEffect(() => {
    setOnCanvas(!!document.querySelector('.react-flow__viewport'));
  }, []);

  const linked = useMemo(
    () => evidence.filter((e) => isLinkedToCard(e, cardId)),
    [evidence, cardId]
  );
  const linkable = useMemo(
    () => evidence.filter((e) => !isLinkedToCard(e, cardId)),
    [evidence, cardId]
  );

  const emit = (evidenceId: string | null) =>
    window.dispatchEvent(
      new CustomEvent('card:link-evidence', { detail: { cardId, evidenceId } })
    );

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold mb-1">Evidence</h3>
          <p className="text-sm text-muted-foreground">
            Evidence pins linked to this metric — analysis lives on the canvas
            and in the notebook.
          </p>
        </div>
        {onCanvas && (
          <div className="flex shrink-0 items-center gap-1.5">
            {linkable.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Link2 className="h-3.5 w-3.5" />
                    Link existing
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="max-h-64 w-56 overflow-y-auto">
                  {linkable.map((e) => (
                    <DropdownMenuItem key={e.id} onClick={() => emit(e.id)}>
                      <span className="truncate">{e.title || 'Untitled'}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button size="sm" className="gap-1.5" onClick={() => emit(null)}>
              <Plus className="h-3.5 w-3.5" />
              New evidence pin
            </Button>
          </div>
        )}
      </div>

      {linked.length > 0 ? (
        <div className="space-y-2">
          {linked.map((e) => {
            const Icon = TYPE_ICON[e.type] ?? FileText;
            return (
              <button
                key={e.id}
                type="button"
                onClick={() =>
                  openRight({ kind: 'evidenceEdit', evidenceId: e.id })
                }
                className="flex w-full items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 text-left transition-colors hover:border-primary/40 hover:bg-accent/40"
                title="Open in the side editor"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {e.title || 'Untitled evidence'}
                  </span>
                  <span className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>{e.type}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {e.date}
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
          <p className="pt-1 text-[11px] text-muted-foreground">
            Unlink by deleting the reference edge on the canvas.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border py-10 text-center">
          <FileText className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm font-medium">No evidence linked yet</p>
          <p className="mx-auto mt-1 max-w-xs text-xs text-muted-foreground">
            Create an evidence pin next to this card, or drag an edge from an
            existing pin onto it.
          </p>
        </div>
      )}
    </div>
  );
}

export default LinkedEvidenceList;
