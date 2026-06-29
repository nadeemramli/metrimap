import { Button } from '@/shared/components/ui/button';
import { TrackedMetricsPanel } from '@/features/data/components/TrackedMetricsPanel';
import { ArrowLeft, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// The Metric Catalog — the user-facing surface of the semantic layer, mounted at
// the top-level /catalog route. The in-canvas surface is the Data hub "Tracked
// Metrics" tab; both render <TrackedMetricsPanel/>. See
// docs/backlog/object-model-and-catalog.md.
export default function CatalogPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-6 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Home
          </Button>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold">Metric Catalog</h1>
          </div>
        </div>
      </div>

      <div className="px-8 py-8 max-w-5xl mx-auto">
        <TrackedMetricsPanel
          intro="The shared definitions of your real, sourced metrics. A metric becomes trackable once a card is fed by a source — promote it here so it can be referenced across canvases."
        />
      </div>
    </div>
  );
}
