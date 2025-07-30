import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, TrendingUp, TrendingDown, Minus } from "lucide-react";

// Mock dashboard data
const mockDashboards = [
  "Customer Acquisition Funnel",
  "Core Financials", 
  "User Retention Loop",
  "Marketing Performance"
];

const mockMetricCards = [
  {
    id: "1",
    title: "Monthly Recurring Revenue",
    value: 124567,
    change: 8.2,
    trend: "up" as const,
    period: "vs last month"
  },
  {
    id: "2", 
    title: "Customer Acquisition Cost",
    value: 89,
    change: -5.4,
    trend: "down" as const,
    period: "vs last month"
  },
  {
    id: "3",
    title: "Monthly Active Users", 
    value: 15642,
    change: 12.1,
    trend: "up" as const,
    period: "vs last month"
  },
  {
    id: "4",
    title: "Churn Rate",
    value: 3.2,
    change: 0.1,
    trend: "neutral" as const,
    period: "vs last month",
    unit: "%"
  }
];

export default function DashboardPage() {
  const { canvasId } = useParams();
  const [selectedDashboard, setSelectedDashboard] = useState(mockDashboards[0]);

  const formatValue = (value: number, unit?: string) => {
    if (unit === "%") return `${value}${unit}`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return value.toLocaleString();
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down": return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up": return "text-green-500";
      case "down": return "text-red-500";
      default: return "text-yellow-500";
    }
  };

  return (
    <div className="h-full bg-background">
      {/* Dashboard Header */}
      <div className="h-14 border-b border-border bg-card px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-card-foreground">Dashboard</h2>
          
          {/* Dashboard Selector */}
          <div className="relative">
            <Button variant="outline" className="gap-2 min-w-[200px] justify-between">
              {selectedDashboard}
              <ChevronDown className="h-4 w-4" />
            </Button>
            {/* Dropdown menu would go here */}
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          Canvas {canvasId} • Live Data
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="p-6 h-[calc(100%-3.5rem)] overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {selectedDashboard}
            </h1>
            <p className="text-muted-foreground">
              Live metrics from your business model • Auto-generated from canvas subflows
            </p>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockMetricCards.map((metric) => (
              <div key={metric.id} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-medium text-card-foreground text-sm">
                    {metric.title}
                  </h3>
                  {getTrendIcon(metric.trend)}
                </div>

                <div className="space-y-2">
                  <div className="text-2xl font-bold text-card-foreground">
                    {formatValue(metric.value, metric.unit)}
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm">
                    <span className={getTrendColor(metric.trend)}>
                      {metric.change > 0 ? "+" : ""}{metric.change}%
                    </span>
                    <span className="text-muted-foreground">
                      {metric.period}
                    </span>
                  </div>
                </div>

                {/* Mini chart placeholder */}
                <div className="mt-4 h-12 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                  Chart Area
                </div>
              </div>
            ))}
          </div>

          {/* Drill Down Section */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Performance Analysis
            </h2>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground text-center py-8">
                Click on any metric above to "drill on the reds" and investigate upstream drivers and downstream impacts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}