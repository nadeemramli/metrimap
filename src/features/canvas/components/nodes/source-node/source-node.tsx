'use client';

import { Button } from '@/shared/components/ui/button';
import {
  EmptyState,
  NodeCardShell,
} from '@/features/canvas/components/primitives';
import type { SourceNodeData } from '@/features/canvas/utils/sourceResolver';
import { displayNodeTitle } from '@/features/canvas/utils/nodeTitle';
import { type NodeProps } from '@xyflow/react';
import { FourSideHandles } from '../FourSideHandles';
import {
  AlertTriangle,
  Database,
  FileSpreadsheet,
  GripVertical,
  PenLine,
  Settings2,
  Sparkles,
} from 'lucide-react';
import { memo, useCallback } from 'react';
import { useOpenConfigOnDoubleClick } from '@/features/canvas/hooks/useOpenConfigOnDoubleClick';
import { useCanvasPanelStore } from '@/features/canvas/stores/useCanvasPanelStore';
import { SourceConfigSheet } from './source-config-sheet';

const ORIGIN_ICON: Record<string, React.ElementType> = {
  warehouse: Database,
  file: FileSpreadsheet,
  manual: PenLine,
  generate: Sparkles,
};

// Source keeps a decorative (unclassed) drag pill — the whole card drags.
const DragPill = () => (
  <div className="flex cursor-grab justify-center active:cursor-grabbing">
    <div className="flex items-center gap-1 rounded-full border border-border/50 bg-muted/80 px-3 py-1.5 text-xs text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-muted/90">
      <GripVertical className="h-3 w-3" />
      <span className="select-none font-medium">Drag</span>
      <GripVertical className="h-3 w-3" />
    </div>
  </div>
);

export const SourceNode = memo(({ id, data, selected }: NodeProps) => {
  const d = (data || {}) as SourceNodeData;
  // Open state lives in the shared panel store so the config panel is
  // mutually exclusive with every other right-dock panel.
  const showConfig = useCanvasPanelStore(
    (s) => s.rightPanel?.kind === 'sourceConfig' && s.rightPanel.nodeId === id
  );
  const setShowConfig = useCallback(
    (open: boolean) => {
      const s = useCanvasPanelStore.getState();
      if (open) s.openRight({ kind: 'sourceConfig', nodeId: id });
      else if (
        s.rightPanel?.kind === 'sourceConfig' &&
        s.rightPanel.nodeId === id
      )
        s.closeRight();
    },
    [id]
  );
  useOpenConfigOnDoubleClick(id, () => setShowConfig(true));

  // Origin label: new `config.origin`, else legacy `sourceType`, else unconfigured.
  const origin = d.config?.origin ?? d.sourceType ?? 'unconfigured';
  const series = Array.isArray(d.series) ? d.series : undefined;
  const hasLegacySample =
    !series && Array.isArray(d.sample) && d.sample.length > 0;

  return (
    <>
      <NodeCardShell
        icon={ORIGIN_ICON[origin] ?? Database}
        title={displayNodeTitle(d.title, 'Data Source')}
        typeLabel={<span className="capitalize">{origin}</span>}
        width={288}
        selected={!!selected}
        handles={<FourSideHandles />}
        dragHandle={<DragPill />}
      >
        {d.stale && (
          <div
            className="flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300"
            title={d.lastError || 'Source connection unavailable'}
          >
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              Disconnected — showing last value
              {d.refreshedAt
                ? ` (${new Date(d.refreshedAt).toLocaleDateString()})`
                : ''}
            </span>
          </div>
        )}

        {series && series.length > 0 ? (
          <>
            <div className="space-y-1 text-xs text-muted-foreground">
              {series.slice(-3).map((p, idx) => (
                <div key={idx} className="flex justify-between">
                  <span className="font-mono">{p.period}</span>
                  <span className="font-semibold text-foreground">
                    {p.value}
                  </span>
                </div>
              ))}
              <div className="text-[10px] text-muted-foreground/70">
                {series.length} points
                {d.refreshedAt
                  ? ` · ${new Date(d.refreshedAt).toLocaleDateString()}`
                  : ''}
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="nodrag w-full"
              onClick={() => setShowConfig(true)}
            >
              <Settings2 className="mr-2 h-3 w-3" />
              Configure
            </Button>
          </>
        ) : (
          <EmptyState
            compact
            title={hasLegacySample ? 'Legacy source — reconfigure' : 'No data yet'}
            action={
              <Button
                size="sm"
                className="nodrag"
                onClick={() => setShowConfig(true)}
              >
                <Settings2 className="mr-2 h-3 w-3" />
                Configure source
              </Button>
            }
          />
        )}
      </NodeCardShell>

      <SourceConfigSheet
        open={showConfig}
        onOpenChange={setShowConfig}
        nodeId={id}
        data={d}
      />
    </>
  );
});

SourceNode.displayName = 'SourceNode';

export default SourceNode;
