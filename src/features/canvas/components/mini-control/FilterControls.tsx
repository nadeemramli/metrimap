import { useCanvasStore } from '@/lib/stores';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import type { MetricCard as MetricCardType } from '@/shared/types';
import { cn } from '@/shared/utils';
import { userCodename } from '@/shared/utils/codename';
import { Filter, RefreshCw, Search } from 'lucide-react';
import { useState } from 'react';

type CardCategory = MetricCardType['category'];

interface FilterState {
  searchTerm: string;
  categories: CardCategory[];
  dateRange: { from: string; to: string };
  tags: string[];
  owners: string[];
  showOnlyConnected: boolean;
}

const categoryOptions: Array<{ value: CardCategory; label: string }> = [
  { value: 'Core/Value', label: 'Core/Value' },
  { value: 'Data/Metric', label: 'Data/Metric' },
  { value: 'Work/Action', label: 'Work/Action' },
  { value: 'Ideas/Hypothesis', label: 'Ideas/Hypothesis' },
  { value: 'Metadata', label: 'Metadata' },
];

// Never show a raw Clerk id (`user_…`) as an owner — resolve it to the same
// stable pseudonymous codename comments use (CVS-33). Real name strings (which
// don't start with `user_`) pass through unchanged so they aren't hashed away.
const ownerLabel = (owner: string): string =>
  /^user_/.test(owner) ? userCodename(owner) : owner;

/** Compact chip toggle used for every facet (categories / tags / owners). */
function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-md border px-2 py-0.5 text-xs transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-muted/40 text-muted-foreground hover:bg-muted'
      )}
    >
      {children}
    </button>
  );
}

export default function FilterControls() {
  const { canvas, dateRange, setDateRange } = useCanvasStore();
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    categories: [],
    dateRange: { from: dateRange.start, to: dateRange.end },
    tags: [],
    owners: [],
    showOnlyConnected: false,
  });

  const availableTags = Array.from(
    new Set((canvas?.nodes || []).flatMap((n) => n.tags))
  ).filter(Boolean) as string[];
  const availableOwners = Array.from(
    new Set(
      (canvas?.nodes || [])
        .map((n) => n.owner)
        .filter((o): o is string => Boolean(o))
    )
  );

  const set = <K extends keyof FilterState>(key: K, value: FilterState[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const toggle = <K extends 'categories' | 'tags' | 'owners'>(
    key: K,
    value: FilterState[K][number]
  ) =>
    setFilters((prev) => ({
      ...prev,
      [key]: (prev[key] as string[]).includes(value as string)
        ? (prev[key] as string[]).filter((v) => v !== value)
        : [...(prev[key] as string[]), value],
    }));

  const handleApply = () => {
    setDateRange(filters.dateRange.from, filters.dateRange.to);
    setOpen(false);
  };

  const handleReset = () =>
    setFilters({
      searchTerm: '',
      categories: [],
      dateRange: {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        to: new Date().toISOString().split('T')[0],
      },
      tags: [],
      owners: [],
      showOnlyConnected: false,
    });

  const activeFilterCount = [
    filters.searchTerm,
    filters.categories.length > 0,
    filters.tags.length > 0,
    filters.owners.length > 0,
    filters.showOnlyConnected,
  ].filter(Boolean).length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="react-flow__controls-button rf-control-tool"
          title="Filter & date"
          aria-label="Filter & date"
        >
          <Filter />
          {activeFilterCount > 0 && (
            <span
              data-testid="filter-active-count"
              className="absolute -right-1 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground"
            >
              {activeFilterCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent side="top" align="start" className="w-[340px] p-0">
        <div className="flex items-center justify-between border-b px-3.5 py-2.5">
          <span className="text-sm font-medium">Filter canvas</span>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="max-h-[60vh] space-y-4 overflow-y-auto px-3.5 py-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search title, description, tags"
              className="h-8 pl-7 text-sm"
              value={filters.searchTerm}
              onChange={(e) => set('searchTerm', e.target.value)}
            />
          </div>

          {/* Date range */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Date range</Label>
            <div className="flex items-center gap-1.5">
              <Input
                type="date"
                aria-label="Filter start date"
                className="h-8 text-xs"
                value={filters.dateRange.from}
                onChange={(e) =>
                  set('dateRange', { ...filters.dateRange, from: e.target.value })
                }
              />
              <span className="text-xs text-muted-foreground">–</span>
              <Input
                type="date"
                aria-label="Filter end date"
                className="h-8 text-xs"
                value={filters.dateRange.to}
                onChange={(e) =>
                  set('dateRange', { ...filters.dateRange, to: e.target.value })
                }
              />
            </div>
            <button
              type="button"
              className="text-xs text-primary hover:underline"
              onClick={() =>
                set('dateRange', {
                  from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split('T')[0],
                  to: new Date().toISOString().split('T')[0],
                })
              }
            >
              Last 30 days
            </button>
          </div>

          {/* Categories */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Categories</Label>
            <div className="flex flex-wrap gap-1.5">
              {categoryOptions.map((opt) => (
                <Chip
                  key={opt.value}
                  active={filters.categories.includes(opt.value)}
                  onClick={() => toggle('categories', opt.value)}
                >
                  {opt.label}
                </Chip>
              ))}
            </div>
          </div>

          {/* Tags */}
          {availableTags.length > 0 && (
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Tags</Label>
              <div className="flex flex-wrap gap-1.5">
                {availableTags.map((tag) => (
                  <Chip
                    key={tag}
                    active={filters.tags.includes(tag)}
                    onClick={() => toggle('tags', tag)}
                  >
                    {tag}
                  </Chip>
                ))}
              </div>
            </div>
          )}

          {/* Owners */}
          {availableOwners.length > 0 && (
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Owners</Label>
              <div className="flex flex-wrap gap-1.5">
                {availableOwners.map((owner) => (
                  <Chip
                    key={owner}
                    active={filters.owners.includes(owner)}
                    onClick={() => toggle('owners', owner)}
                  >
                    {ownerLabel(owner)}
                  </Chip>
                ))}
              </div>
            </div>
          )}

          {/* Connected only */}
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <Checkbox
              checked={filters.showOnlyConnected}
              onCheckedChange={(v) => set('showOnlyConnected', Boolean(v))}
            />
            Show only connected nodes
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 border-t px-3.5 py-2.5">
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Reset
          </Button>
          <Button size="sm" onClick={handleApply}>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
