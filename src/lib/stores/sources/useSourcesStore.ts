import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type {
  ApiConnection,
  DataSource,
  GovernancePolicy,
  StatusFilter,
} from '../../types/source';
import { generateUUID } from '../../utils/validation';

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
        // Simulate refresh operation
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Update some sample data to show refresh worked
        set((state) => ({
          dataSources: state.dataSources.map((source) => ({
            ...source,
            lastSync: new Date().toISOString(),
            recordsToday: Math.floor(Math.random() * 10000),
          })),
          apiConnections: state.apiConnections.map((connection) => ({
            ...connection,
            lastPing: new Date().toISOString(),
            responseTime: Math.floor(Math.random() * 500) + 50,
            requestsToday: Math.floor(Math.random() * 5000),
          })),
          isLoading: false,
        }));

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
      const state = get();

      for (const connection of state.apiConnections) {
        try {
          // Simulate API health check
          const isHealthy = Math.random() > 0.1; // 90% success rate
          const status = isHealthy ? 'Connected' : 'Warning';
          const responseTime = isHealthy
            ? Math.floor(Math.random() * 200) + 50
            : null;

          await get().updateApiConnection(connection.id, {
            status,
            responseTime,
            lastPing: new Date().toISOString(),
          });
        } catch (error) {
          console.error('Failed to check connection:', connection.name, error);
        }
      }

      console.log('✅ API connections checked');
    },

    updateDataQuality: async (sourceId: string): Promise<void> => {
      try {
        // Simulate data quality check
        const quality = Math.floor(Math.random() * 30) + 70; // 70-100%

        await get().updateDataSource(sourceId, {
          dataQuality: quality,
        });

        console.log('✅ Data quality updated for:', sourceId);
      } catch (error) {
        console.error('Failed to update data quality:', error);
        throw error;
      }
    },

    // Utility functions
    searchSources: (query: string): DataSource[] => {
      const state = get();
      const lowercaseQuery = query.toLowerCase();

      return state.dataSources.filter(
        (source) =>
          source.metricName.toLowerCase().includes(lowercaseQuery) ||
          source.sourceSystem.toLowerCase().includes(lowercaseQuery) ||
          source.owner.toLowerCase().includes(lowercaseQuery) ||
          source.description.toLowerCase().includes(lowercaseQuery)
      );
    },

    filterByStatus: (
      sources: DataSource[],
      status: StatusFilter
    ): DataSource[] => {
      if (status === 'all') return sources;
      return sources.filter(
        (source) => source.status.toLowerCase() === status.toLowerCase()
      );
    },

    getSystemsList: (): string[] => {
      const state = get();
      const systems = new Set(
        state.dataSources.map((source) => source.sourceSystem)
      );
      return Array.from(systems);
    },

    getSourceStatistics: () => {
      const state = get();
      const sources = state.dataSources;

      const totalSources = sources.length;
      const activeSources = sources.filter((s) => s.status === 'Live').length;
      const qualityScores = sources
        .map((s) => s.dataQuality)
        .filter(Boolean) as number[];
      const dataQualityAverage =
        qualityScores.length > 0
          ? qualityScores.reduce((sum, score) => sum + score, 0) /
            qualityScores.length
          : 0;

      const syncTimes = sources.map((s) => s.lastSync).filter(Boolean);
      const lastSyncTime =
        syncTimes.length > 0
          ? Math.max(...syncTimes.map((t) => new Date(t!).getTime())).toString()
          : null;

      return {
        totalSources,
        activeSources,
        dataQualityAverage: Math.round(dataQualityAverage),
        lastSyncTime: lastSyncTime
          ? new Date(parseInt(lastSyncTime)).toISOString()
          : null,
      };
    },

    // Loading and initialization
    loadAllData: async (): Promise<void> => {
      set({ isLoading: true, error: undefined });

      try {
        // In a real implementation, this would load from APIs/database
        // For now, we'll initialize with some sample data

        const sampleDataSources: DataSource[] = [
          {
            id: generateUUID(),
            metricName: 'User Signup Rate',
            sourceSystem: 'Analytics Platform',
            eventName: 'user_signup',
            actor: 'User',
            trigger: 'Form submission',
            status: 'Live',
            lastSync: new Date(Date.now() - 3600000).toISOString(),
            dataQuality: 98,
            recordsToday: 156,
            owner: 'Product Team',
            description:
              'Tracks new user signups from the main registration form',
            tags: ['growth', 'acquisition'],
            compliance: ['GDPR', 'CCPA'],
          },
          {
            id: generateUUID(),
            metricName: 'Purchase Conversion',
            sourceSystem: 'E-commerce API',
            eventName: 'purchase_completed',
            actor: 'Customer',
            trigger: 'Checkout completion',
            status: 'Needs QA',
            lastSync: new Date(Date.now() - 7200000).toISOString(),
            dataQuality: 85,
            recordsToday: 89,
            owner: 'Sales Team',
            description: 'Measures conversion from cart to completed purchase',
            tags: ['revenue', 'conversion'],
            compliance: ['PCI-DSS'],
          },
        ];

        const sampleApiConnections: ApiConnection[] = [
          {
            id: generateUUID(),
            name: 'Analytics API',
            type: 'REST',
            status: 'Connected',
            lastPing: new Date().toISOString(),
            responseTime: 120,
            uptime: 99.8,
            requestsToday: 2547,
            errorRate: 0.2,
            version: 'v2.1',
          },
          {
            id: generateUUID(),
            name: 'CRM Integration',
            type: 'GraphQL',
            status: 'Warning',
            lastPing: new Date(Date.now() - 300000).toISOString(),
            responseTime: 450,
            uptime: 97.2,
            requestsToday: 1203,
            errorRate: 2.8,
            version: 'v1.5',
          },
        ];

        const sampleGovernancePolicies: GovernancePolicy[] = [
          {
            id: generateUUID(),
            name: 'Data Retention Policy',
            type: 'Retention',
            status: 'Active',
            coverage: 87,
            lastReview: new Date(Date.now() - 2592000000).toISOString(), // 30 days ago
            nextReview: new Date(Date.now() + 7776000000).toISOString(), // 90 days from now
            owner: 'Data Governance Team',
            compliance: ['GDPR', 'HIPAA'],
          },
        ];

        set({
          dataSources: sampleDataSources,
          apiConnections: sampleApiConnections,
          governancePolicies: sampleGovernancePolicies,
          isLoading: false,
        });

        console.log('✅ All source data loaded');
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to load data';
        set({ error: errorMessage, isLoading: false });
        throw error;
      }
    },

    setLoading: (loading: boolean) => set({ isLoading: loading }),
    setError: (error: string | undefined) => set({ error }),
  }))
);
