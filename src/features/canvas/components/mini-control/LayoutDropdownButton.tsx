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
import type { LayoutDirection, LayoutOptions } from '@/shared/utils/autoLayout';
import {
  applyAutoLayout,
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
      console.log('🔄 LayoutDropdownButton: Applying layout with options:', {
        ...options,
        direction,
      });

      try {
        // Apply the auto-layout algorithm
        const layoutedNodes = applyAutoLayout(nodes, edges, {
          ...options,
          direction,
        });
        console.log(
          '🔄 LayoutDropdownButton: Layout result:',
          layoutedNodes.length,
          'nodes'
        );

        // Update the underlying data sources with new positions
        for (const layoutedNode of layoutedNodes) {
          const newPosition = layoutedNode.position;
          console.log(
            `🔄 Updating node ${layoutedNode.id} (type: ${layoutedNode.type}) to position:`,
            newPosition
          );

          if (layoutedNode.type === 'metricCard') {
            // Update canvas store for MetricCard nodes
            console.log(`📝 Updating MetricCard node ${layoutedNode.id}`);
            await updateNodePosition(layoutedNode.id, newPosition);
          } else if (layoutedNode.type === 'evidenceNode') {
            // Update evidence store for Evidence nodes
            console.log(`📄 Updating Evidence node ${layoutedNode.id}`);
            updateEvidencePosition(layoutedNode.id, newPosition);
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
            await updateCanvasNodePosition(layoutedNode.id, newPosition);
          } else {
            // Temporary extra nodes - these will be handled by ReactFlow state only
            console.log(
              `⚠️ Skipping temporary node ${layoutedNode.id} (type: ${layoutedNode.type}) - not persisted`
            );
          }
        }

        console.log('✅ LayoutDropdownButton: All node positions updated');

        // Update canvas settings
        updateCanvasSettings({
          autoLayout: {
            algorithm: direction,
            enabled: currentSettings.enabled,
          },
        });

        // Fit the view to show all nodes
        setTimeout(() => {
          rf?.fitView?.({ padding: 50, duration: 800 });
          setIsApplying(false);
          console.log('✅ LayoutDropdownButton: Layout complete');
        }, 100);
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="rounded-lg" title="Layout">
          <LayoutGrid className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>Auto Layout</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {AUTO_LAYOUT_ALGORITHMS.map((direction) => (
          <DropdownMenuItem
            key={direction.value}
            onClick={() => handleApply(direction.value)}
            disabled={isApplying || (rf?.getNodes?.() || []).length === 0}
            className="flex items-center justify-between"
          >
            <span>{direction.label}</span>
            {currentSettings.algorithm === direction.value && (
              <div className="w-2 h-2 bg-primary rounded-full" />
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => window.dispatchEvent(new Event('openUnifiedLayout'))}
        >
          <Settings className="h-4 w-4 mr-2" /> More settings
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
