import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppStore } from "@/lib/stores";
import { getProjectCollaborators } from "@/lib/supabase/services/collaborators";
import { getProjectChangelog } from "@/lib/supabase/services/changelog";
import type { Collaborator } from "@/lib/supabase/services/collaborators";
import type { ChangelogEntry } from "@/lib/supabase/services/changelog";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Save,
  Trash2,
  Clock,
  Plus,
  Download,
  Upload,
  Eye,
  Edit,
  Users,
  Calendar,
  Activity,
  Settings,
  MoreVertical,
  Search,
  Share,
  Copy,
  FileText,
  Zap,
  BarChart3,
  Network,
  User,
} from "lucide-react";
import { useProjectsStore } from "@/lib/stores";

type TabType = "general" | "data" | "changelog" | "team" | "settings";

export default function CanvasSettingsPage() {
  const { canvasId } = useParams();
  const navigate = useNavigate();
  const { projects, updateProject, deleteProject } = useProjectsStore();
  const { user } = useAppStore();

  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [changelogFilter, setChangelogFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Real data state
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([]);
  const [loadingCollaborators, setLoadingCollaborators] = useState(false);
  const [loadingChangelog, setLoadingChangelog] = useState(false);

  // Dirty state tracking for better UX
  const [isDirty, setIsDirty] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Find project from store instead of calling async function
  const currentProject = canvasId
    ? projects.find((p) => p.id === canvasId)
    : null;

  const [canvasName, setCanvasName] = useState("");
  const [canvasDescription, setCanvasDescription] = useState("");
  const [canvasLabels, setCanvasLabels] = useState("");

  // Form field change handlers that set dirty state
  const handleNameChange = (value: string) => {
    setCanvasName(value);
    setIsDirty(value !== (currentProject?.name || ""));
  };

  const handleDescriptionChange = (value: string) => {
    setCanvasDescription(value);
    setIsDirty(value !== (currentProject?.description || ""));
  };

  const handleLabelsChange = (value: string) => {
    setCanvasLabels(value);
    setIsDirty(value !== (currentProject?.tags?.join(", ") || ""));
  };

  // Load project data when available
  useEffect(() => {
    if (currentProject) {
      const name = currentProject.name || "";
      const description = currentProject.description || "";
      const labels = currentProject.tags?.join(", ") || "";

      setCanvasName(name);
      setCanvasDescription(description);
      setCanvasLabels(labels);
      setIsDirty(false); // Reset dirty state when loading fresh data
      setLoading(false);
    } else if (canvasId) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [currentProject, canvasId]);

  // Load collaborators when project changes
  useEffect(() => {
    if (currentProject?.id) {
      loadCollaborators();
    }
  }, [currentProject?.id]);

  // Load changelog when project changes
  useEffect(() => {
    if (currentProject?.id) {
      loadChangelog();
    }
  }, [currentProject?.id]);

  // Load collaborators function
  const loadCollaborators = async () => {
    if (!currentProject?.id) return;

    setLoadingCollaborators(true);
    try {
      const data = await getProjectCollaborators(currentProject.id);
      setCollaborators(data);
    } catch (error) {
      console.error("Failed to load collaborators:", error);
    } finally {
      setLoadingCollaborators(false);
    }
  };

  // Load changelog function
  const loadChangelog = async () => {
    if (!currentProject?.id) return;

    setLoadingChangelog(true);
    try {
      const data = await getProjectChangelog(currentProject.id);
      setChangelog(data);
    } catch (error) {
      console.error("Failed to load changelog:", error);
    } finally {
      setLoadingChangelog(false);
    }
  };

  // Filter data based on search and filters
  const filteredChangelog = useMemo(() => {
    return changelog.filter((entry) => {
      const userName = entry.users?.name || entry.users?.email || "Unknown";
      const matchesSearch =
        entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (entry.target_name?.toLowerCase() || "").includes(
          searchQuery.toLowerCase()
        ) ||
        userName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        changelogFilter === "all" || entry.action === changelogFilter;
      return matchesSearch && matchesFilter;
    });
  }, [changelog, searchQuery, changelogFilter]);

  const filteredMetrics = useMemo(() => {
    if (!currentProject) return [];
    return currentProject.nodes.filter(
      (node) =>
        node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [currentProject, searchQuery]);

  const tabs = [
    { id: "general" as const, label: "General", count: null },
    {
      id: "data" as const,
      label: "Data",
      count: currentProject?.nodes.length || 0,
    },
    { id: "team" as const, label: "Team", count: collaborators.length },
    {
      id: "changelog" as const,
      label: "Changelog",
      count: filteredChangelog.length,
    },
    { id: "settings" as const, label: "Settings", count: null },
  ];

  const getActionIcon = (action: string) => {
    const baseClasses = "w-8 h-8 rounded-full flex items-center justify-center";
    switch (action) {
      case "created":
        return (
          <div className={`${baseClasses} bg-green-100`}>
            <Plus className="h-4 w-4 text-green-600" />
          </div>
        );
      case "deleted":
        return (
          <div className={`${baseClasses} bg-red-100`}>
            <Trash2 className="h-4 w-4 text-red-600" />
          </div>
        );
      case "updated":
        return (
          <div className={`${baseClasses} bg-blue-100`}>
            <Edit className="h-4 w-4 text-blue-600" />
          </div>
        );
      case "shared":
        return (
          <div className={`${baseClasses} bg-purple-100`}>
            <Share className="h-4 w-4 text-purple-600" />
          </div>
        );
      case "synchronized":
        return (
          <div className={`${baseClasses} bg-green-100`}>
            <Zap className="h-4 w-4 text-green-600" />
          </div>
        );
      case "commented":
        return (
          <div className={`${baseClasses} bg-orange-100`}>
            <FileText className="h-4 w-4 text-orange-600" />
          </div>
        );
      default:
        return (
          <div className={`${baseClasses} bg-gray-100`}>
            <Activity className="h-4 w-4 text-gray-600" />
          </div>
        );
    }
  };

  const handleSave = async () => {
    if (!currentProject) return;
    if (!user?.id) {
      alert("Please log in to save changes.");
      return;
    }

    // Only include database-valid fields for the projects table
    const updatedProject = {
      name: canvasName,
      description: canvasDescription,
      tags: canvasLabels
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      updated_at: new Date().toISOString(),
      last_modified_by: user.id, // Use current user's UUID, not email
    };

    try {
      await updateProject(currentProject.id, updatedProject);
      // Show success message or handle success
      console.log("Canvas updated successfully");
      alert("Canvas updated successfully!");
    } catch (error) {
      console.error("Failed to update canvas:", error);
      alert("Failed to update canvas. Please try again.");
    }
  };

  const handleDeleteCanvas = async () => {
    if (!currentProject) return;

    setIsDeleting(true);
    try {
      await deleteProject(currentProject.id);
      // Navigate back to home after successful deletion
      navigate("/");
    } catch (error) {
      console.error("Failed to delete canvas:", error);
      alert("Failed to delete canvas. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-muted-foreground">
            Loading canvas...
          </h3>
        </div>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-muted-foreground">
            Canvas not found
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Canvas Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your canvas configuration, team, and activity
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Project Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Metrics</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentProject.nodes.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {new Set(currentProject.nodes.map((n) => n.category)).size}{" "}
              categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Relationships</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentProject.edges.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {
                currentProject.edges.filter((e) => e.confidence === "High")
                  .length
              }{" "}
              high confidence
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{collaborators.length}</div>
            <p className="text-xs text-muted-foreground">
              {
                collaborators.filter(
                  (m: Collaborator) =>
                    m.permissions?.includes("write") ||
                    ["owner", "admin", "editor"].includes(m.role)
                ).length
              }{" "}
              can edit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getTimeAgo(currentProject.updatedAt)}
            </div>
            <p className="text-xs text-muted-foreground">
              By {currentProject.lastModifiedBy}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TabType)}
        className="w-full"
      >
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
              {tab.count !== null && ` (${tab.count})`}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Search Bar for relevant tabs */}
        {(activeTab === "data" || activeTab === "changelog") && (
          <div className="flex items-center gap-4 mt-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {activeTab === "changelog" && (
              <Select
                value={changelogFilter}
                onValueChange={setChangelogFilter}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="created">Created</SelectItem>
                  <SelectItem value="updated">Updated</SelectItem>
                  <SelectItem value="deleted">Deleted</SelectItem>
                  <SelectItem value="shared">Shared</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
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
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Enter canvas name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <Textarea
                    value={canvasDescription}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                    rows={4}
                    placeholder="Describe your canvas purpose and goals"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <Input
                    value={canvasLabels}
                    onChange={(e) => handleLabelsChange(e.target.value)}
                    placeholder="Marketing, Finance, Q4"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Separate tags with commas
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Status</CardTitle>
                <CardDescription>
                  Canvas information and metadata
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Created
                    </label>
                    <div className="text-sm text-muted-foreground">
                      {new Date(currentProject.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Last Modified
                    </label>
                    <div className="text-sm text-muted-foreground">
                      {getTimeAgo(currentProject.updatedAt)}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {currentProject.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex gap-3">
                    <Button
                      onClick={handleSave}
                      disabled={!isDirty || !user?.id}
                    >
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
          </div>

          {/* Danger Zone */}
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions that affect this canvas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isDeleting}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isDeleting ? "Deleting..." : "Delete Canvas"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Canvas</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{currentProject?.name}"?
                      This action cannot be undone. All metrics, relationships,
                      and history will be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteCanvas}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete Canvas
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <p className="text-xs text-muted-foreground mt-2">
                This action cannot be undone. All metrics, relationships, and
                history will be permanently deleted.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Tab */}
        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Metric
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Last Updated
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredMetrics.map((metric) => (
                      <tr key={metric.id} className="hover:bg-muted/25">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                              <BarChart3 className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium text-foreground">
                                {metric.title}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {metric.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline">{metric.category}</Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium">No data</div>
                          <div className="text-xs text-muted-foreground">
                            Target: Not set
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {getTimeAgo(metric.updatedAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Metric
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Team Members</h3>
              <p className="text-sm text-muted-foreground">
                Manage access and permissions
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </div>

          <div className="grid gap-4">
            {loadingCollaborators ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading team members...</p>
              </div>
            ) : collaborators.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No team members yet. Invite someone to collaborate!
                </p>
              </div>
            ) : (
              collaborators.map((member) => (
                <Card key={member.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {member.users?.name || member.users?.email}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {member.users?.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            member.role === "owner" ? "default" : "secondary"
                          }
                        >
                          {member.role}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          {member.joined_at
                            ? `Joined ${getTimeAgo(member.joined_at)}`
                            : "Invited"}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Change Role
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Settings className="mr-2 h-4 w-4" />
                              Permissions
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Changelog Tab */}
        <TabsContent value="changelog" className="space-y-4">
          <div className="space-y-4">
            {loadingChangelog ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading changelog...</p>
              </div>
            ) : filteredChangelog.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No activity yet.</p>
              </div>
            ) : (
              filteredChangelog.map((entry) => (
                <Card key={entry.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {getActionIcon(entry.action)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-foreground">
                            {entry.users?.name ||
                              entry.users?.email ||
                              "Unknown"}
                          </span>
                          <span className="text-muted-foreground">
                            {entry.action}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {entry.target}
                          </Badge>
                          <span className="font-mono text-sm bg-muted px-2 py-0.5 rounded">
                            {entry.target_name}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {entry.description}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {getTimeAgo(entry.timestamp || "")}
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Import & Export</CardTitle>
                <CardDescription>Manage your canvas data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Canvas Data
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export Canvas Data
                </Button>
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Configure alert preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Email notifications</div>
                    <div className="text-sm text-muted-foreground">
                      Get notified of changes
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Data quality alerts</div>
                    <div className="text-sm text-muted-foreground">
                      Alert on data issues
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
