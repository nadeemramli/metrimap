import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { cn } from '@/shared/utils';
import type { GroupNode } from '@/shared/types';
import {
  Crosshair,
  FolderPlus,
  Minus,
  Plus,
  Trash2,
  Unlink,
  X,
} from 'lucide-react';
import { useState } from 'react';

const GROUP_COLORS = [
  '#6366f1', // indigo
  '#0ea5e9', // sky
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#ec4899', // pink
  '#8b5cf6', // violet
  '#64748b', // slate
];

interface GroupsPanelProps {
  groups: GroupNode[];
  selectedNodeIds: string[];
  focusedGroupId: string | null;
  onFocus: (groupId: string) => void;
  onClearFocus: () => void;
  onCreateFromSelection: () => void;
  onAddSelected: (groupId: string) => void;
  onRemoveSelected: (groupId: string) => void;
  onRename: (groupId: string, name: string) => void;
  onRecolor: (groupId: string, color: string) => void;
  onDelete: (groupId: string) => void;
  /** Count of cards with no typed relationship (computed "Unlinked" group). */
  unlinkedCount: number;
  /** Select + fit-view the unlinked cards so they can be wired or culled. */
  onFocusUnlinked: () => void;
}

export default function GroupsPanel({
  groups,
  selectedNodeIds,
  focusedGroupId,
  onFocus,
  onClearFocus,
  onCreateFromSelection,
  onAddSelected,
  onRemoveSelected,
  onRename,
  onRecolor,
  onDelete,
  unlinkedCount,
  onFocusUnlinked,
}: GroupsPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');
  const selectionCount = selectedNodeIds.length;

  const startRename = (group: GroupNode) => {
    setEditingId(group.id);
    setDraftName(group.name);
  };
  const commitRename = (groupId: string) => {
    const next = draftName.trim();
    if (next) onRename(groupId, next);
    setEditingId(null);
  };

  return (
    <div className="w-72 max-h-[70vh] overflow-auto bg-background/95 backdrop-blur border rounded-lg shadow-lg">
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="text-sm font-semibold">Groups</h3>
        <Badge variant="secondary" className="text-xs">
          {groups.length}
        </Badge>
      </div>

      <div className="p-3 space-y-2 border-b">
        <Button
          size="sm"
          className="w-full gap-1.5"
          onClick={onCreateFromSelection}
          disabled={selectionCount < 2}
        >
          <FolderPlus className="h-4 w-4" />
          New group from selection
        </Button>
        <p className="text-[11px] text-muted-foreground">
          {selectionCount < 2
            ? 'Select 2+ cards on the canvas to create a group.'
            : `${selectionCount} cards selected.`}
        </p>
      </div>

      {focusedGroupId && (
        <div className="flex items-center justify-between px-3 py-2 bg-primary/10 border-b">
          <span className="text-xs font-medium">Focusing a group</span>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 gap-1 px-2 text-xs"
            onClick={onClearFocus}
          >
            <X className="h-3 w-3" />
            Exit focus
          </Button>
        </div>
      )}

      <div className="p-2 space-y-1.5">
        {/* Computed "Unlinked" group: cards with no typed relationship. Muted +
            dashed to signal it isn't a real saved group — just a focus shortcut. */}
        {unlinkedCount > 0 && (
          <div className="rounded-md border border-dashed border-muted-foreground/30 bg-muted/40 p-2">
            <div className="flex items-center gap-2">
              <Unlink className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="flex-1 min-w-0 truncate text-left text-xs font-medium text-muted-foreground">
                Unlinked
              </span>
              <Badge variant="outline" className="text-[10px] shrink-0">
                {unlinkedCount}
              </Badge>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {unlinkedCount === 1 ? '1 card has' : `${unlinkedCount} cards have`}{' '}
              no relationship yet.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="mt-2 h-7 w-full gap-1 px-2 text-xs"
              onClick={onFocusUnlinked}
              title="Select and zoom to the unlinked cards to wire or remove them"
            >
              <Crosshair className="h-3 w-3" />
              Focus to wire or cull
            </Button>
          </div>
        )}

        {groups.length === 0 ? (
          <p className="px-2 py-6 text-center text-xs text-muted-foreground">
            No groups yet.
          </p>
        ) : (
          groups.map((group) => {
            const isFocused = focusedGroupId === group.id;
            const memberCount = group.nodeIds?.length || 0;
            return (
              <div
                key={group.id}
                className={cn(
                  'rounded-md border p-2 transition-colors',
                  isFocused ? 'border-primary bg-primary/5' : 'border-border'
                )}
              >
                <div className="flex items-center gap-2">
                  {/* Color dot → recolor */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className="h-4 w-4 shrink-0 rounded-full border shadow-sm"
                        style={{ backgroundColor: group.color || '#64748b' }}
                        title="Change color"
                      />
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2" align="start">
                      <div className="grid grid-cols-4 gap-1.5">
                        {GROUP_COLORS.map((c) => (
                          <button
                            key={c}
                            className="h-6 w-6 rounded-full border shadow-sm hover:scale-110 transition-transform"
                            style={{ backgroundColor: c }}
                            onClick={() => onRecolor(group.id, c)}
                            title={c}
                          />
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>

                  {/* Name (double-click to rename) */}
                  {editingId === group.id ? (
                    <Input
                      autoFocus
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      onBlur={() => commitRename(group.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') commitRename(group.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      className="h-7 text-xs"
                    />
                  ) : (
                    <button
                      className="flex-1 min-w-0 truncate text-left text-xs font-medium"
                      onDoubleClick={() => startRename(group)}
                      title="Double-click to rename"
                    >
                      {group.name}
                    </button>
                  )}

                  <Badge variant="outline" className="text-[10px] shrink-0">
                    {memberCount}
                  </Badge>
                </div>

                <div className="mt-2 flex items-center gap-1">
                  <Button
                    size="sm"
                    variant={isFocused ? 'default' : 'outline'}
                    className="h-7 flex-1 gap-1 px-2 text-xs"
                    onClick={() =>
                      isFocused ? onClearFocus() : onFocus(group.id)
                    }
                  >
                    <Crosshair className="h-3 w-3" />
                    {isFocused ? 'Focusing' : 'Focus'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 px-2 text-xs"
                    onClick={() => onAddSelected(group.id)}
                    disabled={selectionCount === 0}
                    title="Add selected cards to this group"
                  >
                    <Plus className="h-3 w-3" />
                    {selectionCount > 0 ? selectionCount : ''}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-2 text-xs"
                    onClick={() => onRemoveSelected(group.id)}
                    disabled={selectionCount === 0}
                    title="Remove selected cards from this group"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-destructive hover:text-destructive"
                    onClick={() => onDelete(group.id)}
                    title="Delete group (cards are kept)"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
