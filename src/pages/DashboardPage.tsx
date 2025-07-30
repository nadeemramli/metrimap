import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  Plus,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Grid3X3,
  Zap,
  Network,
  Calendar,
} from "lucide-react";
import { useCanvasStore, useProjectsStore } from "@/lib/stores";
import type { MetricCard } from "@/lib/types";

// Mock dashboard data - in real app this would come from analytics service
const generateMockMetrics = (cards: MetricCard[]) => {
  return {
    overview: {
      totalMetrics: cards.length,
      activeMetrics: cards.filter(c => c.category === "Data/Metric").length,
      totalRelationships: Math.floor(cards.length * 1.5),
      healthScore: 85,
      lastUpdated: new Date().toISOString(),
    },
    kpis: cards.slice(0, 6).map((card, index) => ({
      id: card.id,
      name: card.title,
      value: Math.floor(Math.random() * 1000) + 100,
      change: (Math.random() - 0.5) * 30,
      target: Math.floor(Math.random() * 1200) + 800,
      category: card.category,
      trend: Array.from({ length: 7 }, () => Math.random() * 100),
    })),
    insights: [
      {
        id: "1",
        type: "opportunity",
        title: "Revenue Growth Acceleration",
        description: "Customer acquisition metrics show 23% increase vs. target",
        severity: "high",
        relatedMetrics: ["customer-acquisition", "revenue-growth"],
      },
      {
        id: "2", 
        type: "warning",
        title: "User Retention Declining",
        description: "Retention rate has decreased by 8% over the last month",
        severity: "medium",
        relatedMetrics: ["user-retention", "churn-rate"],
      },
      {
        id: "3",
        type: "info",
        title: "New Data Source Connected",
        description: "Successfully integrated Stripe payment analytics",
        severity: "low",
        relatedMetrics: ["payment-metrics"],
      },
    ],
  };
};

export default function DashboardPage() {
  const { canvasId } = useParams();
  const { canvas } = useCanvasStore();
  const { getProjectById } = useProjectsStore();
  
  const [timeRange, setTimeRange] = useState("30d");
  const [viewMode, setViewMode] = useState("overview");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const project = canvasId ? getProjectById(canvasId) : null;
  const metrics = project?.nodes || [];
  const dashboardData = useMemo(() => generateMockMetrics(metrics), [metrics]);

  const filteredKpis = useMemo(() => {
    if (selectedCategory === "all") return dashboardData.kpis;
    return dashboardData.kpis.filter(kpi => kpi.category === selectedCategory);
  }, [dashboardData.kpis, selectedCategory]);

  const categories = useMemo(() => {
    const cats = new Set(metrics.map(m => m.category));
    return Array.from(cats);
  }, [metrics]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Analytics and insights from your metric mappings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Metrics</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.overview.totalMetrics}</div>
                <p className="text-xs text-muted-foreground">
                  {dashboardData.overview.activeMetrics} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Relationships</CardTitle>
                <Network className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.overview.totalRelationships}</div>
                <p className="text-xs text-muted-foreground">
                  Across all metrics
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Health Score</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{dashboardData.overview.healthScore}%</div>
                <p className="text-xs text-muted-foreground">
                  +5% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Now</div>
                <p className="text-xs text-muted-foreground">
                  Auto-sync enabled
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Insights</CardTitle>
              <CardDescription>
                Key findings and recommendations from your metric analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.insights.map((insight) => (
                  <div key={insight.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="mt-0.5">
                      {insight.type === "opportunity" && <TrendingUp className="h-5 w-5 text-green-500" />}
                      {insight.type === "warning" && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                      {insight.type === "info" && <CheckCircle className="h-5 w-5 text-blue-500" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{insight.title}</h4>
                        <Badge variant={insight.severity === "high" ? "destructive" : insight.severity === "medium" ? "default" : "secondary"}>
                          {insight.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Related:</span>
                        {insight.relatedMetrics.map((metric) => (
                          <Badge key={metric} variant="outline" className="text-xs">
                            {metric}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Metrics Tab */}
        <TabsContent value="metrics" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add to Dashboard
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredKpis.map((kpi) => (
              <Card key={kpi.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{kpi.name}</CardTitle>
                    <Badge variant="outline">{kpi.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">{kpi.value.toLocaleString()}</div>
                      <div className={`flex items-center gap-1 text-sm ${kpi.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {kpi.change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {Math.abs(kpi.change).toFixed(1)}%
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      Target: {kpi.target.toLocaleString()} ({((kpi.value / kpi.target) * 100).toFixed(0)}%)
                    </div>
                    
                    {/* Simple trend visualization */}
                    <div className="h-12 flex items-end gap-1">
                      {kpi.trend.map((value, index) => (
                        <div
                          key={index}
                          className="bg-primary/20 rounded-sm flex-1"
                          style={{ height: `${(value / 100) * 100}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Insights</CardTitle>
              <CardDescription>
                Automated analysis and recommendations based on your metric relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {dashboardData.insights.map((insight) => (
                  <Card key={insight.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="mt-0.5">
                          {insight.type === "opportunity" && <TrendingUp className="h-6 w-6 text-green-500" />}
                          {insight.type === "warning" && <AlertTriangle className="h-6 w-6 text-yellow-500" />}
                          {insight.type === "info" && <CheckCircle className="h-6 w-6 text-blue-500" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{insight.title}</h3>
                            <Badge variant={insight.severity === "high" ? "destructive" : insight.severity === "medium" ? "default" : "secondary"}>
                              {insight.severity}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">{insight.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Related metrics:</span>
                              <div className="flex gap-1">
                                {insight.relatedMetrics.map((metric) => (
                                  <Badge key={metric} variant="outline" className="text-xs">
                                    {metric}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                              <Button size="sm">
                                Take Action
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Health Tab */}
        <TabsContent value="health" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Overall health of your metric ecosystem</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Data Quality</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full">
                        <div className="w-20 h-2 bg-green-500 rounded-full" />
                      </div>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Relationship Integrity</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full">
                        <div className="w-22 h-2 bg-green-500 rounded-full" />
                      </div>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Update Frequency</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full">
                        <div className="w-18 h-2 bg-yellow-500 rounded-full" />
                      </div>
                      <span className="text-sm font-medium">76%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest changes and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm">New metric relationship created</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-4 w-4 text-green-500" />
                    <div className="flex-1">
                      <p className="text-sm">Data source updated</p>
                      <p className="text-xs text-muted-foreground">15 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-purple-500" />
                    <div className="flex-1">
                      <p className="text-sm">Collaborator added</p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}