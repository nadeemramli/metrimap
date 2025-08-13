import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import type { StatusFilter, TabType } from '@/types/source';
import { Search } from 'lucide-react';

interface SourceFiltersProps {
  activeTab: TabType;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
  systemFilter: string;
  onSystemFilterChange: (value: string) => void;
  systems: string[];
}

export function SourceFilters({
  activeTab,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  systemFilter,
  onSystemFilterChange,
  systems,
}: SourceFiltersProps) {
  const getStatusOptions = () => {
    switch (activeTab) {
      case 'sources':
        return [
          { value: 'all', label: 'All Status' },
          { value: 'connected', label: 'Connected' },
          { value: 'disconnected', label: 'Disconnected' },
          { value: 'syncing', label: 'Syncing' },
          { value: 'error', label: 'Error' },
        ];
      case 'apis':
        return [
          { value: 'all', label: 'All Status' },
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
          { value: 'error', label: 'Error' },
        ];
      case 'governance':
        return [
          { value: 'all', label: 'All Status' },
          { value: 'active', label: 'Active' },
          { value: 'draft', label: 'Draft' },
          { value: 'archived', label: 'Archived' },
        ];
      default:
        return [{ value: 'all', label: 'All Status' }];
    }
  };

  const getSearchPlaceholder = () => {
    switch (activeTab) {
      case 'sources':
        return 'Search data sources...';
      case 'apis':
        return 'Search API connections...';
      case 'governance':
        return 'Search policies...';
      case 'monitoring':
        return 'Search monitors...';
      default:
        return 'Search...';
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={getSearchPlaceholder()}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {getStatusOptions().map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {activeTab === 'sources' && systems.length > 0 && (
        <Select value={systemFilter} onValueChange={onSystemFilterChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Systems</SelectItem>
            {systems.map((system) => (
              <SelectItem key={system} value={system}>
                {system}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
