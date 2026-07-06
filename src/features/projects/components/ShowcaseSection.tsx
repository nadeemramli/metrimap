import { getShowcaseProjects } from '@/shared/lib/supabase/services/projects';
import { ArrowRight, BarChart3, Eye, Folder, Network, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

const countOf = (v: any): number =>
  Array.isArray(v) ? (v[0]?.count ?? 0) : 0;

// Static accent classes (Tailwind can't see dynamically built names) — one per
// example, picked deterministically from the name so each domain reads distinct
// yet stable across reloads.
const ACCENTS = [
  { bar: 'bg-chart-1', chip: 'bg-chart-1/10', text: 'text-chart-1' },
  { bar: 'bg-chart-2', chip: 'bg-chart-2/10', text: 'text-chart-2' },
  { bar: 'bg-chart-3', chip: 'bg-chart-3/10', text: 'text-chart-3' },
  { bar: 'bg-chart-4', chip: 'bg-chart-4/10', text: 'text-chart-4' },
  { bar: 'bg-chart-5', chip: 'bg-chart-5/10', text: 'text-chart-5' },
] as const;

const accentFor = (key: string) =>
  ACCENTS[
    [...key].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % ACCENTS.length
  ];

const cleanName = (name: string) =>
  String(name).replace(/\s*—\s*Example Metric Tree$/, '');

interface ShowcaseSectionProps {
  onOpenCanvas: (canvasId: string) => void;
  /** Retained for call-site compatibility; examples are always shown now. */
  defaultCollapsed?: boolean;
}

/**
 * "Learn from examples" gallery on the Explore tab. A responsive grid of
 * read-only example metric trees (public RLS, not in the user's own list) that
 * teach the metric-tree pattern. Each card carries a domain-tinted tree glyph
 * and a Read-only pill so the browse-don't-edit intent is unmistakable.
 */
export function ShowcaseSection({ onOpenCanvas }: ShowcaseSectionProps) {
  const [examples, setExamples] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getShowcaseProjects()
      .then((rows) => {
        if (active) setExamples(rows || []);
      })
      .catch((e) => console.warn('Failed to load showcase examples', e))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <section>
        <SectionHeading count={null} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[168px] animate-pulse rounded-xl border border-border bg-muted/40"
            />
          ))}
        </div>
      </section>
    );
  }

  if (examples.length === 0) return null;

  return (
    <section>
      <SectionHeading count={examples.length} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {examples.map((p) => {
          const accent = accentFor(String(p.name ?? p.id));
          return (
            <button
              key={p.id}
              onClick={() => onOpenCanvas(p.id)}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span
                className={`absolute inset-x-0 top-0 h-[3px] ${accent.bar} opacity-70 transition-opacity group-hover:opacity-100`}
              />

              <div className="flex items-center gap-2.5">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${accent.chip}`}
                >
                  <Network className={`h-[18px] w-[18px] ${accent.text}`} />
                </span>
                <h3 className="min-w-0 flex-1 truncate text-sm font-semibold">
                  {cleanName(p.name)}
                </h3>
              </div>

              <p className="mt-2.5 line-clamp-2 min-h-[2.5rem] text-xs leading-relaxed text-muted-foreground">
                {p.description}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BarChart3 className="h-3 w-3 text-chart-1" />
                  {countOf(p.metric_cards)} metrics
                </span>
                <span className="flex items-center gap-1">
                  <Network className="h-3 w-3 text-chart-2" />
                  {countOf(p.relationships)} links
                </span>
                <span className="flex items-center gap-1">
                  <Folder className="h-3 w-3 text-chart-3" />
                  {countOf(p.groups)} groups
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  <Eye className="h-3 w-3" />
                  Read-only
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Explore
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function SectionHeading({ count }: { count: number | null }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <Sparkles className="h-4 w-4 text-primary" />
      <h2 className="text-sm font-semibold">Learn from examples</h2>
      {count !== null && (
        <span className="text-xs text-muted-foreground">
          {count} read-only metric {count === 1 ? 'tree' : 'trees'} to explore
        </span>
      )}
    </div>
  );
}
