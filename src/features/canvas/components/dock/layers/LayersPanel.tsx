import { DockPanel } from '@/features/canvas/components/dock';
import { FeatureTipCard } from '@/features/onboarding';
import { useCanvasNodesStore } from '@/features/canvas/stores/useCanvasNodesStore';
import { useCanvasPanelStore } from '@/features/canvas/stores/useCanvasPanelStore';
import { useLayersUiStore } from '@/features/canvas/stores/useLayersUiStore';
import { useNewNodeTypesStore } from '@/features/canvas/stores/useNewNodeTypesStore';
import {
  bringForward,
  bringToFront,
  reorder,
  sendBackward,
  sendToBack,
  sortByZ,
  type ZPatch,
} from '@/features/canvas/utils/zOrder';
import { useEvidenceStore } from '@/features/evidence/stores/useEvidenceStore';
import { useCanvasStore } from '@/lib/stores';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import type { GroupNode } from '@/shared/types';
import { cn } from '@/shared/utils';
import { useReactFlow } from '@xyflow/react';
import {
  ChevronDown,
  ChevronRight,
  Crosshair,
  FolderPlus,
  Layers,
  Minus,
  Plus,
  Search,
  Trash2,
  Unlink,
  X,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { LayerRow } from './LayerRow';
import { useLayersTree, type LayerEntry } from './useLayersTree';

const GROUP_COLORS = [
  '#6366f1',
  '#0ea5e9',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#ec4899',
  '#8b5cf6',
  '#64748b',
];

export interface LayersPanelProps {
  selectedNodeIds: string[];
  focusedGroupId: string | null;
  unlinkedCount: number;
  onFocusGroup: (groupId: string) => void;
  onClearFocus: () => void;
  onCreateFromSelection: () => void;
  onAddSelected: (groupId: string) => void;
  onRemoveSelected: (groupId: string) => void;
  onRenameGroup: (groupId: string, name: string) => void;
  onRecolorGroup: (groupId: string, color: string) => void;
  onDeleteGroup: (groupId: string) => void;
  onFocusUnlinked: () => void;
}

/** Fan z-order patches out to whichever store owns each entry. */
function applyZPatches(patches: ZPatch[], entriesById: Map<string, LayerEntry>) {
  for (const patch of patches) {
    const entry = entriesById.get(patch.id);
    if (!entry) continue;
    switch (entry.kind) {
      case 'metricCard':
        useCanvasStore.getState().updateNode(patch.id, { zIndex: patch.zIndex });
        break;
      case 'canvasNode':
        void useCanvasNodesStore
          .getState()
          .updateNode(patch.id, { zIndex: patch.zIndex });
        break;
      case 'newNode':
        useNewNodeTypesStore
          .getState()
          .updateNewNode(patch.id, { zIndex: patch.zIndex } as never);
        break;
      case 'evidence':
        useEvidenceStore
          .getState()
          .updateEvidence(patch.id, { zIndex: patch.zIndex });
        break;
    }
  }
}

export function LayersPanel(props: LayersPanelProps) {
  const open = useCanvasPanelStore((s) => s.leftPanel === 'layers');
  const closeLeft = useCanvasPanelStore((s) => s.closeLeft);
  const tree = useLayersTree();
  const { setNodes, fitView } = useReactFlow();

  const hidden = useLayersUiStore((s) => s.hidden);
  const locked = useLayersUiStore((s) => s.locked);
  const collapsedGroups = useLayersUiStore((s) => s.collapsedGroups);
  const search = useLayersUiStore((s) => s.search);
  const toggleHidden = useLayersUiStore((s) => s.toggleHidden);
  const toggleLocked = useLayersUiStore((s) => s.toggleLocked);
  const toggleGroupCollapsed = useLayersUiStore((s) => s.toggleGroupCollapsed);
  const setSearch = useLayersUiStore((s) => s.setSearch);

  const selectedSet = useMemo(
    () => new Set(props.selectedNodeIds),
    [props.selectedNodeIds]
  );
  const entriesById = useMemo(
    () => new Map(tree.all.map((e) => [e.id, e])),
    [tree.all]
  );

  const query = search.trim().toLowerCase();
  const matches = useCallback(
    (e: LayerEntry) =>
      !query ||
      e.title.toLowerCase().includes(query) ||
      e.typeKey.toLowerCase().includes(query),
    [query]
  );

  const handleSelect = useCallback(
    (entry: LayerEntry, additive: boolean) => {
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          selected: additive
            ? n.id === entry.id
              ? !n.selected
              : !!n.selected
            : n.id === entry.id,
        }))
      );
      if (!additive) {
        fitView({
          nodes: [{ id: entry.id }],
          duration: 500,
          padding: 0.4,
          maxZoom: 1.2,
        });
      }
    },
    [setNodes, fitView]
  );

  const handleRename = useCallback((entry: LayerEntry, title: string) => {
    switch (entry.kind) {
      case 'metricCard':
        useCanvasStore.getState().updateNode(entry.id, { title });
        break;
      case 'canvasNode':
        void useCanvasNodesStore.getState().updateNode(entry.id, { title });
        break;
      case 'newNode':
        useNewNodeTypesStore
          .getState()
          .updateNewNode(entry.id, { title } as never);
        break;
      case 'evidence':
        useEvidenceStore.getState().updateEvidence(entry.id, { title });
        break;
    }
  }, []);

  const handleZAction = useCallback(
    (entry: LayerEntry, action: 'front' | 'forward' | 'backward' | 'back') => {
      const items = tree.all.map((e) => ({
        id: e.id,
        zIndex: e.zIndex,
        createdAt: e.createdAt,
      }));
      const patches =
        action === 'front'
          ? bringToFront(items, entry.id)
          : action === 'forward'
            ? bringForward(items, entry.id)
            : action === 'backward'
              ? sendBackward(items, entry.id)
              : sendToBack(items, entry.id);
      applyZPatches(patches, entriesById);
    },
    [tree.all, entriesById]
  );

  // Drag-to-reorder: drop a row onto another to take its stacking position.
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const handleDrop = useCallback(
    (target: LayerEntry) => {
      const sourceId = draggingId;
      setDraggingId(null);
      setDragOverId(null);
      if (!sourceId || sourceId === target.id) return;
      const items = tree.all.map((e) => ({
        id: e.id,
        zIndex: e.zIndex,
        createdAt: e.createdAt,
      }));
      // reorder() works on the bottom→top order; take the target's slot there.
      const toIndex = sortByZ(items).findIndex((i) => i.id === target.id);
      if (toIndex === -1) return;
      applyZPatches(reorder(items, sourceId, toIndex), entriesById);
    },
    [draggingId, tree.all, entriesById]
  );
  const dragHandlers = {
    onDragStart: (e: LayerEntry) => setDraggingId(e.id),
    onDragOver: (e: LayerEntry) => setDragOverId(e.id),
    onDropOn: handleDrop,
    onDragEnd: () => {
      setDraggingId(null);
      setDragOverId(null);
    },
  };

  const renderRow = (entry: LayerEntry, indented?: boolean) => (
    <LayerRow
      key={entry.id}
      entry={entry}
      indented={indented}
      selected={selectedSet.has(entry.id)}
      hidden={!!hidden[entry.id]}
      locked={!!locked[entry.id]}
      dropTarget={dragOverId === entry.id && draggingId !== entry.id}
      onSelect={handleSelect}
      onRename={handleRename}
      onToggleHidden={toggleHidden}
      onToggleLocked={toggleLocked}
      onZAction={handleZAction}
      {...dragHandlers}
    />
  );

  const renderGroup = ({
    group,
    entries,
  }: {
    group: GroupNode;
    entries: LayerEntry[];
  }) => {
    const visible = entries.filter(matches);
    if (query && visible.length === 0 && !group.name.toLowerCase().includes(query))
      return null;
    const collapsed = !!collapsedGroups[group.id];
    const isFocused = props.focusedGroupId === group.id;
    return (
      <div key={group.id} className="space-y-0.5">
        <div
          className={cn(
            'group flex h-7 items-center gap-1.5 rounded-md px-1 text-xs font-medium transition-colors hover:bg-accent/50',
            isFocused && 'bg-primary/10'
          )}
        >
          <button
            className="flex h-5 w-5 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground"
            onClick={() => toggleGroupCollapsed(group.id)}
            aria-label={collapsed ? 'Expand group' : 'Collapse group'}
          >
            {collapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="h-3 w-3 shrink-0 rounded-full border shadow-sm"
                style={{ backgroundColor: group.color || '#64748b' }}
                title="Change color"
              />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="start">
              <div className="grid grid-cols-4 gap-1.5">
                {GROUP_COLORS.map((c) => (
                  <button
                    key={c}
                    className="h-6 w-6 rounded-full border shadow-sm transition-transform hover:scale-110"
                    style={{ backgroundColor: c }}
                    onClick={() => props.onRecolorGroup(group.id, c)}
                    title={c}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <GroupName
            name={group.name}
            onRename={(name) => props.onRenameGroup(group.id, name)}
          />
          <Badge variant="outline" className="shrink-0 text-[10px]">
            {entries.length}
          </Badge>
          <div
            className="flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-5 w-5 p-0',
                isFocused
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              onClick={() =>
                isFocused ? props.onClearFocus() : props.onFocusGroup(group.id)
              }
              title={isFocused ? 'Exit focus' : 'Focus group'}
            >
              <Crosshair className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
              onClick={() => props.onAddSelected(group.id)}
              disabled={props.selectedNodeIds.length === 0}
              title="Add selected cards to this group"
            >
              <Plus className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
              onClick={() => props.onRemoveSelected(group.id)}
              disabled={props.selectedNodeIds.length === 0}
              title="Remove selected cards from this group"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 text-muted-foreground hover:text-destructive"
              onClick={() => props.onDeleteGroup(group.id)}
              title="Delete group (cards are kept)"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        {!collapsed && visible.map((e) => renderRow(e, true))}
      </div>
    );
  };

  const visibleRoot = tree.rootEntries.filter(matches);
  const isEmpty = tree.all.length === 0 && tree.groups.length === 0;

  return (
    <DockPanel
      side="left"
      open={open}
      onClose={closeLeft}
      width={280}
      icon={<Layers />}
      title="Layers"
      headerActions={
        <Badge variant="secondary" className="text-[10px]">
          {tree.all.length}
        </Badge>
      }
      closeOnEscape={false}
      padded={false}
      scrollBody={false}
    >
      {/* Search + quick actions */}
      <div className="shrink-0 space-y-2 border-b border-border px-3 py-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search layers…"
            className="h-7 pl-7 text-xs"
          />
          {search && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setSearch('')}
              aria-label="Clear search"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            className="h-6 flex-1 gap-1 px-2 text-[11px]"
            onClick={props.onCreateFromSelection}
            disabled={props.selectedNodeIds.length < 2}
            title={
              props.selectedNodeIds.length < 2
                ? 'Select 2+ cards on the canvas to create a group'
                : `Group ${props.selectedNodeIds.length} selected cards`
            }
          >
            <FolderPlus className="h-3 w-3" />
            Group selection
          </Button>
          {props.unlinkedCount > 0 && (
            <Button
              size="sm"
              variant="outline"
              className="h-6 gap-1 px-2 text-[11px]"
              onClick={props.onFocusUnlinked}
              title="Select and zoom to cards with no relationship yet"
            >
              <Unlink className="h-3 w-3" />
              {props.unlinkedCount}
            </Button>
          )}
        </div>
        {props.focusedGroupId && (
          <button
            className="flex w-full items-center justify-between rounded-md bg-primary/10 px-2 py-1 text-[11px] font-medium"
            onClick={props.onClearFocus}
          >
            Focusing a group
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Tree — top-most first, groups as folders */}
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {/* First-encounter tip (one-shot, persisted). */}
        <FeatureTipCard id="layers-panel" className="mb-2">
          Everything on the canvas, top-most first — including drawings. Click
          to select &amp; zoom, double-click to rename, use the eye/lock to
          hide or freeze, and drag rows to change paint order.
        </FeatureTipCard>
        {isEmpty ? (
          <div className="px-3 py-10 text-center">
            <Layers className="mx-auto mb-2 h-6 w-6 text-muted-foreground/50" />
            <p className="text-xs text-muted-foreground">
              Nothing on this canvas yet.
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground/70">
              Add cards or drawings and they'll stack here, top-most first.
            </p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {tree.groups.map(renderGroup)}
            {visibleRoot.map((e) => renderRow(e))}
            {query &&
              visibleRoot.length === 0 &&
              tree.groups.every(
                (g) =>
                  g.entries.filter(matches).length === 0 &&
                  !g.group.name.toLowerCase().includes(query)
              ) && (
                <p className="px-2 py-6 text-center text-xs text-muted-foreground">
                  No layers match “{search}”.
                </p>
              )}
          </div>
        )}
      </div>
    </DockPanel>
  );
}

function GroupName({
  name,
  onRename,
}: {
  name: string;
  onRename: (name: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const commit = () => {
    const next = draft.trim();
    if (next && next !== name) onRename(next);
    setEditing(false);
  };
  if (editing) {
    return (
      <Input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') setEditing(false);
        }}
        className="h-5 flex-1 rounded-sm px-1 text-xs"
      />
    );
  }
  return (
    <button
      className="min-w-0 flex-1 truncate text-left"
      onDoubleClick={() => {
        setDraft(name);
        setEditing(true);
      }}
      title="Double-click to rename"
    >
      {name}
    </button>
  );
}
