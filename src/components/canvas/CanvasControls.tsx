import { useState, useCallback } from "react";
import { addDays, format } from "date-fns";
import dagre from "dagre";
import {
  Calendar,
  CalendarDays,
  LayoutGrid,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Filter,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useReactFlow, Node, Edge } from "@xyflow/react";
import { useCanvasStore } from "@/lib/stores";
import type { MetricCard } from "@/lib/types";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface CanvasControlsProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (nodes: Node[]) => void;
}

const AUTO_LAYOUT_ALGORITHMS = [
  { value: "TB", label: "Top to Bottom" },
  { value: "BT", label: "Bottom to Top" },
  { value: "LR", label: "Left to Right" },
  { value: "RL", label: "Right to Left" },
];

const ZOOM_LEVELS = [
  { value: "0.25", label: "25%" },
  { value: "0.5", label: "50%" },
  { value: "0.75", label: "75%" },
  { value: "1", label: "100%" },
  { value: "1.25", label: "125%" },
  { value: "1.5", label: "150%" },
  { value: "2", label: "200%" },
];

export default function CanvasControls({
  nodes,
  edges,
  onNodesChange,
}: CanvasControlsProps) {
  const { zoomIn, zoomOut, zoomTo, fitView, getZoom, setCenter } =
    useReactFlow();

  const { canvas, updateCanvasSettings } = useCanvasStore();

  // Date range state
  const [dateRange, setDateRange] = useState<DateRange>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Layout state
  const [layoutDirection, setLayoutDirection] = useState<string>("TB");
  const [isApplyingLayout, setIsApplyingLayout] = useState(false);

  // Auto-layout function using Dagre
  const applyAutoLayout = useCallback(
    async (direction: string = layoutDirection) => {
      if (!nodes.length) return;

      setIsApplyingLayout(true);

      // Create dagre graph
      const dagreGraph = new dagre.graphlib.Graph();
      dagreGraph.setDefaultEdgeLabel(() => ({}));
      dagreGraph.setGraph({
        rankdir: direction,
        nodesep: 100,
        ranksep: 150,
        marginx: 50,
        marginy: 50,
      });

      // Add nodes to dagre graph
      nodes.forEach((node) => {
        dagreGraph.setNode(node.id, {
          width: 320, // MetricCard width
          height: 200, // MetricCard height
        });
      });

      // Add edges to dagre graph
      edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
      });

      // Calculate layout
      dagre.layout(dagreGraph);

      // Update node positions
      const updatedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
          ...node,
          position: {
            x: nodeWithPosition.x - nodeWithPosition.width / 2,
            y: nodeWithPosition.y - nodeWithPosition.height / 2,
          },
        };
      });

      onNodesChange(updatedNodes);

      // Fit view to show all nodes
      setTimeout(() => {
        fitView({ padding: 50, duration: 800 });
        setIsApplyingLayout(false);
      }, 100);
    },
    [nodes, edges, onNodesChange, fitView, layoutDirection]
  );

  // Date range formatting
  const formatDateRange = () => {
    if (!dateRange?.from) return "Select date range";
    if (dateRange.from && !dateRange.to) {
      return format(dateRange.from, "MMM dd, yyyy");
    }
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd, yyyy")}`;
    }
    return "Select date range";
  };

  // Quick date range presets
  const applyDatePreset = (days: number) => {
    const to = new Date();
    const from = addDays(to, -days);
    setDateRange({ from, to });
    setIsDatePickerOpen(false);

    // Update canvas settings with new date range
    updateCanvasSettings({
      dateRange: { from: from.toISOString(), to: to.toISOString() },
    });
  };

  const handleZoomLevelChange = (value: string) => {
    const zoomLevel = parseFloat(value);
    zoomTo(zoomLevel, { duration: 300 });
  };

  const resetCanvas = () => {
    fitView({ padding: 50, duration: 800 });
    setCenter(0, 0, { zoom: 1, duration: 800 });
  };

  return (
    <div className="absolute top-4 left-4 right-4 z-10 pointer-events-none">
      <div className="flex items-center justify-between">
        {/* Left Controls - Date Range & Filters */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-2 shadow-lg">
            <div className="flex items-center gap-2">
              {/* Date Range Picker */}
              <Popover
                open={isDatePickerOpen}
                onOpenChange={setIsDatePickerOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "justify-start text-left font-normal min-w-[200px]",
                      !dateRange?.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {formatDateRange()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-3 space-y-3">
                    {/* Quick presets */}
                    <div className="flex flex-wrap gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => applyDatePreset(7)}
                        className="text-xs"
                      >
                        7d
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => applyDatePreset(30)}
                        className="text-xs"
                      >
                        30d
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => applyDatePreset(90)}
                        className="text-xs"
                      >
                        90d
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => applyDatePreset(365)}
                        className="text-xs"
                      >
                        1y
                      </Button>
                    </div>

                    <Separator />

                    {/* Calendar */}
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={(range) => {
                        setDateRange(
                          range || { from: undefined, to: undefined }
                        );
                        if (range?.from && range?.to) {
                          setIsDatePickerOpen(false);
                          updateCanvasSettings({
                            dateRange: {
                              from: range.from.toISOString(),
                              to: range.to.toISOString(),
                            },
                          });
                        }
                      }}
                      numberOfMonths={1}
                    />
                  </div>
                </PopoverContent>
              </Popover>

              {/* Active Filters Badge */}
              {(dateRange?.from || dateRange?.to) && (
                <Badge variant="secondary" className="text-xs">
                  <Filter className="mr-1 h-3 w-3" />
                  Filtered
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Right Controls - Layout & Zoom */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Layout Controls */}
          <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-2 shadow-lg">
            <div className="flex items-center gap-2">
              <Select
                value={layoutDirection}
                onValueChange={setLayoutDirection}
              >
                <SelectTrigger className="h-8 w-[140px] text-xs">
                  <LayoutGrid className="mr-1 h-3 w-3" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AUTO_LAYOUT_ALGORITHMS.map((algorithm) => (
                    <SelectItem key={algorithm.value} value={algorithm.value}>
                      {algorithm.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => applyAutoLayout()}
                disabled={isApplyingLayout || nodes.length === 0}
                className="text-xs"
              >
                {isApplyingLayout ? "Applying..." : "Auto Layout"}
              </Button>
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-2 shadow-lg">
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => zoomOut({ duration: 300 })}
                className="h-8 w-8 p-0"
              >
                <ZoomOut className="h-3 w-3" />
              </Button>

              <Select onValueChange={handleZoomLevelChange}>
                <SelectTrigger className="h-8 w-[70px] text-xs">
                  <SelectValue
                    placeholder={`${Math.round(getZoom() * 100)}%`}
                  />
                </SelectTrigger>
                <SelectContent>
                  {ZOOM_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => zoomIn({ duration: 300 })}
                className="h-8 w-8 p-0"
              >
                <ZoomIn className="h-3 w-3" />
              </Button>

              <Separator orientation="vertical" className="h-4 mx-1" />

              <Button
                variant="outline"
                size="sm"
                onClick={() => fitView({ padding: 50, duration: 800 })}
                className="h-8 w-8 p-0"
                title="Fit to view"
              >
                <Maximize2 className="h-3 w-3" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={resetCanvas}
                className="h-8 w-8 p-0"
                title="Reset canvas"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
