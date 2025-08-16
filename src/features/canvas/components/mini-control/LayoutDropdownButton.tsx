import { useCanvasNodesStore } from '@/features/canvas/stores/useCanvasNodesStore';
import { useEvidenceStore } from '@/features/evidence/stores/useEvidenceStore';
import { useCanvasStore } from '@/lib/stores';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { cn } from '@/shared/utils';
import type { LayoutDirection, LayoutOptions } from '@/shared/utils/autoLayout';
import {
  applyAutoLayoutWithValidation,
  AUTO_LAYOUT_ALGORITHMS,
} from '@/shared/utils/autoLayout';
import { useReactFlow } from '@xyflow/react';
import { LayoutGrid, Settings } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function LayoutDropdownButton() {
  const { canvas, updateCanvasSettings, updateNodePosition } = useCanvasStore();
  const { evidenceList, updateEvidencePosition } = useEvidenceStore();
  const { updateNodePosition: updateCanvasNodePosition } =
    useCanvasNodesStore();
  const rf = useReactFlow<any>();
  const [isApplying, setIsApplying] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const currentSettings = useMemo(
    () =>
      (canvas?.settings?.autoLayout || {
        algorithm: 'TB',
        enabled: false,
      }) as { algorithm: LayoutDirection; enabled: boolean },
    [canvas?.settings?.autoLayout]
  );

  const [options, setOptions] = useState<LayoutOptions>({
    direction: currentSettings.algorithm,
    nodeWidth: 320,
    nodeHeight: 200,
    rankSeparation: 150,
    nodeSeparation: 100,
    marginX: 50,
    marginY: 50,
  });

  useEffect(() => {
    setOptions((p) => ({ ...p, direction: currentSettings.algorithm }));
  }, [currentSettings.algorithm]);

  const handleApply = useCallback(
    async (dir?: LayoutDirection) => {
      console.log(
        '🔄 LayoutDropdownButton: handleApply called with direction:',
        dir
      );
      const direction = dir || options.direction;
      const nodes = rf?.getNodes?.() || [];
      const edges = rf?.getEdges?.() || [];
      console.log(
        '🔄 LayoutDropdownButton: Found nodes:',
        nodes.length,
        'edges:',
        edges.length
      );

      if (nodes.length === 0) {
        console.log('⚠️ LayoutDropdownButton: No nodes to layout');
        return;
      }

      setIsApplying(true);
      setIsOpen(false); // Close dropdown after selection
      console.log('🔄 LayoutDropdownButton: Applying layout with options:', {
        ...options,
        direction,
      });

      try {
        const prevViewport = (rf as any)?.getViewport?.();

        // Apply the enhanced auto-layout algorithm with validation
        const { nodes: layoutedNodes, validation } =
          applyAutoLayoutWithValidation(nodes, edges, {
            ...options,
            direction,
          });

        // Check validation results
        if (!validation.isValid) {
          console.warn(
            '⚠️ LayoutDropdownButton: Layout validation issues:',
            validation.issues
          );
          // Continue anyway, but log the issues
        }

        console.log(
          '🔄 LayoutDropdownButton: Layout result:',
          layoutedNodes.length,
          'nodes'
        );

        // Update ReactFlow state first for immediate visual feedback
        rf?.setNodes?.(layoutedNodes as any);

        // Update the underlying data sources with new positions
        const updatePromises: Promise<void>[] = [];

        for (const layoutedNode of layoutedNodes) {
          const newPosition = layoutedNode.position;
          console.log(
            `🔄 Updating node ${layoutedNode.id} (type: ${layoutedNode.type}) to position:`,
            newPosition
          );

          try {
            if (layoutedNode.type === 'metricCard') {
              // Update canvas store for MetricCard nodes
              console.log(`📝 Updating MetricCard node ${layoutedNode.id}`);
              updatePromises.push(
                updateNodePosition(layoutedNode.id, newPosition)
              );
            } else if (layoutedNode.type === 'evidenceNode') {
              // Update evidence store for Evidence nodes
              console.log(`📄 Updating Evidence node ${layoutedNode.id}`);
              const evidenceItem = evidenceList.find(
                (e) => e.id === layoutedNode.id
              );
              if (evidenceItem) {
                updatePromises.push(
                  updateEvidencePosition(evidenceItem.id, newPosition)
                );
              } else {
                console.warn(
                  `⚠️ Evidence item not found for node ${layoutedNode.id}`
                );
              }
            } else if (
              [
                'commentNode',
                'sourceNode',
                'chartNode',
                'operatorNode',
                'whiteboardNode',
              ].includes(layoutedNode.type)
            ) {
              // Update canvas nodes store for persisted extra nodes
              console.log(
                `🎨 Updating Canvas node ${layoutedNode.id} (type: ${layoutedNode.type})`
              );
              updatePromises.push(
                updateCanvasNodePosition(layoutedNode.id, newPosition)
              );
            } else {
              // Temporary extra nodes - these will be handled by ReactFlow state only
              console.log(
                `⚠️ Skipping temporary node ${layoutedNode.id} (type: ${layoutedNode.type}) - not persisted`
              );
            }
          } catch (error) {
            console.error(
              `❌ Error preparing update for node ${layoutedNode.id}:`,
              error
            );
          }
        }

        // Execute all updates in parallel for better performance
        console.log(
          `🔄 LayoutDropdownButton: Executing ${updatePromises.length} position updates...`
        );
        try {
          await Promise.all(updatePromises);
          console.log(
            '✅ LayoutDropdownButton: All node positions updated successfully'
          );
        } catch (error) {
          console.error(
            '❌ LayoutDropdownButton: Error updating some node positions:',
            error
          );
          // Continue anyway - ReactFlow state is already updated
        }

        // Update canvas settings - enable layout when applying
        updateCanvasSettings({
          autoLayout: {
            algorithm: direction,
            enabled: true, // Always enable when applying a layout
          },
        });

        console.log('✅ LayoutDropdownButton: Layout applied successfully', {
          direction,
          nodesUpdated: layoutedNodes.length,
        });

        // Preserve current viewport (avoid auto zooming)
        setTimeout(() => {
          if (prevViewport) {
            (rf as any)?.setViewport?.(prevViewport, { duration: 0 });
          }
          setIsApplying(false);
          console.log(
            '✅ LayoutDropdownButton: Layout complete (viewport preserved)'
          );
        }, 50);
      } catch (error) {
        console.error('❌ LayoutDropdownButton: Error applying layout:', error);
        setIsApplying(false);
      }
    },
    [
      rf,
      options,
      currentSettings.enabled,
      updateCanvasSettings,
      updateNodePosition,
      updateEvidencePosition,
      updateCanvasNodePosition,
    ]
  );

  // Check if any layout is currently active
  const hasActiveLayout = currentSettings.algorithm && currentSettings.enabled;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'rounded-lg transition-colors',
            hasActiveLayout
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'hover:bg-accent hover:text-accent-foreground'
          )}
          title="Layout"
        >
          <LayoutGrid className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>Auto Layout</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {AUTO_LAYOUT_ALGORITHMS.map((direction) => {
          const isActive = currentSettings.algorithm === direction.value;
          return (
            <DropdownMenuItem
              key={direction.value}
              onClick={() => handleApply(direction.value)}
              disabled={isApplying || (rf?.getNodes?.() || []).length === 0}
              className={cn(
                'flex items-center justify-between cursor-pointer',
                isActive && 'bg-accent text-accent-foreground'
              )}
            >
              <span>{direction.label}</span>
              {isActive && <div className="w-2 h-2 bg-primary rounded-full" />}
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            window.dispatchEvent(new Event('openUnifiedLayout'));
            setIsOpen(false);
          }}
          className="cursor-pointer"
        >
          <Settings className="h-4 w-4 mr-2" /> More settings
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
