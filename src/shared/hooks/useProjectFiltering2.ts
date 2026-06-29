import { useMemo } from 'react';

export type ViewFilter = 'all' | 'recent' | 'starred' | 'archived';

interface UseProjectFilteringArgs {
  projects: any[];
  searchQuery: string;
  selectedTags: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  viewFilter: ViewFilter;
  // 'all' | 'uncategorized' | <spaceId>
  spaceFilter?: string;
}

// is_starred is the source of truth (the legacy 'starred' tag was backfilled
// into it by migration, so no tag fallback — that would break un-starring).
const isStarred = (p: any) => p?.isStarred === true;
const isArchived = (p: any) => Boolean(p?.archivedAt);

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
  spaceFilter = 'all',
}: UseProjectFilteringArgs) {
  // Space + search + tags applied to ALL projects, then split active / archived.
  const searched = useMemo(() => {
    let filtered = Array.isArray(projects) ? [...projects] : [];
    if (spaceFilter === 'uncategorized') {
      filtered = filtered.filter((p) => !p.spaceId);
    } else if (spaceFilter && spaceFilter !== 'all') {
      filtered = filtered.filter((p) => p.spaceId === spaceFilter);
    }
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
  }, [projects, searchQuery, selectedTags, spaceFilter]);

  const active = useMemo(
    () => searched.filter((p) => !isArchived(p)),
    [searched]
  );
  const archived = useMemo(() => searched.filter(isArchived), [searched]);

  const counts = useMemo(
    () => ({
      all: active.length,
      recent: Math.min(10, active.length),
      starred: active.filter(isStarred).length,
      archived: archived.length,
    }),
    [active, archived]
  );

  const filteredProjects = useMemo(() => {
    if (viewFilter === 'archived') {
      return sortProjects(archived, sortBy, sortOrder);
    }
    if (viewFilter === 'starred') {
      return sortProjects(active.filter(isStarred), sortBy, sortOrder);
    }
    if (viewFilter === 'recent') {
      // Recent ignores the chosen sort — it's always the 10 freshest.
      return [...active]
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
        .slice(0, 10);
    }
    return sortProjects(active, sortBy, sortOrder);
  }, [active, archived, viewFilter, sortBy, sortOrder]);

  return { filteredProjects, counts };
}
