import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FolderPlus, FolderOpen, Copy, Delete, Settings } from "lucide-react";

interface SelectionToolbarProps {
  selectedNodeIds: string[];
  selectedGroupIds: string[];
  onGroupNodes: () => void;
  onUngroupNodes: () => void;
  onDeleteNodes: () => void;
  onDuplicateNodes: () => void;
  onOpenSettings: () => void;
  position: { x: number; y: number };
}

export default function SelectionToolbar({
  selectedNodeIds,
  selectedGroupIds,
  onGroupNodes,
  onUngroupNodes,
  onDeleteNodes,
  onDuplicateNodes,
  onOpenSettings,
  position,
}: SelectionToolbarProps) {
  const hasSelectedNodes = selectedNodeIds.length > 0;
  const hasSelectedGroups = selectedGroupIds.length > 0;
  const totalSelected = selectedNodeIds.length + selectedGroupIds.length;

  if (totalSelected === 0) return null;

  return (
    <div
      className="fixed z-50 bg-popover/95 backdrop-blur-sm border border-border rounded-lg shadow-xl p-3 animate-in fade-in-0 zoom-in-95 duration-200"
      style={{
        left: position.x,
        top: position.y - 100, // Position higher above the selection
        transform: "translateX(-50%)", // Center horizontally
      }}
    >
      <div className="flex items-center gap-2">
        {/* Selection Info */}
        <Badge variant="secondary" className="text-xs font-medium">
          {totalSelected} selected
        </Badge>

        {/* Divider */}
        <div className="w-px h-4 bg-border" />

        {/* Group Actions */}
        {hasSelectedNodes && selectedNodeIds.length > 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onGroupNodes}
            className="text-xs hover:bg-primary/10 hover:text-primary transition-colors"
            title="Group selected nodes"
          >
            <FolderPlus className="mr-1 h-3 w-3" />
            Group
          </Button>
        )}

        {/* Ungroup Actions */}
        {hasSelectedGroups && (
          <Button
            variant="outline"
            size="sm"
            onClick={onUngroupNodes}
            className="text-xs hover:bg-primary/10 hover:text-primary transition-colors"
            title="Ungroup selected groups"
          >
            <FolderOpen className="mr-1 h-3 w-3" />
            Ungroup
          </Button>
        )}

        {/* Divider */}
        <div className="w-px h-4 bg-border" />

        {/* Common Actions */}
        <Button
          variant="outline"
          size="sm"
          onClick={onDuplicateNodes}
          className="text-xs hover:bg-primary/10 hover:text-primary transition-colors"
          title="Duplicate selected items"
        >
          <Copy className="mr-1 h-3 w-3" />
          Duplicate
        </Button>

        {selectedNodeIds.length === 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenSettings}
            className="text-xs hover:bg-primary/10 hover:text-primary transition-colors"
            title="Open settings for selected item"
          >
            <Settings className="mr-1 h-3 w-3" />
            Settings
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={onDeleteNodes}
          className="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
          title="Delete selected items"
        >
          <Delete className="mr-1 h-3 w-3" />
          Delete
        </Button>
      </div>
    </div>
  );
}
