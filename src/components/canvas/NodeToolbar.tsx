import { useCallback, useState } from "react";
import {
  Copy,
  Settings,
  Trash2,
  Minimize2,
  Link,
  Eye,
  EyeOff,
  MoreHorizontal,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCanvasStore } from "@/lib/stores";
import { DimensionSliceModal } from "./index";

interface NodeToolbarProps {
  nodeId: string;
  position: { x: number; y: number };
  isVisible: boolean;
  onOpenSettings: (cardId: string) => void;
}

export default function NodeToolbar({
  nodeId,
  position,
  isVisible,
  onOpenSettings,
}: NodeToolbarProps) {
  const [isDimensionSliceOpen, setIsDimensionSliceOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    getNodeById,
    duplicateNode,
    persistNodeDelete,
    getConnectedNodes,
    selectedNodeIds,
    selectNode,
    deselectNodes,
    sliceMetricByDimensions,
  } = useCanvasStore();

  const node = getNodeById(nodeId);
  const connectedNodes = getConnectedNodes(nodeId);
  const isSelected = selectedNodeIds.includes(nodeId);

  const handleCopy = useCallback(() => {
    duplicateNode(nodeId);
  }, [nodeId, duplicateNode]);

  const handleDeleteClick = useCallback(() => {
    setIsDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    try {
      await persistNodeDelete(nodeId);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete node:", error);
      // Keep dialog open on error so user can try again
    }
  }, [nodeId, persistNodeDelete]);

  const handleSettings = useCallback(() => {
    onOpenSettings(nodeId);
  }, [nodeId, onOpenSettings]);

  const handleToggleSelect = useCallback(() => {
    if (isSelected) {
      deselectNodes();
    } else {
      selectNode(nodeId);
    }
  }, [isSelected, nodeId, selectNode, deselectNodes]);

  const handleCollapseExpand = useCallback(() => {
    // TODO: Implement collapse/expand functionality
    console.log("Toggle collapse for node:", nodeId);
  }, [nodeId]);

  const handleCreateRelationship = useCallback(() => {
    // TODO: Implement relationship creation mode
    console.log("Create relationship from node:", nodeId);
  }, [nodeId]);

  const handleViewDetails = useCallback(() => {
    // TODO: Implement quick view details
    console.log("View details for node:", nodeId);
  }, [nodeId]);

  const handleDimensionSlice = useCallback(() => {
    setIsDimensionSliceOpen(true);
  }, []);

  const handleSlice = useCallback(
    async (
      dimensions: string[],
      historyOption: "manual" | "proportional" | "forfeit",
      percentages?: number[]
    ) => {
      try {
        const newCardIds = await sliceMetricByDimensions(
          nodeId,
          dimensions,
          historyOption,
          percentages
        );
        console.log("Created dimension cards:", newCardIds);
        setIsDimensionSliceOpen(false);
      } catch (error) {
        console.error("Error slicing metric:", error);
        // You might want to show this error to the user
        alert(
          error instanceof Error
            ? error.message
            : "An error occurred while slicing the metric"
        );
      }
    },
    [nodeId, sliceMetricByDimensions]
  );

  if (!node || !isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        "absolute z-50 pointer-events-auto transition-all duration-200",
        "bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-lg",
        "flex items-center gap-1 p-1",
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}
      style={{
        left: position.x,
        top: position.y - 50, // Position above the node
        transform: "translateX(-50%)", // Center horizontally
      }}
    >
      {/* Node Info Badge */}
      <Badge variant="secondary" className="text-xs font-normal mr-2">
        {node.category.split("/")[0]}
        {connectedNodes.length > 0 && (
          <span className="ml-1 text-muted-foreground">
            • {connectedNodes.length} linked
          </span>
        )}
      </Badge>

      {/* Quick Actions */}
      <div className="flex items-center gap-1">
        {/* Settings */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSettings}
          className="h-8 w-8 p-0"
          title="Settings"
        >
          <Settings className="h-3 w-3" />
        </Button>

        {/* Copy */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 w-8 p-0"
          title="Duplicate"
        >
          <Copy className="h-3 w-3" />
        </Button>

        {/* Create Relationship */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCreateRelationship}
          className="h-8 w-8 p-0"
          title="Create Relationship"
        >
          <Link className="h-3 w-3" />
        </Button>

        {/* Toggle Selection */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleSelect}
          className={cn(
            "h-8 w-8 p-0",
            isSelected && "bg-accent text-accent-foreground"
          )}
          title={isSelected ? "Deselect" : "Select"}
        >
          {isSelected ? (
            <EyeOff className="h-3 w-3" />
          ) : (
            <Eye className="h-3 w-3" />
          )}
        </Button>

        {/* More Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="More actions"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            <DropdownMenuItem onClick={handleViewDetails}>
              <Eye className="mr-2 h-3 w-3" />
              Quick View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCollapseExpand}>
              <Minimize2 className="mr-2 h-3 w-3" />
              Collapse/Expand
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleCreateRelationship}>
              <Link className="mr-2 h-3 w-3" />
              Create Relationship
            </DropdownMenuItem>
            {node.category === "Data/Metric" && (
              <DropdownMenuItem onClick={handleDimensionSlice}>
                <Layers className="mr-2 h-3 w-3" />
                Slice by Dimension
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleCopy}>
              <Copy className="mr-2 h-3 w-3" />
              Duplicate Card
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDeleteClick}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-3 w-3" />
              Delete Card
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Dimension Slice Modal */}
      {node.category === "Data/Metric" && (
        <DimensionSliceModal
          isOpen={isDimensionSliceOpen}
          onClose={() => setIsDimensionSliceOpen(false)}
          parentCard={node}
          onSlice={handleSlice}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Card</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this card? This action cannot be
              undone. All relationships connected to this card will also be
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Card
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
