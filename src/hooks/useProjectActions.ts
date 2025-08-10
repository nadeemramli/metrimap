import { useAppStore, useProjectsStore } from '@/lib/stores';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useProjectActions() {
  const navigate = useNavigate();
  const [isCreatingCanvas, setIsCreatingCanvas] = useState(false);
  const {
    projects,
    addProject,
    updateProject,
    deleteProject,
    duplicateProject,
  } = useProjectsStore();
  const { setCurrentCanvas, user } = useAppStore();

  const handleCreateCanvas = async () => {
    if (isCreatingCanvas || !user) return; // Prevent multiple clicks

    setIsCreatingCanvas(true);
    try {
      // Use the projects store to create the project
      const { addProject } = useProjectsStore.getState();
      const newProjectId = await addProject({
        name: 'New Canvas',
        description: 'New business model canvas',
        tags: ['New'],
        settings: {},
        collaborators: [],
        nodes: [],
        edges: [],
        groups: [],
        lastModifiedBy: user.id,
      });

      if (newProjectId) {
        setCurrentCanvas(newProjectId);
        navigate(`/canvas/${newProjectId}`);
      }
    } catch (error) {
      console.error('Failed to create canvas:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
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
      console.error('Failed to duplicate project:', error);
      alert('Failed to duplicate project. Please try again.');
    }
  };

  const handleDeleteProject = (projectId: string) => {
    if (
      confirm(
        'Are you sure you want to delete this project? This action cannot be undone.'
      )
    ) {
      deleteProject(projectId);
    }
  };

  const toggleStar = async (projectId: string) => {
    try {
      const project = projects.find((p) => p.id === projectId);
      if (!project) return;

      const isStarred = project.tags.includes('starred');
      const updatedTags = isStarred
        ? project.tags.filter((tag) => tag !== 'starred')
        : [...project.tags, 'starred'];

      await updateProject(projectId, { tags: updatedTags });
    } catch (error) {
      console.error('Failed to toggle star:', error);
    }
  };

  return {
    isCreatingCanvas,
    handleCreateCanvas,
    handleOpenCanvas,
    handleDuplicateProject,
    handleDeleteProject,
    toggleStar,
  };
}
