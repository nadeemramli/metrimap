import { ImportExportCard } from '@/features/canvas/components/settings/cards/ImportExportCard';
import { NotificationsCard } from '@/features/canvas/components/settings/cards/NotificationsCard';
import { TeamMembersCard } from '@/features/canvas/components/settings/cards/TeamMembersCard';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { EnhancedTagInput } from '@/shared/components/ui/enhanced-tag-input';
import { Copy, Tag, Trash2 } from 'lucide-react';

interface Props {
  currentProject: any;
  canvasName: string;
  canvasDescription: string;
  canvasTags: string[];
  isDirty: boolean;
  isDeleting: boolean;
  onNameChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onTagsChange: (tags: string[]) => void;
  onSave: () => Promise<void> | void;
  onDelete: () => Promise<void> | void;
  onOpenTagManagement: () => void;
  collaborators?: any[];
  isLoadingCollaborators?: boolean;
  onDuplicate?: () => Promise<void> | void;
}

export function GeneralTab({
  currentProject,
  canvasName,
  canvasDescription,
  canvasTags,
  isDirty,
  isDeleting,
  onNameChange,
  onDescriptionChange,
  onTagsChange,
  onSave,
  onDelete,
  onOpenTagManagement,
  collaborators = [],
  isLoadingCollaborators = false,
  onDuplicate,
}: Props) {
  const createdAt = (currentProject?.createdAt ||
    currentProject?.created_at) as string | undefined;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update your canvas name and description
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Canvas Name
              </label>
              <input
                className="w-full border rounded px-3 py-2 text-sm"
                value={canvasName}
                onChange={(e) => onNameChange(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                className="w-full border rounded px-3 py-2 text-sm"
                rows={4}
                value={canvasDescription}
                onChange={(e) => onDescriptionChange(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tags</label>
              <EnhancedTagInput
                tags={canvasTags}
                onAdd={(tag) => onTagsChange([...canvasTags, tag])}
                onRemove={(tag) =>
                  onTagsChange(canvasTags.filter((t) => t !== tag))
                }
              />
              <div className="text-xs text-muted-foreground mt-1">
                Press Enter or comma to add tags
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Button variant="outline" disabled={!isDirty} onClick={onSave}>
                Save Changes
              </Button>
              {onDuplicate && (
                <Button variant="outline" onClick={onDuplicate}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Canvas Details */}
        <Card>
          <CardHeader>
            <CardTitle>Canvas Details</CardTitle>
            <CardDescription>
              View canvas metadata and manage actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-1">
                Created
              </div>
              <div className="text-sm">
                {createdAt ? new Date(createdAt).toLocaleDateString() : '-'}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-1">
                Canvas Tags
              </div>
              <div className="flex items-center gap-2">
                <div className="flex flex-wrap gap-1">
                  {canvasTags.slice(0, 3).map((t) => (
                    <Badge key={t} variant="secondary">
                      {t}
                    </Badge>
                  ))}
                  {canvasTags.length > 3 && (
                    <Badge variant="gray">+{canvasTags.length - 3}</Badge>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onOpenTagManagement}
                >
                  <Tag className="h-4 w-4 mr-2" />
                  Manage Canvas Tags
                </Button>
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-destructive mb-2">
                Danger Zone
              </div>
              <div className="text-xs text-muted-foreground mb-3">
                This action cannot be undone. All metrics, relationships, and
                history will be permanently deleted.
              </div>
              <Button
                variant="destructive"
                onClick={onDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? 'Deleting...' : 'Delete Canvas'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members */}
      <TeamMembersCard
        collaborators={collaborators}
        isLoading={isLoadingCollaborators}
      />

      {/* Bottom row: Import & Export | Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ImportExportCard />
        <NotificationsCard />
      </div>
    </div>
  );
}
