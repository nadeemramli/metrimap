// Strength-trend sparkline for the relationship History tab (relationship
// intelligence lane, priority 5). Renders the recorded weight-over-time series
// from relationship_history, coloured by the current sign.

import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { Sparkline } from '@/features/dashboard/components/Sparkline';
import {
  summarizeStrengthTrend,
  toStrengthTrend,
  type RelationshipHistoryPoint,
} from '@/shared/lib/supabase/services/relationshipHistory';

export function StrengthTrendCard({
  points,
}: {
  points: RelationshipHistoryPoint[];
}) {
  const series = toStrengthTrend(points);
  const summary = summarizeStrengthTrend(points);

  if (summary.points === 0) {
    return (
      <div className="rounded-lg border p-3 text-sm text-gray-500">
        No strength history yet — change this relationship's strength to start
        tracking its trend.
      </div>
    );
  }

  const current = summary.current ?? 0;
  const color = current < 0 ? '#dc2626' : current > 0 ? '#16a34a' : '#6b7280';
  const Icon =
    summary.direction === 'up'
      ? TrendingUp
      : summary.direction === 'down'
        ? TrendingDown
        : Minus;

  return (
    <div className="rounded-lg border p-3">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-medium">Strength trend</span>
        <span className="flex items-center gap-1 text-xs text-gray-600">
          <Icon className="h-3.5 w-3.5" />
          {current}
          {summary.delta != null && summary.points > 1 && (
            <span className="text-gray-400">
              ({summary.delta > 0 ? '+' : ''}
              {summary.delta})
            </span>
          )}
        </span>
      </div>
      {series.length >= 2 ? (
        <Sparkline
          values={series}
          color={color}
          idKey={`rel-strength-${points[0]?.relationshipId ?? 'x'}`}
          height={40}
        />
      ) : (
        <p className="text-xs text-gray-500">
          One data point so far — more edits will draw the trend.
        </p>
      )}
      <p className="mt-1 text-[11px] text-gray-500">
        {summary.points} recorded change{summary.points === 1 ? '' : 's'}
      </p>
    </div>
  );
}
