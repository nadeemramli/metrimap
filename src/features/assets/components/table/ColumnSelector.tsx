import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { CheckSquare, Settings, Square } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  sortable: boolean;
  width: string;
}

interface ColumnSelectorProps {
  columns: Column[];
  visibleColumns: Set<string>;
  columnOrder: string[];
  onToggleColumn: (columnKey: string) => void;
  onReorderColumns: (newOrder: string[]) => void;
  activeTab: 'metrics' | 'relationships';
}

export function ColumnSelector({
  columns,
  visibleColumns,
  columnOrder,
  onToggleColumn,
  onReorderColumns,
  activeTab,
}: ColumnSelectorProps) {
  const orderedVisibleColumns = columnOrder.filter((col) =>
    visibleColumns.has(col)
  );

  const handleDragStart = (e: React.DragEvent, columnKey: string) => {
    e.dataTransfer.setData('text/plain', columnKey);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetColumnKey: string) => {
    e.preventDefault();
    const draggedColumnKey = e.dataTransfer.getData('text/plain');

    if (draggedColumnKey !== targetColumnKey) {
      const newOrder = [...columnOrder];
      const draggedIndex = newOrder.indexOf(draggedColumnKey);
      const targetIndex = newOrder.indexOf(targetColumnKey);

      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedColumnKey);

      onReorderColumns(newOrder);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuItem className="font-medium">
          {activeTab === 'metrics' ? 'Metric Columns' : 'Relationship Columns'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="p-2 space-y-1">
          {orderedVisibleColumns.map((columnKey) => {
            const column = columns.find((c) => c.key === columnKey);
            if (!column) return null;

            return (
              <div
                key={column.key}
                draggable
                onDragStart={(e) => handleDragStart(e, column.key)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.key)}
                onClick={() => onToggleColumn(column.key)}
                className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-muted"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
                <CheckSquare className="h-4 w-4 text-green-600" />
                <span className="text-sm">{column.label}</span>
              </div>
            );
          })}
          <DropdownMenuSeparator />
          {columns
            .filter((col) => !visibleColumns.has(col.key))
            .map((column) => (
              <div
                key={column.key}
                onClick={() => onToggleColumn(column.key)}
                className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-muted"
              >
                <div className="w-4 h-4"></div>
                <Square className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">{column.label}</span>
              </div>
            ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ColumnSelector;
