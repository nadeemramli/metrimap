import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import type { GroupNode as GroupNodeType } from '@/shared/types';
import { cn } from '@/shared/utils';
import type { NodeProps } from '@xyflow/react';
import { Handle, NodeResizer, NodeToolbar, Position } from '@xyflow/react';
import {
  Edit3,
  Folder,
  FolderOpen,
  MoreVertical,
  Settings,
  Trash2,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface GroupNodeData {
  group: GroupNodeType;
  isCollapsed?: boolean;
  onEditGroup?: (groupId: string) => void;
  onDeleteGroup?: (groupId: string) => void;
  onToggleCollapse?: (groupId: string) => void;
  onResizeGroup?: (
    groupId: string,
    size: { width: number; height: number }
  ) => void;
}

export default function GroupNode({ id, data, selected }: NodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const {
    group,
    isCollapsed = false,
    onEditGroup,
    onDeleteGroup,
    onToggleCollapse,
    onResizeGroup,
  } = (data as unknown as GroupNodeData) || {};

  useEffect(() => {
    if (!selected || !onResizeGroup || !group) return;
    const padding = 50;
    const childBounds = group.size;
    const newSize = {
      width: childBounds.width + padding * 2,
      height: childBounds.height + padding * 2,
    };
    onResizeGroup(id as string, newSize);
  }, [selected, onResizeGroup, id, group]);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditGroup?.(id as string);
  };
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteGroup?.(id as string);
  };
  const handleToggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleCollapse?.(id as string);
  };

  if (!group) return null;

  return (
    <>
      <NodeResizer
        minWidth={200}
        minHeight={120}
        isVisible={!!selected}
        lineClassName="border-primary"
        handleClassName="h-3 w-3 bg-primary border-2 border-background rounded z-20 cursor-se-resize"
        onResize={(_, params) => {
          onResizeGroup?.(id as string, {
            width: params.width,
            height: params.height,
          });
        }}
      />

      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-primary border-2 border-background"
        style={{ top: '-6px' }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        className="w-3 h-3 bg-primary border-2 border-background"
        style={{ bottom: '-6px' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-primary border-2 border-background"
        style={{ left: '-6px' }}
      />
      <Handle
        type="target"
        position={Position.Right}
        className="w-3 h-3 bg-primary border-2 border-background"
        style={{ right: '-6px' }}
      />

      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg transition-all cursor-move',
          'min-h-[120px] min-w-[200px]',
          selected
            ? 'border-primary shadow-lg shadow-primary/20 bg-primary/5'
            : 'border-muted-foreground/30 hover:border-muted-foreground/50',
          isCollapsed && 'min-h-[60px]'
        )}
        style={{
          width: group.size.width,
          height: isCollapsed ? 60 : group.size.height,
          position: 'relative',
          overflow: 'visible',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-2 bg-background/80 border-b border-dashed border-muted-foreground/20 rounded-t-lg flex items-center justify-between cursor-move">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              {group.name}
            </span>
            <Badge variant="outline" className="text-xs">
              {group.nodeIds.length} items
            </Badge>
          </div>
          {selected && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            </div>
          )}
        </div>

        {/* Empty content hint */}
        {!isCollapsed && group.nodeIds.length === 0 && (
          <div className="absolute inset-0 top-10 p-2 flex items-center justify-center pointer-events-none">
            <div className="text-muted-foreground text-sm text-center opacity-50">
              <Folder className="h-8 w-8 mx-auto mb-2" />
              <p>Drop nodes here to group them</p>
            </div>
          </div>
        )}

        {/* Collapsed description */}
        {isCollapsed && (
          <div className="absolute inset-0 top-8 px-2 flex items-center">
            <span className="text-xs text-muted-foreground truncate">
              {group.nodeIds.length === 0
                ? 'Empty group'
                : `${group.nodeIds.length} node${group.nodeIds.length === 1 ? '' : 's'}`}
            </span>
          </div>
        )}

        {/* Visual drop hint */}
        <div className="absolute inset-2 top-12 border-2 border-transparent rounded pointer-events-none group-hover:border-primary/20 transition-colors" />
        {isHovered && (
          <div className="absolute inset-0 border-2 border-dashed border-primary/50 rounded-lg pointer-events-none bg-primary/5" />
        )}
      </div>

      {/* Toolbar */}
      <NodeToolbar className="nodrag" position={Position.Top} offset={10}>
        <div className="nodrag flex items-center gap-1 bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(e);
            }}
            className="nodrag h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 hover:scale-110 transition-all duration-200"
            title="Edit Group"
          >
            <Edit3 className="h-3 w-3" />
          </Button>
          <div className="w-px h-4 bg-gray-300 mx-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleCollapse(e);
            }}
            className="nodrag h-8 w-8 p-0 hover:bg-gray-50 hover:text-gray-600 hover:scale-110 transition-all duration-200"
            title={isCollapsed ? 'Expand Group' : 'Collapse Group'}
          >
            {isCollapsed ? (
              <FolderOpen className="h-3 w-3" />
            ) : (
              <Folder className="h-3 w-3" />
            )}
          </Button>
          <div className="w-px h-4 bg-gray-300 mx-1" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="nodrag h-8 w-8 p-0 hover:bg-gray-50 hover:text-gray-600 hover:scale-110 transition-all duration-200"
                title="More Actions"
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleEdit}>
                <Settings className="h-4 w-4 mr-2" />
                Edit Group
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users className="h-4 w-4 mr-2" />
                Manage Nodes
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Group
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </NodeToolbar>
    </>
  );
}
