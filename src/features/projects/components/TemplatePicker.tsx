import { useProjectsStore } from '@/features/projects/stores/useProjectsStore';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import {
  getShowcaseProjects,
  listTemplates,
} from '@/shared/lib/supabase/services/projects';
import { BarChart3, Loader2, Network, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface TemplateItem {
  id: string;
  name: string;
  description?: string;
  cards: number;
  rels: number;
}

function toItem(row: any): TemplateItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    cards: row.metric_cards?.[0]?.count ?? 0,
    rels: row.relationships?.[0]?.count ?? 0,
  };
}

interface TemplatePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Start a new canvas from a template: instantiating = a deep copy into the
// active workspace (reuses duplicateProject). "Starter examples" are the public
// example trees; "Your templates" are 'template'-tagged canvases you saved.
export function TemplatePicker({ open, onOpenChange }: TemplatePickerProps) {
  const client = useClerkSupabase();
  const navigate = useNavigate();
  const duplicateProject = useProjectsStore((s) => s.duplicateProject);

  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [starters, setStarters] = useState<TemplateItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [usingId, setUsingId] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !client) return;
    setBusy(true);
    Promise.all([listTemplates(client), getShowcaseProjects(client)])
      .then(([t, s]) => {
        setTemplates((t || []).map(toItem));
        setStarters((s || []).map(toItem));
      })
      .catch(() => {
        setTemplates([]);
        setStarters([]);
      })
      .finally(() => setBusy(false));
  }, [open, client]);

  const use = async (item: TemplateItem) => {
    setUsingId(item.id);
    try {
      const newId = await duplicateProject(item.id);
      onOpenChange(false);
      if (newId) navigate(`/canvas/${newId}`);
    } catch {
      toast.error('Failed to create canvas from template');
    } finally {
      setUsingId(null);
    }
  };

  const Group = ({
    title,
    items,
    empty,
  }: {
    title: string;
    items: TemplateItem[];
    empty: string;
  }) => (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground/70">{empty}</p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {items.map((t) => (
            <button
              key={t.id}
              onClick={() => use(t)}
              disabled={usingId !== null}
              className="flex flex-col items-start gap-1 rounded-md border border-border p-3 text-left transition-colors hover:border-primary/40 hover:bg-muted/50 disabled:opacity-50"
            >
              <span className="flex w-full items-center justify-between">
                <span className="truncate text-sm font-medium">{t.name}</span>
                {usingId === t.id && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
              </span>
              {t.description && (
                <span className="line-clamp-2 text-xs text-muted-foreground">
                  {t.description}
                </span>
              )}
              <span className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground/70">
                <span className="flex items-center gap-1">
                  <BarChart3 className="h-3 w-3" />
                  {t.cards}
                </span>
                <span className="flex items-center gap-1">
                  <Network className="h-3 w-3" />
                  {t.rels}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            New from template
          </DialogTitle>
          <DialogDescription>
            Start from a saved template or an example tree — it's copied into your
            workspace so you can edit freely.
          </DialogDescription>
        </DialogHeader>

        {busy ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : (
          <div className="max-h-[60vh] space-y-5 overflow-auto py-1">
            <Group
              title="Your templates"
              items={templates}
              empty="No saved templates yet — use “Save as Template” on any canvas."
            />
            <Group
              title="Starter examples"
              items={starters}
              empty="No starter examples available."
            />
          </div>
        )}

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
