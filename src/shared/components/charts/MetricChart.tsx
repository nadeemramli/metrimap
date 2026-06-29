import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/shared/components/ui/chart';
import {
  formatCompact,
  type ResolvedChart,
} from '@/features/canvas/utils/chartData';
import type { ReactNode } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts';

export type ChartType = 'line' | 'area' | 'bar' | 'pie';

interface MetricChartProps extends ResolvedChart {
  chartType: ChartType;
  showLegend?: boolean;
  /** Chart height — px number or a CSS string like '100%' (default 200). */
  height?: number | string;
  /** Disambiguates gradient ids when several area charts share a page. */
  idPrefix?: string;
  /** Rendered when there is no data to plot. */
  emptySlot?: ReactNode;
}

/**
 * Presentational Recharts renderer shared by the canvas Chart node and the
 * dashboard widgets. Takes the output of `resolveChartSeries` and renders the
 * requested chart type with the shadcn chart primitives (theme-aware via
 * `--color-*` vars). Pure — no data fetching.
 */
export function MetricChart({
  chartType,
  config,
  series,
  rows,
  pie,
  hasData,
  showLegend = true,
  height = 200,
  idPrefix = 'mc',
  emptySlot,
}: MetricChartProps) {
  if (!hasData) {
    return (
      <>
        {emptySlot ?? (
          <div
            className="flex items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-center text-sm text-muted-foreground"
            style={{ height }}
          >
            No data to display.
          </div>
        )}
      </>
    );
  }

  const containerStyle = { height } as const;
  const axisProps = {
    tickLine: false,
    axisLine: false,
    tick: { fontSize: 11 },
  } as const;

  if (chartType === 'pie') {
    return (
      <ChartContainer
        config={config}
        className="aspect-auto w-full"
        style={containerStyle}
      >
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={pie}
            dataKey="value"
            nameKey="label"
            innerRadius={45}
            outerRadius={78}
            paddingAngle={2}
            strokeWidth={2}
          >
            {pie.map((slice) => (
              <Cell key={slice.key} fill={slice.fill} />
            ))}
          </Pie>
          <ChartLegend
            content={(props) => (
              <ChartLegendContent {...(props as any)} nameKey="label" />
            )}
          />
        </PieChart>
      </ChartContainer>
    );
  }

  const grid = (
    <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.4} />
  );
  const x = <XAxis dataKey="period" {...axisProps} minTickGap={16} />;
  const y = <YAxis {...axisProps} width={36} tickFormatter={formatCompact} />;
  const tooltip = <ChartTooltip content={<ChartTooltipContent />} />;
  const legend = showLegend ? (
    <ChartLegend content={(props) => <ChartLegendContent {...(props as any)} />} />
  ) : null;

  if (chartType === 'line') {
    return (
      <ChartContainer
        config={config}
        className="aspect-auto w-full"
        style={containerStyle}
      >
        <LineChart data={rows} margin={{ left: 4, right: 8, top: 8 }}>
          {grid}
          {x}
          {y}
          {tooltip}
          {legend}
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              stroke={`var(--color-${s.key})`}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ChartContainer>
    );
  }

  if (chartType === 'bar') {
    return (
      <ChartContainer
        config={config}
        className="aspect-auto w-full"
        style={containerStyle}
      >
        <BarChart data={rows} margin={{ left: 4, right: 8, top: 8 }}>
          {grid}
          {x}
          {y}
          {tooltip}
          {legend}
          {series.map((s) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              fill={`var(--color-${s.key})`}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ChartContainer>
    );
  }

  // area (default)
  return (
    <ChartContainer
      config={config}
      className="aspect-auto w-full"
      style={containerStyle}
    >
      <AreaChart data={rows} margin={{ left: 4, right: 8, top: 8 }}>
        <defs>
          {series.map((s) => (
            <linearGradient
              key={s.key}
              id={`fill-${idPrefix}-${s.key}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor={`var(--color-${s.key})`}
                stopOpacity={0.45}
              />
              <stop
                offset="95%"
                stopColor={`var(--color-${s.key})`}
                stopOpacity={0.05}
              />
            </linearGradient>
          ))}
        </defs>
        {grid}
        {x}
        {y}
        {tooltip}
        {legend}
        {series.map((s) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            stroke={`var(--color-${s.key})`}
            strokeWidth={2}
            fill={`url(#fill-${idPrefix}-${s.key})`}
            connectNulls
          />
        ))}
      </AreaChart>
    </ChartContainer>
  );
}
