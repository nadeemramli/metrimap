import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import type { MetricCard, Relationship } from '@/shared/types';
import { BarChart3, Network } from 'lucide-react';

interface AssetsStatsCardsProps {
  metrics: MetricCard[];
  relationships: Relationship[];
  metricCategories: string[];
}

export default function AssetsStatsCards({
  metrics,
  relationships,
  metricCategories,
}: AssetsStatsCardsProps) {
  const highConfidenceRelationships = relationships.filter(
    (r: Relationship) => r.confidence === 'High'
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Metrics</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.length}</div>
          <p className="text-xs text-muted-foreground">
            Across {metricCategories.length} categories
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Relationships</CardTitle>
          <Network className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{relationships.length}</div>
          <p className="text-xs text-muted-foreground">
            {highConfidenceRelationships} high confidence
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
