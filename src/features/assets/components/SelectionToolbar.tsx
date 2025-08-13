import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Download, Edit, MoreVertical, Tag, Trash2 } from 'lucide-react';

type TabType = 'metrics' | 'relationships';

interface SelectionToolbarProps {
  activeTab: TabType;
  selectedMetricIds: Set<string>;
  selectedRelationshipIds: Set<string>;
  onClearSelection: () => void;
  onOpenTagDialog: () => void;
  onBulkDelete: () => void;
  onEditSelected: () => void;
}

export default function SelectionToolbar({
  activeTab,
  selectedMetricIds,
  selectedRelationshipIds,
  onClearSelection,
  onOpenTagDialog,
  onBulkDelete,
  onEditSelected,
}: SelectionToolbarProps) {
  const hasSelection =
    (activeTab === 'metrics' && selectedMetricIds.size > 0) ||
    (activeTab === 'relationships' && selectedRelationshipIds.size > 0);

  if (!hasSelection) return null;

  const selectedCount =
    activeTab === 'metrics'
      ? selectedMetricIds.size
      : selectedRelationshipIds.size;
  const itemType = activeTab === 'metrics' ? 'metric' : 'relationship';

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-blue-900">
            {selectedCount} {itemType}
            {selectedCount > 1 ? 's' : ''} selected
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="text-blue-700 hover:text-blue-900"
          >
            Clear Selection
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenTagDialog}
            className="flex items-center gap-1"
          >
            <Tag className="h-4 w-4" />
            Add Tags
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onBulkDelete}
            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
          >
            <Trash2 className="h-4 w-4" />
            Delete Selected
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEditSelected}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Selected
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Export Selected
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={onBulkDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete All Selected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
