import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Download, Edit, MoreVertical, Tag, Trash2 } from 'lucide-react';

interface BulkActionToolbarProps {
  activeTab: 'metrics' | 'relationships';
  selectedCount: number;
  onClearSelection: () => void;
  onBulkAddTags: () => void;
  onBulkDelete: () => void;
  onBulkEdit?: () => void;
  onBulkExport?: () => void;
}

export function BulkActionToolbar({
  activeTab,
  selectedCount,
  onClearSelection,
  onBulkAddTags,
  onBulkDelete,
  onBulkEdit,
  onBulkExport,
}: BulkActionToolbarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-blue-900">
            {selectedCount}{' '}
            {activeTab === 'metrics' ? 'metric' : 'relationship'}
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
            onClick={onBulkAddTags}
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
              {onBulkEdit && (
                <DropdownMenuItem onClick={onBulkEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Selected
                </DropdownMenuItem>
              )}
              {onBulkExport && (
                <DropdownMenuItem onClick={onBulkExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Selected
                </DropdownMenuItem>
              )}
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

export default BulkActionToolbar;
