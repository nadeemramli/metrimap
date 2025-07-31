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
} from "lucide-react";
import { useProjectsStore, useAppStore } from "@/lib/stores";
import type { CanvasProject } from "@/lib/types";

type SortOption = "name" | "updated" | "created" | "nodes" | "edges";
type ViewMode = "grid" | "list";

export default function HomePage() {
  const navigate = useNavigate();
  const {
    projects,
    addProject,
    duplicateProject,
    deleteProject,
    initializeProjects,
  } = useProjectsStore();
  const { setCurrentCanvas } = useAppStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("updated");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [activeTab, setActiveTab] = useState("all");

  // Initialize projects store on component mount
  useEffect(() => {
    initializeProjects();
  }, [initializeProjects]);

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
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

  // Recent projects (updated in last 7 days)
  const isRecentProject = (project: CanvasProject) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return new Date(project.updatedAt) > sevenDaysAgo;
  };

  const recentProjects = projects.filter(isRecentProject);
  const starredProjects = projects.filter((p) => p.tags.includes("starred"));

  const handleCreateCanvas = () => {
    const newId = Date.now().toString();
    const newProject: CanvasProject = {
      id: newId,
      name: "New Canvas",
      description: "New business model canvas",
      tags: ["New"],
      collaborators: [],
      nodes: [],
      edges: [],
      groups: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastModifiedBy: "Current User",
    };

    addProject(newProject);
    setCurrentCanvas(newId);
    navigate(`/canvas/${newId}`);
  };

  const handleOpenCanvas = (canvasId: string) => {
    setCurrentCanvas(canvasId);
    navigate(`/canvas/${canvasId}`);
  };

  const handleDuplicateProject = (projectId: string) => {
    const duplicatedProject = duplicateProject(projectId);
    if (duplicatedProject) {
      setCurrentCanvas(duplicatedProject.id);
      navigate(`/canvas/${duplicatedProject.id}`);
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

  const toggleStar = (projectId: string) => {
    // TODO: Implement star toggle in project store
    console.log("Toggle star for project:", projectId);
  };

  const renderProjectCard = (project: CanvasProject) => (
    <Card
      key={project.id}
      className="group hover:shadow-lg transition-all duration-200 border hover:border-primary/20"
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
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleOpenCanvas(project.id)}>
                <Eye className="mr-2 h-4 w-4" />
                Open Canvas
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDuplicateProject(project.id)}
              >
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleStar(project.id)}>
                <Star className="mr-2 h-4 w-4" />
                {project.tags.includes("starred") ? "Remove Star" : "Add Star"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Project Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteProject(project.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Canvas Preview Area */}
          <div
            className="h-24 bg-muted/30 rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center cursor-pointer"
            onClick={() => handleOpenCanvas(project.id)}
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <Network className="h-5 w-5" />
              <span className="text-sm">Canvas Preview</span>
            </div>
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
                  <Badge key={tag} variant="outline" className="text-xs">
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Metrimap</h1>
              <p className="text-muted-foreground mt-1">
                Visual business architecture mapping
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button onClick={handleCreateCanvas} className="gap-2">
                <Plus className="h-4 w-4" />
                New Canvas
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="grid w-[400px] grid-cols-3">
              <TabsTrigger value="all">
                All Projects ({projects.length})
              </TabsTrigger>
              <TabsTrigger value="recent">
                <Clock className="h-3 w-3 mr-1" />
                Recent ({recentProjects.length})
              </TabsTrigger>
              <TabsTrigger value="starred">
                <Star className="h-3 w-3 mr-1" />
                Starred ({starredProjects.length})
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Controls */}
          <div className="mb-8 space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as SortOption)}
              >
                <SelectTrigger className="w-[180px]">
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
              >
                {sortOrder === "asc" ? (
                  <SortAsc className="h-4 w-4" />
                ) : (
                  <SortDesc className="h-4 w-4" />
                )}
              </Button>

              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none border-l"
                >
                  <List className="h-4 w-4" />
                </Button>
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
                      selectedTags.includes(tag) ? "default" : "secondary"
                    }
                    className="cursor-pointer hover:bg-primary/80"
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedProjects.map((project) =>
                  renderProjectCard(project)
                )}
              </div>
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
                  <Button onClick={handleCreateCanvas} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Your First Canvas
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="recent" className="mt-0">
            {recentProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentProjects.map((project) => renderProjectCard(project))}
              </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {starredProjects.map((project) => renderProjectCard(project))}
              </div>
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
    </div>
  );
}
