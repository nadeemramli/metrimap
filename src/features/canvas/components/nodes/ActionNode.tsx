/**
 * Action Node Component
 * Maps specific tasks and initiatives (BAU or new initiatives)
 */

import { Badge } from '@/shared/components/ui/badge';
import type { ActionNode as ActionNodeType } from '@/shared/types';
import { cn } from '@/shared/utils';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  GripVertical,
  Pause,
  User,
  Zap,
} from 'lucide-react';
import { memo, useState } from 'react';
import EnhancedNodeToolbar, {
  useNodeToolbarActions,
} from './shared/EnhancedNodeToolbar';

interface ActionNodeData {
  node: ActionNodeType;
  isSelected?: boolean;
  isConnectable?: boolean;
}

const ActionNode = memo(({ data, selected }: NodeProps<ActionNodeData>) => {
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
  } = useNodeToolbarActions(node.id, 'action');

  // Handle double-click to toggle toolbar
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSelected) {
      setIsToolbarVisible(!isToolbarVisible);
    }
  };

  const getActionTypeColor = (actionType: string) => {
    switch (actionType) {
      case 'Experiment':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'BAU':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Initiative':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Scope/Function':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Business Driver':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'Planning':
        return <Clock className="w-3 h-3 text-blue-600" />;
      case 'In Progress':
        return <AlertCircle className="w-3 h-3 text-yellow-600" />;
      case 'Completed':
        return <CheckCircle className="w-3 h-3 text-green-600" />;
      case 'On Hold':
        return <Pause className="w-3 h-3 text-gray-600" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'High':
        return 'border-red-200 text-red-700 bg-red-50';
      case 'Medium':
        return 'border-yellow-200 text-yellow-700 bg-yellow-50';
      case 'Low':
        return 'border-green-200 text-green-700 bg-green-50';
      default:
        return 'border-gray-200 text-gray-700 bg-gray-50';
    }
  };

  return (
    <div
      className={cn(
        'relative bg-white rounded-lg border-2 shadow-sm transition-all duration-200 cursor-pointer',
        'min-w-[280px] max-w-[320px]',
        isSelected
          ? 'border-orange-500 shadow-lg ring-2 ring-orange-200'
          : 'border-gray-200 hover:border-gray-300',
        isHovered &&
          !isSelected &&
          'shadow-md transform scale-[1.02] border-orange-300',
        isHovered && isSelected && 'shadow-xl ring-4 ring-orange-100'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDoubleClick={handleDoubleClick}
      title={isSelected ? 'Double-click to open toolbar' : 'Click to select'}
    >
      {/* Double-click hint for selected nodes */}
      {isSelected && !isToolbarVisible && (
        <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full shadow-lg animate-pulse">
          Double-click
        </div>
      )}

      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-orange-500 !border-2 !border-white"
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-orange-500 !border-2 !border-white"
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-orange-500 !border-2 !border-white"
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-orange-500 !border-2 !border-white"
        isConnectable={isConnectable}
      />

      {/* Enhanced Node Toolbar - Only visible on double-click of selected node */}
      <EnhancedNodeToolbar
        isVisible={isToolbarVisible && isSelected}
        position={Position.Top}
        nodeType="action"
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
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100">
              <Zap className="w-4 h-4 text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <Badge
                variant="outline"
                className={cn(
                  'text-xs font-medium',
                  getActionTypeColor(node.actionType)
                )}
              >
                {node.actionType}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {getStatusIcon(node.status)}
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

        {/* Status and Priority */}
        <div className="flex items-center gap-2 mb-2">
          {node.status && (
            <Badge variant="outline" className="text-xs">
              {node.status}
            </Badge>
          )}
          {node.priority && (
            <Badge
              variant="outline"
              className={cn('text-xs', getPriorityColor(node.priority))}
            >
              {node.priority}
            </Badge>
          )}
        </div>

        {/* Assignee and Due Date */}
        <div className="space-y-1 mb-2">
          {node.assignee && (
            <div className="flex items-center gap-2">
              <User className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-600">{node.assignee}</span>
            </div>
          )}
          {node.dueDate && (
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-600">
                {new Date(node.dueDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Effort */}
        {node.effort && (
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-600">
              {node.effort} {node.effort === 1 ? 'point' : 'points'}
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
      <div className="px-3 py-2 bg-gray-50 rounded-b-lg border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Action Node</span>
          <span className="font-mono">{node.id.slice(0, 8)}</span>
        </div>
      </div>
    </div>
  );
});

ActionNode.displayName = 'ActionNode';

export default ActionNode;
