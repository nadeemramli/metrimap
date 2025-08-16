import React from 'react';
import { NodeToolbar, Position } from '@xyflow/react';
import { Button } from '@/shared/components/ui/button';
import { 
  Eye, 
  Edit, 
  Copy, 
  Trash2, 
  Settings, 
  Link, 
  MoreHorizontal,
  Share,
  Download,
  Tag
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { Separator } from '@/shared/components/ui/separator';

interface EnhancedNodeToolbarProps {
  isVisible: boolean;
  position?: Position;
  offset?: number;
  
  // Core actions
  onView?: () => void;
  onEdit?: () => void;
  onSettings?: () => void;
  onCopy?: () => void;
  onDelete?: () => void;
  
  // Additional actions
  onShare?: () => void;
  onExport?: () => void;
  onAddTag?: () => void;
  onCreateLink?: () => void;
  
  // Customization
  showView?: boolean;
  showEdit?: boolean;
  showSettings?: boolean;
  showCopy?: boolean;
  showDelete?: boolean;
  showMoreActions?: boolean;
  
  // Node type specific
  nodeType?: 'value' | 'action' | 'hypothesis' | 'metric' | 'evidence' | 'comment' | 'metricCard';
  customActions?: Array<{
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    onClick: () => void;
    variant?: 'default' | 'destructive' | 'secondary';
  }>;
}

export default function EnhancedNodeToolbar({
  isVisible,
  position = Position.Top,
  offset = 10,
  onView,
  onEdit,
  onSettings,
  onCopy,
  onDelete,
  onShare,
  onExport,
  onAddTag,
  onCreateLink,
  showView = true,
  showEdit = true,
  showSettings = true,
  showCopy = true,
  showDelete = true,
  showMoreActions = true,
  nodeType,
  customActions = [],
}: EnhancedNodeToolbarProps) {
  const [showMore, setShowMore] = React.useState(false);

  // Core actions that are always visible
  const coreActions = [
    {
      icon: Eye,
      label: 'View Details',
      onClick: onView,
      show: showView && onView,
      variant: 'default' as const,
      className: 'hover:bg-blue-50 hover:text-blue-600',
    },
    {
      icon: Edit,
      label: 'Edit',
      onClick: onEdit,
      show: showEdit && onEdit,
      variant: 'default' as const,
      className: 'hover:bg-green-50 hover:text-green-600',
    },
    {
      icon: Settings,
      label: 'Settings',
      onClick: onSettings,
      show: showSettings && onSettings,
      variant: 'default' as const,
      className: 'hover:bg-purple-50 hover:text-purple-600',
    },
    {
      icon: Copy,
      label: 'Duplicate',
      onClick: onCopy,
      show: showCopy && onCopy,
      variant: 'default' as const,
      className: 'hover:bg-gray-50 hover:text-gray-600',
    },
  ];

  // Additional actions for the "More" menu
  const moreActions = [
    {
      icon: Share,
      label: 'Share',
      onClick: onShare,
      show: onShare,
    },
    {
      icon: Download,
      label: 'Export',
      onClick: onExport,
      show: onExport,
    },
    {
      icon: Tag,
      label: 'Add Tag',
      onClick: onAddTag,
      show: onAddTag,
    },
    {
      icon: Link,
      label: 'Create Link',
      onClick: onCreateLink,
      show: onCreateLink,
    },
    ...customActions,
  ].filter(action => action.show);

  // Delete action (always last)
  const deleteAction = {
    icon: Trash2,
    label: 'Delete',
    onClick: onDelete,
    show: showDelete && onDelete,
    variant: 'destructive' as const,
    className: 'hover:bg-red-50 hover:text-red-600',
  };

  const visibleCoreActions = coreActions.filter(action => action.show);
  const hasMoreActions = moreActions.length > 0;
  const showDeleteAction = deleteAction.show;

  if (!isVisible) return null;

  return (
    <NodeToolbar className="nodrag" position={position} offset={offset}>
      <div className="nodrag flex items-center gap-1 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-1">
        {/* Core Actions */}
        {visibleCoreActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                action.onClick?.();
              }}
              className={`nodrag h-8 w-8 p-0 hover:scale-110 transition-all duration-200 ${action.className}`}
              title={action.label}
            >
              <Icon className="h-3 w-3" />
            </Button>
          );
        })}

        {/* Separator if we have both core actions and more actions */}
        {visibleCoreActions.length > 0 && (hasMoreActions || showDeleteAction) && (
          <Separator orientation="vertical" className="h-4 mx-1" />
        )}

        {/* More Actions Dropdown */}
        {hasMoreActions && showMoreActions && (
          <Popover open={showMore} onOpenChange={setShowMore}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="nodrag h-8 w-8 p-0 hover:bg-gray-50 hover:text-gray-600 hover:scale-110 transition-all duration-200"
                title="More Actions"
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-1" align="center">
              <div className="space-y-1">
                {moreActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        action.onClick?.();
                        setShowMore(false);
                      }}
                      className="nodrag w-full justify-start text-xs"
                    >
                      <Icon className="mr-2 h-3 w-3" />
                      {action.label}
                    </Button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* Delete Action */}
        {showDeleteAction && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              deleteAction.onClick?.();
            }}
            className={`nodrag h-8 w-8 p-0 hover:scale-110 transition-all duration-200 ${deleteAction.className}`}
            title={deleteAction.label}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>
    </NodeToolbar>
  );
}

// Helper hook for common node toolbar actions
export function useNodeToolbarActions(nodeId: string, nodeType: string) {
  const handleView = React.useCallback(() => {
    console.log(`👁️ View ${nodeType} node:`, nodeId);
    // Implement view logic
  }, [nodeId, nodeType]);

  const handleEdit = React.useCallback(() => {
    console.log(`✏️ Edit ${nodeType} node:`, nodeId);
    // Implement edit logic
  }, [nodeId, nodeType]);

  const handleSettings = React.useCallback(() => {
    console.log(`⚙️ Settings for ${nodeType} node:`, nodeId);
    // This will be connected to the settings sheets
  }, [nodeId, nodeType]);

  const handleCopy = React.useCallback(() => {
    console.log(`📋 Copy ${nodeType} node:`, nodeId);
    // Implement copy logic
  }, [nodeId, nodeType]);

  const handleDelete = React.useCallback(() => {
    console.log(`🗑️ Delete ${nodeType} node:`, nodeId);
    // Implement delete logic with confirmation
  }, [nodeId, nodeType]);

  const handleShare = React.useCallback(() => {
    console.log(`🔗 Share ${nodeType} node:`, nodeId);
    // Implement share logic
  }, [nodeId, nodeType]);

  const handleExport = React.useCallback(() => {
    console.log(`📤 Export ${nodeType} node:`, nodeId);
    // Implement export logic
  }, [nodeId, nodeType]);

  const handleAddTag = React.useCallback(() => {
    console.log(`🏷️ Add tag to ${nodeType} node:`, nodeId);
    // Implement tag logic
  }, [nodeId, nodeType]);

  return {
    handleView,
    handleEdit,
    handleSettings,
    handleCopy,
    handleDelete,
    handleShare,
    handleExport,
    handleAddTag,
  };
}
