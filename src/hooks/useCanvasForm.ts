import type { CanvasProject } from '@/lib/types';
import { useEffect, useState } from 'react';

interface UseCanvasFormProps {
  currentProject: CanvasProject | null;
}

export function useCanvasForm({ currentProject }: UseCanvasFormProps) {
  const [canvasName, setCanvasName] = useState('');
  const [canvasDescription, setCanvasDescription] = useState('');
  const [canvasTags, setCanvasTags] = useState<string[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  // Load project data when available
  useEffect(() => {
    if (currentProject) {
      const name = currentProject.name || '';
      const description = currentProject.description || '';
      const tags = currentProject.tags || [];

      setCanvasName(name);
      setCanvasDescription(description);
      setCanvasTags(tags);
      setIsDirty(false); // Reset dirty state when loading fresh data
    }
  }, [currentProject]);

  const checkDirtyState = (
    name: string,
    description: string,
    tags: string[]
  ) => {
    if (!currentProject) return false;

    const tagsChanged =
      JSON.stringify(tags.sort()) !==
      JSON.stringify((currentProject.tags || []).sort());

    return (
      name !== (currentProject.name || '') ||
      description !== (currentProject.description || '') ||
      tagsChanged
    );
  };

  const handleNameChange = (value: string) => {
    setCanvasName(value);
    setIsDirty(checkDirtyState(value, canvasDescription, canvasTags));
  };

  const handleDescriptionChange = (value: string) => {
    setCanvasDescription(value);
    setIsDirty(checkDirtyState(canvasName, value, canvasTags));
  };

  const handleTagsChange = (tags: string[]) => {
    setCanvasTags(tags);
    setIsDirty(checkDirtyState(canvasName, canvasDescription, tags));
  };

  return {
    canvasName,
    canvasDescription,
    canvasTags,
    isDirty,
    handleNameChange,
    handleDescriptionChange,
    handleTagsChange,
  };
}
