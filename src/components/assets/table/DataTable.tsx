import { Card, CardContent } from '@/components/ui/card';

interface Column {
  key: string;
  label: string;
  sortable: boolean;
  width: string;
}

interface DataTableProps<T> {
  columns: Column[];
  data: T[];
  visibleColumns: Set<string>;
  columnOrder: string[];
  selectedItems: Set<string>;
  onSelectItem: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  renderCell: (item: T, columnKey: string) => React.ReactNode;
  getItemId: (item: T) => string;
  emptyState: React.ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  visibleColumns,
  columnOrder,
  selectedItems,
  onSelectItem,
  onSelectAll,
  renderCell,
  getItemId,
  emptyState,
}: DataTableProps<T>) {
  const orderedVisibleColumns = columnOrder.filter((col) =>
    visibleColumns.has(col)
  );
  const allSelected = selectedItems.size === data.length && data.length > 0;

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-12">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                {orderedVisibleColumns.map((columnKey) => {
                  const column = columns.find((c) => c.key === columnKey);
                  if (!column) return null;

                  return (
                    <th
                      key={columnKey}
                      className={`px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider border-r border-border ${column.width}`}
                    >
                      {column.label}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.length > 0 ? (
                data.map((item) => {
                  const itemId = getItemId(item);
                  return (
                    <tr
                      key={itemId}
                      className="hover:bg-muted/30 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 w-12">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(itemId)}
                          onChange={(e) =>
                            onSelectItem(itemId, e.target.checked)
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      {orderedVisibleColumns.map((columnKey) => {
                        const column = columns.find((c) => c.key === columnKey);
                        if (!column) return null;

                        return (
                          <td
                            key={columnKey}
                            className={`px-6 py-4 ${column.width}`}
                          >
                            {renderCell(item, columnKey)}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={orderedVisibleColumns.length + 1}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    {emptyState}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
