import type {
  ApiConnection,
  DataSource,
  GovernancePolicy,
  StatusFilter,
} from '@/types/source';
import { useMemo } from 'react';

interface UseSourceFilteringProps {
  dataSources: DataSource[];
  apiConnections: ApiConnection[];
  governancePolicies: GovernancePolicy[];
  activeTab: string;
  searchQuery: string;
  statusFilter: StatusFilter;
  systemFilter: string;
}

export function useSourceFiltering({
  dataSources,
  apiConnections,
  governancePolicies,
  activeTab,
  searchQuery,
  statusFilter,
  systemFilter,
}: UseSourceFilteringProps) {
  const filteredSources = useMemo(() => {
    return dataSources.filter((source) => {
      const name = (source.metricName ?? '').toLowerCase();
      const system = (source.sourceSystem ?? '').toLowerCase();
      const search = (searchQuery ?? '').toLowerCase();
      const matchesSearch = name.includes(search) || system.includes(search);
      const matchesStatus =
        (statusFilter ?? 'all').toLowerCase() === 'all' ||
        (source.status ?? '').toLowerCase() ===
          (statusFilter as string).toLowerCase();
      const matchesSystem =
        (systemFilter ?? 'all').toLowerCase() === 'all' ||
        system === (systemFilter as string).toLowerCase();
      return matchesSearch && matchesStatus && matchesSystem;
    });
  }, [dataSources, searchQuery, statusFilter, systemFilter]);

  const filteredApis = useMemo(() => {
    return apiConnections.filter((api) => {
      const name = (api.name ?? '').toLowerCase();
      const type = (api.type ?? '').toLowerCase();
      const search = (searchQuery ?? '').toLowerCase();
      const matchesSearch = name.includes(search) || type.includes(search);
      const matchesStatus =
        (statusFilter ?? 'all').toLowerCase() === 'all' ||
        (api.status ?? '').toLowerCase() ===
          (statusFilter as string).toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [apiConnections, searchQuery, statusFilter]);

  const filteredPolicies = useMemo(() => {
    return governancePolicies.filter((policy) => {
      const name = (policy.name ?? '').toLowerCase();
      const type = (policy.type ?? '').toLowerCase();
      const search = (searchQuery ?? '').toLowerCase();
      const matchesSearch = name.includes(search) || type.includes(search);
      const matchesStatus =
        (statusFilter ?? 'all').toLowerCase() === 'all' ||
        (policy.status ?? '').toLowerCase() ===
          (statusFilter as string).toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [governancePolicies, searchQuery, statusFilter]);

  const getFilteredData = () => {
    switch (activeTab) {
      case 'sources':
        return filteredSources;
      case 'apis':
        return filteredApis;
      case 'governance':
        return filteredPolicies;
      default:
        return [];
    }
  };

  return {
    filteredSources,
    filteredApis,
    filteredPolicies,
    getFilteredData,
  };
}
