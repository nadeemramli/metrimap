import { Area, AreaChart, ResponsiveContainer } from 'recharts';

interface SparklineProps {
  /** Series of numeric values to plot. */
  data: number[];
  height?: number;
  /** Stroke/fill color — defaults to the primary token (theme-aware). */
  color?: string;
}

/**
 * Tiny inline trend chart (no axes/grid/tooltip) built on Recharts. Replaces
 * the hand-rolled `<div>`-bar "charts" with a real, smooth sparkline that
 * follows the design tokens (so it themes for dark mode).
 */
export function Sparkline({
  data,
  height = 48,
  color = 'var(--primary)',
}: SparklineProps) {
  if (!data || data.length === 0) {
    return <div className="h-12 w-full rounded-sm bg-muted" style={{ height }} />;
  }

  const chartData = data.map((value, index) => ({ index, value }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={chartData}
        margin={{ top: 2, right: 0, bottom: 0, left: 0 }}
      >
        <defs>
          <linearGradient id="sparkline-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          fill="url(#sparkline-fill)"
          isAnimationActive={false}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
