import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Database,
  Activity,
  Shield,
  Link,
  RefreshCw,
  TrendingUp,
  Calendar,
  Users,
  Settings,
  Wifi,
  WifiOff,
} from "lucide-react";

type InstrumentationStatus = "Planned" | "Instrumented" | "Needs QA" | "Live";

interface DataSource {
  id: string;
  metricName: string;
  sourceSystem: string;
  eventName: string;
  actor: string;
  trigger: string;
  status: InstrumentationStatus;
  lastSync: string | null;
  dataQuality: number | null;
  recordsToday: number;
  owner: string;
  description: string;
  tags: string[];
  compliance: string[];
}

interface ApiConnection {
  id: string;
  name: string;
  type: string;
  status: "Connected" | "Warning" | "Disconnected";
  lastPing: string;
  responseTime: number | null;
  uptime: number;
  requestsToday: number;
  errorRate: number;
  version: string;
}

interface GovernancePolicy {
  id: string;
  name: string;
  type: string;
  status: "Active" | "Under Review" | "Inactive";
  coverage: number;
  lastReview: string;
  nextReview: string;
  owner: string;
  compliance: string[];
}

export default function SourcePage() {
  const [activeTab, setActiveTab] = useState<
    "sources" | "governance" | "apis" | "monitoring"
  >("sources");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    InstrumentationStatus | "All"
  >("All");
  const [systemFilter, setSystemFilter] = useState("all");

  // State for CRUD operations
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [apiConnections, setApiConnections] = useState<ApiConnection[]>([]);
  const [governancePolicies] = useState<GovernancePolicy[]>([]);

  // Filtering and data processing
  const filteredSources = useMemo(() => {
    return dataSources.filter((source) => {
      const matchesSearch =
        source.metricName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        source.sourceSystem.toLowerCase().includes(searchQuery.toLowerCase()) ||
        source.eventName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || source.status === statusFilter;
      const matchesSystem =
        systemFilter === "all" ||
        source.sourceSystem.toLowerCase() === systemFilter;
      return matchesSearch && matchesStatus && matchesSystem;
    });
  }, [dataSources, searchQuery, statusFilter, systemFilter]);

  const filteredApis = useMemo(() => {
    return apiConnections.filter(
      (api) =>
        api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        api.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [apiConnections, searchQuery]);

  const filteredPolicies = useMemo(() => {
    return governancePolicies.filter(
      (policy) =>
        policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        policy.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [governancePolicies, searchQuery]);

  const getStatusIcon = (status: InstrumentationStatus) => {
    switch (status) {
      case "Live":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Instrumented":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "Needs QA":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "Planned":
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getApiStatusIcon = (status: string) => {
    switch (status) {
      case "Connected":
        return <Wifi className="h-4 w-4 text-green-500" />;
      case "Warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "Disconnected":
        return <WifiOff className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getDataQualityColor = (quality: number | null) => {
    if (!quality) return "text-gray-500";
    if (quality >= 95) return "text-green-500";
    if (quality >= 85) return "text-yellow-500";
    return "text-red-500";
  };

  const uniqueSystems = [...new Set(dataSources.map((s) => s.sourceSystem))];

  // CRUD Operations
  const handleDeleteDataSource = (id: string) => {
    setDataSources(dataSources.filter((source) => source.id !== id));
  };

  const handleDeleteApiConnection = (id: string) => {
    setApiConnections(apiConnections.filter((api) => api.id !== id));
  };

  const tabs = [
    {
      id: "sources" as const,
      label: "Data Sources",
      count: filteredSources.length,
    },
    {
      id: "governance" as const,
      label: "Governance",
      count: filteredPolicies.length,
    },
    { id: "apis" as const, label: "API Health", count: filteredApis.length },
    {
      id: "monitoring" as const,
      label: "Monitoring",
      count: dataSources.filter((s) => s.status === "Live").length,
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
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync All
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add{" "}
            {activeTab === "sources"
              ? "Source"
              : activeTab === "apis"
                ? "API"
                : "Policy"}
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
              {dataSources.filter((s) => s.status === "Live").length}
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
              {apiConnections.filter((a) => a.status === "Connected").length}/
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

          {activeTab === "sources" && (
            <>
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as InstrumentationStatus | "All")
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
                                  source.status === "Live"
                                    ? "default"
                                    : source.status === "Instrumented"
                                      ? "secondary"
                                      : source.status === "Needs QA"
                                        ? "destructive"
                                        : "outline"
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
                                : "Never"}
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
                                  onClick={() =>
                                    handleDeleteDataSource(source.id)
                                  }
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
                          policy.status === "Active" ? "default" : "secondary"
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
                          Next review:{" "}
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
                                  api.status === "Connected"
                                    ? "default"
                                    : api.status === "Warning"
                                      ? "destructive"
                                      : "secondary"
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
                                : "N/A"}
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
                              className={`text-sm font-medium ${api.errorRate > 1 ? "text-red-500" : "text-green-500"}`}
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
                                  onClick={() =>
                                    handleDeleteApiConnection(api.id)
                                  }
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
                {dataSources.filter((s) => s.status === "Live").length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No live data sources to monitor
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dataSources
                      .filter((s) => s.status === "Live")
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
                  {apiConnections.filter((api) => api.status !== "Connected")
                    .length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        All systems healthy
                      </p>
                    </div>
                  ) : (
                    apiConnections
                      .filter((api) => api.status !== "Connected")
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
    </div>
  );
}
