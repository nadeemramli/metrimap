import { CanvasPreview } from '@/components/canvas/homepage/CanvasPreview';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { CanvasProject } from '@/lib/types';
import { getTagColor } from '@/lib/utils/tag-colors';
import {
  BarChart3,
  Calendar,
  Folder,
  MoreVertical,
  Network,
  Star,
  Users,
} from 'lucide-react';

interface ProjectCardProps {
  project: CanvasProject;
  onOpenCanvas: (canvasId: string) => void;
  onDuplicateProject: (projectId: string) => void;
  onToggleStar: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
}

export function ProjectCard({
  project,
  onOpenCanvas,
  onDuplicateProject,
  onToggleStar,
  onDeleteProject,
}: ProjectCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 ease-out border hover:border-primary/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div
            className="flex-1 cursor-pointer"
            onClick={() => onOpenCanvas(project.id)}
          >
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg">{project.name}</CardTitle>
              {project.tags.includes('starred') && (
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
              )}
            </div>
            <CardDescription className="line-clamp-2">
              {project.description}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out hover:bg-muted/50 hover:scale-105 active:scale-95 rounded-full p-2"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
            >
              <DropdownMenuItem
                onClick={() => onOpenCanvas(project.id)}
                className="flex items-center px-3 py-2.5 rounded-md hover:bg-gray-50 transition-colors cursor-pointer text-sm font-medium"
              >
                <span>Open Canvas</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDuplicateProject(project.id)}
                className="flex items-center px-3 py-2.5 rounded-md hover:bg-gray-50 transition-colors cursor-pointer text-sm font-medium"
              >
                <span>Duplicate</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onToggleStar(project.id)}
                className="flex items-center px-3 py-2.5 rounded-md hover:bg-gray-50 transition-colors cursor-pointer text-sm font-medium"
              >
                <span>
                  {project.tags.includes('starred')
                    ? 'Remove Star'
                    : 'Add Star'}
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 bg-gray-200" />
              <DropdownMenuItem className="flex items-center px-3 py-2.5 rounded-md hover:bg-gray-50 transition-colors cursor-pointer text-sm font-medium">
                <span>Project Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeleteProject(project.id)}
                className="flex items-center px-3 py-2.5 rounded-md hover:bg-red-50 transition-colors cursor-pointer text-sm font-medium text-red-600 hover:text-red-700"
              >
                <span>Delete Project</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Canvas Preview Area */}
          <div
            className="h-24 bg-muted/30 rounded border-2 border-dashed border-muted-foreground/20 cursor-pointer transition-all duration-300 ease-out hover:bg-muted/50 hover:border-primary/30 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
            onClick={() => onOpenCanvas(project.id)}
          >
            {project.nodes && project.nodes.length > 0 ? (
              <CanvasPreview
                nodes={project.nodes}
                edges={project.edges}
                className="w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="flex items-center gap-2 text-muted-foreground transition-all duration-300 group-hover:text-primary">
                  <Network className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  <span className="text-sm">Canvas Preview</span>
                </div>
              </div>
            )}
          </div>

          {/* Project Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <BarChart3 className="h-3 w-3 text-blue-500" />
              {project.nodes.length} metrics
            </div>
            <div className="flex items-center gap-1">
              <Network className="h-3 w-3 text-green-500" />
              {project.edges.length} relationships
            </div>
            <div className="flex items-center gap-1">
              <Folder className="h-3 w-3 text-purple-500" />
              {project.groups?.length || 0} groups
            </div>
          </div>

          {/* Tags */}
          {project.tags.filter((tag) => tag !== 'starred').length > 0 && (
            <div className="flex flex-wrap gap-1">
              {project.tags
                .filter((tag) => tag !== 'starred')
                .map((tag) => (
                  <Badge
                    key={tag}
                    variant={getTagColor(tag)}
                    className="text-xs font-medium px-2.5 py-1 shadow-sm"
                  >
                    {tag}
                  </Badge>
                ))}
            </div>
          )}

          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Updated {new Date(project.updatedAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {project.collaborators.length} collaborators
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
