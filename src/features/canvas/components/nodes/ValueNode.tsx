// @ts-nocheck
// TODO(type-debt): pre-existing type errors quarantined when strict type-checking
// was enabled. See docs/architecture/TYPE_CHECK_DEBT.md. Fix the errors and remove
// this directive — do not add new code here assuming it is type-checked.
/**
 * Value Node Component
 * Represents core business value chain components
 */

import { Badge } from '@/shared/components/ui/badge';
import type { ValueNode as ValueNodeType } from '@/shared/types';
import { cn } from '@/shared/utils';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { GripVertical, Target, TrendingUp, Users } from 'lucide-react';
import { memo, useState } from 'react';
import EnhancedNodeToolbar, {
  useNodeToolbarActions,
} from './shared/EnhancedNodeToolbar';

interface ValueNodeData {
  node: ValueNodeType;
  isSelected?: boolean;
  isConnectable?: boolean;
}

const ValueNode = memo(({ data, selected }: NodeProps<ValueNodeData>) => {
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
  } = useNodeToolbarActions(node.id, 'value');

  // Handle double-click to toggle toolbar
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSelected) {
      setIsToolbarVisible(!isToolbarVisible);
    }
  };

  const getValueTypeColor = (valueType: string) => {
    switch (valueType) {
      case 'Journey Step':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Value Chain':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Critical Path':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-muted text-foreground border-border';
    }
  };

  const getBusinessImpactIcon = (impact?: string) => {
    switch (impact) {
      case 'High':
        return <TrendingUp className="w-3 h-3 text-red-600" />;
      case 'Medium':
        return <TrendingUp className="w-3 h-3 text-yellow-600" />;
      case 'Low':
        return <TrendingUp className="w-3 h-3 text-green-600" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        'relative bg-card rounded-lg border-2 shadow-sm transition-all duration-200 cursor-pointer',
        'min-w-[280px] max-w-[320px]',
        isSelected
          ? 'border-blue-500 shadow-lg ring-2 ring-blue-200'
          : 'border-border hover:border-border',
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
        id="top-target"
        type="source"
        position={Position.Top}
        className="w-3 h-3 !bg-blue-500 !border-2 !border-white"
        isConnectable={isConnectable}
      />
      <Handle
        id="bottom-source"
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-blue-500 !border-2 !border-white"
        isConnectable={isConnectable}
      />
      <Handle
        id="left-target"
        type="source"
        position={Position.Left}
        className="w-3 h-3 !bg-blue-500 !border-2 !border-white"
        isConnectable={isConnectable}
      />
      <Handle
        id="right-source"
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-blue-500 !border-2 !border-white"
        isConnectable={isConnectable}
      />

      {/* Enhanced Node Toolbar - Only visible on double-click of selected node */}
      <EnhancedNodeToolbar
        isVisible={isToolbarVisible && isSelected}
        position={Position.Top}
        nodeType="value"
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
              <Target className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <Badge
                variant="outline"
                className={cn(
                  'text-xs font-medium',
                  getValueTypeColor(node.valueType)
                )}
              >
                {node.valueType}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {getBusinessImpactIcon(node.businessImpact)}
            <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-2">
          {node.title}
        </h3>

        {node.description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {node.description}
          </p>
        )}

        {/* Business Impact */}
        {node.businessImpact && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-muted-foreground">Impact:</span>
            <Badge
              variant="outline"
              className={cn(
                'text-xs',
                node.businessImpact === 'High' &&
                  'border-red-200 text-red-700 bg-red-50',
                node.businessImpact === 'Medium' &&
                  'border-yellow-200 text-yellow-700 bg-yellow-50',
                node.businessImpact === 'Low' &&
                  'border-green-200 text-green-700 bg-green-50'
              )}
            >
              {node.businessImpact}
            </Badge>
          </div>
        )}

        {/* Stakeholders */}
        {node.stakeholders && node.stakeholders.length > 0 && (
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {node.stakeholders.length} stakeholder
              {node.stakeholders.length !== 1 ? 's' : ''}
            </span>
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
      <div className="px-3 py-2 bg-muted rounded-b-lg border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Value Node</span>
          <span className="font-mono">{node.id.slice(0, 8)}</span>
        </div>
      </div>
    </div>
  );
});

ValueNode.displayName = 'ValueNode';

export default ValueNode;
