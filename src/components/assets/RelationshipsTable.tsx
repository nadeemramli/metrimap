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
import type { MetricCard, Relationship } from '@/lib/types';
import { getRelationshipTypeColor } from '@/lib/utils/metricUtils';
import {
  Calendar,
  Edit,
  FileText,
  MoreVertical,
  Settings,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface RelationshipsTableProps {
  relationships: Relationship[];
  visibleColumns: Set<string>;
  columnOrder: string[];
  selectedRelationshipIds: Set<string>;
  relationshipTags: Record<string, string[]>;
  isLoadingTags: boolean;
  getNodeById: (nodeId: string) => MetricCard | null;
  onRelationshipSelection: (relationshipId: string, checked: boolean) => void;
  onOpenRelationshipSheet: (relationshipId: string) => void;
  onDeleteRelationship: (relationshipId: string) => Promise<void>;
  onSelectAllRelationships: (checked: boolean) => void;
  onSort: (field: string) => void;
  onAddTagsToRelationship: (
    relationshipId: string,
    tags: string[]
  ) => Promise<void>;
}

export default function RelationshipsTable({
  relationships,
  visibleColumns,
  columnOrder,
  selectedRelationshipIds,
  relationshipTags,
  isLoadingTags,
  getNodeById,
  onRelationshipSelection,
  onOpenRelationshipSheet,
  onDeleteRelationship,
  onSelectAllRelationships,
  onSort,
  onAddTagsToRelationship,
}: RelationshipsTableProps) {
  const [expandedTagInputs, setExpandedTagInputs] = useState<Set<string>>(
    new Set()
  );

  const relationshipColumns = [
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

  const getOrderedVisibleColumns = () => {
    return columnOrder.filter((col) => visibleColumns.has(col));
  };

  const toggleTagInput = (relationshipId: string) => {
    const newExpanded = new Set(expandedTagInputs);
    if (newExpanded.has(relationshipId)) {
      newExpanded.delete(relationshipId);
    } else {
      newExpanded.add(relationshipId);
    }
    setExpandedTagInputs(newExpanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'High':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
                      relationships.length > 0 &&
                      selectedRelationshipIds.size === relationships.length
                    }
                    onChange={(e) => onSelectAllRelationships(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </th>
                {getOrderedVisibleColumns().map((columnKey) => {
                  const column = relationshipColumns.find(
                    (c) => c.key === columnKey
                  );
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
              {relationships.map((relationship) => {
                const sourceNode = getNodeById(relationship.sourceId);
                const targetNode = getNodeById(relationship.targetId);

                return (
                  <tr
                    key={relationship.id}
                    className={`hover:bg-muted/30 ${
                      selectedRelationshipIds.has(relationship.id)
                        ? 'bg-blue-50'
                        : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRelationshipIds.has(relationship.id)}
                        onChange={(e) =>
                          onRelationshipSelection(
                            relationship.id,
                            e.target.checked
                          )
                        }
                        className="rounded border-gray-300"
                      />
                    </td>

                    {getOrderedVisibleColumns().map((columnKey) => {
                      switch (columnKey) {
                        case 'relationship':
                          return (
                            <td key={columnKey} className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="font-medium text-foreground">
                                  {sourceNode?.title} → {targetNode?.title}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {sourceNode?.id} → {targetNode?.id}
                                </span>
                              </div>
                            </td>
                          );

                        case 'type':
                          return (
                            <td
                              key={columnKey}
                              className="px-6 py-4 whitespace-nowrap"
                            >
                              <Badge
                                variant="secondary"
                                className={getRelationshipTypeColor(
                                  relationship.type
                                )}
                              >
                                {relationship.type}
                              </Badge>
                            </td>
                          );

                        case 'confidence':
                          return (
                            <td
                              key={columnKey}
                              className="px-6 py-4 whitespace-nowrap"
                            >
                              <Badge
                                variant="secondary"
                                className={getConfidenceColor(
                                  relationship.confidence
                                )}
                              >
                                {relationship.confidence}
                              </Badge>
                            </td>
                          );

                        case 'evidence':
                          return (
                            <td
                              key={columnKey}
                              className="px-6 py-4 whitespace-nowrap"
                            >
                              <div className="flex items-center gap-1">
                                <FileText className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  {relationship.evidence?.length || 0}
                                </span>
                              </div>
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
                                  {formatDate(relationship.updatedAt)}
                                </span>
                              </div>
                            </td>
                          );

                        case 'weight':
                          return (
                            <td
                              key={columnKey}
                              className="px-6 py-4 whitespace-nowrap"
                            >
                              <span className="font-mono text-sm">
                                {relationship.weight?.toFixed(2) || '0.00'}
                              </span>
                            </td>
                          );

                        case 'notes':
                          return (
                            <td key={columnKey} className="px-6 py-4">
                              <span className="text-sm text-muted-foreground line-clamp-2">
                                {relationship.notes || '-'}
                              </span>
                            </td>
                          );

                        case 'tags':
                          return (
                            <td key={columnKey} className="px-6 py-4">
                              <div className="space-y-2">
                                <div className="flex flex-wrap gap-1">
                                  {relationshipTags[relationship.id]
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
                                  {relationshipTags[relationship.id]?.length >
                                    2 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      +
                                      {relationshipTags[relationship.id]
                                        .length - 2}
                                    </Badge>
                                  )}
                                </div>
                                {expandedTagInputs.has(relationship.id) && (
                                  <EnhancedTagInput
                                    value={
                                      relationshipTags[relationship.id] || []
                                    }
                                    onChange={async (tags) => {
                                      await onAddTagsToRelationship(
                                        relationship.id,
                                        tags
                                      );
                                      toggleTagInput(relationship.id);
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
                                    onClick={() =>
                                      onOpenRelationshipSheet(relationship.id)
                                    }
                                  >
                                    <Settings className="mr-2 h-4 w-4" />
                                    Settings
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      toggleTagInput(relationship.id)
                                    }
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    {expandedTagInputs.has(relationship.id)
                                      ? 'Cancel Tags'
                                      : 'Edit Tags'}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() =>
                                      onDeleteRelationship(relationship.id)
                                    }
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
                );
              })}
            </tbody>
          </table>

          {relationships.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No relationships found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
