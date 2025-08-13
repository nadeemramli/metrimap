import { generateUUID } from '@/shared/utils/validation';
import type {
  ApiConnection,
  DataSource,
  GovernancePolicy,
  StatusFilter,
} from '@/types/source';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface SourcesStoreState {
  // State
  dataSources: DataSource[];
  apiConnections: ApiConnection[];
  governancePolicies: GovernancePolicy[];
  isLoading: boolean;
  error: string | undefined;

  // Data Source CRUD operations
  createDataSource: (source: Omit<DataSource, 'id'>) => Promise<DataSource>;
  updateDataSource: (id: string, updates: Partial<DataSource>) => Promise<void>;
  deleteDataSource: (id: string) => Promise<void>;
  getDataSourceById: (id: string) => DataSource | undefined;

  // API Connection CRUD operations
  createApiConnection: (
    connection: Omit<ApiConnection, 'id'>
  ) => Promise<ApiConnection>;
  updateApiConnection: (
    id: string,
    updates: Partial<ApiConnection>
  ) => Promise<void>;
  deleteApiConnection: (id: string) => Promise<void>;
  getApiConnectionById: (id: string) => ApiConnection | undefined;

  // Governance Policy CRUD operations
  createGovernancePolicy: (
    policy: Omit<GovernancePolicy, 'id'>
  ) => Promise<GovernancePolicy>;
  updateGovernancePolicy: (
    id: string,
    updates: Partial<GovernancePolicy>
  ) => Promise<void>;
  deleteGovernancePolicy: (id: string) => Promise<void>;
  getGovernancePolicyById: (id: string) => GovernancePolicy | undefined;

  // Bulk operations
  exportData: (
    type: 'sources' | 'apis' | 'policies' | 'all'
  ) => Promise<string>;
  importData: (
    data: any[],
    type: 'sources' | 'apis' | 'policies'
  ) => Promise<void>;

  // Monitoring operations
  refreshMonitoring: () => Promise<void>;
  checkApiConnections: () => Promise<void>;
  updateDataQuality: (sourceId: string) => Promise<void>;

  // Utility functions
  searchSources: (query: string) => DataSource[];
  filterByStatus: (sources: DataSource[], status: StatusFilter) => DataSource[];
  getSystemsList: () => string[];
  getSourceStatistics: () => {
    totalSources: number;
    activeSources: number;
    dataQualityAverage: number;
    lastSyncTime: string | null;
  };

  // Loading and initialization
  loadAllData: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | undefined) => void;
}

