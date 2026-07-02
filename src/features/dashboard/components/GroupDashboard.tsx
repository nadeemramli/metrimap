import { Badge } from '@/shared/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { MetricChart } from '@/shared/components/charts/MetricChart';
import { PALETTE, formatCompact } from '@/features/canvas/utils/chartData';
import { Sparkline } from '@/features/dashboard/components/Sparkline';
import {
  buildGroupDashboard,
  type GroupKpi,
} from '@/features/dashboard/utils/groupDashboard';
import type { GroupNode, MetricCard } from '@/shared/types';
import { Activity, Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';

interface GroupDashboardProps {
  group: GroupNode;
  cards: MetricCard[];
}

/**
 * Read-only dashboard auto-generated from a canvas group. Every metric card in
 * the group becomes a KPI tile (with sparkline) and feeds the trend/composition
 * charts. Restores the "group → dashboard" linkage on the current Recharts UI.
 */
export function GroupDashboard({ group, cards }: GroupDashboardProps) {
  const data = useMemo(
    () => buildGroupDashboard(group, cards),
    [group, cards]
  );
  const { members, kpis, categoryCounts, health, chart, chartCards, latest } =
    data;

  // Colour lookup so a KPI tile matches its series colour on the charts.
  const colorByCard = useMemo(() => {
    const map: Record<string, string> = {};
    chart.series.forEach((s, i) => {
      map[s.cardId] = PALETTE[i % PALETTE.length];
    });
    return map;
  }, [chart.series]);

  const accent = group.color || '#6366f1';
  const showPie = chartCards.length >= 2 && latest.some((l) => l.value > 0);

  return (
    <div className="space-y-4">
      {/* Summary header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: accent }}
          />
          <h2 className="text-lg font-semibold leading-none">{group.name}</h2>
          <Badge variant="secondary" className="font-normal">
            {members.length} {members.length === 1 ? 'metric' : 'metrics'}
          </Badge>
          {Object.entries(categoryCounts).map(([cat, n]) => (
            <Badge key={cat} variant="outline" className="font-normal">
              {cat.split('/')[0]} · {n}
            </Badge>
          ))}
        </div>
        {health.total > 0 && (
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {health.up > 0 && (
              <span className="flex items-center gap-1 text-emerald-600">
                <TrendingUp className="h-3.5 w-3.5" />
                {health.up} up
              </span>
            )}
            {health.down > 0 && (
              <span className="flex items-center gap-1 text-red-600">
                <TrendingDown className="h-3.5 w-3.5" />
                {health.down} down
              </span>
            )}
            {health.flat > 0 && (
              <span className="flex items-center gap-1">
                <Minus className="h-3.5 w-3.5" />
                {health.flat} flat
              </span>
            )}
          </div>
        )}
      </div>

      {kpis.length === 0 ? (
        <Card className="p-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <Activity className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No time-series data in this group yet. Add values to its metric
              cards on the canvas to see charts here.
            </p>
            {members.length > 0 && (
              <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                {members.slice(0, 12).map((m) => (
                  <Badge key={m.id} variant="outline" className="font-normal">
                    {m.title}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </Card>
      ) : (
        <>
          {/* KPI tiles */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {kpis.slice(0, 8).map((kpi) => (
              <StatTile
                key={kpi.cardId}
                kpi={kpi}
                color={colorByCard[kpi.cardId] || accent}
              />
            ))}
          </div>

          {/* Charts */}
          <div
            className={
              showPie ? 'grid gap-4 lg:grid-cols-3' : 'grid gap-4'
            }
          >
            <Card className={showPie ? 'lg:col-span-2' : ''}>
              <CardHeader className="py-3">
                <CardTitle className="text-sm">Trends over time</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <MetricChart
                  chartType={chartCards.length > 3 ? 'line' : 'area'}
                  {...chart}
                  showLegend
                  height={300}
                  idPrefix={`grp-${group.id}`}
                />
              </CardContent>
            </Card>

            {showPie && (
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">
                    Latest composition
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <MetricChart
                    chartType="pie"
                    {...chart}
                    height={300}
                    idPrefix={`grp-pie-${group.id}`}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function StatTile({ kpi, color }: { kpi: GroupKpi; color: string }) {
  const Trend =
    kpi.trend === 'down'
      ? TrendingDown
      : kpi.trend === 'up'
        ? TrendingUp
        : Minus;
  const trendClass =
    kpi.trend === 'up'
      ? 'text-emerald-600'
      : kpi.trend === 'down'
        ? 'text-red-600'
        : 'text-muted-foreground';

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-muted-foreground">
              {kpi.label}
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums">
              {kpi.value == null ? '—' : formatCompact(kpi.value)}
            </p>
          </div>
          {kpi.changePercent != null && (
            <span
              className={`flex shrink-0 items-center gap-0.5 text-xs font-medium ${trendClass}`}
            >
              <Trend className="h-3.5 w-3.5" />
              {kpi.changePercent > 0 ? '+' : ''}
              {kpi.changePercent}%
            </span>
          )}
        </div>
        <div className="mt-2 -mx-1">
          <Sparkline values={kpi.spark} color={color} idKey={kpi.cardId} />
        </div>
      </CardContent>
    </Card>
  );
}
