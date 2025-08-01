import { useState, useCallback, useEffect } from "react";
import { LayoutGrid, Settings, Play } from "lucide-react";
import { ControlButton, useReactFlow } from "@xyflow/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
// import { Slider } from "@/components/ui/slider"; // Not available, using input range
import { Button } from "@/components/ui/button";
import { useCanvasStore } from "@/lib/stores";
import {
  applyAutoLayout,
  AUTO_LAYOUT_ALGORITHMS,
  type LayoutDirection,
  type LayoutOptions,
} from "@/lib/utils/autoLayout";
import type { Node, Edge } from "@xyflow/react";

interface AutoLayoutControlsProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (nodes: Node[]) => void;
}

export default function AutoLayoutControls({
  nodes,
  edges,
  onNodesChange,
}: AutoLayoutControlsProps) {
  const { canvas, updateCanvasSettings } = useCanvasStore();
  const { fitView } = useReactFlow();
  const [showSettings, setShowSettings] = useState(false);
  const [isApplyingLayout, setIsApplyingLayout] = useState(false);

  // Get current settings from canvas or use defaults
  const currentSettings = canvas?.settings?.autoLayout || {
    algorithm: "TB" as LayoutDirection,
    enabled: false,
  };

  const [layoutOptions, setLayoutOptions] = useState<LayoutOptions>({
    direction: currentSettings.algorithm,
    nodeWidth: 320, // Match CanvasControls
    nodeHeight: 200, // Match CanvasControls
    rankSeparation: 150, // Match CanvasControls
    nodeSeparation: 100, // Match CanvasControls
    marginX: 50, // Match CanvasControls
    marginY: 50, // Match CanvasControls
  });

  // Auto-layout function with fitView (exactly like CanvasControls)
  const handleApplyLayout = useCallback(
    async (direction?: LayoutDirection) => {
      const layoutDirection = direction || layoutOptions.direction;

      if (nodes.length === 0) return;

      setIsApplyingLayout(true);

      const layoutedNodes = applyAutoLayout(nodes, edges, {
        ...layoutOptions,
        direction: layoutDirection,
      });

      onNodesChange(layoutedNodes);

      // Fit view to show all nodes (like CanvasControls)
      setTimeout(() => {
        fitView({ padding: 50, duration: 800 });
        setIsApplyingLayout(false);
      }, 100);

      // Update canvas settings
      updateCanvasSettings({
        autoLayout: {
          algorithm: layoutDirection,
          enabled: currentSettings.enabled,
        },
      });
    },
    [
      nodes,
      edges,
      onNodesChange,
      fitView,
      layoutOptions,
      currentSettings.enabled,
      updateCanvasSettings,
    ]
  );

  // Initialize settings from canvas when available (like CanvasControls)
  useEffect(() => {
    if (canvas?.settings?.autoLayout) {
      setLayoutOptions((prev) => ({
        ...prev,
        direction: canvas.settings?.autoLayout?.algorithm || "TB",
      }));
    }
  }, [canvas?.settings?.autoLayout]);

  // Auto-apply layout when nodes change and auto-layout is enabled (like CanvasControls)
  useEffect(() => {
    if (currentSettings.enabled && nodes.length > 0 && !isApplyingLayout) {
      const timeoutId = setTimeout(() => {
        handleApplyLayout();
      }, 500); // Debounce to avoid too frequent auto-layouts

      return () => clearTimeout(timeoutId);
    }
  }, [
    nodes.length,
    currentSettings.enabled,
    handleApplyLayout,
    isApplyingLayout,
  ]);

  const handleToggleAutoLayout = useCallback(
    (enabled: boolean) => {
      updateCanvasSettings({
        autoLayout: {
          algorithm: currentSettings.algorithm,
          enabled,
        },
      });

      // If enabling auto-layout, apply it immediately (like CanvasControls)
      if (enabled && nodes.length > 0) {
        handleApplyLayout();
      }
    },
    [
      currentSettings.algorithm,
      nodes.length,
      handleApplyLayout,
      updateCanvasSettings,
    ]
  );

  const handleSettingsChange = (key: keyof LayoutOptions, value: any) => {
    setLayoutOptions((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      {/* Quick Layout Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ControlButton title="Auto Layout">
            <LayoutGrid className="h-4 w-4" />
          </ControlButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Auto Layout</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="h-6 w-6 p-0"
            >
              <Settings className="h-3 w-3" />
            </Button>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Quick Apply Buttons */}
          {AUTO_LAYOUT_ALGORITHMS.map((direction) => (
            <DropdownMenuItem
              key={direction.value}
              onClick={() => handleApplyLayout(direction.value)}
              disabled={isApplyingLayout || nodes.length === 0}
              className="flex items-center justify-between"
            >
              <span>{direction.label}</span>
              {currentSettings.algorithm === direction.value && (
                <div className="w-2 h-2 bg-primary rounded-full" />
              )}
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          {/* Auto-Layout Toggle */}
          <div className="flex items-center justify-between px-2 py-1.5">
            <Label htmlFor="auto-layout-toggle" className="text-sm">
              Auto-apply
            </Label>
            <Switch
              id="auto-layout-toggle"
              checked={currentSettings.enabled}
              onCheckedChange={handleToggleAutoLayout}
            />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Advanced Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Auto-Layout Settings</DialogTitle>
            <DialogDescription>
              Configure the automatic layout algorithm for your canvas.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Direction Selection */}
            <div className="space-y-2">
              <Label>Layout Direction</Label>
              <Select
                value={layoutOptions.direction}
                onValueChange={(value) =>
                  handleSettingsChange("direction", value as LayoutDirection)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AUTO_LAYOUT_ALGORITHMS.map((direction) => (
                    <SelectItem key={direction.value} value={direction.value}>
                      {direction.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Node Dimensions */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Node Width: {layoutOptions.nodeWidth}px</Label>
                <input
                  type="range"
                  min={200}
                  max={500}
                  step={20}
                  value={layoutOptions.nodeWidth}
                  onChange={(e) =>
                    handleSettingsChange("nodeWidth", parseInt(e.target.value))
                  }
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label>Node Height: {layoutOptions.nodeHeight}px</Label>
                <input
                  type="range"
                  min={150}
                  max={300}
                  step={10}
                  value={layoutOptions.nodeHeight}
                  onChange={(e) =>
                    handleSettingsChange("nodeHeight", parseInt(e.target.value))
                  }
                  className="w-full"
                />
              </div>
            </div>

            {/* Spacing */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rank Separation: {layoutOptions.rankSeparation}px</Label>
                <input
                  type="range"
                  min={50}
                  max={200}
                  step={10}
                  value={layoutOptions.rankSeparation}
                  onChange={(e) =>
                    handleSettingsChange(
                      "rankSeparation",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label>Node Separation: {layoutOptions.nodeSeparation}px</Label>
                <input
                  type="range"
                  min={40}
                  max={150}
                  step={10}
                  value={layoutOptions.nodeSeparation}
                  onChange={(e) =>
                    handleSettingsChange(
                      "nodeSeparation",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full"
                />
              </div>
            </div>

            {/* Auto-Layout Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Auto-Layout</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically apply layout when nodes change
                </p>
              </div>
              <Switch
                checked={currentSettings.enabled}
                onCheckedChange={handleToggleAutoLayout}
              />
            </div>

            {/* Apply Button */}
            <Button
              onClick={() => handleApplyLayout()}
              disabled={isApplyingLayout || nodes.length === 0}
              className="w-full"
            >
              <Play className="h-4 w-4 mr-2" />
              {isApplyingLayout ? "Applying..." : "Apply Layout Now"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
