import { useCallback, useState } from "react";
import { Minimize2, Link, Eye, MoreHorizontal, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCanvasStore } from "@/lib/stores";
import { DimensionSliceModal } from "./index";

interface NodeToolbarProps {
  nodeId: string;
  position: { x: number; y: number };
  isVisible: boolean;
}

export default function NodeToolbar({
  nodeId,
  position,
  isVisible,
}: NodeToolbarProps) {
  const [isDimensionSliceOpen, setIsDimensionSliceOpen] = useState(false);

  const { getNodeById, getConnectedNodes, sliceMetricByDimensions } =
    useCanvasStore();

  const node = getNodeById(nodeId);
  const connectedNodes = getConnectedNodes(nodeId);

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
        left: position.x + 160, // Center of MetricCard (width: 320px)
        top: position.y - 60, // Position above the node with more clearance
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
        {/* Quick View */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleViewDetails}
          className="h-8 w-8 p-0"
          title="Quick View"
        >
          <Eye className="h-3 w-3" />
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
            <DropdownMenuItem onClick={handleCollapseExpand}>
              <Minimize2 className="mr-2 h-3 w-3" />
              Collapse/Expand
            </DropdownMenuItem>
            {node.category === "Data/Metric" && (
              <DropdownMenuItem onClick={handleDimensionSlice}>
                <Layers className="mr-2 h-3 w-3" />
                Slice by Dimension
              </DropdownMenuItem>
            )}
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
    </div>
  );
}
