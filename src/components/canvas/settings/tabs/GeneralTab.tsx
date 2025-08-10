import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TagInput } from '@/components/ui/tag-input';
import { Textarea } from '@/components/ui/textarea';
import { COMMON_PROJECT_TAGS } from '@/lib/constants/tags';
import type { CanvasProject } from '@/lib/types';
import { Copy, Save, Tag, Trash2 } from 'lucide-react';
import { ImportExportCard } from '../cards/ImportExportCard';
import { NotificationsCard } from '../cards/NotificationsCard';
import { TeamMembersCard } from '../cards/TeamMembersCard';

interface GeneralTabProps {
  currentProject: CanvasProject;
  canvasName: string;
  canvasDescription: string;
  canvasTags: string[];
  isDirty: boolean;
  isDeleting: boolean;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onTagsChange: (tags: string[]) => void;
  onSave: () => void;
  onDelete: () => void;
  onOpenTagManagement: () => void;
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
}: GeneralTabProps) {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update your canvas name and description
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Canvas Name
              </label>
              <Input
                value={canvasName}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="Enter canvas name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <Textarea
                value={canvasDescription}
                onChange={(e) => onDescriptionChange(e.target.value)}
                rows={4}
                placeholder="Describe your canvas purpose and goals"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <TagInput
                tags={canvasTags}
                onChange={onTagsChange}
                placeholder="Add a tag..."
                maxTags={10}
                suggestions={COMMON_PROJECT_TAGS}
              />
            </div>

            <div className="pt-4 border-t">
              <div className="flex gap-3">
                <Button onClick={onSave} disabled={!isDirty}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Canvas Details</CardTitle>
            <CardDescription>
              View canvas metadata and manage actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Created</label>
              <div className="text-sm text-muted-foreground">
                {new Date(currentProject.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Canvas Tags
              </label>
              <div className="text-sm text-muted-foreground mb-2">
                Manage tags used within this canvas for metrics and
                relationships
              </div>
              <Button
                variant="outline"
                onClick={onOpenTagManagement}
                className="w-full"
              >
                <Tag className="h-4 w-4 mr-2" />
                Manage Canvas Tags
              </Button>
            </div>

            <div className="pt-4 border-t border-red-200">
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-red-700 mb-2">
                    Danger Zone
                  </h4>
                  <p className="text-xs text-red-600 mb-3">
                    Irreversible actions that affect this canvas
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      disabled={isDeleting}
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {isDeleting ? 'Deleting...' : 'Delete Canvas'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Canvas</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{currentProject?.name}
                        "? This action cannot be undone. All metrics,
                        relationships, and history will be permanently deleted.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={onDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete Canvas
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <p className="text-xs text-red-600">
                  This action cannot be undone. All metrics, relationships, and
                  history will be permanently deleted.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members */}
      <TeamMembersCard />

      {/* Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ImportExportCard />
        <NotificationsCard />
      </div>
    </div>
  );
}
