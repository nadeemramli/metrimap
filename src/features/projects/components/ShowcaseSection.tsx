import { Button } from '@/shared/components/ui/button';
import { getShowcaseProjects } from '@/shared/lib/supabase/services/projects';
import { BarChart3, ChevronDown, Network, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

const countOf = (v: any): number =>
  Array.isArray(v) ? (v[0]?.count ?? 0) : 0;

const COLLAPSE_KEY = 'metrimap.showcase.collapsed';

interface ShowcaseSectionProps {
  onOpenCanvas: (canvasId: string) => void;
}

/**
 * Read-only "Examples" rail at the top of the homepage: one horizontal row of
 * compact cards (template-gallery pattern — user canvases stay the page's
 * primary content). Collapsible, remembered per browser. Examples load via
 * public RLS and are intentionally NOT in the user's own list.
 */
export function ShowcaseSection({ onOpenCanvas }: ShowcaseSectionProps) {
  const [examples, setExamples] = useState<any[]>([]);
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(COLLAPSE_KEY) === '1'
  );

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
          {collapsed ? 'Show' : 'Hide'}
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform ${collapsed ? '' : 'rotate-180'}`}
          />
        </Button>
      </div>

      {!collapsed && (
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
