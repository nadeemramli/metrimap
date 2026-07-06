import { Section } from '@/features/canvas/components/settings/Section';
import { useCanvasStore } from '@/lib/stores';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { EnhancedTagInput } from '@/shared/components/ui/enhanced-tag-input';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import type { Collaborator } from '@/shared/lib/supabase/services/collaborators';
import { formatDate } from '@/shared/utils/formatDate';
import {
  Copy,
  Download,
  FileText,
  Tags,
  Trash2,
  TriangleAlert,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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
  collaborators?: Collaborator[];
  isLoadingCollaborators?: boolean;
  onDuplicate?: () => Promise<void> | void;
}

function memberInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
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
  const navigate = useNavigate();
  const canvas = useCanvasStore((s) => s.canvas);

  const createdAt = (currentProject?.createdAt ||
    currentProject?.created_at) as string | undefined;

  const handleExport = () => {
    try {
      const blob = new Blob([JSON.stringify(canvas ?? currentProject, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(canvasName || 'canvas').replace(/[^\w-]+/g, '-')}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Canvas exported as JSON');
    } catch (e) {
      console.error('Failed to export canvas:', e);
      toast.error('Failed to export canvas');
    }
  };

  return (
    <div className="space-y-5">
      {/* About this canvas */}
      <Section
        icon={FileText}
        title="About"
        description="Name, description, and tags for this canvas."
        action={
          <div className="flex items-center gap-2">
            {onDuplicate && (
              <Button variant="outline" size="sm" onClick={onDuplicate}>
                <Copy className="mr-1.5 h-3.5 w-3.5" />
                Duplicate
              </Button>
            )}
            <Button size="sm" disabled={!isDirty} onClick={onSave}>
              Save changes
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="canvas-name">Name</Label>
            <Input
              id="canvas-name"
              value={canvasName}
              onChange={(e) => onNameChange(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="canvas-description">Description</Label>
            <Textarea
              id="canvas-description"
              rows={3}
              value={canvasDescription}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="What is this canvas for?"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>Tags</Label>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-muted-foreground"
                onClick={onOpenTagManagement}
              >
                <Tags className="mr-1 h-3.5 w-3.5" />
                Manage tags
              </Button>
            </div>
            <EnhancedTagInput
              tags={canvasTags}
              onAdd={(tag) => onTagsChange([...canvasTags, tag])}
              onRemove={(tag) =>
                onTagsChange(canvasTags.filter((t) => t !== tag))
              }
            />
            <p className="text-xs text-muted-foreground">
              Press Enter or comma to add a tag.
            </p>
          </div>
          <p className="border-t border-border pt-3 text-xs text-muted-foreground">
            Created {formatDate(createdAt)}
          </p>
        </div>
      </Section>

      {/* People — read-only glance; management lives in the Collaboration
          panel (guests) and Workspace Settings (org members). */}
      <Section
        icon={Users}
        title="People"
        description="Invite guests and change roles from the canvas Collaboration panel. Workspace members are managed in Workspace Settings."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/settings/workspace')}
          >
            Workspace settings
          </Button>
        }
      >
        {isLoadingCollaborators ? (
          <p className="py-2 text-sm text-muted-foreground">Loading people…</p>
        ) : collaborators.length === 0 ? (
          <p className="py-2 text-sm text-muted-foreground">
            No guest collaborators on this canvas yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {collaborators.map((member) => {
              const name =
                member.users?.name || member.users?.email || 'Unknown';
              return (
                <li
                  key={member.id}
                  className="flex items-center gap-3 rounded-md border border-border px-3 py-2"
                >
                  <Avatar className="h-8 w-8">
                    {member.users?.avatar_url && (
                      <AvatarImage src={member.users.avatar_url} alt={name} />
                    )}
                    <AvatarFallback className="text-xs">
                      {memberInitials(name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{name}</div>
                    {member.users?.email && (
                      <div className="truncate text-xs text-muted-foreground">
                        {member.users.email}
                      </div>
                    )}
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {member.role}
                  </Badge>
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      {/* Data */}
      <Section
        icon={Download}
        title="Data"
        description="Download a full JSON snapshot of this canvas — nodes, relationships, and groups. PNG/PDF/CSV exports live in the canvas Collaboration panel."
        action={
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Export JSON
          </Button>
        }
      />

      {/* Danger zone */}
      <Section
        icon={TriangleAlert}
        title="Danger zone"
        description="Deleting a canvas removes all its metrics, relationships, checkpoints, and history. This cannot be undone."
        destructive
        action={
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            disabled={isDeleting}
          >
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            {isDeleting ? 'Deleting…' : 'Delete canvas'}
          </Button>
        }
      />

      <p className="px-1 text-xs text-muted-foreground">
        Looking for notification preferences? They're personal, not
        per-canvas —{' '}
        <button
          type="button"
          className="underline underline-offset-2 hover:text-foreground"
          onClick={() => navigate('/settings')}
        >
          configure them in Account Settings
        </button>
        .
      </p>
    </div>
  );
}
