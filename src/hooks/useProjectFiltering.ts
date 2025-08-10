import type { CanvasProject } from '@/lib/types';
import { useMemo } from 'react';

type SortOption = 'name' | 'updated' | 'created' | 'nodes' | 'edges';

interface UseProjectFilteringProps {
  projects: CanvasProject[];
  searchQuery: string;
  selectedTags: string[];
  sortBy: SortOption;
  sortOrder: 'asc' | 'desc';
  activeTab: string;
}

export function useProjectFiltering({
  projects,
  searchQuery,
  selectedTags,
  sortBy,
  sortOrder,
  activeTab,
}: UseProjectFilteringProps) {
  const isRecentProject = (project: CanvasProject) => {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    return new Date(project.updatedAt) > oneDayAgo;
  };

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects.filter((project) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
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
        activeTab === 'all' ||
        (activeTab === 'recent' && isRecentProject(project)) ||
        (activeTab === 'starred' && project.tags.includes('starred'));

      return matchesSearch && matchesTags && matchesTab;
    });

    // Sort projects
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'updated':
          comparison =
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'created':
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'nodes':
          comparison = a.nodes.length - b.nodes.length;
          break;
        case 'edges':
          comparison = a.edges.length - b.edges.length;
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [projects, searchQuery, selectedTags, sortBy, sortOrder, activeTab]);

  const recentProjects = projects.filter(isRecentProject);
  const starredProjects = projects.filter((p) => p.tags.includes('starred'));

  return {
    filteredAndSortedProjects,
    recentProjects,
    starredProjects,
  };
}
