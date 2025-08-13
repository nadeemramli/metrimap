import { useCanvasStore } from '@/lib/stores';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import type { MetricCard as MetricCardType } from '@/shared/types';
import { Calendar, Filter, RefreshCw, Search } from 'lucide-react';
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

export default function FilterControls() {
  const { canvas, dateRange, setDateRange } = useCanvasStore();
  const [showFilters, setShowFilters] = useState(false);
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

  const handleFilterChange = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleCategoryToggle = (category: CardCategory) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleTagToggle = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleOwnerToggle = (owner: string) => {
    setFilters((prev) => ({
      ...prev,
      owners: prev.owners.includes(owner)
        ? prev.owners.filter((o) => o !== owner)
        : [...prev.owners, owner],
    }));
  };

  const handleApplyFilters = () => {
    setDateRange(filters.dateRange.from, filters.dateRange.to);
    setShowFilters(false);
  };

  const handleResetFilters = () => {
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
  };

  const activeFilterCount = [
    filters.searchTerm,
    filters.categories.length > 0,
    filters.tags.length > 0,
    filters.owners.length > 0,
    filters.showOnlyConnected,
  ].filter(Boolean).length;

  return (
    <Dialog open={showFilters} onOpenChange={setShowFilters}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-lg relative"
          title="Filter & Date"
        >
          <Filter className="h-4 w-4" />
          {activeFilterCount > 0 && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
              {activeFilterCount}
            </div>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Filter Canvas</DialogTitle>
          <DialogDescription>
            Narrow down visible cards and relationships
          </DialogDescription>
        </DialogHeader>
        {/* existing content remains unchanged */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search title, description, tags"
                  className="pl-8"
                  value={filters.searchTerm}
                  onChange={(e) =>
                    handleFilterChange('searchTerm', e.target.value)
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Date range</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={filters.dateRange.from}
                  onChange={(e) =>
                    handleFilterChange('dateRange', {
                      ...filters.dateRange,
                      from: e.target.value,
                    })
                  }
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="date"
                  value={filters.dateRange.to}
                  onChange={(e) =>
                    handleFilterChange('dateRange', {
                      ...filters.dateRange,
                      to: e.target.value,
                    })
                  }
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleFilterChange('dateRange', {
                      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                        .toISOString()
                        .split('T')[0],
                      to: new Date().toISOString().split('T')[0],
                    })
                  }
                >
                  <Calendar className="h-4 w-4 mr-2" /> Last 30 days
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Categories</Label>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((opt) => (
                <Badge
                  key={opt.value}
                  variant={
                    filters.categories.includes(opt.value)
                      ? 'default'
                      : 'secondary'
                  }
                  className="cursor-pointer"
                  onClick={() => handleCategoryToggle(opt.value)}
                >
                  {opt.label}
                </Badge>
              ))}
            </div>
          </div>

          {availableTags.length > 0 && (
            <div className="space-y-3">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={
                      filters.tags.includes(tag) ? 'default' : 'secondary'
                    }
                    className="cursor-pointer"
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {availableOwners.length > 0 && (
            <div className="space-y-3">
              <Label>Owners</Label>
              <div className="flex flex-wrap gap-2">
                {availableOwners.map((owner) => (
                  <Badge
                    key={owner}
                    variant={
                      filters.owners.includes(owner) ? 'default' : 'secondary'
                    }
                    className="cursor-pointer"
                    onClick={() => handleOwnerToggle(owner)}
                  >
                    {owner}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="connectedOnly"
                checked={filters.showOnlyConnected}
                onCheckedChange={(v) =>
                  handleFilterChange('showOnlyConnected', Boolean(v))
                }
              />
              <Label htmlFor="connectedOnly">Show only connected nodes</Label>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleResetFilters}>
                <RefreshCw className="h-4 w-4 mr-2" /> Reset
              </Button>
              <Button size="sm" onClick={handleApplyFilters}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
