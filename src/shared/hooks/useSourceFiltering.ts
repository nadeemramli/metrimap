import type {
  ApiConnection,
  DataSource,
  GovernancePolicy,
  StatusFilter,
} from '@/features/sources/source';
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

// Helper utilities to reduce complexity in the main hook
const normalize = (value?: string) => (value ?? '').toLowerCase();

function statusMatches(
  status: string | undefined,
  filter: StatusFilter
): boolean {
  const f = normalize(filter as unknown as string);
  if (f === 'all') return true;
  return normalize(status) === f;
}

function systemMatches(system: string | undefined, filter: string): boolean {
  const f = normalize(filter);
  if (f === 'all') return true;
  return normalize(system) === f;
}

function buildSourcePredicate(
  searchQuery: string,
  statusFilter: StatusFilter,
  systemFilter: string
) {
  const query = normalize(searchQuery);
  return (source: DataSource) => {
    const name = normalize(source.metricName);
    const system = normalize(source.sourceSystem);
    const matchesSearch = name.includes(query) || system.includes(query);
    return (
      matchesSearch &&
      statusMatches(source.status, statusFilter) &&
      systemMatches(source.sourceSystem, systemFilter)
    );
  };
}

function buildApiPredicate(searchQuery: string, statusFilter: StatusFilter) {
  const query = normalize(searchQuery);
  return (api: ApiConnection) => {
    const name = normalize(api.name);
    const type = normalize(api.type);
    const matchesSearch = name.includes(query) || type.includes(query);
    return matchesSearch && statusMatches(api.status, statusFilter);
  };
}

function buildPolicyPredicate(searchQuery: string, statusFilter: StatusFilter) {
  const query = normalize(searchQuery);
  return (policy: GovernancePolicy) => {
    const name = normalize(policy.name);
    const type = normalize(policy.type);
    const matchesSearch = name.includes(query) || type.includes(query);
    return matchesSearch && statusMatches(policy.status, statusFilter);
  };
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
  const filteredSources = useMemo(
    () =>
      dataSources.filter(
        buildSourcePredicate(searchQuery, statusFilter, systemFilter)
      ),
    [dataSources, searchQuery, statusFilter, systemFilter]
  );

  const filteredApis = useMemo(
    () => apiConnections.filter(buildApiPredicate(searchQuery, statusFilter)),
    [apiConnections, searchQuery, statusFilter]
  );

  const filteredPolicies = useMemo(
    () =>
      governancePolicies.filter(
        buildPolicyPredicate(searchQuery, statusFilter)
      ),
    [governancePolicies, searchQuery, statusFilter]
  );

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
