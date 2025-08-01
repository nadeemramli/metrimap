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
import { TagInput } from "@/components/ui/tag-input";
import { COMMON_PROJECT_TAGS } from "@/lib/constants/tags";
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
  User,
} from "lucide-react";
import { useProjectsStore } from "@/lib/stores";

type TabType = "general" | "changelog";

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
  const [canvasTags, setCanvasTags] = useState<string[]>([]);

  // Form field change handlers that set dirty state
  const handleNameChange = (value: string) => {
    setCanvasName(value);
    const tagsChanged =
      JSON.stringify(canvasTags.sort()) !==
      JSON.stringify((currentProject?.tags || []).sort());
    setIsDirty(
      value !== (currentProject?.name || "") ||
        canvasDescription !== (currentProject?.description || "") ||
        tagsChanged
    );
  };

  const handleDescriptionChange = (value: string) => {
    setCanvasDescription(value);
    const tagsChanged =
      JSON.stringify(canvasTags.sort()) !==
      JSON.stringify((currentProject?.tags || []).sort());
    setIsDirty(
      canvasName !== (currentProject?.name || "") ||
        value !== (currentProject?.description || "") ||
        tagsChanged
    );
  };

  const handleTagsChange = (tags: string[]) => {
    setCanvasTags(tags);
    const originalTags = currentProject?.tags || [];
    const tagsChanged =
      JSON.stringify(tags.sort()) !== JSON.stringify(originalTags.sort());
    setIsDirty(
      tagsChanged ||
        canvasName !== (currentProject?.name || "") ||
        canvasDescription !== (currentProject?.description || "")
    );
  };

  // Load project data when available
  useEffect(() => {
    if (currentProject) {
      const name = currentProject.name || "";
      const description = currentProject.description || "";
      const tags = currentProject.tags || [];

      setCanvasName(name);
      setCanvasDescription(description);
      setCanvasTags(tags);
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
      tags: canvasTags,
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
            Manage your canvas configuration and activity
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TabType)}
        className="w-full"
      >
        <div className="flex items-center justify-between mb-6">
          <TabsList className="bg-gray-100 rounded-lg p-[3px] shadow-sm">
            <TabsTrigger
              value="general"
              className="h-[calc(100%-1px)] flex-1 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-foreground data-[state=inactive]:text-foreground data-[state=inactive]:bg-transparent transition-all duration-300"
            >
              General
            </TabsTrigger>
            <TabsTrigger
              value="changelog"
              className="h-[calc(100%-1px)] flex-1 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-foreground data-[state=inactive]:text-foreground data-[state=inactive]:bg-transparent transition-all duration-300"
            >
              Changelog
              <span className="inline-flex items-center justify-center rounded-full bg-gray-300 text-secondary-foreground text-xs font-medium w-5 h-5 min-w-5 min-h-5 p-0">
                {changelog.length}
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Search Bar for changelog */}
        {activeTab === "changelog" && (
          <div className="flex items-center gap-4 mt-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search changelog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={changelogFilter} onValueChange={setChangelogFilter}>
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
          </div>
        )}

        {/* General Tab - Consolidated */}
        <TabsContent value="general" className="space-y-6">
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
                  <TagInput
                    tags={canvasTags}
                    onChange={handleTagsChange}
                    placeholder="Add a tag..."
                    maxTags={10}
                    suggestions={COMMON_PROJECT_TAGS}
                  />
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

            <Card>
              <CardHeader>
                <CardTitle>Canvas Details</CardTitle>
                <CardDescription>
                  View canvas metadata and manage actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Created
                  </label>
                  <div className="text-sm text-muted-foreground">
                    {new Date(currentProject.createdAt).toLocaleDateString()}
                  </div>
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
                          {isDeleting ? "Deleting..." : "Delete Canvas"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Canvas</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "
                            {currentProject?.name}"? This action cannot be
                            undone. All metrics, relationships, and history will
                            be permanently deleted.
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
                    <p className="text-xs text-red-600">
                      This action cannot be undone. All metrics, relationships,
                      and history will be permanently deleted.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>
                    Manage access and permissions
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Invite Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loadingCollaborators ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Loading team members...
                    </p>
                  </div>
                ) : collaborators.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No team members yet. Invite someone to collaborate!
                    </p>
                  </div>
                ) : (
                  collaborators.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
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
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
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
      </Tabs>
    </div>
  );
}