export const useSourcesStore = create<SourcesStoreState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    dataSources: [],
    apiConnections: [],
    governancePolicies: [],
    isLoading: false,
    error: undefined,

    // Data Source CRUD operations
    createDataSource: async (
      sourceData: Omit<DataSource, 'id'>
    ): Promise<DataSource> => {
      set({ isLoading: true, error: undefined });

      try {
        const newSource: DataSource = {
          ...sourceData,
          id: generateUUID(),
        };

        // In a real implementation, this would make an API call
        // For now, we'll just add to local state
        set((state) => ({
          dataSources: [...state.dataSources, newSource],
          isLoading: false,
        }));

        console.log('✅ Data source created:', newSource.metricName);
        return newSource;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to create data source';
        set({ error: errorMessage, isLoading: false });
        throw error;
      }
    },

    updateDataSource: async (
      id: string,
      updates: Partial<DataSource>
    ): Promise<void> => {
      set({ isLoading: true, error: undefined });

      try {
        // In a real implementation, this would make an API call
        set((state) => ({
          dataSources: state.dataSources.map((source) =>
            source.id === id ? { ...source, ...updates } : source
          ),
          isLoading: false,
        }));

        console.log('✅ Data source updated:', id);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to update data source';
        set({ error: errorMessage, isLoading: false });
        throw error;
      }
    },

    deleteDataSource: async (id: string): Promise<void> => {
      set({ isLoading: true, error: undefined });

      try {
        // In a real implementation, this would make an API call
        set((state) => ({
          dataSources: state.dataSources.filter((source) => source.id !== id),
          isLoading: false,
        }));

        console.log('✅ Data source deleted:', id);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to delete data source';
        set({ error: errorMessage, isLoading: false });
        throw error;
      }
    },

    getDataSourceById: (id: string): DataSource | undefined => {
      const state = get();
      return state.dataSources.find((source) => source.id === id);
    },

    // API Connection CRUD operations
    createApiConnection: async (
      connectionData: Omit<ApiConnection, 'id'>
    ): Promise<ApiConnection> => {
      set({ isLoading: true, error: undefined });

      try {
        const newConnection: ApiConnection = {
          ...connectionData,
          id: generateUUID(),
        };

        set((state) => ({
          apiConnections: [...state.apiConnections, newConnection],
          isLoading: false,
        }));

        console.log('✅ API connection created:', newConnection.name);
        return newConnection;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to create API connection';
        set({ error: errorMessage, isLoading: false });
        throw error;
      }
    },

    updateApiConnection: async (
      id: string,
      updates: Partial<ApiConnection>
    ): Promise<void> => {
      set({ isLoading: true, error: undefined });

      try {
        set((state) => ({
          apiConnections: state.apiConnections.map((connection) =>
            connection.id === id ? { ...connection, ...updates } : connection
          ),
          isLoading: false,
        }));

        console.log('✅ API connection updated:', id);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to update API connection';
        set({ error: errorMessage, isLoading: false });
        throw error;
      }
    },

    deleteApiConnection: async (id: string): Promise<void> => {
      set({ isLoading: true, error: undefined });

      try {
        set((state) => ({
          apiConnections: state.apiConnections.filter(
            (connection) => connection.id !== id
          ),
          isLoading: false,
        }));

        console.log('✅ API connection deleted:', id);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to delete API connection';
        set({ error: errorMessage, isLoading: false });
        throw error;
      }
    },

    getApiConnectionById: (id: string): ApiConnection | undefined => {
      const state = get();
      return state.apiConnections.find((connection) => connection.id === id);
    },

    // Governance Policy CRUD operations
    createGovernancePolicy: async (
      policyData: Omit<GovernancePolicy, 'id'>
    ): Promise<GovernancePolicy> => {
      set({ isLoading: true, error: undefined });

      try {
        const newPolicy: GovernancePolicy = {
          ...policyData,
          id: generateUUID(),
        };

        set((state) => ({
          governancePolicies: [...state.governancePolicies, newPolicy],
          isLoading: false,
        }));

        console.log('✅ Governance policy created:', newPolicy.name);
        return newPolicy;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to create governance policy';
        set({ error: errorMessage, isLoading: false });
        throw error;
      }
    },

    updateGovernancePolicy: async (
      id: string,
      updates: Partial<GovernancePolicy>
    ): Promise<void> => {
      set({ isLoading: true, error: undefined });

      try {
        set((state) => ({
          governancePolicies: state.governancePolicies.map((policy) =>
            policy.id === id ? { ...policy, ...updates } : policy
          ),
          isLoading: false,
        }));

        console.log('✅ Governance policy updated:', id);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to update governance policy';
        set({ error: errorMessage, isLoading: false });
        throw error;
      }
    },

    deleteGovernancePolicy: async (id: string): Promise<void> => {
      set({ isLoading: true, error: undefined });

      try {
        set((state) => ({
          governancePolicies: state.governancePolicies.filter(
            (policy) => policy.id !== id
          ),
          isLoading: false,
        }));

        console.log('✅ Governance policy deleted:', id);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to delete governance policy';
        set({ error: errorMessage, isLoading: false });
        throw error;
      }
    },

    getGovernancePolicyById: (id: string): GovernancePolicy | undefined => {
      const state = get();
      return state.governancePolicies.find((policy) => policy.id === id);
    },

    // Bulk operations
    exportData: async (
      type: 'sources' | 'apis' | 'policies' | 'all'
    ): Promise<string> => {
      const state = get();
      let dataToExport: any = {};

      switch (type) {
        case 'sources':
          dataToExport = { dataSources: state.dataSources };
          break;
        case 'apis':
          dataToExport = { apiConnections: state.apiConnections };
          break;
        case 'policies':
          dataToExport = { governancePolicies: state.governancePolicies };
          break;
        case 'all':
          dataToExport = {
            dataSources: state.dataSources,
            apiConnections: state.apiConnections,
            governancePolicies: state.governancePolicies,
          };
          break;
      }

      const json = JSON.stringify(dataToExport, null, 2);
      console.log('✅ Data exported:', type);
      return json;
    },

    importData: async (
      data: any[],
      type: 'sources' | 'apis' | 'policies'
    ): Promise<void> => {
      set({ isLoading: true, error: undefined });

      try {
        // Validate and add IDs to imported data
        const processedData = data.map((item) => ({
          ...item,
          id: item.id || generateUUID(),
        }));

        switch (type) {
          case 'sources':
            set((state) => ({
              dataSources: [...state.dataSources, ...processedData],
              isLoading: false,
            }));
            break;
          case 'apis':
            set((state) => ({
              apiConnections: [...state.apiConnections, ...processedData],
              isLoading: false,
            }));
            break;
          case 'policies':
            set((state) => ({
              governancePolicies: [
                ...state.governancePolicies,
                ...processedData,
              ],
              isLoading: false,
            }));
            break;
        }

        console.log('✅ Data imported:', type, processedData.length);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to import data';
        set({ error: errorMessage, isLoading: false });
        throw error;
      }
    },

    // Monitoring operations
    refreshMonitoring: async (): Promise<void> => {
      set({ isLoading: true, error: undefined });
      try {
        // In a real implementation, this would call API endpoints to refresh
        // monitoring data. For now, simulate a refresh with a delay.
        await new Promise((resolve) => setTimeout(resolve, 500));
        set({ isLoading: false });
        console.log('✅ Monitoring data refreshed');
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to refresh monitoring data';
        set({ error: errorMessage, isLoading: false });
        throw error;
      }
    },

    checkApiConnections: async (): Promise<void> => {
      set({ isLoading: true, error: undefined });
      try {
        // Simulate API connection checks
        await new Promise((resolve) => setTimeout(resolve, 500));
        set({ isLoading: false });
        console.log('✅ API connections checked');
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to check API connections';
        set({ error: errorMessage, isLoading: false });
        throw error;
      }
    },

    updateDataQuality: async (sourceId: string): Promise<void> => {
      set({ isLoading: true, error: undefined });
      try {
        // Simulate data quality update for a specific source
        await new Promise((resolve) => setTimeout(resolve, 500));
        set({ isLoading: false });
        console.log('✅ Data quality updated for source:', sourceId);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to update data quality';
        set({ error: errorMessage, isLoading: false });
        throw error;
      }
    },

    // Utility functions
    searchSources: (query: string): DataSource[] => {
      const state = get();
      const lowerQuery = query.toLowerCase();
      return state.dataSources.filter(
        (source) =>
          source.metricName.toLowerCase().includes(lowerQuery) ||
          source.sourceSystem.toLowerCase().includes(lowerQuery)
      );
    },

    filterByStatus: (
      sources: DataSource[],
      status: StatusFilter
    ): DataSource[] => {
      const lowerStatus = (status || 'all').toLowerCase();
      if (lowerStatus === 'all') return sources;
      return sources.filter(
        (source) => source.status.toLowerCase() === lowerStatus
      );
    },

    getSystemsList: (): string[] => {
      const state = get();
      const systems = new Set<string>();
      state.dataSources.forEach((source) => {
        if (source.sourceSystem) {
          systems.add(source.sourceSystem);
        }
      });
      return Array.from(systems);
    },

    getSourceStatistics: () => {
      const state = get();
      const totalSources = state.dataSources.length;
      const activeSources = state.dataSources.filter(
        (s) => s.status === 'Live'
      ).length;
      const dataQualityValues = state.dataSources
        .map((s) => s.dataQuality)
        .filter((q): q is number => q !== null && q !== undefined);
      const dataQualityAverage =
        dataQualityValues.length > 0
          ? Math.round(
              dataQualityValues.reduce((acc, q) => acc + q, 0) /
                dataQualityValues.length
            )
          : 0;
      const lastSyncTime =
        state.dataSources
          .map((s) => s.lastSync)
          .filter((t): t is string => !!t)
          .sort()
          .pop() || null;

      return {
        totalSources,
        activeSources,
        dataQualityAverage,
        lastSyncTime,
      };
    },

    // Loading and initialization
    loadAllData: async (): Promise<void> => {
      set({ isLoading: true, error: undefined });
      try {
        // Simulated data loading
        await new Promise((resolve) => setTimeout(resolve, 500));
        set({ isLoading: false });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to load data';
        set({ error: errorMessage, isLoading: false });
        throw error;
      }
    },

    setLoading: (loading: boolean): void => {
      set({ isLoading: loading });
    },

    setError: (error: string | undefined): void => {
      set({ error });
    },
  }))
);
