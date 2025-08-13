import { useMemo } from 'react';

interface UseProjectFilteringArgs {
  projects: any[];
  searchQuery: string;
  selectedTags: string[];
  sortBy: string;
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
}: UseProjectFilteringArgs) {
  const safeProjects = Array.isArray(projects) ? projects : [];

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = [...safeProjects];

    // search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          (Array.isArray(p.tags) &&
            p.tags.some((t: string) => t?.toLowerCase().includes(q)))
      );
    }

    // tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(
        (p) =>
          Array.isArray(p.tags) && selectedTags.every((t) => p.tags.includes(t))
      );
    }

    // tab
    if (activeTab === 'starred') {
      filtered = filtered.filter(
        (p) => Array.isArray(p.tags) && p.tags.includes('starred')
      );
    }

    // sort
    filtered.sort((a, b) => {
      const dir = sortOrder === 'asc' ? 1 : -1;
      switch (sortBy) {
        case 'name':
          return dir * (a.name || '').localeCompare(b.name || '');
        case 'created':
          return (
            dir *
            (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          );
        case 'nodes':
          return dir * ((a.nodes?.length || 0) - (b.nodes?.length || 0));
        case 'edges':
          return dir * ((a.edges?.length || 0) - (b.edges?.length || 0));
        case 'updated':
        default:
          return (
            dir *
            (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
          );
      }
    });

    return filtered;
  }, [safeProjects, searchQuery, selectedTags, sortBy, sortOrder, activeTab]);

  const recentProjects = useMemo(() => {
    const copy = [...filteredAndSortedProjects];
    return copy
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, 10);
  }, [filteredAndSortedProjects]);

  const starredProjects = useMemo(
    () =>
      filteredAndSortedProjects.filter(
        (p) => Array.isArray(p.tags) && p.tags.includes('starred')
      ),
    [filteredAndSortedProjects]
  );

  return { filteredAndSortedProjects, recentProjects, starredProjects };
}
