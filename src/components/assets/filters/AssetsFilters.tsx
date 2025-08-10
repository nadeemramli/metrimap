import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

interface AssetsFiltersProps {
  activeTab: 'metrics' | 'relationships';
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortField: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (field: string, order: 'asc' | 'desc') => void;
  categoryFilter?: string;
  onCategoryFilterChange?: (value: string) => void;
  metricCategories?: string[];
  typeFilter?: string;
  onTypeFilterChange?: (value: string) => void;
  relationshipTypes?: string[];
  confidenceFilter?: string;
  onConfidenceFilterChange?: (value: string) => void;
  confidenceLevels?: string[];
}

export function AssetsFilters({
  activeTab,
  searchQuery,
  onSearchChange,
  sortField,
  sortOrder,
  onSortChange,
  categoryFilter,
  onCategoryFilterChange,
  metricCategories = [],
  typeFilter,
  onTypeFilterChange,
  relationshipTypes = [],
  confidenceFilter,
  onConfidenceFilterChange,
  confidenceLevels = [],
}: AssetsFiltersProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {activeTab === 'metrics' &&
          categoryFilter !== undefined &&
          onCategoryFilterChange && (
            <Select
              value={categoryFilter}
              onValueChange={onCategoryFilterChange}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {metricCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

        {activeTab === 'relationships' && (
          <div className="flex items-center gap-2">
            {typeFilter !== undefined && onTypeFilterChange && (
              <Select value={typeFilter} onValueChange={onTypeFilterChange}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {relationshipTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {confidenceFilter !== undefined && onConfidenceFilterChange && (
              <Select
                value={confidenceFilter}
                onValueChange={onConfidenceFilterChange}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Confidence</SelectItem>
                  {confidenceLevels.map((confidence) => (
                    <SelectItem key={confidence} value={confidence}>
                      {confidence}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        <Select
          value={`${sortField}-${sortOrder}`}
          onValueChange={(value) => {
            const [field, order] = value.split('-');
            onSortChange(field, order as 'asc' | 'desc');
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated-desc">Latest First</SelectItem>
            <SelectItem value="updated-asc">Oldest First</SelectItem>
            <SelectItem value="name-asc">Name A-Z</SelectItem>
            <SelectItem value="name-desc">Name Z-A</SelectItem>
            {activeTab === 'metrics' && (
              <SelectItem value="category-asc">Category A-Z</SelectItem>
            )}
            {activeTab === 'relationships' && (
              <>
                <SelectItem value="type-asc">Type A-Z</SelectItem>
                <SelectItem value="type-desc">Type Z-A</SelectItem>
                <SelectItem value="confidence-asc">Confidence A-Z</SelectItem>
                <SelectItem value="confidence-desc">Confidence Z-A</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
