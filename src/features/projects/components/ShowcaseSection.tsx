import { Badge } from '@/shared/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { getShowcaseProjects } from '@/shared/lib/supabase/services/projects';
import { BarChart3, Network, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

const countOf = (v: any): number =>
  Array.isArray(v) ? (v[0]?.count ?? 0) : 0;

interface ShowcaseSectionProps {
  onOpenCanvas: (canvasId: string) => void;
}

/**
 * Read-only "Examples" showcase at the top of the homepage. Loads the public
 * example/template projects (anyone can read them via public RLS). These are
 * intentionally NOT in the user's own list, so they can't be deleted from the UI.
 */
export function ShowcaseSection({ onOpenCanvas }: ShowcaseSectionProps) {
  const [examples, setExamples] = useState<any[]>([]);

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

  if (examples.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold">
          Examples — explore sample metric trees
        </h2>
        <Badge variant="secondary" className="text-[10px]">
          read-only
        </Badge>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {examples.map((p) => (
          <Card
            key={p.id}
            onClick={() => onOpenCanvas(p.id)}
            className="cursor-pointer border-primary/20 bg-primary/[0.03] transition-all duration-300 hover:scale-[1.02] hover:border-primary/40 hover:shadow-md active:scale-[0.99]"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base">
                  {String(p.name).replace(/\s*—\s*Example Metric Tree$/, '')}
                </CardTitle>
                <Badge variant="outline" className="shrink-0 text-[10px]">
                  Example
                </Badge>
              </div>
              <CardDescription className="line-clamp-2 text-xs">
                {p.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BarChart3 className="h-3 w-3 text-blue-500" />
                  {countOf(p.metric_cards)} metrics
                </span>
                <span className="flex items-center gap-1">
                  <Network className="h-3 w-3 text-green-500" />
                  {countOf(p.relationships)} links
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
