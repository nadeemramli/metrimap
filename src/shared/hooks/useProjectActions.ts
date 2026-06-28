import { useProjectsStore } from '@/features/projects/stores/useProjectsStore';
import { useAppStore } from '@/lib/stores';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function useProjectActions() {
  const navigate = useNavigate();
  const [isCreatingCanvas, setIsCreatingCanvas] = useState(false);
  const {
    addProject,
    deleteProject: deleteProjectStore,
    duplicateProject: duplicateProjectStore,
    setStarred,
    setArchived,
    getProjectById,
  } = useProjectsStore();

  const openProject = useCallback(
    (projectId: string) => {
      navigate(`/canvas/${projectId}`);
    },
    [navigate]
  );

  const duplicateProject = useCallback(
    async (project: any) => {
      try {
        const newProjectId = await duplicateProjectStore(project.id);
        if (newProjectId) {
          navigate(`/canvas/${newProjectId}`);
        }
      } catch (error) {
        console.error('Failed to duplicate project:', error);
      }
    },
    [duplicateProjectStore, navigate]
  );

  const deleteProject = useCallback(
    async (projectId: string) => {
      try {
        await deleteProjectStore(projectId);
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    },
    [deleteProjectStore]
  );

  const shareProject = useCallback(async (projectId: string) => {
    const shareUrl = `${window.location.origin}/canvas/${projectId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      console.log('Share URL copied to clipboard');
    } catch (error) {
      console.error('Failed to copy share URL:', error);
    }
  }, []);

  const starProject = useCallback(
    (projectId: string) => setStarred(projectId, true).catch(() => {}),
    [setStarred]
  );

  const unstarProject = useCallback(
    (projectId: string) => setStarred(projectId, false).catch(() => {}),
    [setStarred]
  );

  const archiveProject = useCallback(
    async (projectId: string) => {
      try {
        await setArchived(projectId, true);
        toast.success('Canvas archived');
      } catch {
        toast.error('Failed to archive canvas');
      }
    },
    [setArchived]
  );

  const restoreProject = useCallback(
    async (projectId: string) => {
      try {
        await setArchived(projectId, false);
        toast.success('Canvas restored');
      } catch {
        toast.error('Failed to restore canvas');
      }
    },
    [setArchived]
  );

  // Aliases expected by features/projects/pages/HomePage
  const handleOpenCanvas = useCallback(
    (projectId: string) => {
      openProject(projectId);
    },
    [openProject]
  );

  const handleDuplicateProject = useCallback(
    (projectId: string) => {
      duplicateProject({ id: projectId });
    },
    [duplicateProject]
  );

  const handleDeleteProject = useCallback(
    (projectId: string) => {
      deleteProject(projectId);
    },
    [deleteProject]
  );

  const handleProjectSettings = useCallback(
    (projectId: string) => {
      navigate(`/canvas/${projectId}/settings`);
    },
    [navigate]
  );

  const toggleStar = useCallback(
    async (projectId: string) => {
      const project = getProjectById(projectId);
      if (!project) return;
      await setStarred(projectId, !project.isStarred);
    },
    [getProjectById, setStarred]
  );

  const handleCreateCanvas = useCallback(async () => {
    // Guard against the auth-timing race: addProject -> requireAuth() throws
    // when the user has not been populated yet. Surface that instead of
    // silently navigating to a broken /canvas/new skeleton.
    if (!useAppStore.getState().user) {
      toast.error('Finishing sign-in… please try again in a moment.');
      return;
    }
    setIsCreatingCanvas(true);
    try {
      // Create a new project first
      const newProjectId = await addProject({
        name: 'Untitled Project',
        description: '',
        tags: [],
        collaborators: [],
        nodes: [],
        edges: [],
        groups: [],
        settings: {},
        // Note: createdAt/updatedAt are automatically handled by the database
        lastModifiedBy: 'user',
      });

      if (newProjectId) {
        // Navigate to the new project's canvas
        navigate(`/canvas/${newProjectId}`);
      } else {
        throw new Error('Failed to create project');
      }
    } catch (error) {
      console.error('Failed to create canvas:', error);
      toast.error(
        error instanceof Error && error.message
          ? `Could not create canvas: ${error.message}`
          : 'Could not create canvas. Please try again.'
      );
    } finally {
      setIsCreatingCanvas(false);
    }
  }, [navigate, addProject]);

  return {
    openProject,
    duplicateProject,
    deleteProject,
    shareProject,
    starProject,
    unstarProject,
    archiveProject,
    restoreProject,
    // aliases used by HomePage and children
    handleOpenCanvas,
    handleDuplicateProject,
    handleDeleteProject,
    handleProjectSettings,
    toggleStar,
    handleCreateCanvas,
    isCreatingCanvas,
  };
}
