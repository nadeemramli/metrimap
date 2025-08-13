import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { getTagColor } from '@/shared/utils/tag-colors';
import {
  Filter,
  Grid3X3,
  List,
  Plus,
  Search,
  SortAsc,
  SortDesc,
} from 'lucide-react';

type SortOption = 'name' | 'updated' | 'created' | 'nodes' | 'edges';
type ViewMode = 'grid' | 'list';

interface ProjectControlsProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  sortBy: SortOption;
  onSortByChange: (sort: SortOption) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  selectedTags: string[];
  allTags: string[];
  onToggleTag: (tag: string) => void;
  onClearTags: () => void;
  isCreatingCanvas: boolean;
  onCreateCanvas: () => void;
  filteredProjectsCount: number;
  totalProjectsCount: number;
}

export function ProjectControls({
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
  filteredProjectsCount,
  totalProjectsCount,
}: ProjectControlsProps) {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={onCreateCanvas}
            className="gap-2 rounded-md whitespace-nowrap bg-black hover:bg-zinc-900 text-white font-medium shadow-sm transition-all duration-300 ease-out hover:shadow-lg hover:scale-105 active:scale-95"
            disabled={isCreatingCanvas}
            size="sm"
          >
            <span className="relative flex items-center">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-4 h-4 rounded-full bg-white">
                <Plus className="h-3 w-3 text-black" />
              </span>
              <span className="pl-6">
                {isCreatingCanvas ? 'Creating...' : 'New Canvas'}
              </span>
            </span>
          </Button>
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-all duration-300 group-focus-within:text-primary group-hover:text-primary" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="pl-10 transition-all duration-300 ease-out hover:shadow-md focus:shadow-lg focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <Select
            value={sortBy}
            onValueChange={(value) => onSortByChange(value as SortOption)}
          >
            <SelectTrigger className="w-[180px] transition-all duration-300 ease-out hover:shadow-md focus:shadow-lg focus:ring-2 focus:ring-primary/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated">Last Updated</SelectItem>
              <SelectItem value="created">Date Created</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="nodes">Metric Count</SelectItem>
              <SelectItem value="edges">Relationship Count</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')
            }
            className="transition-all duration-300 ease-out hover:shadow-md hover:scale-105 active:scale-95"
          >
            {sortOrder === 'asc' ? (
              <SortAsc className="h-4 w-4 transition-transform duration-300" />
            ) : (
              <SortDesc className="h-4 w-4 transition-transform duration-300" />
            )}
          </Button>

          <div className="flex items-center border rounded-md shadow-sm">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className="rounded-r-none hover:bg-accent transition-all duration-300 ease-out hover:scale-105 active:scale-95"
              title="Grid view"
            >
              <Grid3X3 className="h-4 w-4 transition-transform duration-300" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="rounded-l-none border-l hover:bg-accent transition-all duration-300 ease-out hover:scale-105 active:scale-95"
              title="List view"
            >
              <List className="h-4 w-4 transition-transform duration-300" />
            </Button>
          </div>
          {searchQuery.trim() !== '' && (
            <div className="text-sm text-muted-foreground">
              {filteredProjectsCount} of {totalProjectsCount} projects
            </div>
          )}
        </div>
      </div>

      {allTags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filter by tags:</span>
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={
                selectedTags.includes(tag) ? 'default' : getTagColor(tag)
              }
              className="cursor-pointer hover:bg-primary/80 font-medium px-2.5 py-1 shadow-sm transition-all duration-300 ease-out hover:scale-105 active:scale-95 hover:shadow-md"
              onClick={() => onToggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
          {selectedTags.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearTags}>
              Clear filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
