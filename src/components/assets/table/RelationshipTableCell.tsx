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
import { getRelationshipTypeColor } from '@/lib/utils/metricUtils';
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  FileText,
  MoreVertical,
  Trash2,
} from 'lucide-react';

interface RelationshipTableCellProps {
  relationship: Relationship;
  columnKey: string;
  getNodeById: (id: string) => MetricCard | undefined;
  relationshipTags: Record<string, string[]>;
  isLoadingTags: boolean;
  onEdit: (relationshipId: string) => void;
  onDelete: (relationshipId: string) => void;
}

export function RelationshipTableCell({
  relationship,
  columnKey,
  getNodeById,
  relationshipTags,
  isLoadingTags,
  onEdit,
  onDelete,
}: RelationshipTableCellProps) {
  const sourceNode = getNodeById(relationship.sourceId);
  const targetNode = getNodeById(relationship.targetId);

  switch (columnKey) {
    case 'relationship':
      return (
        <div className="flex items-center gap-2 min-h-[2.5rem]">
          <div className="text-sm font-medium">
            {sourceNode?.title || 'Unknown'}
          </div>
          <div className="text-muted-foreground">→</div>
          <div className="text-sm font-medium">
            {targetNode?.title || 'Unknown'}
          </div>
        </div>
      );

    case 'notes':
      return (
        <div className="text-sm text-muted-foreground max-w-xs truncate min-h-[2.5rem] flex items-center">
          {relationship.notes || 'No notes'}
        </div>
      );

    case 'type':
      return (
        <div className="min-h-[2.5rem] flex items-center">
          <Badge
            variant="outline"
            className={getRelationshipTypeColor(relationship.type)}
          >
            {relationship.type}
          </Badge>
        </div>
      );

    case 'confidence':
      return (
        <div className="flex items-center gap-2 min-h-[2.5rem]">
          {relationship.confidence === 'High' && (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
          {relationship.confidence === 'Medium' && (
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          )}
          {relationship.confidence === 'Low' && (
            <Clock className="h-4 w-4 text-red-500" />
          )}
          <span className="text-sm">{relationship.confidence}</span>
        </div>
      );

    case 'evidence':
      return (
        <div className="flex items-center gap-1 min-h-[2.5rem]">
          <FileText className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{relationship.evidence.length} items</span>
        </div>
      );

    case 'updated':
      return (
        <div className="flex items-center gap-1 text-sm text-muted-foreground min-h-[2.5rem]">
          <Calendar className="h-3 w-3" />
          {new Date(relationship.updatedAt).toLocaleDateString()}
        </div>
      );

    case 'weight':
      return (
        <div className="text-sm font-medium min-h-[2.5rem] flex items-center">
          {relationship.weight || 0}
        </div>
      );

    case 'tags':
      return (
        <div className="flex flex-wrap gap-1 min-h-[2.5rem] items-center">
          {isLoadingTags ? (
            <span className="text-xs text-muted-foreground">Loading...</span>
          ) : (
            <>
              {relationshipTags[relationship.id]
                ?.slice(0, 2)
                .map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              {relationshipTags[relationship.id] &&
                relationshipTags[relationship.id].length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{relationshipTags[relationship.id].length - 2}
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
              <DropdownMenuItem onClick={() => onEdit(relationship.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(relationship.id)}
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
