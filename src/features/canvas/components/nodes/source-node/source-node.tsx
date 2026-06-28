'use client';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { cn } from '@/shared/utils';
import type { SourceNodeData } from '@/features/canvas/utils/sourceResolver';
import { type NodeProps } from '@xyflow/react';
import { FourSideHandles } from '../FourSideHandles';
import {
  Database,
  FileSpreadsheet,
  GripVertical,
  PenLine,
  Settings2,
  Sparkles,
} from 'lucide-react';
import React, { memo, useState } from 'react';
import { SourceConfigSheet } from './source-config-sheet';

const originIconMap: Record<string, React.ReactNode> = {
  warehouse: <Database className="w-4 h-4" />,
  file: <FileSpreadsheet className="w-4 h-4" />,
  manual: <PenLine className="w-4 h-4" />,
  generate: <Sparkles className="w-4 h-4" />,
};

export const SourceNode = memo(({ id, data, selected }: NodeProps) => {
  const d = (data || {}) as SourceNodeData;
  const [showConfig, setShowConfig] = useState(false);

  // Origin label: new `config.origin`, else legacy `sourceType`, else unconfigured.
  const origin = d.config?.origin ?? d.sourceType ?? 'unconfigured';
  const series = Array.isArray(d.series) ? d.series : undefined;
  const hasLegacySample =
    !series && Array.isArray(d.sample) && d.sample.length > 0;

  return (
    <>
      <Card
        className={cn(
          'w-72 bg-white dark:bg-white-300 border-2 rounded-lg shadow-lg transition-all duration-200',
          selected && 'ring-2 ring-blue-500'
        )}
      >
        <FourSideHandles />
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            <span>{d.title || 'Data Source'}</span>
            <Badge variant="secondary" className="gap-1">
              {originIconMap[origin] ?? <Database className="w-4 h-4" />}
              <span className="capitalize">{origin}</span>
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {series && series.length > 0 ? (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground space-y-1">
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
                className="w-full nodrag"
                onClick={() => setShowConfig(true)}
              >
                <Settings2 className="w-3 h-3 mr-2" />
                Configure
              </Button>
            </div>
          ) : (
            <div className="h-24 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded gap-2">
              <span className="text-xs">
                {hasLegacySample ? 'Legacy source — reconfigure' : 'No data yet'}
              </span>
              <Button
                size="sm"
                className="nodrag"
                onClick={() => setShowConfig(true)}
              >
                <Settings2 className="w-3 h-3 mr-2" />
                Configure source
              </Button>
            </div>
          )}
        </CardContent>
        {/* Drag handle */}
        <div className="p-3 border-t border-border/30 bg-muted/20">
          <div className="flex justify-center cursor-grab active:cursor-grabbing">
            <div className="flex items-center gap-1 px-3 py-1.5 bg-muted/80 backdrop-blur-sm rounded-full text-xs text-muted-foreground hover:bg-muted/90 transition-colors border border-border/50 shadow-sm">
              <GripVertical className="w-3 h-3" />
              <span className="font-medium select-none">Drag</span>
              <GripVertical className="w-3 h-3" />
            </div>
          </div>
        </div>
      </Card>

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
