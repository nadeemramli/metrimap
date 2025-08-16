/**
 * Hypothesis Node Component
 * Dedicated space for brainstorming and capturing new ideas
 */

import { Badge } from '@/shared/components/ui/badge';
import type { HypothesisNode as HypothesisNodeType } from '@/shared/types';
import { cn } from '@/shared/utils';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import {
  AlertTriangle,
  CheckSquare,
  GripVertical,
  Lightbulb,
  Target,
} from 'lucide-react';
import { memo, useState } from 'react';
import { useNodeToolbarActions } from './shared/EnhancedNodeToolbar';

interface HypothesisNodeData {
  node: HypothesisNodeType;
  isSelected?: boolean;
  isConnectable?: boolean;
}

const HypothesisNode = memo(
  ({ data, selected }: NodeProps<HypothesisNodeData>) => {
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
    } = useNodeToolbarActions(node.id, 'hypothesis');

    // Handle double-click to toggle toolbar
    const handleDoubleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isSelected) {
        setIsToolbarVisible(!isToolbarVisible);
      }
    };

    const getHypothesisTypeColor = (hypothesisType: string) => {
      switch (hypothesisType) {
        case 'Factor':
          return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'Seller Solution':
          return 'bg-indigo-100 text-indigo-800 border-indigo-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    const getConfidenceColor = (confidence?: string) => {
      switch (confidence) {
        case 'High':
          return 'border-green-200 text-green-700 bg-green-50';
        case 'Medium':
          return 'border-yellow-200 text-yellow-700 bg-yellow-50';
        case 'Low':
          return 'border-red-200 text-red-700 bg-red-50';
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
            ? 'border-purple-500 shadow-lg ring-2 ring-purple-200'
            : 'border-gray-200 hover:border-gray-300',
          isHovered &&
            !isSelected &&
            'shadow-md transform scale-[1.02] border-purple-300',
          isHovered && isSelected && 'shadow-xl ring-4 ring-purple-100'
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDoubleClick={handleDoubleClick}
        title={isSelected ? 'Double-click to open toolbar' : 'Click to select'}
      >
        {/* Double-click hint for selected nodes */}
        {isSelected && !isToolbarVisible && (
          <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full shadow-lg animate-pulse">
            Double-click
          </div>
        )}

        {/* Connection Handles */}
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 !bg-purple-500 !border-2 !border-white"
          isConnectable={isConnectable}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 !bg-purple-500 !border-2 !border-white"
          isConnectable={isConnectable}
        />
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 !bg-purple-500 !border-2 !border-white"
          isConnectable={isConnectable}
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 !bg-purple-500 !border-2 !border-white"
          isConnectable={isConnectable}
        />

        {/* Enhanced Node Toolbar - Only visible on double-click of selected node */}
        <EnhancedNodeToolbar
          isVisible={isToolbarVisible && isSelected}
          position={Position.Top}
          nodeType="hypothesis"
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
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100">
                <Lightbulb className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <Badge
                  variant="outline"
                  className={cn(
                    'text-xs font-medium',
                    getHypothesisTypeColor(node.hypothesisType)
                  )}
                >
                  {node.hypothesisType}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {node.testable && (
                <CheckSquare className="w-3 h-3 text-green-600" />
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

          {/* Confidence and Testable */}
          <div className="flex items-center gap-2 mb-2">
            {node.confidence && (
              <Badge
                variant="outline"
                className={cn('text-xs', getConfidenceColor(node.confidence))}
              >
                {node.confidence} Confidence
              </Badge>
            )}
            {node.testable && (
              <Badge
                variant="outline"
                className="text-xs border-green-200 text-green-700 bg-green-50"
              >
                Testable
              </Badge>
            )}
          </div>

          {/* Assumptions */}
          {node.assumptions && node.assumptions.length > 0 && (
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-3 h-3 text-amber-500" />
                <span className="text-xs font-medium text-gray-700">
                  Assumptions
                </span>
              </div>
              <div className="space-y-1">
                {node.assumptions.slice(0, 2).map((assumption, index) => (
                  <div key={index} className="text-xs text-gray-600 pl-5">
                    • {assumption}
                  </div>
                ))}
                {node.assumptions.length > 2 && (
                  <div className="text-xs text-gray-500 pl-5">
                    +{node.assumptions.length - 2} more
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Success Criteria */}
          {node.successCriteria && node.successCriteria.length > 0 && (
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-3 h-3 text-green-500" />
                <span className="text-xs font-medium text-gray-700">
                  Success Criteria
                </span>
              </div>
              <div className="space-y-1">
                {node.successCriteria.slice(0, 2).map((criteria, index) => (
                  <div key={index} className="text-xs text-gray-600 pl-5">
                    • {criteria}
                  </div>
                ))}
                {node.successCriteria.length > 2 && (
                  <div className="text-xs text-gray-500 pl-5">
                    +{node.successCriteria.length - 2} more
                  </div>
                )}
              </div>
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
            <span>Hypothesis Node</span>
            <span className="font-mono">{node.id.slice(0, 8)}</span>
          </div>
        </div>
      </div>
    );
  }
);

HypothesisNode.displayName = 'HypothesisNode';

export default HypothesisNode;
