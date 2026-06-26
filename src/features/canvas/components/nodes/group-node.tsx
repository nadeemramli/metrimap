import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
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
  onColorChange?: (groupId: string, color: string) => void;
  onResizeGroup?: (
    groupId: string,
    size: { width: number; height: number }
  ) => void;
}

// Preset colors for the frame color picker (also the deterministic fallback).
const PALETTE = [
  '#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#ec4899',
  '#14b8a6', '#ef4444', '#6366f1', '#0ea5e9', '#64748b',
];

function hexToRgba(hex: string, a: number): string {
  const m = hex.replace('#', '');
  const n = m.length === 3 ? m.split('').map((x) => x + x).join('') : m;
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function paletteFor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

/**
 * Figma-style frame. The header bar is the only drag handle (class
 * `group-drag-handle`, matched in convertToGroupNode), and the frame paints
 * behind the cards, so cards stay interactive while the frame is movable.
 * Color comes from group.color (user-picked) or a deterministic palette.
 */
export default function GroupNode({ id, data, selected }: NodeProps) {
  const {
    group,
    isCollapsed = false,
    onDeleteGroup,
    onToggleCollapse,
    onColorChange,
    onResizeGroup,
  } = (data as unknown as GroupNodeData) || {};

  if (!group) return null;

  const base = group.color || paletteFor(group.name);
  const bg = hexToRgba(base, 0.05);
  const head = hexToRgba(base, 0.12);

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
          borderColor: selected ? 'hsl(var(--primary))' : base,
          backgroundColor: bg,
        }}
      >
        {/* Header = the drag handle */}
        <div
          className="group-drag-handle flex cursor-grab select-none items-center justify-between gap-2 border-b border-border/40 px-3 py-1.5 backdrop-blur-sm active:cursor-grabbing"
          style={{ backgroundColor: head }}
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
            <Folder className="h-3.5 w-3.5 shrink-0" style={{ color: base }} />
            <span className="truncate text-sm font-semibold text-foreground">
              {group.name}
            </span>
            <Badge variant="secondary" className="shrink-0 text-[10px]">
              {group.nodeIds.length}
            </Badge>
          </div>

          <div className="flex shrink-0 items-center gap-0.5">
            {/* Color picker */}
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="nodrag h-4 w-4 rounded-full border border-black/10 transition-transform hover:scale-110"
                  style={{ backgroundColor: base }}
                  title="Frame color"
                />
              </PopoverTrigger>
              <PopoverContent
                className="nodrag w-auto p-2"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="grid grid-cols-5 gap-1.5">
                  {PALETTE.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onColorChange?.(id as string, hex);
                      }}
                      className={cn(
                        'h-5 w-5 rounded-full border transition-transform hover:scale-110',
                        base.toLowerCase() === hex
                          ? 'border-foreground ring-1 ring-foreground'
                          : 'border-black/10'
                      )}
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="nodrag h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
              title="Delete group (cards are kept)"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
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
