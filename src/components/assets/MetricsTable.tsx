import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EnhancedTagInput } from '@/components/ui/enhanced-tag-input';
import type { MetricCard } from '@/lib/types';
import { getCategoryColor } from '@/lib/utils/metricUtils';
import { Calendar, Edit, MoreVertical, Settings, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface MetricsTableProps {
  metrics: MetricCard[];
  visibleColumns: Set<string>;
  columnOrder: string[];
  selectedMetricIds: Set<string>;
  metricTags: Record<string, string[]>;
  isLoadingTags: boolean;
  onMetricSelection: (metricId: string, checked: boolean) => void;
  onOpenCardSettings: (cardId: string) => void;
  onDeleteMetric: (metricId: string) => Promise<void>;
  onSelectAllMetrics: (checked: boolean) => void;
  onSort: (field: string) => void;
  onAddTagsToMetric: (metricId: string, tags: string[]) => Promise<void>;
}

export default function MetricsTable({
  metrics,
  visibleColumns,
  columnOrder,
  selectedMetricIds,
  metricTags,
  isLoadingTags,
  onMetricSelection,
  onOpenCardSettings,
  onDeleteMetric,
  onSelectAllMetrics,
  onSort,
  onAddTagsToMetric,
}: MetricsTableProps) {
  const [expandedTagInputs, setExpandedTagInputs] = useState<Set<string>>(
    new Set()
  );

  const metricColumns = [
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

  const getOrderedVisibleColumns = () => {
    return columnOrder.filter((col) => visibleColumns.has(col));
  };

  const toggleTagInput = (metricId: string) => {
    const newExpanded = new Set(expandedTagInputs);
    if (newExpanded.has(metricId)) {
      newExpanded.delete(metricId);
    } else {
      newExpanded.add(metricId);
    }
    setExpandedTagInputs(newExpanded);
  };

  const formatValue = (metric: MetricCard) => {
    if (!metric.value) return '-';

    const value =
      typeof metric.value === 'number'
        ? metric.value
        : parseFloat(metric.value);
    if (isNaN(value)) return metric.value;

    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

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
                    checked={
                      metrics.length > 0 &&
                      selectedMetricIds.size === metrics.length
                    }
                    onChange={(e) => onSelectAllMetrics(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </th>
                {getOrderedVisibleColumns().map((columnKey) => {
                  const column = metricColumns.find((c) => c.key === columnKey);
                  if (!column) return null;

                  return (
                    <th
                      key={column.key}
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground"
                      onClick={() => column.sortable && onSort(column.key)}
                    >
                      {column.label}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="bg-background divide-y divide-border">
              {metrics.map((metric) => (
                <tr
                  key={metric.id}
                  className={`hover:bg-muted/30 ${
                    selectedMetricIds.has(metric.id) ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedMetricIds.has(metric.id)}
                      onChange={(e) =>
                        onMetricSelection(metric.id, e.target.checked)
                      }
                      className="rounded border-gray-300"
                    />
                  </td>

                  {getOrderedVisibleColumns().map((columnKey) => {
                    switch (columnKey) {
                      case 'title':
                        return (
                          <td key={columnKey} className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-medium text-foreground">
                                {metric.title}
                              </span>
                              {metric.subtitle && (
                                <span className="text-sm text-muted-foreground">
                                  {metric.subtitle}
                                </span>
                              )}
                            </div>
                          </td>
                        );

                      case 'category':
                        return (
                          <td
                            key={columnKey}
                            className="px-6 py-4 whitespace-nowrap"
                          >
                            <Badge
                              variant="secondary"
                              className={getCategoryColor(metric.category)}
                            >
                              {metric.category}
                            </Badge>
                          </td>
                        );

                      case 'value':
                        return (
                          <td
                            key={columnKey}
                            className="px-6 py-4 whitespace-nowrap"
                          >
                            <span className="font-mono text-sm">
                              {formatValue(metric)}
                            </span>
                          </td>
                        );

                      case 'connections':
                        return (
                          <td
                            key={columnKey}
                            className="px-6 py-4 whitespace-nowrap"
                          >
                            <span className="text-sm text-muted-foreground">
                              {metric.connections || 0}
                            </span>
                          </td>
                        );

                      case 'updated':
                        return (
                          <td
                            key={columnKey}
                            className="px-6 py-4 whitespace-nowrap"
                          >
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {formatDate(metric.updatedAt)}
                              </span>
                            </div>
                          </td>
                        );

                      case 'description':
                        return (
                          <td key={columnKey} className="px-6 py-4">
                            <span className="text-sm text-muted-foreground line-clamp-2">
                              {metric.description || '-'}
                            </span>
                          </td>
                        );

                      case 'owner':
                        return (
                          <td
                            key={columnKey}
                            className="px-6 py-4 whitespace-nowrap"
                          >
                            <span className="text-sm">
                              {metric.owner || '-'}
                            </span>
                          </td>
                        );

                      case 'tags':
                        return (
                          <td key={columnKey} className="px-6 py-4">
                            <div className="space-y-2">
                              <div className="flex flex-wrap gap-1">
                                {metricTags[metric.id]
                                  ?.slice(0, 2)
                                  .map((tag) => (
                                    <Badge
                                      key={tag}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                {metricTags[metric.id]?.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{metricTags[metric.id].length - 2}
                                  </Badge>
                                )}
                              </div>
                              {expandedTagInputs.has(metric.id) && (
                                <EnhancedTagInput
                                  value={metricTags[metric.id] || []}
                                  onChange={async (tags) => {
                                    await onAddTagsToMetric(metric.id, tags);
                                    toggleTagInput(metric.id);
                                  }}
                                  placeholder="Add tags..."
                                  disabled={isLoadingTags}
                                />
                              )}
                            </div>
                          </td>
                        );

                      case 'actions':
                        return (
                          <td
                            key={columnKey}
                            className="px-6 py-4 whitespace-nowrap"
                          >
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => onOpenCardSettings(metric.id)}
                                >
                                  <Settings className="mr-2 h-4 w-4" />
                                  Settings
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => toggleTagInput(metric.id)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  {expandedTagInputs.has(metric.id)
                                    ? 'Cancel Tags'
                                    : 'Edit Tags'}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => onDeleteMetric(metric.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        );

                      default:
                        return null;
                    }
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {metrics.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No metrics found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
