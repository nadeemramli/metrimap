import { useMemo, useState } from 'react';
import {
  ChevronDown,
  Filter,
  Folder,
  Grid3X3,
  List,
  Pencil,
  Plus,
  Search,
  SortAsc,
  SortDesc,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/shared/utils';
import { useConfirm } from '@/shared/components/ConfirmDialog';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { getTagColor } from '@/shared/utils/tag-colors';
import type { Space } from '@/shared/lib/supabase/services/spaces';
import type { ViewFilter } from '@/shared/hooks/useProjectFiltering2';

type SortOption = 'name' | 'updated' | 'created' | 'nodes' | 'edges';
type ViewMode = 'grid' | 'list';

const SPACE_COLORS = [
  '#6366f1', '#3b82f6', '#14b8a6', '#22c55e', '#eab308',
  '#f59e0b', '#ef4444', '#ec4899', '#a855f7', '#64748b',
];

export interface HomeControlBarProps {
  // Space filter + management
  spaces: Space[];
  spaceFilter: string;
  onSpaceFilter: (id: string) => void;
  onSpaceCreate: (name: string, color: string | null) => Promise<void>;
  onSpaceUpdate: (
    id: string,
    patch: { name?: string; color?: string | null }
  ) => Promise<void>;
  onSpaceDelete: (id: string) => Promise<void>;
  // View filter (All / Recent / Starred / Archived)
  viewFilter: ViewFilter;
  onViewFilter: (f: ViewFilter) => void;
  counts: Record<ViewFilter, number>;
  // Search
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  // Sort
  sortBy: SortOption;
  onSortByChange: (s: SortOption) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (o: 'asc' | 'desc') => void;
  // View mode
  viewMode: ViewMode;
  onViewModeChange: (m: ViewMode) => void;
  // Tags
  selectedTags: string[];
  allTags: string[];
  onToggleTag: (tag: string) => void;
  onClearTags: () => void;
  // Create
  isCreatingCanvas: boolean;
  onCreateCanvas: () => void;
  onNewFromTemplate: () => void;
}

/**
 * The home page's single control bar — consolidates what used to be four
 * stacked bands (space tabs, filter chips, and the search/sort/create toolbar)
 * into one row (CVS-29). Space management (create/rename/delete) lives inside
 * the space menu; creation affordances collapse into one split "New" button.
 */
export function HomeControlBar(props: HomeControlBarProps) {
  const {
    spaces,
    spaceFilter,
    onSpaceFilter,
    onSpaceCreate,
    onSpaceUpdate,
    onSpaceDelete,
    viewFilter,
    onViewFilter,
    counts,
    searchQuery,
    onSearchQueryChange,
    sortBy,
    onSortByChange,
    sortOrder,
    onSortOrderChange,
    viewMode,
    onViewModeChange,
    selectedTags,
    allTags,
    onToggleTag,
    onClearTags,
    isCreatingCanvas,
    onCreateCanvas,
    onNewFromTemplate,
  } = props;

  const confirm = useConfirm();

  // Space create/edit dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Space | null>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState<string>(SPACE_COLORS[0]);
  const [busy, setBusy] = useState(false);

  const spaceLabel = useMemo(() => {
    if (spaceFilter === 'all') return 'All Canvases';
    if (spaceFilter === 'uncategorized') return 'Uncategorized';
    return spaces.find((s) => s.id === spaceFilter)?.name ?? 'All Canvases';
  }, [spaceFilter, spaces]);

  const activeColor =
    spaceFilter !== 'all' && spaceFilter !== 'uncategorized'
      ? spaces.find((s) => s.id === spaceFilter)?.color
      : undefined;

  const openCreate = () => {
    setEditing(null);
    setName('');
    setColor(SPACE_COLORS[0]);
    setDialogOpen(true);
  };
  const openEdit = (s: Space) => {
    setEditing(s);
    setName(s.name);
    setColor(s.color || SPACE_COLORS[0]);
    setDialogOpen(true);
  };
  const save = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setBusy(true);
    try {
      if (editing) await onSpaceUpdate(editing.id, { name: trimmed, color });
      else await onSpaceCreate(trimmed, color);
      setDialogOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save space');
    } finally {
      setBusy(false);
    }
  };
  const remove = async (s: Space) => {
    const ok = await confirm({
      title: `Delete "${s.name}"?`,
      description:
        'Canvases in this space move to Uncategorized. They are not deleted.',
      destructive: true,
      actionLabel: 'Delete space',
    });
    if (!ok) return;
    try {
      await onSpaceDelete(s.id);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to delete space');
    }
  };

  const FILTERS: { key: ViewFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'recent', label: 'Recent' },
    { key: 'starred', label: 'Starred' },
    ...(counts.archived > 0 || viewFilter === 'archived'
      ? [{ key: 'archived' as ViewFilter, label: 'Archived' }]
      : []),
  ];

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {/* Space menu (filter + manage) */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5">
            {activeColor ? (
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: activeColor }}
              />
            ) : (
              <Folder className="h-4 w-4" />
            )}
            <span className="max-w-[10rem] truncate">{spaceLabel}</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem onClick={() => onSpaceFilter('all')}>
            <Folder className="mr-2 h-3.5 w-3.5" /> All Canvases
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSpaceFilter('uncategorized')}>
            <Folder className="mr-2 h-3.5 w-3.5" /> Uncategorized
          </DropdownMenuItem>
          {spaces.length > 0 && <DropdownMenuSeparator />}
          {spaces.map((s) => (
            <div
              key={s.id}
              className="group flex items-center justify-between rounded-sm pr-1 hover:bg-accent"
            >
              <button
                onClick={() => onSpaceFilter(s.id)}
                className="flex flex-1 items-center gap-2 px-2 py-1.5 text-sm"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: s.color || '#94a3b8' }}
                />
                <span className="truncate">{s.name}</span>
              </button>
              <button
                onClick={() => openEdit(s)}
                className="rounded p-1 opacity-0 hover:bg-black/10 group-hover:opacity-100"
                title="Rename / recolor"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => void remove(s)}
                className="rounded p-1 opacity-0 hover:bg-black/10 group-hover:opacity-100"
                title="Delete space"
              >
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </button>
            </div>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={openCreate}>
            <Plus className="mr-2 h-3.5 w-3.5" /> New space
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Segmented view filter */}
      <div
        role="tablist"
        aria-label="Filter canvases"
        className="flex items-center rounded-md border border-border p-0.5"
      >
        {FILTERS.map((f) => (
          <button
            key={f.key}
            role="tab"
            aria-selected={viewFilter === f.key}
            onClick={() => onViewFilter(f.key)}
            className={cn(
              'flex items-center gap-1.5 rounded px-2.5 py-1 text-sm transition-colors',
              viewFilter === f.key
                ? 'bg-secondary text-secondary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            )}
          >
            {f.label}
            <span className="text-xs opacity-70">{counts[f.key]}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative min-w-[12rem] flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search canvases…"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          aria-label="Search canvases"
          className="h-9 pl-9"
        />
      </div>

      {/* Sort */}
      <Select
        value={sortBy}
        onValueChange={(v) => onSortByChange(v as SortOption)}
      >
        <SelectTrigger className="h-9 w-[150px]" aria-label="Sort by">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="updated">Last updated</SelectItem>
          <SelectItem value="created">Date created</SelectItem>
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="nodes">Metric count</SelectItem>
          <SelectItem value="edges">Relationship count</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="sm"
        className="h-9 w-9 p-0"
        onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
        aria-label={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
      >
        {sortOrder === 'asc' ? (
          <SortAsc className="h-4 w-4" />
        ) : (
          <SortDesc className="h-4 w-4" />
        )}
      </Button>

      {/* Tag filter (only when tags exist) */}
      {allTags.length > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1.5"
              aria-label="Filter by tags"
            >
              <Filter className="h-4 w-4" />
              Tags
              {selectedTags.length > 0 && (
                <span className="rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                  {selectedTags.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-64">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Filter by tags</span>
              {selectedTags.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={onClearTags}
                >
                  Clear
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? 'default' : getTagColor(tag)}
                  className="cursor-pointer"
                  onClick={() => onToggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* View mode */}
      <div className="flex items-center rounded-md border border-border">
        <Button
          variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
          size="sm"
          className="h-9 w-9 rounded-r-none p-0"
          onClick={() => onViewModeChange('grid')}
          aria-label="Grid view"
          aria-pressed={viewMode === 'grid'}
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'secondary' : 'ghost'}
          size="sm"
          className="h-9 w-9 rounded-l-none border-l border-border p-0"
          onClick={() => onViewModeChange('list')}
          aria-label="List view"
          aria-pressed={viewMode === 'list'}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>

      {/* New (split) */}
      <div className="ml-auto flex items-center">
        <Button
          onClick={onCreateCanvas}
          disabled={isCreatingCanvas}
          size="sm"
          className="h-9 gap-1.5 rounded-r-none"
        >
          <Plus className="h-4 w-4" />
          {isCreatingCanvas ? 'Creating…' : 'New Canvas'}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              className="h-9 rounded-l-none border-l border-primary-foreground/20 px-2"
              aria-label="More create options"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Create</DropdownMenuLabel>
            <DropdownMenuItem onClick={onCreateCanvas} disabled={isCreatingCanvas}>
              <Plus className="mr-2 h-4 w-4" /> New Canvas
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onNewFromTemplate}>
              <Sparkles className="mr-2 h-4 w-4" /> From template
            </DropdownMenuItem>
            <DropdownMenuItem onClick={openCreate}>
              <Folder className="mr-2 h-4 w-4" /> New space
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Space create/edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit space' : 'New space'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              autoFocus
              placeholder="Space name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && void save()}
            />
            <div className="flex flex-wrap gap-2">
              {SPACE_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={cn(
                    'h-6 w-6 rounded-full border-2 transition-transform',
                    color === c ? 'scale-110 border-foreground' : 'border-transparent'
                  )}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={busy}
            >
              Cancel
            </Button>
            <Button onClick={() => void save()} disabled={busy || !name.trim()}>
              {editing ? 'Save' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
