import { Handle, Position } from '@xyflow/react';
import { memo, type CSSProperties } from 'react';

// One handle per side, with the SAME stable ids the metric card uses
// (top-target / bottom-source / left-target / right-source). This lets the
// auto-layout anchor edges to a direction-appropriate side on EVERY node type
// (source / operator / chart), not just metric cards.
//
// ALL handles are type="source" (CVS-335): React Flow resolves an edge's
// sourceHandle ONLY among source-type handles even with connectionMode=loose
// (only the target lookup unions both types — see @xyflow/system
// getEdgePosition). A target-type handle on the source side (BT/RL layouts,
// or any pinned endpoint) made the whole edge silently unrenderable (error
// 008). Loose mode allows source→source connections, so source-everywhere
// keeps every drag working while making every side/id combination drawable.
// The -target/-source id suffixes are stable identifiers, not restrictions.

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
        type="source"
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
        type="source"
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
