import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Database,
  Download,
  Edit,
  Eye,
  Link,
  MoreVertical,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Shield,
  TrendingUp,
  Users,
  Wifi,
  WifiOff,
  XCircle,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

// Types and hooks
import { useSourceFiltering } from '@/hooks/useSourceFiltering';
import { useSourcesStore } from '@/lib/stores/sources/useSourcesStore';
import type {
  ApiConnection,
  DataSource,
  GovernancePolicy,
  StatusFilter,
  TabType,
} from '@/types/source';

// Dialog components
import ApiConnectionDialog from '@/components/sources/dialogs/ApiConnectionDialog';
import DataSourceDialog from '@/components/sources/dialogs/DataSourceDialog';
import ExportDialog, {
  type ExportOptions,
} from '@/components/sources/dialogs/ExportDialog';
import GovernancePolicyDialog from '@/components/sources/dialogs/GovernancePolicyDialog';
import MonitoringSettingsDialog, {
  type MonitoringSettings,
} from '@/components/sources/dialogs/MonitoringSettingsDialog';

// Tab components

type InstrumentationStatus = 'Planned' | 'Instrumented' | 'Needs QA' | 'Live';

export default function SourcePage() {
  const [activeTab, setActiveTab] = useState<TabType>('sources');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [systemFilter, setSystemFilter] = useState('all');

  // State from store
  const {
    dataSources,
    apiConnections,
    governancePolicies,
    isLoading,
    error,
    // CRUD operations
    createDataSource,
    updateDataSource,
    deleteDataSource,
    createApiConnection,
    updateApiConnection,
    deleteApiConnection,
    createGovernancePolicy,
    updateGovernancePolicy,
    deleteGovernancePolicy,
    // Utility operations
    exportData,
    refreshMonitoring,
    loadAllData,
  } = useSourcesStore();

  // Dialog states
  const [dataSourceDialog, setDataSourceDialog] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit' | 'view';
    item?: DataSource;
  }>({ isOpen: false, mode: 'create' });

  const [apiConnectionDialog, setApiConnectionDialog] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit' | 'view';
    item?: ApiConnection;
  }>({ isOpen: false, mode: 'create' });

  const [governancePolicyDialog, setGovernancePolicyDialog] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit' | 'view';
    item?: GovernancePolicy;
  }>({ isOpen: false, mode: 'create' });

  const [exportDialog, setExportDialog] = useState(false);
  const [monitoringSettingsDialog, setMonitoringSettingsDialog] =
    useState(false);

  // Use filtering hook
  const { filteredSources, filteredApis, filteredPolicies } =
    useSourceFiltering({
      dataSources,
      apiConnections,
      governancePolicies,
      activeTab,
      searchQuery,
      statusFilter,
      systemFilter,
    });

  // Load data on component mount
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Get available systems for filtering
  const availableSystems = useMemo(() => {
    const systems = new Set(dataSources.map((source) => source.sourceSystem));
    return Array.from(systems);
  }, [dataSources]);

  // Handler functions - Now fully implemented!
  const handleEdit = (item: DataSource | ApiConnection | GovernancePolicy) => {
    // Determine item type and open appropriate dialog
    if ('metricName' in item) {
      // It's a DataSource
      setDataSourceDialog({
        isOpen: true,
        mode: 'edit',
        item: item as DataSource,
      });
    } else if ('type' in item && 'lastPing' in item) {
      // It's an ApiConnection
      setApiConnectionDialog({
        isOpen: true,
        mode: 'edit',
        item: item as ApiConnection,
      });
    } else {
      // It's a GovernancePolicy
      setGovernancePolicyDialog({
        isOpen: true,
        mode: 'edit',
        item: item as GovernancePolicy,
      });
    }
  };

  const handleDelete = async (itemId: string) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this item? This action cannot be undone.'
      )
    ) {
      return;
    }

    try {
      // Determine which type of item to delete by finding it in the arrays
      const dataSource = dataSources.find((item) => item.id === itemId);
      const apiConnection = apiConnections.find((item) => item.id === itemId);
      const governancePolicy = governancePolicies.find(
        (item) => item.id === itemId
      );

      if (dataSource) {
        await deleteDataSource(itemId);
      } else if (apiConnection) {
        await deleteApiConnection(itemId);
      } else if (governancePolicy) {
        await deleteGovernancePolicy(itemId);
      }
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const handleView = (item: DataSource | ApiConnection | GovernancePolicy) => {
    // Determine item type and open appropriate dialog in view mode
    if ('metricName' in item) {
      // It's a DataSource
      setDataSourceDialog({
        isOpen: true,
        mode: 'view',
        item: item as DataSource,
      });
    } else if ('type' in item && 'lastPing' in item) {
      // It's an ApiConnection
      setApiConnectionDialog({
        isOpen: true,
        mode: 'view',
        item: item as ApiConnection,
      });
    } else {
      // It's a GovernancePolicy
      setGovernancePolicyDialog({
        isOpen: true,
        mode: 'view',
        item: item as GovernancePolicy,
      });
    }
  };

  const handleExport = () => {
    setExportDialog(true);
  };

  const handleRefresh = async () => {
    try {
      await refreshMonitoring();
    } catch (error) {
      console.error('Failed to refresh monitoring data:', error);
    }
  };

  const handleMonitoringSettings = () => {
    setMonitoringSettingsDialog(true);
  };

  const handleAddMonitor = () => {
    // Open the appropriate dialog based on active tab
    switch (activeTab) {
      case 'sources':
        setDataSourceDialog({ isOpen: true, mode: 'create' });
        break;
      case 'apis':
        setApiConnectionDialog({ isOpen: true, mode: 'create' });
        break;
      case 'governance':
        setGovernancePolicyDialog({ isOpen: true, mode: 'create' });
        break;
    }
  };

  // Dialog handlers
  const handleExportData = async (options: ExportOptions) => {
    try {
      const exportedData = await exportData(options.type);

      // Create and download file
      const blob = new Blob([exportedData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `metrimap-${options.type}-${new Date().toISOString().split('T')[0]}.${options.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleSaveMonitoringSettings = async (settings: MonitoringSettings) => {
    try {
      // In a real app, this would save to backend
      console.log('Monitoring settings saved:', settings);
      // You could update a settings store here
    } catch (error) {
      console.error('Failed to save monitoring settings:', error);
    }
  };

  const getStatusIcon = (status: InstrumentationStatus) => {
    switch (status) {
      case 'Live':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Instrumented':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'Needs QA':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Planned':
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getApiStatusIcon = (status: string) => {
    switch (status) {
      case 'Connected':
        return <Wifi className="h-4 w-4 text-green-500" />;
      case 'Warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'Disconnected':
        return <WifiOff className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getDataQualityColor = (quality: number | null) => {
    if (!quality) return 'text-gray-500';
    if (quality >= 95) return 'text-green-500';
    if (quality >= 85) return 'text-yellow-500';
    return 'text-red-500';
  };

  const uniqueSystems = [...new Set(dataSources.map((s) => s.sourceSystem))];

  // CRUD Operations - Now handled by the unified handlers above

  const tabs = [
    {
      id: 'sources' as const,
      label: 'Data Sources',
      count: filteredSources.length,
    },
    {
      id: 'governance' as const,
      label: 'Governance',
      count: filteredPolicies.length,
    },
    { id: 'apis' as const, label: 'API Health', count: filteredApis.length },
    {
      id: 'monitoring' as const,
      label: 'Monitoring',
      count: dataSources.filter((s) => s.status === 'Live').length,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Data Governance</h1>
          <p className="text-muted-foreground mt-1">
            Manage data sources, instrumentation, and compliance monitoring
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <Plus className="h-4 w-4 mr-2" />
            Sync All
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add{' '}
            {activeTab === 'sources'
              ? 'Source'
              : activeTab === 'apis'
                ? 'API'
                : 'Policy'}
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Sources
            </CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dataSources.filter((s) => s.status === 'Live').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {dataSources.length} total configured
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Quality</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {dataSources.filter((s) => s.dataQuality).length > 0
                ? Math.round(
                    dataSources.reduce(
                      (acc, s) => acc + (s.dataQuality || 0),
                      0
                    ) / dataSources.filter((s) => s.dataQuality).length
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              Average across sources
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {apiConnections.filter((a) => a.status === 'Connected').length}/
              {apiConnections.length}
            </div>
            <p className="text-xs text-muted-foreground">Connections healthy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {governancePolicies.length > 0
                ? Math.round(
                    governancePolicies.reduce((acc, p) => acc + p.coverage, 0) /
                      governancePolicies.length
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">Policy coverage</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as typeof activeTab)}
        className="w-full"
      >
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label} ({tab.count})
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Search and Filter Bar */}
        <div className="flex items-center gap-4 mt-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {activeTab === 'sources' && (
            <>
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as InstrumentationStatus | 'All')
                }
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Live">Live</SelectItem>
                  <SelectItem value="Instrumented">Instrumented</SelectItem>
                  <SelectItem value="Needs QA">Needs QA</SelectItem>
                  <SelectItem value="Planned">Planned</SelectItem>
                </SelectContent>
              </Select>

              <Select value={systemFilter} onValueChange={setSystemFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Systems</SelectItem>
                  {uniqueSystems.map((system) => (
                    <SelectItem key={system} value={system.toLowerCase()}>
                      {system}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
        </div>

        {/* Data Sources Tab */}
        <TabsContent value="sources" className="space-y-4">
          {filteredSources.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No data sources found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Get started by adding your first data source to track metrics
                  and events.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Data Source
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Data Source
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          System
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Quality
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Records Today
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Last Sync
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredSources.map((source) => (
                        <tr key={source.id} className="hover:bg-muted/25">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                                <Database className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium text-foreground">
                                  {source.metricName}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {source.description}
                                </div>
                                <div className="flex gap-1 mt-1">
                                  {source.tags.map((tag) => (
                                    <Badge
                                      key={tag}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="outline">
                              {source.sourceSystem}
                            </Badge>
                            <div className="text-xs text-muted-foreground mt-1">
                              <code className="bg-muted px-1 py-0.5 rounded text-xs">
                                {source.eventName}
                              </code>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(source.status)}
                              <Badge
                                variant={
                                  source.status === 'Live'
                                    ? 'default'
                                    : source.status === 'Instrumented'
                                      ? 'secondary'
                                      : source.status === 'Needs QA'
                                        ? 'destructive'
                                        : 'outline'
                                }
                              >
                                {source.status}
                              </Badge>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {source.dataQuality ? (
                              <div className="flex items-center gap-2">
                                <div
                                  className={`text-lg font-semibold ${getDataQualityColor(source.dataQuality)}`}
                                >
                                  {source.dataQuality}%
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-500">N/A</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium">
                              {source.recordsToday.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {source.lastSync
                                ? new Date(source.lastSync).toLocaleTimeString()
                                : 'Never'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Source
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Sync Now
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleDelete(source.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Governance Tab */}
        <TabsContent value="governance" className="space-y-4">
          {filteredPolicies.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No governance policies
                </h3>
                <p className="text-muted-foreground mb-4">
                  Create governance policies to ensure data compliance and
                  security.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Policy
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPolicies.map((policy) => (
                <Card key={policy.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{policy.name}</CardTitle>
                      <Badge
                        variant={
                          policy.status === 'Active' ? 'default' : 'secondary'
                        }
                      >
                        {policy.status}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">
                      {policy.type} Policy
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Coverage
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full">
                            <div
                              className="h-2 bg-primary rounded-full"
                              style={{ width: `${policy.coverage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {policy.coverage}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {policy.owner}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Next review:{' '}
                          {new Date(policy.nextReview).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {policy.compliance.map((comp) => (
                          <Badge
                            key={comp}
                            variant="outline"
                            className="text-xs"
                          >
                            {comp}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* API Health Tab */}
        <TabsContent value="apis" className="space-y-4">
          {filteredApis.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Link className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No API connections</h3>
                <p className="text-muted-foreground mb-4">
                  Add API connections to monitor external service health.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add API Connection
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          API Connection
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Response Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Uptime
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Requests Today
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Error Rate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredApis.map((api) => (
                        <tr key={api.id} className="hover:bg-muted/25">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                                <Link className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium text-foreground">
                                  {api.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {api.type}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {getApiStatusIcon(api.status)}
                              <Badge
                                variant={
                                  api.status === 'Connected'
                                    ? 'default'
                                    : api.status === 'Warning'
                                      ? 'destructive'
                                      : 'secondary'
                                }
                              >
                                {api.status}
                              </Badge>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium">
                              {api.responseTime
                                ? `${api.responseTime}ms`
                                : 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium">
                              {api.uptime}%
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium">
                              {api.requestsToday.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div
                              className={`text-sm font-medium ${api.errorRate > 1 ? 'text-red-500' : 'text-green-500'}`}
                            >
                              {api.errorRate}%
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Logs
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Settings className="mr-2 h-4 w-4" />
                                  Configure
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Activity className="mr-2 h-4 w-4" />
                                  Test Connection
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleDelete(api.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Pipeline Health</CardTitle>
                <CardDescription>
                  Real-time monitoring of data flows
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dataSources.filter((s) => s.status === 'Live').length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No live data sources to monitor
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dataSources
                      .filter((s) => s.status === 'Live')
                      .map((source) => (
                        <div
                          key={source.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <div>
                              <div className="font-medium text-sm">
                                {source.metricName}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {source.sourceSystem}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {source.recordsToday}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              records today
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alerts & Issues</CardTitle>
                <CardDescription>
                  Current system alerts and warnings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {apiConnections.filter((api) => api.status !== 'Connected')
                    .length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        All systems healthy
                      </p>
                    </div>
                  ) : (
                    apiConnections
                      .filter((api) => api.status !== 'Connected')
                      .map((api) => (
                        <div
                          key={api.id}
                          className="flex items-center gap-3 p-3 border border-yellow-200 bg-yellow-50 rounded-lg"
                        >
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          <div className="flex-1">
                            <div className="text-sm font-medium">
                              {api.name} - {api.status}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {api.errorRate}% error rate
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog Components */}
      <DataSourceDialog
        isOpen={dataSourceDialog.isOpen}
        onClose={() => setDataSourceDialog({ isOpen: false, mode: 'create' })}
        onSave={async (source) => {
          if (dataSourceDialog.mode === 'edit' && dataSourceDialog.item) {
            await updateDataSource(dataSourceDialog.item.id, source);
          } else {
            await createDataSource(source);
          }
        }}
        dataSource={dataSourceDialog.item}
        mode={dataSourceDialog.mode}
      />

      <ApiConnectionDialog
        isOpen={apiConnectionDialog.isOpen}
        onClose={() =>
          setApiConnectionDialog({ isOpen: false, mode: 'create' })
        }
        onSave={async (connection) => {
          if (apiConnectionDialog.mode === 'edit' && apiConnectionDialog.item) {
            await updateApiConnection(apiConnectionDialog.item.id, connection);
          } else {
            await createApiConnection(connection);
          }
        }}
        apiConnection={apiConnectionDialog.item}
        mode={apiConnectionDialog.mode}
      />

      <GovernancePolicyDialog
        isOpen={governancePolicyDialog.isOpen}
        onClose={() =>
          setGovernancePolicyDialog({ isOpen: false, mode: 'create' })
        }
        onSave={async (policy) => {
          if (
            governancePolicyDialog.mode === 'edit' &&
            governancePolicyDialog.item
          ) {
            await updateGovernancePolicy(
              governancePolicyDialog.item.id,
              policy
            );
          } else {
            await createGovernancePolicy(policy);
          }
        }}
        governancePolicy={governancePolicyDialog.item}
        mode={governancePolicyDialog.mode}
      />

      <ExportDialog
        isOpen={exportDialog}
        onClose={() => setExportDialog(false)}
        onExport={handleExportData}
      />

      <MonitoringSettingsDialog
        isOpen={monitoringSettingsDialog}
        onClose={() => setMonitoringSettingsDialog(false)}
        onSave={handleSaveMonitoringSettings}
      />
    </div>
  );
}
