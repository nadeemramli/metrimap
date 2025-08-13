import { ChangelogFilters } from '@/features/canvas/components/settings/filters/ChangelogFilters';
import { ChangelogTab } from '@/features/canvas/components/settings/tabs/ChangelogTab';
import { GeneralTab } from '@/features/canvas/components/settings/tabs/GeneralTab';
import { useAppStore, useProjectsStore } from '@/lib/stores';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { EnhancedTagInput } from '@/shared/components/ui/enhanced-tag-input';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
import { useAuthenticatedSupabase } from '@/shared/contexts/AuthenticatedSupabaseContext';
import { useCanvasForm } from '@/shared/hooks/useCanvasForm';
import { useChangelogData } from '@/shared/hooks/useChangelogData';
import type { Collaborator } from '@/shared/lib/supabase/services/collaborators';
import { getProjectCollaborators } from '@/shared/lib/supabase/services/collaborators';
import { useTagStore } from '@/shared/stores/useTagStore';
import { Edit, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

type TabType = 'general' | 'changelog';

export default function CanvasSettingsPage() {
  const { canvasId } = useParams();
  const supabaseClient = useAuthenticatedSupabase();
  const navigate = useNavigate();
  const { projects, updateProject, deleteProject } = useProjectsStore();
  const { user } = useAppStore();

  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [changelogFilter, setChangelogFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Real data state
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loadingCollaborators, setLoadingCollaborators] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Tag management state
  const [isTagManagementOpen, setIsTagManagementOpen] = useState(false);

  // Tag store
  const {
    tags,
    isLoading: isLoadingTags,
    loadProjectTags,
    createProjectTag,
    updateProjectTag,
    deleteProjectTag,
  } = useTagStore();

  // Find project from store instead of calling async function
  const currentProject = canvasId
    ? projects.find((p) => p.id === canvasId)
    : null;

  // Use custom hooks
  const {
    canvasName,
    canvasDescription,
    canvasTags,
    isDirty,
    handleNameChange,
    handleDescriptionChange,
    handleTagsChange,
  } = useCanvasForm({ currentProject });

  const { filteredChangelog, isLoading: isLoadingChangelog } = useChangelogData(
    {
      projectId: currentProject?.id,
      supabaseClient,
      searchQuery,
      changelogFilter,
    }
  );

  // Load data when component mounts
  useEffect(() => {
    if (canvasId) {
      loadCollaborators();
      loadProjectTags(canvasId);
    }
  }, [canvasId]);

  // Update loading state
  useEffect(() => {
    if (currentProject) {
      setLoading(false);
    } else if (canvasId) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [currentProject, canvasId]);

  // Tag management functions
  const handleOpenTagManagement = async () => {
    if (!canvasId) return;

    try {
      await loadProjectTags(canvasId);
      setIsTagManagementOpen(true);
    } catch (error) {
      console.error('Failed to load project tags:', error);
    }
  };

  const handleCreateTag = async (tagName: string) => {
    if (!canvasId) return;

    try {
      await createProjectTag(canvasId, { name: tagName });
      console.log('Tag created successfully:', tagName);
    } catch (error) {
      console.error('Failed to create tag:', error);
    }
  };

  const handleUpdateTag = async (
    tagId: string,
    updates: { name?: string; color?: string; description?: string }
  ) => {
    try {
      await updateProjectTag(tagId, updates);
      console.log('Tag updated successfully:', tagId);
    } catch (error) {
      console.error('Failed to update tag:', error);
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    try {
      await deleteProjectTag(tagId);
      console.log('Tag deleted successfully:', tagId);
    } catch (error) {
      console.error('Failed to delete tag:', error);
    }
  };

  // Load collaborators function
  const loadCollaborators = async () => {
    if (!currentProject?.id) return;

    setLoadingCollaborators(true);
    try {
      const data = await getProjectCollaborators(
        currentProject.id,
        supabaseClient
      );
      setCollaborators(data);
    } catch (error) {
      console.error('Failed to load collaborators:', error);
    } finally {
      setLoadingCollaborators(false);
    }
  };

  const handleSave = async () => {
    if (!currentProject) return;
    if (!user?.id) {
      alert('Please log in to save changes.');
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
      console.log('Canvas updated successfully');
      alert('Canvas updated successfully!');
    } catch (error) {
      console.error('Failed to update canvas:', error);
      alert('Failed to update canvas. Please try again.');
    }
  };

  const handleDeleteCanvas = async () => {
    if (!currentProject) return;

    setIsDeleting(true);
    try {
      await deleteProject(currentProject.id);
      // Navigate back to home after successful deletion
      navigate('/');
    } catch (error) {
      console.error('Failed to delete canvas:', error);
      alert('Failed to delete canvas. Please try again.');
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
                {filteredChangelog.length}
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Search Bar for changelog */}
        {activeTab === 'changelog' && (
          <ChangelogFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            changelogFilter={changelogFilter}
            onChangelogFilterChange={setChangelogFilter}
          />
        )}

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          <GeneralTab
            currentProject={currentProject}
            canvasName={canvasName}
            canvasDescription={canvasDescription}
            canvasTags={canvasTags}
            isDirty={isDirty}
            isDeleting={isDeleting}
            onNameChange={handleNameChange}
            onDescriptionChange={handleDescriptionChange}
            onTagsChange={handleTagsChange}
            onSave={handleSave}
            onDelete={handleDeleteCanvas}
            onOpenTagManagement={handleOpenTagManagement}
            collaborators={collaborators}
            isLoadingCollaborators={loadingCollaborators}
            onDuplicate={async () => {
              try {
                // Duplicate via projects store
                const newId = await useProjectsStore
                  .getState()
                  .duplicateProject(currentProject.id);
                if (newId) {
                  navigate(`/canvas/${newId}`);
                }
              } catch (err) {
                console.error('Failed to duplicate canvas:', err);
              }
            }}
          />
        </TabsContent>

        {/* Changelog Tab */}
        <TabsContent value="changelog" className="space-y-4">
          <ChangelogTab
            filteredChangelog={filteredChangelog}
            isLoading={isLoadingChangelog}
          />
        </TabsContent>
      </Tabs>

      {/* Tag Management Dialog */}
      {isTagManagementOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">Manage Canvas Tags</h2>
                <p className="text-sm text-muted-foreground">
                  Create and manage tags used within this canvas
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsTagManagementOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Create New Tag */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Create New Tag
                </label>
                <EnhancedTagInput
                  tags={[]}
                  onAdd={handleCreateTag}
                  onRemove={() => {}}
                  placeholder="Enter tag name..."
                  maxTags={1}
                  showCreateOption={true}
                  showSearchResults={false}
                />
              </div>

              {/* Existing Tags */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Existing Tags ({tags.length})
                </label>
                {isLoadingTags ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">Loading tags...</p>
                  </div>
                ) : tags.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">
                      No tags created yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {tags.map((tag) => (
                      <div
                        key={tag.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{tag.name}</Badge>
                          {tag.description && (
                            <span className="text-sm text-muted-foreground">
                              {tag.description}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleUpdateTag(tag.id, { name: tag.name })
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTag(tag.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsTagManagementOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
