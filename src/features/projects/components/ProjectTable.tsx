import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import type { CanvasProject } from '@/shared/types';
import { getTagColor } from '@/shared/utils/tag-colors';
import {
  BarChart3,
  Folder,
  MoreVertical,
  Network,
  Star,
  Users,
} from 'lucide-react';

interface ProjectTableProps {
  projects: CanvasProject[];
  onOpenCanvas: (canvasId: string) => void;
  onDuplicateProject: (projectId: string) => void;
  onToggleStar: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onProjectSettings: (projectId: string) => void;
  onArchive: (projectId: string) => void;
  onRestore: (projectId: string) => void;
  spaces?: Array<{ id: string; name: string }>;
  onMoveToSpace?: (projectId: string, spaceId: string | null) => void;
  onSaveAsTemplate?: (projectId: string) => void;
}

export function ProjectTable({
  projects,
  onOpenCanvas,
  onDuplicateProject,
  onToggleStar,
  onDeleteProject,
  onProjectSettings,
  onArchive,
  onRestore,
  spaces = [],
  onMoveToSpace,
  onSaveAsTemplate,
}: ProjectTableProps) {
  return (
    <Table className="transition-all duration-300">
      <TableHeader>
        <TableRow className="hover:bg-muted/30 transition-all duration-300">
          <TableHead className="w-[250px] transition-all duration-300">
            Project
          </TableHead>
          <TableHead className="text-center transition-all duration-300">
            Metrics
          </TableHead>
          <TableHead className="text-center transition-all duration-300">
            Relationships
          </TableHead>
          <TableHead className="text-center transition-all duration-300">
            Groups
          </TableHead>
          <TableHead className="text-center transition-all duration-300">
            Collaborators
          </TableHead>
          <TableHead className="transition-all duration-300">Tags</TableHead>
          <TableHead className="transition-all duration-300">
            Last Updated
          </TableHead>
          <TableHead className="text-right transition-all duration-300">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow
            key={project.id}
            className="hover:bg-muted/50 transition-all duration-300 ease-out cursor-pointer hover:scale-[1.01] active:scale-[0.99] group"
          >
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <div
                  className="cursor-pointer hover:text-primary transition-all duration-300 ease-out hover:scale-[1.02] group-hover:shadow-sm p-2 rounded-md"
                  onClick={() => onOpenCanvas(project.id)}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium transition-all duration-300 group-hover:font-semibold">
                      {project.name}
                    </span>
                    {project.isStarred && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current transition-transform duration-300 group-hover:scale-110" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1 transition-all duration-300 group-hover:text-foreground">
                    {project.description}
                  </p>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-center">
              <div className="flex items-center justify-center gap-1 p-2 rounded-md transition-all duration-300 group-hover:bg-blue-50 group-hover:scale-105">
                <BarChart3 className="h-3 w-3 text-blue-500 transition-transform duration-300 group-hover:scale-110" />
                <span className="font-medium transition-all duration-300 group-hover:font-semibold">
                  {project.nodeCount ?? project.nodes.length}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-center">
              <div className="flex items-center justify-center gap-1 p-2 rounded-md transition-all duration-300 group-hover:bg-green-50 group-hover:scale-105">
                <Network className="h-3 w-3 text-green-500 transition-transform duration-300 group-hover:scale-110" />
                <span className="font-medium transition-all duration-300 group-hover:font-semibold">
                  {project.edgeCount ?? project.edges.length}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-center">
              <div className="flex items-center justify-center gap-1 p-2 rounded-md transition-all duration-300 group-hover:bg-purple-50 group-hover:scale-105">
                <Folder className="h-3 w-3 text-purple-500 transition-transform duration-300 group-hover:scale-110" />
                <span className="font-medium transition-all duration-300 group-hover:font-semibold">
                  {project.groupCount ?? project.groups?.length ?? 0}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-center">
              <div className="flex items-center justify-center gap-1 p-2 rounded-md transition-all duration-300 group-hover:bg-orange-50 group-hover:scale-105">
                <Users className="h-3 w-3 text-orange-500 transition-transform duration-300 group-hover:scale-110" />
                <span className="font-medium transition-all duration-300 group-hover:font-semibold">
                  {project.collaborators.length}
                </span>
              </div>
            </TableCell>
            <TableCell>
              {project.tags.filter((tag) => tag !== 'starred').length > 0 ? (
                <div className="flex flex-wrap gap-1 p-2 rounded-md transition-all duration-300 group-hover:bg-muted/30">
                  {project.tags
                    .filter((tag) => tag !== 'starred')
                    .slice(0, 3)
                    .map((tag) => (
                      <Badge
                        key={tag}
                        variant={getTagColor(tag)}
                        className="text-xs font-medium px-2 py-0.5 transition-all duration-300 ease-out hover:scale-105 active:scale-95 hover:shadow-sm"
                      >
                        {tag}
                      </Badge>
                    ))}
                  {project.tags.filter((tag) => tag !== 'starred').length >
                    3 && (
                    <Badge
                      variant="gray"
                      className="text-xs font-medium px-2 py-0.5 transition-all duration-300 ease-out hover:scale-105 active:scale-95 hover:shadow-sm"
                    >
                      +
                      {project.tags.filter((tag) => tag !== 'starred').length -
                        3}
                    </Badge>
                  )}
                </div>
              ) : (
                <span className="text-muted-foreground text-sm p-2 rounded-md transition-all duration-300 group-hover:bg-muted/30">
                  No tags
                </span>
              )}
            </TableCell>
            <TableCell>
              <div className="p-2 rounded-md transition-all duration-300 group-hover:bg-muted/30">
                <span className="text-sm font-medium transition-all duration-300 group-hover:font-semibold">
                  {new Date(project.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end p-2 rounded-md transition-all duration-300 group-hover:bg-muted/30">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="transition-all duration-300 ease-out hover:scale-110 active:scale-95 hover:bg-primary/10 rounded-full p-2"
                    >
                      <MoreVertical className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 p-2 bg-white border border-gray-200 shadow-lg rounded-lg"
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
                    {onSaveAsTemplate && (
                      <DropdownMenuItem
                        onClick={() => onSaveAsTemplate(project.id)}
                        className="flex items-center px-3 py-2.5 rounded-md hover:bg-gray-50 transition-colors cursor-pointer text-sm font-medium"
                      >
                        <span>Save as Template</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => onToggleStar(project.id)}
                      className="flex items-center px-3 py-2.5 rounded-md hover:bg-gray-50 transition-colors cursor-pointer text-sm font-medium"
                    >
                      <span>
                        {project.isStarred ? 'Remove Star' : 'Add Star'}
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1 bg-gray-200" />
                    <DropdownMenuItem
                      onClick={() => onProjectSettings(project.id)}
                      className="flex items-center px-3 py-2.5 rounded-md hover:bg-gray-50 transition-colors cursor-pointer text-sm font-medium"
                    >
                      <span>Project Settings</span>
                    </DropdownMenuItem>
                    {project.archivedAt ? (
                      <DropdownMenuItem
                        onClick={() => onRestore(project.id)}
                        className="flex items-center px-3 py-2.5 rounded-md hover:bg-gray-50 transition-colors cursor-pointer text-sm font-medium"
                      >
                        <span>Restore from Archive</span>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() => onArchive(project.id)}
                        className="flex items-center px-3 py-2.5 rounded-md hover:bg-gray-50 transition-colors cursor-pointer text-sm font-medium"
                      >
                        <span>Archive</span>
                      </DropdownMenuItem>
                    )}
                    {onMoveToSpace && (
                      <>
                        <DropdownMenuSeparator className="my-1 bg-gray-200" />
                        <DropdownMenuLabel className="px-3 text-xs text-muted-foreground">
                          Move to Space
                        </DropdownMenuLabel>
                        {project.spaceId && (
                          <DropdownMenuItem
                            onClick={() => onMoveToSpace(project.id, null)}
                            className="flex items-center px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer text-sm"
                          >
                            <span>Uncategorized</span>
                          </DropdownMenuItem>
                        )}
                        {spaces
                          .filter((s) => s.id !== project.spaceId)
                          .map((s) => (
                            <DropdownMenuItem
                              key={s.id}
                              onClick={() => onMoveToSpace(project.id, s.id)}
                              className="flex items-center px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer text-sm"
                            >
                              <span>{s.name}</span>
                            </DropdownMenuItem>
                          ))}
                        <DropdownMenuSeparator className="my-1 bg-gray-200" />
                      </>
                    )}
                    <DropdownMenuItem
                      onClick={() => onDeleteProject(project.id)}
                      className="flex items-center px-3 py-2.5 rounded-md hover:bg-red-50 transition-colors cursor-pointer text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      <span>
                        {project.archivedAt
                          ? 'Delete Permanently'
                          : 'Delete Project'}
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
