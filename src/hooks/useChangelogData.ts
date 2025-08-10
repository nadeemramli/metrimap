import type { ChangelogEntry } from '@/lib/supabase/services/changelog';
import { getProjectChangelog } from '@/lib/supabase/services/changelog';
import type { SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useMemo, useState } from 'react';

interface UseChangelogDataProps {
  projectId: string | undefined;
  supabaseClient: SupabaseClient;
  searchQuery: string;
  changelogFilter: string;
}

export function useChangelogData({
  projectId,
  supabaseClient,
  searchQuery,
  changelogFilter,
}: UseChangelogDataProps) {
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadChangelog = async () => {
    if (!projectId) return;

    setIsLoading(true);
    try {
      const data = await getProjectChangelog(
        projectId,
        undefined,
        supabaseClient
      );
      setChangelog(data);
    } catch (error) {
      console.error('Failed to load changelog:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      loadChangelog();
    }
  }, [projectId]);

  const filteredChangelog = useMemo(() => {
    return changelog.filter((entry) => {
      const userName = entry.userId || 'Unknown';
      const matchesSearch =
        entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (entry.targetName?.toLowerCase() || '').includes(
          searchQuery.toLowerCase()
        ) ||
        userName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        changelogFilter === 'all' || entry.action === changelogFilter;
      return matchesSearch && matchesFilter;
    });
  }, [changelog, searchQuery, changelogFilter]);

  return {
    changelog,
    filteredChangelog,
    isLoading,
    loadChangelog,
  };
}
