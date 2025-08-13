import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import type { MetricCard, Relationship } from '@/shared/types';
import { getCategoryColor } from '@/shared/utils/metricUtils';
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

type RendererProps = Omit<MetricTableCellProps, 'columnKey'>;

const metricCellRenderers: Record<
  string,
  (props: RendererProps) => JSX.Element | null
> = {
  title: ({ metric }) => (
    <div className="font-medium text-foreground">{metric.title}</div>
  ),
  category: ({ metric }) => (
    <Badge variant="outline" className={getCategoryColor(metric.category)}>
      {metric.category}
    </Badge>
  ),
  value: ({ metric }) => (
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
  ),
  connections: ({ metric, relationships }) => (
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
  ),
  updated: ({ metric }) => (
    <div className="flex items-center gap-1 text-sm text-muted-foreground min-h-[2.5rem]">
      <Calendar className="h-3 w-3" />
      {new Date(metric.updatedAt).toLocaleDateString()}
    </div>
  ),
  description: ({ metric }) => (
    <div className="text-sm text-muted-foreground max-w-xs truncate min-h-[2.5rem] flex items-center">
      {metric.description || 'No description'}
    </div>
  ),
  owner: ({ metric }) => (
    <div className="text-sm text-muted-foreground min-h-[2.5rem] flex items-center">
      {metric.assignees?.[0] || 'Unassigned'}
    </div>
  ),
  tags: ({ metric, metricTags, isLoadingTags }) => (
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
  ),
  actions: ({ metric, onEdit, onDelete }) => (
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
  ),
};

export function MetricTableCell(props: MetricTableCellProps) {
  const { columnKey, ...rest } = props;
  const renderer = metricCellRenderers[columnKey];
  return renderer ? renderer(rest) : null;
}

export default MetricTableCell;
