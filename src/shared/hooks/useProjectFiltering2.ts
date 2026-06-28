import { useMemo } from 'react';

export type ViewFilter = 'all' | 'recent' | 'starred';

interface UseProjectFilteringArgs {
  projects: any[];
  searchQuery: string;
  selectedTags: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  viewFilter: ViewFilter;
}

const isStarred = (p: any) =>
  p?.is_starred === true ||
  (Array.isArray(p?.tags) && p.tags.includes('starred')); // legacy tag fallback

function sortProjects(list: any[], sortBy: string, sortOrder: 'asc' | 'desc') {
  const dir = sortOrder === 'asc' ? 1 : -1;
  return [...list].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return dir * (a.name || '').localeCompare(b.name || '');
      case 'created':
        return (
          dir *
          (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        );
      case 'nodes':
        return (
          dir *
          ((a.nodeCount ?? a.nodes?.length ?? 0) -
            (b.nodeCount ?? b.nodes?.length ?? 0))
        );
      case 'edges':
        return (
          dir *
          ((a.edgeCount ?? a.edges?.length ?? 0) -
            (b.edgeCount ?? b.edges?.length ?? 0))
        );
      case 'updated':
      default:
        return (
          dir *
          (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
        );
    }
  });
}

/**
 * Single source of truth for the homepage list. Search + tags narrow a base set;
 * the view filter (All / Recent / Starred) is now a *chip* over that same base
 * (Recent = 10 most-recently-updated), not a separate tab. Returns the final
 * list plus per-chip counts for the badges.
 */
export function useProjectFiltering({
  projects,
  searchQuery,
  selectedTags,
  sortBy,
  sortOrder,
  viewFilter,
}: UseProjectFilteringArgs) {
  // Base = search + tags (shared by every chip; drives the chip counts).
  const base = useMemo(() => {
    let filtered = Array.isArray(projects) ? [...projects] : [];
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
    if (selectedTags.length > 0) {
      filtered = filtered.filter(
        (p) =>
          Array.isArray(p.tags) && selectedTags.every((t) => p.tags.includes(t))
      );
    }
    return filtered;
  }, [projects, searchQuery, selectedTags]);

  const counts = useMemo(
    () => ({
      all: base.length,
      starred: base.filter(isStarred).length,
      recent: Math.min(10, base.length),
    }),
    [base]
  );

  const filteredProjects = useMemo(() => {
    if (viewFilter === 'starred') {
      return sortProjects(base.filter(isStarred), sortBy, sortOrder);
    }
    if (viewFilter === 'recent') {
      // Recent ignores the chosen sort — it's always the 10 freshest.
      return [...base]
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
        .slice(0, 10);
    }
    return sortProjects(base, sortBy, sortOrder);
  }, [base, viewFilter, sortBy, sortOrder]);

  return { filteredProjects, counts };
}
