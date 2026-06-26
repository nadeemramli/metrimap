import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import type { GroupNode as GroupNodeType } from '@/shared/types';
import { cn } from '@/shared/utils';
import type { NodeProps } from '@xyflow/react';
import { NodeResizer } from '@xyflow/react';
import { ChevronDown, ChevronRight, Folder, Trash2 } from 'lucide-react';

interface GroupNodeData {
  group: GroupNodeType;
  isCollapsed?: boolean;
  onEditGroup?: (groupId: string) => void;
  onDeleteGroup?: (groupId: string) => void;
  onToggleCollapse?: (groupId: string) => void;
  onResizeGroup?: (
    groupId: string,
    size: { width: number; height: number }
  ) => void;
}

// Translucent color palette so overlapping/adjacent frames read as distinct
// regions. Deterministic per group name (until a user color-picker is added).
const FRAME_PALETTE = [
  { border: '#3b82f6', bg: 'rgba(59,130,246,0.05)', head: 'rgba(59,130,246,0.12)' },
  { border: '#22c55e', bg: 'rgba(34,197,94,0.05)', head: 'rgba(34,197,94,0.12)' },
  { border: '#f59e0b', bg: 'rgba(245,158,11,0.06)', head: 'rgba(245,158,11,0.14)' },
  { border: '#a855f7', bg: 'rgba(168,85,247,0.05)', head: 'rgba(168,85,247,0.12)' },
  { border: '#ec4899', bg: 'rgba(236,72,153,0.05)', head: 'rgba(236,72,153,0.12)' },
  { border: '#14b8a6', bg: 'rgba(20,184,166,0.05)', head: 'rgba(20,184,166,0.12)' },
];
function frameColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return FRAME_PALETTE[h % FRAME_PALETTE.length];
}

/**
 * Figma-style frame. The header bar is the only drag handle (class
 * `group-drag-handle`, matched in convertToGroupNode), and the frame paints
 * behind the cards, so cards stay interactive while the frame is movable.
 */
export default function GroupNode({ id, data, selected }: NodeProps) {
  const {
    group,
    isCollapsed = false,
    onDeleteGroup,
    onToggleCollapse,
    onResizeGroup,
  } = (data as unknown as GroupNodeData) || {};

  if (!group) return null;

  const c = frameColor(group.name);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteGroup?.(id as string);
  };
  const handleToggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleCollapse?.(id as string);
  };

  return (
    <>
      <NodeResizer
        minWidth={200}
        minHeight={120}
        isVisible={!!selected && !isCollapsed}
        lineClassName="border-primary"
        handleClassName="h-2.5 w-2.5 bg-primary border-2 border-background rounded-sm z-20"
        onResize={(_, params) => {
          onResizeGroup?.(id as string, {
            width: params.width,
            height: params.height,
          });
        }}
      />

      <div
        className={cn(
          'flex flex-col overflow-hidden rounded-xl border-2 transition-colors',
          selected && 'shadow-lg ring-1 ring-primary/30'
        )}
        style={{
          width: group.size.width,
          height: isCollapsed ? 40 : group.size.height,
          borderColor: selected ? 'hsl(var(--primary))' : c.border,
          backgroundColor: c.bg,
        }}
      >
        {/* Header = the drag handle */}
        <div
          className="group-drag-handle flex cursor-grab select-none items-center justify-between gap-2 border-b border-border/40 px-3 py-1.5 backdrop-blur-sm active:cursor-grabbing"
          style={{ backgroundColor: c.head }}
        >
          <div className="flex min-w-0 items-center gap-1.5">
            <button
              type="button"
              onClick={handleToggleCollapse}
              className="nodrag shrink-0 cursor-pointer text-muted-foreground hover:text-foreground"
              title={isCollapsed ? 'Expand' : 'Collapse'}
            >
              {isCollapsed ? (
                <ChevronRight className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>
            <Folder
              className="h-3.5 w-3.5 shrink-0"
              style={{ color: c.border }}
            />
            <span className="truncate text-sm font-semibold text-foreground">
              {group.name}
            </span>
            <Badge variant="secondary" className="shrink-0 text-[10px]">
              {group.nodeIds.length}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="nodrag h-6 w-6 shrink-0 p-0 text-muted-foreground hover:text-destructive"
            title="Delete group (cards are kept)"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Body — sits behind the cards */}
        {!isCollapsed && group.nodeIds.length === 0 && (
          <div className="pointer-events-none flex flex-1 items-center justify-center">
            <div className="text-center text-xs text-muted-foreground opacity-60">
              <Folder className="mx-auto mb-1 h-6 w-6" />
              <p>Select cards and group them</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
