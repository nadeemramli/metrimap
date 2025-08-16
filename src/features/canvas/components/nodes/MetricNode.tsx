/**
 * Metric Node Component
 * Data-centric node that stores and acts as proxy for data from Source Nodes
 */

import { Badge } from '@/shared/components/ui/badge';
import type { MetricNode as MetricNodeType } from '@/shared/types';
import { cn } from '@/shared/utils';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import {
  BarChart3,
  Database,
  GripVertical,
  Target,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { memo, useState } from 'react';
import { useNodeToolbarActions } from './shared/EnhancedNodeToolbar';

interface MetricNodeData {
  node: MetricNodeType;
  isSelected?: boolean;
  isConnectable?: boolean;
}

const MetricNode = memo(({ data, selected }: NodeProps<MetricNodeData>) => {
  const { node, isSelected = selected, isConnectable = true } = data;
  const [isHovered, setIsHovered] = useState(false);
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);

  // Enhanced toolbar actions
  const {
    handleView,
    handleEdit,
    handleSettings,
    handleCopy,
    handleDelete,
    handleShare,
    handleExport,
    handleAddTag,
  } = useNodeToolbarActions(node.id, 'metric');

  // Handle double-click to toggle toolbar
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSelected) {
      setIsToolbarVisible(!isToolbarVisible);
    }
  };

  const getMetricTypeColor = (metricType: string) => {
    switch (metricType) {
      case 'North Star Metric':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Leading KPI':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Lagging KPI':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Input Metric':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Output Metric':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Diagnostic Metric':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCurrentValue = (): number | null => {
    if (node.currentValue !== undefined) return node.currentValue;
    if (node.values && node.values.length > 0) {
      return node.values[node.values.length - 1].value;
    }
    return null;
  };

  const getTrend = (): 'up' | 'down' | 'neutral' => {
    if (!node.values || node.values.length < 2) return 'neutral';
    const latest = node.values[node.values.length - 1].value;
    const previous = node.values[node.values.length - 2].value;
    if (latest > previous) return 'up';
    if (latest < previous) return 'down';
    return 'neutral';
  };

  const formatValue = (value: number): string => {
    if (node.unit) {
      if (node.unit === '%') return `${value.toFixed(1)}%`;
      if (node.unit === '$') return `$${value.toLocaleString()}`;
      return `${value.toLocaleString()} ${node.unit}`;
    }
    return value.toLocaleString();
  };

  const currentValue = getCurrentValue();
  const trend = getTrend();

  return (
    <div
      className={cn(
        'relative bg-white rounded-lg border-2 shadow-sm transition-all duration-200 cursor-pointer',
        'min-w-[280px] max-w-[320px]',
        isSelected
          ? 'border-blue-500 shadow-lg ring-2 ring-blue-200'
          : 'border-gray-200 hover:border-gray-300',
        isHovered &&
          !isSelected &&
          'shadow-md transform scale-[1.02] border-blue-300',
        isHovered && isSelected && 'shadow-xl ring-4 ring-blue-100'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDoubleClick={handleDoubleClick}
      title={isSelected ? 'Double-click to open toolbar' : 'Click to select'}
    >
      {/* Double-click hint for selected nodes */}
      {isSelected && !isToolbarVisible && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full shadow-lg animate-pulse">
          Double-click
        </div>
      )}

      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-blue-500 !border-2 !border-white"
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-blue-500 !border-2 !border-white"
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-blue-500 !border-2 !border-white"
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-blue-500 !border-2 !border-white"
        isConnectable={isConnectable}
      />

      {/* Enhanced Node Toolbar - Only visible on double-click of selected node */}
      <EnhancedNodeToolbar
        isVisible={isToolbarVisible && isSelected}
        position={Position.Top}
        nodeType="metric"
        onView={handleView}
        onEdit={handleEdit}
        onSettings={handleSettings}
        onCopy={handleCopy}
        onDelete={handleDelete}
        onShare={handleShare}
        onExport={handleExport}
        onAddTag={handleAddTag}
      />

      {/* Header */}
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
              <BarChart3 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <Badge
                variant="outline"
                className={cn(
                  'text-xs font-medium',
                  getMetricTypeColor(node.metricType)
                )}
              >
                {node.metricType}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {node.sourceNodeId && (
              <Database className="w-3 h-3 text-gray-400" />
            )}
            <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
          {node.title}
        </h3>

        {node.description && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
            {node.description}
          </p>
        )}

        {/* Current Value */}
        {currentValue !== null && (
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-gray-900">
                  {formatValue(currentValue)}
                </div>
                <div className="text-xs text-gray-500">Current Value</div>
              </div>
              <div className="flex items-center gap-1">
                {trend === 'up' && (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                )}
                {trend === 'down' && (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Target Value */}
        {node.targetValue && (
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-600">
              Target: {formatValue(node.targetValue)}
            </span>
          </div>
        )}

        {/* Formula */}
        {node.formula && (
          <div className="mb-2">
            <div className="text-xs font-medium text-gray-700 mb-1">
              Formula
            </div>
            <div className="text-xs text-gray-600 font-mono bg-gray-50 p-1 rounded">
              {node.formula}
            </div>
          </div>
        )}

        {/* Data Source Connection */}
        {node.sourceNodeId && (
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-3 h-3 text-blue-500" />
            <span className="text-xs text-blue-600">
              Connected to data source
            </span>
          </div>
        )}

        {/* Dimensions and Segments */}
        {((node.dimensions && node.dimensions.length > 0) ||
          (node.segments && node.segments.length > 0)) && (
          <div className="mb-2">
            {node.dimensions && node.dimensions.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-1">
                <span className="text-xs text-gray-500">Dimensions:</span>
                {node.dimensions.slice(0, 2).map((dim, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {dim}
                  </Badge>
                ))}
                {node.dimensions.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{node.dimensions.length - 2}
                  </Badge>
                )}
              </div>
            )}
            {node.segments && node.segments.length > 0 && (
              <div className="flex flex-wrap gap-1">
                <span className="text-xs text-gray-500">Segments:</span>
                {node.segments.slice(0, 2).map((seg, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {seg}
                  </Badge>
                ))}
                {node.segments.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{node.segments.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {node.tags && node.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {node.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs px-1.5 py-0.5"
              >
                {tag}
              </Badge>
            ))}
            {node.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                +{node.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 bg-gray-50 rounded-b-lg border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Metric Node</span>
          <span className="font-mono">{node.id.slice(0, 8)}</span>
        </div>
      </div>
    </div>
  );
});

MetricNode.displayName = 'MetricNode';

export default MetricNode;
