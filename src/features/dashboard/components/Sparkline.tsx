import { Area, AreaChart, ResponsiveContainer } from 'recharts';

interface SparklineProps {
  values: number[];
  color: string;
  /** Unique-ish id so multiple gradients on a page don't collide. */
  idKey: string;
  height?: number;
}

/**
 * Minimal axis-less Recharts area, used inside KPI tiles to show a metric's
 * recent shape at a glance. Purely decorative — no tooltip/axes.
 */
export function Sparkline({
  values,
  color,
  idKey,
  height = 36,
}: SparklineProps) {
  if (!values || values.length < 2) {
    return <div style={{ height }} />;
  }
  const data = values.map((value, i) => ({ i, value }));
  const gradId = `spark-${idKey}`;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 2, bottom: 0, left: 0, right: 0 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.75}
          fill={`url(#${gradId})`}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
