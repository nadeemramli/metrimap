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
import { Handle, Position, type NodeProps } from '@xyflow/react';
import {
  Database,
  FileSpreadsheet,
  Globe,
  GripVertical,
  TestTube,
} from 'lucide-react';
import React, { memo, useState } from 'react';
import DataTransformationNode from './data-transformation-node';

type SourceTypeLocal = 'warehouse' | 'csv' | 'sheets' | 'random';

type SourceNodeData = {
  title: string;
  sourceType: SourceTypeLocal;
  sample?: any[];
};

const sourceIconMap: Record<SourceTypeLocal, React.ReactNode> = {
  warehouse: <Database className="w-4 h-4" />,
  csv: <FileSpreadsheet className="w-4 h-4" />,
  sheets: <Globe className="w-4 h-4" />,
  random: <TestTube className="w-4 h-4" />,
};

export const SourceNode = memo(({ data, selected }: NodeProps) => {
  const { title, sourceType, sample } = (data || {}) as SourceNodeData;
  const [showPipeline, setShowPipeline] = useState(false);

  return (
    <>
      <Card
        className={cn(
          showPipeline ? 'w-[980px]' : 'w-72',
          'bg-white dark:bg-white-300 border-2 rounded-lg shadow-lg transition-all duration-200',
          selected && 'ring-2 ring-blue-500'
        )}
      >
        <Handle type="source" position={Position.Right} />
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            <span>{title || 'Data Source'}</span>
            <Badge variant="secondary" className="gap-1">
              {sourceIconMap[(sourceType || 'random') as SourceTypeLocal]}
              <span className="capitalize">{sourceType || 'random'}</span>
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className={cn(showPipeline ? 'p-2' : undefined)}>
          {showPipeline ? (
            <div className="nodrag">
              <DataTransformationNode
                nodeName={title || 'source_pipeline'}
                onDataTransform={(rows: any[]) => {
                  (data as any).sample = rows;
                }}
              />
              <div className="mt-2 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPipeline(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          ) : Array.isArray(sample) && sample.length > 0 ? (
            <div className="text-xs text-gray-600 space-y-1">
              <div className="font-medium">Preview</div>
              {sample.slice(0, 3).map((row, idx) => (
                <div key={idx} className="truncate">
                  {Object.entries(row)
                    .slice(0, 2)
                    .map(([k, v]) => (
                      <span key={k} className="mr-2">
                        {k}: {String(v)}
                      </span>
                    ))}
                </div>
              ))}
              <div className="text-[10px] text-gray-400">
                {sample.length} rows
              </div>
            </div>
          ) : (
            <div className="h-20 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-200 rounded gap-2">
              <span className="text-xs">No data yet</span>
              <Button size="sm" onClick={() => setShowPipeline(true)}>
                Open Pipeline
              </Button>
            </div>
          )}
        </CardContent>
        {/* Drag Section */}
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
    </>
  );
});

SourceNode.displayName = 'SourceNode';

export default SourceNode;
