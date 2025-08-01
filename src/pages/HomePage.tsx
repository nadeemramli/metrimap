import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  Users,
  Eye,
  Copy,
  Trash2,
  Settings,
  Clock,
  Star,
  BarChart3,
  Network,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  Folder,
  FileText,
} from "lucide-react";
import { useProjectsStore, useAppStore } from "@/lib/stores";
import type { CanvasProject } from "@/lib/types";
import QuickSearchCommand, {
  useQuickSearch,
} from "@/components/search/QuickSearchCommand";
import AdvancedSearchModal from "@/components/search/AdvancedSearchModal";
import {
  useKeyboardShortcuts,
  createShortcut,
} from "@/hooks/useKeyboardShortcuts";
import { UserMenu } from "@/components/layout/UserMenu";
import { getTagColor } from "@/lib/utils/tag-colors";
import { CanvasPreview } from "@/components/canvas/CanvasPreview";

type SortOption = "name" | "updated" | "created" | "nodes" | "edges";
type ViewMode = "grid" | "list";

export default function HomePage() {
  const navigate = useNavigate();
  const {
    projects,
    addProject,
    duplicateProject,
    deleteProject,
    updateProject,
    initializeProjects,
  } = useProjectsStore();
  const { setCurrentCanvas } = useAppStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("updated");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [activeTab, setActiveTab] = useState("all");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [isCreatingCanvas, setIsCreatingCanvas] = useState(false);

  // Search functionality
  const quickSearch = useQuickSearch();

  // Global keyboard shortcuts
  const shortcuts = useMemo(
    () => [
      createShortcut.cmd("k", quickSearch.open, "Open quick search", "Search"),
      createShortcut.key("?", quickSearch.open, "Open quick search", "Search"),
      createShortcut.shift(
        "f",
        () => setShowAdvancedSearch(true),
        "Open advanced search",
        "Search"
      ),
    ],
    [quickSearch.open]
  );

  useKeyboardShortcuts(shortcuts, { enabled: true });

  // Initialize projects store on component mount
  useEffect(() => {
    initializeProjects();
  }, [initializeProjects]);

  // Recent projects (updated in last 1 day)
  const isRecentProject = (project: CanvasProject) => {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    return new Date(project.updatedAt) > oneDayAgo;
  };

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects.filter((project) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => project.tags.includes(tag));

      // Tab filtering
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "recent" && isRecentProject(project)) ||
        (activeTab === "starred" && project.tags.includes("starred"));

      return matchesSearch && matchesTags && matchesTab;
    });

    // Sort projects
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "updated":
          comparison =
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case "created":
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "nodes":
          comparison = a.nodes.length - b.nodes.length;
          break;
        case "edges":
          comparison = a.edges.length - b.edges.length;
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [projects, searchQuery, selectedTags, sortBy, sortOrder, activeTab]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach((project) => {
      project.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).filter((tag) => tag !== "starred");
  }, [projects]);

  const recentProjects = projects.filter(isRecentProject);
  const starredProjects = projects.filter((p) => p.tags.includes("starred"));

  const handleCreateCanvas = async () => {
    if (isCreatingCanvas) return; // Prevent multiple clicks

    setIsCreatingCanvas(true);
    try {
      const newProjectData = {
        name: "New Canvas",
        description: "New business model canvas",
        tags: ["New"],
        collaborators: [],
        nodes: [],
        edges: [],
        groups: [],
        settings: {},
        lastModifiedBy: "Current User",
      };

      const newProjectId = await addProject(newProjectData);
      setCurrentCanvas(newProjectId);
      navigate(`/canvas/${newProjectId}`);
    } catch (error) {
      console.error("Failed to create canvas:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      alert(
        `Failed to create canvas: ${errorMessage}\n\nPlease make sure you're logged in and try again.`
      );
    } finally {
      setIsCreatingCanvas(false);
    }
  };

  const handleOpenCanvas = (canvasId: string) => {
    setCurrentCanvas(canvasId);
    navigate(`/canvas/${canvasId}`);
  };

  const handleDuplicateProject = async (projectId: string) => {
    try {
      const duplicatedProjectId = await duplicateProject(projectId);
      setCurrentCanvas(duplicatedProjectId);
      navigate(`/canvas/${duplicatedProjectId}`);
    } catch (error) {
      console.error("Failed to duplicate project:", error);
      alert("Failed to duplicate project. Please try again.");
    }
  };

  const handleDeleteProject = (projectId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this project? This action cannot be undone."
      )
    ) {
      deleteProject(projectId);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleStar = async (projectId: string) => {
    try {
      const project = projects.find((p) => p.id === projectId);
      if (!project) return;

      const isStarred = project.tags.includes("starred");
      const updatedTags = isStarred
        ? project.tags.filter((tag) => tag !== "starred")
        : [...project.tags, "starred"];

      await updateProject(projectId, { tags: updatedTags });
    } catch (error) {
      console.error("Failed to toggle star:", error);
    }
  };

  const renderProjectCard = (project: CanvasProject) => (
    <Card
      key={project.id}
      className="group hover:shadow-lg transition-all duration-300 ease-out border hover:border-primary/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div
            className="flex-1 cursor-pointer"
            onClick={() => handleOpenCanvas(project.id)}
          >
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg">{project.name}</CardTitle>
              {project.tags.includes("starred") && (
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
              className="w-56 p-2 bg-white border border-gray-200 shadow-lg rounded-lg"
            >
              <DropdownMenuItem
                onClick={() => handleOpenCanvas(project.id)}
                className="flex items-center px-3 py-2.5 rounded-md hover:bg-gray-50 transition-colors cursor-pointer text-sm font-medium"
              >
                <span>Open Canvas</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDuplicateProject(project.id)}
                className="flex items-center px-3 py-2.5 rounded-md hover:bg-gray-50 transition-colors cursor-pointer text-sm font-medium"
              >
                <span>Duplicate</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toggleStar(project.id)}
                className="flex items-center px-3 py-2.5 rounded-md hover:bg-gray-50 transition-colors cursor-pointer text-sm font-medium"
              >
                <span>
                  {project.tags.includes("starred")
                    ? "Remove Star"
                    : "Add Star"}
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 bg-gray-200" />
              <DropdownMenuItem className="flex items-center px-3 py-2.5 rounded-md hover:bg-gray-50 transition-colors cursor-pointer text-sm font-medium">
                <span>Project Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteProject(project.id)}
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
            onClick={() => handleOpenCanvas(project.id)}
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
          {project.tags.filter((tag) => tag !== "starred").length > 0 && (
            <div className="flex flex-wrap gap-1">
              {project.tags
                .filter((tag) => tag !== "starred")
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

  const renderProjectTable = (projects: CanvasProject[]) => (
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
                  onClick={() => handleOpenCanvas(project.id)}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium transition-all duration-300 group-hover:font-semibold">
                      {project.name}
                    </span>
                    {project.tags.includes("starred") && (
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
                  {project.nodes.length}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-center">
              <div className="flex items-center justify-center gap-1 p-2 rounded-md transition-all duration-300 group-hover:bg-green-50 group-hover:scale-105">
                <Network className="h-3 w-3 text-green-500 transition-transform duration-300 group-hover:scale-110" />
                <span className="font-medium transition-all duration-300 group-hover:font-semibold">
                  {project.edges.length}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-center">
              <div className="flex items-center justify-center gap-1 p-2 rounded-md transition-all duration-300 group-hover:bg-purple-50 group-hover:scale-105">
                <Folder className="h-3 w-3 text-purple-500 transition-transform duration-300 group-hover:scale-110" />
                <span className="font-medium transition-all duration-300 group-hover:font-semibold">
                  {project.groups?.length || 0}
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
              {project.tags.filter((tag) => tag !== "starred").length > 0 ? (
                <div className="flex flex-wrap gap-1 p-2 rounded-md transition-all duration-300 group-hover:bg-muted/30">
                  {project.tags
                    .filter((tag) => tag !== "starred")
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
                  {project.tags.filter((tag) => tag !== "starred").length >
                    3 && (
                    <Badge
                      variant="gray"
                      className="text-xs font-medium px-2 py-0.5 transition-all duration-300 ease-out hover:scale-105 active:scale-95 hover:shadow-sm"
                    >
                      +
                      {project.tags.filter((tag) => tag !== "starred").length -
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
                      onClick={() => handleOpenCanvas(project.id)}
                      className="flex items-center px-3 py-2.5 rounded-md hover:bg-gray-50 transition-colors cursor-pointer text-sm font-medium"
                    >
                      <span>Open Canvas</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDuplicateProject(project.id)}
                      className="flex items-center px-3 py-2.5 rounded-md hover:bg-gray-50 transition-colors cursor-pointer text-sm font-medium"
                    >
                      <span>Duplicate</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => toggleStar(project.id)}
                      className="flex items-center px-3 py-2.5 rounded-md hover:bg-gray-50 transition-colors cursor-pointer text-sm font-medium"
                    >
                      <span>
                        {project.tags.includes("starred")
                          ? "Remove Star"
                          : "Add Star"}
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1 bg-gray-200" />
                    <DropdownMenuItem className="flex items-center px-3 py-2.5 rounded-md hover:bg-gray-50 transition-colors cursor-pointer text-sm font-medium">
                      <span>Project Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteProject(project.id)}
                      className="flex items-center px-3 py-2.5 rounded-md hover:bg-red-50 transition-colors cursor-pointer text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      <span>Delete Project</span>
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10 w-full">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold transition-all duration-300 hover:scale-105 cursor-pointer">
              Metrimap
            </h1>
            <UserMenu />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8 max-w-19/20 mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="bg-gray-100 rounded-lg p-[3px] shadow-sm">
              <TabsTrigger
                value="all"
                className="h-[calc(100%-1px)] flex-1 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-foreground data-[state=inactive]:text-foreground data-[state=inactive]:bg-transparent transition-all duration-300"
              >
                All Projects
                <span className="inline-flex items-center justify-center rounded-full bg-gray-300 text-secondary-foreground text-xs font-medium w-5 h-5 min-w-5 min-h-5 p-0">
                  {projects.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="recent"
                className="h-[calc(100%-1px)] flex-1 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-foreground data-[state=inactive]:text-foreground data-[state=inactive]:bg-transparent transition-all duration-300"
              >
                Recent
                <span className="inline-flex items-center justify-center rounded-full bg-gray-300 text-secondary-foreground text-xs font-medium w-5 h-5 min-w-5 min-h-5 p-0">
                  {recentProjects.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="starred"
                className="h-[calc(100%-1px)] flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-foreground data-[state=inactive]:text-foreground data-[state=inactive]:bg-transparent transition-all duration-300"
              >
                Starred
                <span className="inline-flex items-center justify-center rounded-full bg-gray-300 text-secondary-foreground text-xs font-medium w-5 h-5 min-w-5 min-h-5 p-0">
                  {starredProjects.length}
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Controls */}
          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleCreateCanvas}
                  className="gap-2 rounded-md whitespace-nowrap bg-black hover:bg-zinc-900 text-white font-medium shadow-sm transition-all duration-300 ease-out hover:shadow-lg hover:scale-105 active:scale-95"
                  disabled={isCreatingCanvas}
                  size="sm"
                >
                  <span className="relative flex items-center">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-4 h-4 rounded-full bg-white">
                      <Plus className="h-3 w-3 text-black" />
                    </span>
                    <span className="pl-6">
                      {isCreatingCanvas ? "Creating..." : "New Canvas"}
                    </span>
                  </span>
                </Button>
                <div className="relative flex-1 max-w-md group">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-all duration-300 group-focus-within:text-primary group-hover:text-primary" />
                  <Input
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 transition-all duration-300 ease-out hover:shadow-md focus:shadow-lg focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <Select
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value as SortOption)}
                >
                  <SelectTrigger className="w-[180px] transition-all duration-300 ease-out hover:shadow-md focus:shadow-lg focus:ring-2 focus:ring-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="updated">Last Updated</SelectItem>
                    <SelectItem value="created">Date Created</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="nodes">Metric Count</SelectItem>
                    <SelectItem value="edges">Relationship Count</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="transition-all duration-300 ease-out hover:shadow-md hover:scale-105 active:scale-95"
                >
                  {sortOrder === "asc" ? (
                    <SortAsc className="h-4 w-4 transition-transform duration-300" />
                  ) : (
                    <SortDesc className="h-4 w-4 transition-transform duration-300" />
                  )}
                </Button>

                <div className="flex items-center border rounded-md shadow-sm">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none hover:bg-accent transition-all duration-300 ease-out hover:scale-105 active:scale-95"
                    title="Grid view"
                  >
                    <Grid3X3 className="h-4 w-4 transition-transform duration-300" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none border-l hover:bg-accent transition-all duration-300 ease-out hover:scale-105 active:scale-95"
                    title="List view"
                  >
                    <List className="h-4 w-4 transition-transform duration-300" />
                  </Button>
                </div>
                {searchQuery.trim() !== "" && (
                  <div className="text-sm text-muted-foreground">
                    {filteredAndSortedProjects.length} of {projects.length}{" "}
                    projects
                  </div>
                )}
              </div>
            </div>

            {allTags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Filter by tags:
                </span>
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={
                      selectedTags.includes(tag) ? "default" : getTagColor(tag)
                    }
                    className="cursor-pointer hover:bg-primary/80 font-medium px-2.5 py-1 shadow-sm transition-all duration-300 ease-out hover:scale-105 active:scale-95 hover:shadow-md"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
                {selectedTags.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTags([])}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Project Lists */}
          <TabsContent value="all" className="mt-0">
            {filteredAndSortedProjects.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedProjects.map((project) =>
                    renderProjectCard(project)
                  )}
                </div>
              ) : (
                renderProjectTable(filteredAndSortedProjects)
              )
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <Network className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  {projects.length === 0
                    ? "No projects yet"
                    : "No projects match your criteria"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {projects.length === 0
                    ? "Create your first canvas to start mapping your business architecture"
                    : "Try adjusting your search terms or filters"}
                </p>
                {projects.length === 0 && (
                  <Button
                    onClick={handleCreateCanvas}
                    className="gap-2"
                    disabled={isCreatingCanvas}
                  >
                    <Plus className="h-4 w-4" />
                    {isCreatingCanvas
                      ? "Creating..."
                      : "Create Your First Canvas"}
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="recent" className="mt-0">
            {recentProjects.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentProjects.map((project) => renderProjectCard(project))}
                </div>
              ) : (
                renderProjectTable(recentProjects)
              )
            ) : (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No recent projects</h3>
                <p className="text-muted-foreground">
                  Projects you've worked on in the last 7 days will appear here
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="starred" className="mt-0">
            {starredProjects.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {starredProjects.map((project) => renderProjectCard(project))}
                </div>
              ) : (
                renderProjectTable(starredProjects)
              )
            ) : (
              <div className="text-center py-12">
                <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">
                  No starred projects
                </h3>
                <p className="text-muted-foreground">
                  Star your favorite projects to find them quickly
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Quick Search */}
      <QuickSearchCommand
        isOpen={quickSearch.isOpen}
        onClose={quickSearch.close}
        onResultSelect={(result) => {
          // Handle search result selection
          switch (result.type) {
            case "metric":
              // Navigate to canvas containing the metric
              navigate(`/canvas/1`); // TODO: Get actual canvas ID
              break;
            case "relationship":
              // Navigate to canvas containing the relationship
              navigate(`/canvas/1`); // TODO: Get actual canvas ID
              break;
            case "evidence":
              navigate("/evidence");
              break;
          }
        }}
      />

      {/* Advanced Search */}
      <AdvancedSearchModal
        isOpen={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
        onResultSelect={(result) => {
          // Handle advanced search result selection
          switch (result.type) {
            case "metric":
              navigate(`/canvas/1`); // TODO: Get actual canvas ID
              break;
            case "relationship":
              navigate(`/canvas/1`); // TODO: Get actual canvas ID
              break;
            case "evidence":
              navigate("/evidence");
              break;
          }
        }}
      />
    </div>
  );
}
