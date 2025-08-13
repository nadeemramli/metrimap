import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { CheckSquare, Search, Settings, Square } from 'lucide-react';

type TabType = 'metrics' | 'relationships';
type SortField =
  | 'name'
  | 'category'
  | 'updated'
  | 'connections'
  | 'confidence'
  | 'type';
type SortOrder = 'asc' | 'desc';

interface Column {
  key: string;
  label: string;
  sortable: boolean;
}

interface AssetsFiltersProps {
  activeTab: TabType;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  typeFilter: string;
  onTypeChange: (value: string) => void;
  confidenceFilter: string;
  onConfidenceChange: (value: string) => void;
  sortField: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField, order: SortOrder) => void;
  metricCategories: string[];
  relationshipTypes: string[];
  confidenceLevels: string[];
  visibleColumns: Set<string>;
  columnOrder: string[];
  onColumnVisibilityChange: (columnKey: string, visible: boolean) => void;
  onColumnOrderChange: (columnKey: string, newIndex: number) => void;
  getOrderedVisibleColumns: () => string[];
}

export default function AssetsFilters({
  activeTab,
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  typeFilter,
  onTypeChange,
  confidenceFilter,
  onConfidenceChange,
  sortField,
  sortOrder,
  onSortChange,
  metricCategories,
  relationshipTypes,
  confidenceLevels,
  visibleColumns,
  onColumnVisibilityChange,
  getOrderedVisibleColumns,
}: AssetsFiltersProps) {
  const metricColumns: Column[] = [
    { key: 'title', label: 'Metric', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'value', label: 'Value', sortable: false },
    { key: 'connections', label: 'Connections', sortable: true },
    { key: 'updated', label: 'Updated', sortable: true },
    { key: 'description', label: 'Description', sortable: false },
    { key: 'owner', label: 'Owner', sortable: true },
    { key: 'tags', label: 'Tags', sortable: false },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  const relationshipColumns: Column[] = [
    { key: 'relationship', label: 'Relationship', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'confidence', label: 'Confidence', sortable: true },
    { key: 'evidence', label: 'Evidence', sortable: true },
    { key: 'updated', label: 'Updated', sortable: true },
    { key: 'weight', label: 'Weight', sortable: true },
    { key: 'notes', label: 'Notes', sortable: false },
    { key: 'tags', label: 'Tags', sortable: false },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  const currentColumns =
    activeTab === 'metrics' ? metricColumns : relationshipColumns;
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

        {activeTab === 'metrics' && (
          <Select value={categoryFilter} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Categories" />
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
          <>
            <Select value={typeFilter} onValueChange={onTypeChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Types" />
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

            <Select value={confidenceFilter} onValueChange={onConfidenceChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Confidence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Confidence</SelectItem>
                {confidenceLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}

        <Select
          value={`${sortField}-${sortOrder}`}
          onValueChange={(value) => {
            const [field, order] = value.split('-');
            onSortChange(field as SortField, order as SortOrder);
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Columns
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuItem className="font-medium">
            {activeTab === 'metrics'
              ? 'Metric Columns'
              : 'Relationship Columns'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <div className="p-2 space-y-1">
            {getOrderedVisibleColumns().map((columnKey) => {
              const column = currentColumns.find((c) => c.key === columnKey);
              if (!column) return null;

              return (
                <div
                  key={column.key}
                  onClick={() => onColumnVisibilityChange(column.key, false)}
                  className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-muted"
                >
                  <CheckSquare className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{column.label}</span>
                </div>
              );
            })}
            <DropdownMenuSeparator />
            {currentColumns
              .filter((col) => !visibleColumns.has(col.key))
              .map((column) => (
                <div
                  key={column.key}
                  onClick={() => onColumnVisibilityChange(column.key, true)}
                  className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-muted"
                >
                  <Square className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">{column.label}</span>
                </div>
              ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
