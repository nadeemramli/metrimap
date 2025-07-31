import { useState } from "react";
import type { NodeProps } from "@xyflow/react";
import {
  Edit3,
  Settings,
  Trash2,
  Users,
  MoreVertical,
  Folder,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { GroupNode as GroupNodeType } from "@/lib/types";

interface GroupNodeData {
  group: GroupNodeType;
  isCollapsed?: boolean;
  onEditGroup?: (groupId: string) => void;
  onDeleteGroup?: (groupId: string) => void;
  onToggleCollapse?: (groupId: string) => void;
}

export default function GroupNode({ id, data, selected }: NodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const {
    group,
    isCollapsed = false,
    onEditGroup,
    onDeleteGroup,
    onToggleCollapse,
  } = data as unknown as GroupNodeData;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditGroup?.(id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteGroup?.(id);
  };

  const handleToggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleCollapse?.(id);
  };

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-lg bg-background/60 backdrop-blur-sm transition-all",
        "min-h-[120px] min-w-[200px]",
        selected
          ? "border-primary shadow-lg shadow-primary/20"
          : "border-muted-foreground/30 hover:border-muted-foreground/50",
        isCollapsed && "min-h-[60px]"
      )}
      style={{
        width: group.size.width,
        height: isCollapsed ? 60 : group.size.height,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Group Header */}
      <div className="absolute top-0 left-0 right-0 p-2 bg-background/80 border-b border-dashed border-muted-foreground/20 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={handleToggleCollapse}
          >
            {isCollapsed ? (
              <Folder className="h-3 w-3" />
            ) : (
              <FolderOpen className="h-3 w-3" />
            )}
          </Button>
          <span className="text-sm font-medium text-foreground">
            {group.name}
          </span>
          <Badge variant="outline" className="text-xs">
            {group.nodeIds.length} items
          </Badge>
        </div>

        {/* Group Actions */}
        {(isHovered || selected) && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={handleEdit}
            >
              <Edit3 className="h-3 w-3" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
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
        )}
      </div>

      {/* Group Content Area */}
      {!isCollapsed && (
        <div className="absolute inset-0 top-10 p-2 flex items-center justify-center">
          <div className="text-muted-foreground text-sm text-center">
            <Folder className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Drop nodes here to group them</p>
            <p className="text-xs mt-1">
              {group.nodeIds.length === 0
                ? "Empty group"
                : `Contains ${group.nodeIds.length} node${group.nodeIds.length === 1 ? "" : "s"}`}
            </p>
          </div>
        </div>
      )}

      {/* Group Description (if collapsed) */}
      {isCollapsed && (
        <div className="absolute inset-0 top-8 px-2 flex items-center">
          <span className="text-xs text-muted-foreground truncate">
            {group.nodeIds.length === 0
              ? "Empty group"
              : `${group.nodeIds.length} node${group.nodeIds.length === 1 ? "" : "s"}`}
          </span>
        </div>
      )}

      {/* Visual feedback for drop zones */}
      <div className="absolute inset-2 top-12 border-2 border-transparent rounded pointer-events-none group-hover:border-primary/20 transition-colors" />
    </div>
  );
}
