import { Badge } from '@/shared/components/ui/badge';
import type { EdgeProps } from '@xyflow/react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react';

interface OperativeEdgeData {
  label?: string;
  [key: string]: unknown;
}

interface OperativeEdgeProps extends EdgeProps {
  data: OperativeEdgeData;
}

export default function OperativeEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
  data,
}: OperativeEdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        path={edgePath}
        style={{
          stroke: selected ? '#2563eb' : '#6b7280',
          strokeWidth: 2,
          strokeDasharray: '4,2',
          opacity: selected ? 1 : 0.9,
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{ position: 'absolute', transform: 'translate(-50%, -50%)' }}
          className="pointer-events-none"
        >
          {data?.label && (
            <Badge variant="secondary" className="text-[10px]">
              {data.label}
            </Badge>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
