import { useMemo } from 'react';

interface FilterOptions {
  searchTerm: string;
  sortBy: string;
  showStarredOnly?: boolean;
  showRecentOnly?: boolean;
}

export function useProjectFiltering(projects: any[], options: FilterOptions) {
  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    // Apply search filter
    if (options.searchTerm) {
      const searchLower = options.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.name?.toLowerCase().includes(searchLower) ||
          project.description?.toLowerCase().includes(searchLower)
      );
    }

    // Apply starred filter
    if (options.showStarredOnly) {
      filtered = filtered.filter((project) => project.isStarred);
    }

    // Apply recent filter
    if (options.showRecentOnly) {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      filtered = filtered.filter(
        (project) => new Date(project.updatedAt) > oneWeekAgo
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (options.sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'created':
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case 'updated':
        default:
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
      }
    });

    return filtered;
  }, [projects, options]);

  return filteredProjects;
}
