import { Button } from '@/shared/components/ui/button';
import { getShowcaseProjects } from '@/shared/lib/supabase/services/projects';
import { ArrowRight, BarChart3, ChevronDown, Network, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

const countOf = (v: any): number =>
  Array.isArray(v) ? (v[0]?.count ?? 0) : 0;

const COLLAPSE_KEY = 'metrimap.showcase.collapsed';

interface ShowcaseSectionProps {
  onOpenCanvas: (canvasId: string) => void;
  /**
   * Initial collapsed state when the user has no stored preference. Returning
   * users (who have their own canvases) get the examples collapsed by default
   * so their work stays above the fold; first-run/empty gets them expanded.
   */
  defaultCollapsed?: boolean;
}

/**
 * Read-only "Examples" rail on the homepage. Demoted (not deleted) per CVS-29:
 * collapses to a single slim "Explore N examples → Browse" entry so the user's
 * own canvases are the primary above-the-fold content. State remembered per
 * browser. Examples load via public RLS and are NOT in the user's own list.
 */
export function ShowcaseSection({
  onOpenCanvas,
  defaultCollapsed = false,
}: ShowcaseSectionProps) {
  const [examples, setExamples] = useState<any[]>([]);
  const [collapsed, setCollapsed] = useState(() => {
    const stored = localStorage.getItem(COLLAPSE_KEY);
    return stored === null ? defaultCollapsed : stored === '1';
  });

  useEffect(() => {
    let active = true;
    getShowcaseProjects()
      .then((rows) => {
        if (active) setExamples(rows || []);
      })
      .catch((e) => console.warn('Failed to load showcase examples', e));
    return () => {
      active = false;
    };
  }, []);

  const toggle = () => {
    setCollapsed((c) => {
      localStorage.setItem(COLLAPSE_KEY, c ? '0' : '1');
      return !c;
    });
  };

  if (examples.length === 0) return null;

  // Collapsed: a single slim entry — one click away, not a permanent wall.
  if (collapsed) {
    return (
      <button
        onClick={toggle}
        className="group mb-4 flex w-full items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2.5 text-left text-sm transition-colors hover:border-primary/40 hover:bg-primary/[0.03]"
      >
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="font-medium text-foreground">
          Explore {examples.length} example metric trees
        </span>
        <span className="hidden text-xs text-muted-foreground sm:inline">
          Learn the metric-tree pattern
        </span>
        <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-primary">
          Browse
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </button>
    );
  }

  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold">Examples</h2>
        <span className="text-xs text-muted-foreground">
          {examples.length} read-only metric trees to explore
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto h-6 gap-1 px-2 text-xs text-muted-foreground"
          onClick={toggle}
        >
          Hide
          <ChevronDown className="h-3.5 w-3.5 rotate-180" />
        </Button>
      </div>

      {(
        <div className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-2">
          {examples.map((p) => (
            <button
              key={p.id}
              onClick={() => onOpenCanvas(p.id)}
              className="w-[248px] shrink-0 snap-start rounded-lg border border-border bg-card p-3 text-left transition-colors hover:border-primary/40 hover:bg-primary/[0.03]"
            >
              <p className="truncate text-sm font-medium">
                {String(p.name).replace(/\s*—\s*Example Metric Tree$/, '')}
              </p>
              <p className="mt-1 line-clamp-2 min-h-[2rem] text-xs leading-4 text-muted-foreground">
                {p.description}
              </p>
              <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BarChart3 className="h-3 w-3 text-blue-500" />
                  {countOf(p.metric_cards)} metrics
                </span>
                <span className="flex items-center gap-1">
                  <Network className="h-3 w-3 text-green-500" />
                  {countOf(p.relationships)} links
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
