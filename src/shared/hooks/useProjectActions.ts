import { useProjectsStore } from '@/features/projects/stores/useProjectsStore';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useProjectActions() {
  const navigate = useNavigate();
  const [isCreatingCanvas, setIsCreatingCanvas] = useState(false);
  const {
    addProject,
    updateProject,
    deleteProject: deleteProjectStore,
    duplicateProject: duplicateProjectStore,
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
    async (projectId: string) => {
      try {
        const project = getProjectById(projectId);
        if (!project) return;
        const tags = Array.isArray(project.tags) ? project.tags : [];
        if (!tags.includes('starred')) {
          await updateProject(projectId, { tags: [...tags, 'starred'] });
        }
      } catch (error) {
        console.error('Failed to star project:', error);
      }
    },
    [getProjectById, updateProject]
  );

  const unstarProject = useCallback(
    async (projectId: string) => {
      try {
        const project = getProjectById(projectId);
        if (!project) return;
        const tags = Array.isArray(project.tags) ? project.tags : [];
        if (tags.includes('starred')) {
          await updateProject(projectId, {
            tags: tags.filter((t) => t !== 'starred'),
          });
        }
      } catch (error) {
        console.error('Failed to unstar project:', error);
      }
    },
    [getProjectById, updateProject]
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

  const toggleStar = useCallback(
    async (projectId: string) => {
      const project = getProjectById(projectId);
      if (!project) return;
      const tags = Array.isArray(project.tags) ? project.tags : [];
      if (tags.includes('starred')) {
        await unstarProject(projectId);
      } else {
        await starProject(projectId);
      }
    },
    [getProjectById, starProject, unstarProject]
  );

  const handleCreateCanvas = useCallback(async () => {
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
      // Fallback to the previous behavior if project creation fails
      navigate('/canvas/new');
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
    // aliases used by HomePage and children
    handleOpenCanvas,
    handleDuplicateProject,
    handleDeleteProject,
    toggleStar,
    handleCreateCanvas,
    isCreatingCanvas,
  };
}
