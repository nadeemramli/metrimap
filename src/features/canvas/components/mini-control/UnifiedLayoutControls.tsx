import { useCanvasStore } from '@/lib/stores';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Switch } from '@/shared/components/ui/switch';
import type { LayoutDirection, LayoutOptions } from '@/shared/utils/autoLayout';
import {
  applyAutoLayoutWithValidation,
  AUTO_LAYOUT_ALGORITHMS,
} from '@/shared/utils/autoLayout';
import { ControlButton, useReactFlow } from '@xyflow/react';
import { LayoutGrid, Play, Settings } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export default function UnifiedLayoutControls() {
  const { canvas, updateCanvasSettings } = useCanvasStore();
  const rf = useReactFlow<any>();
  const { fitView } = rf;
  const [showSettings, setShowSettings] = useState(false);
  const [isApplyingLayout, setIsApplyingLayout] = useState(false);

  const currentSettings =
    canvas?.settings?.autoLayout ||
    ({ algorithm: 'TB', enabled: false } as {
      algorithm: LayoutDirection;
      enabled: boolean;
    });

  const [layoutOptions, setLayoutOptions] = useState<LayoutOptions>({
    direction: currentSettings.algorithm,
    nodeWidth: 320,
    nodeHeight: 200,
    rankSeparation: 150,
    nodeSeparation: 100,
    marginX: 50,
    marginY: 50,
  });

  const handleApplyLayout = useCallback(
    async (direction?: LayoutDirection) => {
      const applyDir = direction || layoutOptions.direction;
      const nodes = rf?.getNodes?.() || [];
      const edges = rf?.getEdges?.() || [];

      console.log('🔄 UnifiedLayoutControls: Applying layout', {
        direction: applyDir,
        nodeCount: nodes.length,
        edgeCount: edges.length,
      });

      if (nodes.length === 0) {
        console.log('⚠️ UnifiedLayoutControls: No nodes to layout');
        return;
      }

      setIsApplyingLayout(true);

      try {
        const { nodes: layoutedNodes, validation } =
          applyAutoLayoutWithValidation(nodes, edges, {
            ...layoutOptions,
            direction: applyDir,
          });

        // Check validation results
        if (!validation.isValid) {
          console.warn(
            '⚠️ UnifiedLayoutControls: Layout validation issues:',
            validation.issues
          );
        }

        rf?.setNodes?.(layoutedNodes as any);

        setTimeout(() => {
          fitView({ padding: 50, duration: 800 });
          setIsApplyingLayout(false);
        }, 100);

        updateCanvasSettings({
          autoLayout: { algorithm: applyDir, enabled: currentSettings.enabled },
        });

        console.log('✅ UnifiedLayoutControls: Layout applied successfully');
      } catch (error) {
        console.error(
          '❌ UnifiedLayoutControls: Error applying layout:',
          error
        );
        setIsApplyingLayout(false);
      }
    },
    [rf, fitView, layoutOptions, currentSettings.enabled, updateCanvasSettings]
  );

  useEffect(() => {
    if (canvas?.settings?.autoLayout) {
      setLayoutOptions((prev) => ({
        ...prev,
        direction: canvas?.settings?.autoLayout?.algorithm || 'TB',
      }));
    }
  }, [canvas?.settings?.autoLayout]);

  const handleToggleAuto = useCallback(
    (enabled: boolean) => {
      updateCanvasSettings({
        autoLayout: { algorithm: currentSettings.algorithm, enabled },
      });
      const nodes = rf?.getNodes?.() || [];
      if (enabled && nodes.length > 0) handleApplyLayout();
    },
    [currentSettings.algorithm, handleApplyLayout, updateCanvasSettings, rf]
  );

  useEffect(() => {
    const open = () => setShowSettings(true);
    window.addEventListener('openUnifiedLayout', open);
    return () => window.removeEventListener('openUnifiedLayout', open);
  }, []);

  return (
    <>
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
          {AUTO_LAYOUT_ALGORITHMS.map((direction) => (
            <DropdownMenuItem
              key={direction.value}
              onClick={() => handleApplyLayout(direction.value)}
              disabled={isApplyingLayout || rf?.getNodes?.().length === 0}
              className="flex items-center justify-between"
            >
              <span>{direction.label}</span>
              {currentSettings.algorithm === direction.value && (
                <div className="w-2 h-2 bg-primary rounded-full" />
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <div className="flex items-center justify-between px-2 py-1.5">
            <Label htmlFor="auto-layout-toggle" className="text-sm">
              Auto-apply
            </Label>
            <Switch
              id="auto-layout-toggle"
              checked={currentSettings.enabled}
              onCheckedChange={handleToggleAuto}
            />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Auto-Layout Settings</DialogTitle>
            <DialogDescription>
              Configure the automatic layout algorithm for your canvas.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Layout Direction</Label>
              <Select
                value={layoutOptions.direction}
                onValueChange={(val) =>
                  setLayoutOptions((p) => ({
                    ...p,
                    direction: val as LayoutDirection,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AUTO_LAYOUT_ALGORITHMS.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
                    setLayoutOptions((p) => ({
                      ...p,
                      rankSeparation: parseInt(e.target.value),
                    }))
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
                    setLayoutOptions((p) => ({
                      ...p,
                      nodeSeparation: parseInt(e.target.value),
                    }))
                  }
                  className="w-full"
                />
              </div>
            </div>

            <Button
              onClick={() => handleApplyLayout()}
              disabled={isApplyingLayout || rf?.getNodes?.().length === 0}
              className="w-full"
            >
              <Play className="h-4 w-4 mr-2" />
              {isApplyingLayout ? 'Applying...' : 'Apply Layout Now'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
