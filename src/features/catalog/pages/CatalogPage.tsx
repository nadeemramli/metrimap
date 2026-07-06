import { TrackedMetricsPanel } from '@/features/data/components/TrackedMetricsPanel';
import { PageHeader } from '@/shared/components/layout/PageHeader';

// The Metric Catalog — the user-facing surface of the semantic layer, mounted at
// the top-level /catalog route. The in-canvas surface is the Data hub "Tracked
// Metrics" tab; both render <TrackedMetricsPanel/>. See the product vault.
export default function CatalogPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <PageHeader
        title="Metric Catalog"
        description="The shared definitions of your real, sourced metrics. A metric becomes trackable once a card is fed by a source — promote it here so it can be referenced across canvases."
      />
      <div className="mt-8">
        <TrackedMetricsPanel />
      </div>
    </div>
  );
}
