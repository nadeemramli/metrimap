import { Panel } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FolderPlus, FolderOpen, Copy, Delete, Settings } from "lucide-react";

interface SelectionPanelProps {
  selectedNodeIds: string[];
  selectedGroupIds: string[];
  onGroupNodes: () => void;
  onUngroupNodes: () => void;
  onDeleteNodes: () => void;
  onDuplicateNodes: () => void;
  onOpenSettings: () => void;
}

export default function SelectionPanel({
  selectedNodeIds,
  selectedGroupIds,
  onGroupNodes,
  onUngroupNodes,
  onDeleteNodes,
  onDuplicateNodes,
  onOpenSettings,
}: SelectionPanelProps) {
  const hasSelectedNodes = selectedNodeIds.length > 0;
  const hasSelectedGroups = selectedGroupIds.length > 0;
  const totalSelected = selectedNodeIds.length + selectedGroupIds.length;

  if (totalSelected === 0) return null;

  return (
    <Panel position="bottom-center" className="mb-4">
      <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-xl p-4 animate-in slide-in-from-bottom-2 duration-200">
        <div className="flex items-center justify-between gap-4">
          {/* Selection Info */}
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-sm font-medium">
              {totalSelected} selected
            </Badge>

            <div className="text-sm text-muted-foreground">
              {hasSelectedNodes && (
                <span>
                  {selectedNodeIds.length} node
                  {selectedNodeIds.length !== 1 ? "s" : ""}
                </span>
              )}
              {hasSelectedNodes && hasSelectedGroups && <span> • </span>}
              {hasSelectedGroups && (
                <span>
                  {selectedGroupIds.length} group
                  {selectedGroupIds.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Group Actions */}
            {hasSelectedNodes && selectedNodeIds.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onGroupNodes}
                className="hover:bg-primary/10 hover:text-primary transition-colors"
                title={`Group ${selectedNodeIds.length} selected nodes`}
              >
                <FolderPlus className="mr-2 h-4 w-4" />
                Group {selectedNodeIds.length} Nodes
              </Button>
            )}

            {/* Ungroup Actions */}
            {hasSelectedGroups && (
              <Button
                variant="outline"
                size="sm"
                onClick={onUngroupNodes}
                className="hover:bg-primary/10 hover:text-primary transition-colors"
                title={`Ungroup ${selectedGroupIds.length} selected groups`}
              >
                <FolderOpen className="mr-2 h-4 w-4" />
                Ungroup {selectedGroupIds.length} Groups
              </Button>
            )}

            {/* Divider */}
            {(hasSelectedNodes && selectedNodeIds.length > 1) ||
            hasSelectedGroups ? (
              <div className="w-px h-6 bg-border mx-2" />
            ) : null}

            {/* Common Actions */}
            <Button
              variant="outline"
              size="sm"
              onClick={onDuplicateNodes}
              className="hover:bg-primary/10 hover:text-primary transition-colors"
              title="Duplicate selected items"
            >
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </Button>

            {selectedNodeIds.length === 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenSettings}
                className="hover:bg-primary/10 hover:text-primary transition-colors"
                title="Open settings for selected item"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={onDeleteNodes}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
              title="Delete selected items"
            >
              <Delete className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Panel>
  );
}
