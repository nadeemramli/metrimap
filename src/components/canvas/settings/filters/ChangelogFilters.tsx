import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

interface ChangelogFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  changelogFilter: string;
  onChangelogFilterChange: (value: string) => void;
}

export function ChangelogFilters({
  searchQuery,
  onSearchChange,
  changelogFilter,
  onChangelogFilterChange,
}: ChangelogFiltersProps) {
  return (
    <div className="flex items-center gap-4 mt-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search changelog..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select value={changelogFilter} onValueChange={onChangelogFilterChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Actions</SelectItem>
          <SelectItem value="created">Created</SelectItem>
          <SelectItem value="updated">Updated</SelectItem>
          <SelectItem value="deleted">Deleted</SelectItem>
          <SelectItem value="shared">Shared</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
