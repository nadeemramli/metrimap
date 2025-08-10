import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { MetricCard, Relationship } from '@/lib/types';
import { getCategoryColor } from '@/lib/utils/metricUtils';
import { Calendar, Edit, MoreVertical, Network, Trash2 } from 'lucide-react';

interface MetricTableCellProps {
  metric: MetricCard;
  columnKey: string;
  relationships: Relationship[];
  metricTags: Record<string, string[]>;
  isLoadingTags: boolean;
  onEdit: (metricId: string) => void;
  onDelete: (metricId: string) => void;
}

export function MetricTableCell({
  metric,
  columnKey,
  relationships,
  metricTags,
  isLoadingTags,
  onEdit,
  onDelete,
}: MetricTableCellProps) {
  switch (columnKey) {
    case 'title':
      return <div className="font-medium text-foreground">{metric.title}</div>;

    case 'category':
      return (
        <Badge variant="outline" className={getCategoryColor(metric.category)}>
          {metric.category}
        </Badge>
      );

    case 'value':
      return (
        <div className="min-h-[2.5rem] flex flex-col justify-center">
          <div className="text-sm font-medium">
            {metric.data && metric.data.length > 0
              ? `${metric.data[0].value}`
              : 'No data'}
          </div>
          <div className="text-xs text-muted-foreground">
            {metric.data && metric.data.length > 0
              ? `Period: ${metric.data[0].period}`
              : ''}
          </div>
        </div>
      );

    case 'connections':
      return (
        <div className="flex items-center gap-1 min-h-[2.5rem]">
          <Network className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">
            {
              relationships.filter(
                (r) => r.sourceId === metric.id || r.targetId === metric.id
              ).length
            }
          </span>
        </div>
      );

    case 'updated':
      return (
        <div className="flex items-center gap-1 text-sm text-muted-foreground min-h-[2.5rem]">
          <Calendar className="h-3 w-3" />
          {new Date(metric.updatedAt).toLocaleDateString()}
        </div>
      );

    case 'description':
      return (
        <div className="text-sm text-muted-foreground max-w-xs truncate min-h-[2.5rem] flex items-center">
          {metric.description || 'No description'}
        </div>
      );

    case 'owner':
      return (
        <div className="text-sm text-muted-foreground min-h-[2.5rem] flex items-center">
          {metric.assignees?.[0] || 'Unassigned'}
        </div>
      );

    case 'tags':
      return (
        <div className="flex flex-wrap gap-1 min-h-[2.5rem] items-center">
          {isLoadingTags ? (
            <span className="text-xs text-muted-foreground">Loading...</span>
          ) : (
            <>
              {metricTags[metric.id]
                ?.slice(0, 2)
                .map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              {metricTags[metric.id] && metricTags[metric.id].length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{metricTags[metric.id].length - 2}
                </Badge>
              )}
            </>
          )}
        </div>
      );

    case 'actions':
      return (
        <div className="flex items-center justify-center min-h-[2.5rem]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(metric.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(metric.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );

    default:
      return null;
  }
}
