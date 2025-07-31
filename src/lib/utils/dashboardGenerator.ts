import type { CanvasProject, GroupNode, MetricCard } from '../types';

export interface DashboardConfig {
  id: string;
  name: string;
  description?: string;
  metrics: MetricCard[];
  groupId: string;
  createdAt: string;
}

export interface DashboardSection {
  title: string;
  metrics: MetricCard[];
  count: number;
  categories: {
    [key: string]: MetricCard[];
  };
}

/**
 * Generate dashboard configurations from canvas groups
 */
export function generateDashboardsFromGroups(canvas: CanvasProject): DashboardConfig[] {
  if (!canvas.groups || canvas.groups.length === 0) {
    return [];
  }

  return canvas.groups.map((group) => {
    // Get metrics that belong to this group
    const groupMetrics = canvas.nodes.filter(node => 
      group.nodeIds.includes(node.id)
    );

    return {
      id: `dashboard_${group.id}`,
      name: group.name,
      description: `Auto-generated dashboard from "${group.name}" subflow`,
      metrics: groupMetrics,
      groupId: group.id,
      createdAt: new Date().toISOString(),
    };
  });
}

/**
 * Generate dashboard section from metrics
 */
export function generateDashboardSection(
  metrics: MetricCard[], 
  sectionTitle: string
): DashboardSection {
  // Group metrics by category
  const categories = metrics.reduce((acc, metric) => {
    const category = metric.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(metric);
    return acc;
  }, {} as { [key: string]: MetricCard[] });

  return {
    title: sectionTitle,
    metrics,
    count: metrics.length,
    categories,
  };
}

/**
 * Calculate dashboard insights from metrics
 */
export function calculateDashboardInsights(metrics: MetricCard[]) {
  const dataMetrics = metrics.filter(m => m.category === "Data/Metric");
  const coreMetrics = metrics.filter(m => m.category === "Core/Value");
  const actionItems = metrics.filter(m => m.category === "Work/Action");
  
  // Calculate trends from data metrics
  const trendsData = dataMetrics
    .filter(m => m.data && m.data.length > 0)
    .map(metric => {
      const latestData = metric.data![0]; // Most recent data point
      return {
        metric: metric.title,
        value: latestData.value,
        change: latestData.change_percent,
        trend: latestData.trend,
      };
    });

  // Calculate health score based on positive vs negative trends
  const positiveTrends = trendsData.filter(t => t.trend === "up").length;
  const negativeTrends = trendsData.filter(t => t.trend === "down").length;
  const totalTrends = trendsData.length;
  
  const healthScore = totalTrends > 0 
    ? Math.round((positiveTrends / totalTrends) * 100)
    : 100;

  return {
    totalMetrics: metrics.length,
    dataMetrics: dataMetrics.length,
    coreMetrics: coreMetrics.length,
    actionItems: actionItems.length,
    healthScore,
    trends: trendsData,
    topPerformers: trendsData
      .filter(t => t.trend === "up")
      .sort((a, b) => b.change - a.change)
      .slice(0, 3),
    underPerformers: trendsData
      .filter(t => t.trend === "down")
      .sort((a, b) => a.change - b.change)
      .slice(0, 3),
  };
}

/**
 * Generate KPI cards for dashboard overview
 */
export function generateKPICards(metrics: MetricCard[]) {
  return metrics
    .filter(m => m.category === "Data/Metric" && m.data && m.data.length > 0)
    .slice(0, 6) // Limit to 6 KPIs for clean layout
    .map((metric, index) => {
      const latestData = metric.data![0];
      return {
        id: `kpi_${metric.id}`,
        title: metric.title,
        value: latestData.value,
        change: latestData.change_percent,
        trend: latestData.trend,
        category: metric.subCategory || "Metric",
        period: latestData.period,
        description: metric.description,
      };
    });
}

/**
 * Check if canvas has groups for dashboard generation
 */
export function canGenerateDashboards(canvas?: CanvasProject): boolean {
  return !!(canvas?.groups && canvas.groups.length > 0);
}

/**
 * Get default dashboard option
 */
export function getDefaultDashboard(dashboards: DashboardConfig[]): DashboardConfig | null {
  if (dashboards.length === 0) return null;
  
  // Prefer dashboards with more metrics, or first one
  return dashboards.reduce((best, current) => 
    current.metrics.length > best.metrics.length ? current : best
  );
}