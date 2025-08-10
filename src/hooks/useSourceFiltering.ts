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
      const matchesSearch =
        source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        source.system.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || source.status === statusFilter;
      const matchesSystem =
        systemFilter === 'all' || source.system === systemFilter;
      return matchesSearch && matchesStatus && matchesSystem;
    });
  }, [dataSources, searchQuery, statusFilter, systemFilter]);

  const filteredApis = useMemo(() => {
    return apiConnections.filter((api) => {
      const matchesSearch =
        api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        api.endpoint.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || api.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [apiConnections, searchQuery, statusFilter]);

  const filteredPolicies = useMemo(() => {
    return governancePolicies.filter((policy) => {
      const matchesSearch =
        policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        policy.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || policy.status === statusFilter;
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
