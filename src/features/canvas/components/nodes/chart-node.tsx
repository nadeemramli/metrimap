'use client';

import { Badge } from '@/shared/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { cn } from '@/shared/utils';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import {
  BarChart3,
  GripVertical,
  LineChartIcon,
  PieChartIcon,
} from 'lucide-react';
import { memo, useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

interface ChartNodeData {
  chartType?: 'bar' | 'line' | 'pie';
  xAxis?: string | null;
  yAxis?: string | null;
  title?: string;
  data?: any[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ChartNodeInner = memo(({ data, selected }: NodeProps) => {
  const nodeData = (data || {}) as ChartNodeData;
  const chartType = nodeData.chartType ?? 'bar';
  const xAxis = nodeData.xAxis ?? null;
  const yAxis = nodeData.yAxis ?? null;
  const title = nodeData.title ?? 'Chart';
  const chartData = Array.isArray(nodeData.data) ? nodeData.data : undefined;

  const chartLabel = useMemo(
    () => (chartType ? chartType.toUpperCase() : 'BAR'),
    [chartType]
  );

  const getChartIcon = () => {
    switch (chartType) {
      case 'bar':
        return <BarChart3 className="w-4 h-4" />;
      case 'line':
        return <LineChartIcon className="w-4 h-4" />;
      case 'pie':
        return <PieChartIcon className="w-4 h-4" />;
      default:
        return <BarChart3 className="w-4 h-4" />;
    }
  };

  const renderChart = () => {
    if (!chartData || !xAxis || !yAxis) {
      return (
        <div className="h-48 flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-200 rounded">
          <div className="text-center">
            <div className="mb-2">{getChartIcon()}</div>
            <p className="text-sm">Configure data source and axes</p>
          </div>
        </div>
      );
    }

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxis} />
              <YAxis />
              <Bar dataKey={yAxis} fill="#3b82f6" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxis} />
              <YAxis />
              <Line
                type="monotone"
                dataKey={yAxis}
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                }
                outerRadius={60}
                fill="#8884d8"
                dataKey={yAxis}
                nameKey={xAxis}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <Card
      className={cn(
        'w-80 bg-white dark:bg-white-300 border-2 rounded-lg shadow-lg',
        selected && 'ring-2 ring-blue-500'
      )}
    >
      <Handle type="target" position={Position.Left} />
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <span>{title}</span>
          <div className="flex items-center gap-2">
            {getChartIcon()}
            <Badge variant="secondary" className="text-xs">
              {chartLabel}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderChart()}
        <div className="mt-3 flex gap-2 text-xs text-gray-600">
          {xAxis && <Badge variant="outline">X: {xAxis}</Badge>}
          {yAxis && <Badge variant="outline">Y: {yAxis}</Badge>}
        </div>
      </CardContent>
      <Handle type="source" position={Position.Right} />
      {/* Drag Section */}
      <div className="p-2 border-t border-border/30 bg-muted/20">
        <div className="drag-handle__custom flex justify-center cursor-grab active:cursor-grabbing">
          <div className="flex items-center gap-1 px-3 py-1.5 bg-muted/80 backdrop-blur-sm rounded-full text-xs text-muted-foreground hover:bg-muted/90 transition-colors border border-border/50 shadow-sm">
            <GripVertical className="w-3 h-3" />
            <span className="font-medium select-none">Drag</span>
            <GripVertical className="w-3 h-3" />
          </div>
        </div>
      </div>
    </Card>
  );
});

ChartNodeInner.displayName = 'ChartNode';
export default ChartNodeInner;
