import { Handle, Position } from '@xyflow/react';
import { memo, type CSSProperties } from 'react';

// One handle per side, with the SAME stable ids the metric card uses
// (top-target / bottom-source / left-target / right-source). This lets the
// auto-layout anchor edges to a direction-appropriate side on EVERY node type
// (source / operator / chart), not just metric cards. With
// connectionMode=loose each handle works as both source and target, so the
// source/target suffix is just a stable identifier, not a restriction.

const base: CSSProperties = {
  width: 12,
  height: 12,
  background: '#ffffff',
  border: '2px solid #94a3b8',
  borderRadius: 9999,
  zIndex: 1,
};

interface FourSideHandlesProps {
  isConnectable?: boolean;
}

function FourSideHandlesBase({ isConnectable = true }: FourSideHandlesProps) {
  return (
    <>
      <Handle
        id="top-target"
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        style={{ ...base, top: -7 }}
      />
      <Handle
        id="bottom-source"
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        style={{ ...base, bottom: -7 }}
      />
      <Handle
        id="left-target"
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{ ...base, left: -7 }}
      />
      <Handle
        id="right-source"
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{ ...base, right: -7 }}
      />
    </>
  );
}

export const FourSideHandles = memo(FourSideHandlesBase);
