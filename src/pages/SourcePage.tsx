import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Filter, CheckCircle, XCircle, Clock } from "lucide-react";

// Mock data for data/metric cards
const mockDataSources = [
  {
    id: "1",
    metricName: "New User Signups",
    sourceSystem: "Segment",
    eventName: "user_signed_up",
    actor: "User",
    trigger: "clicks_signup_button",
    status: "Live" as const
  },
  {
    id: "2",
    metricName: "Monthly Recurring Revenue", 
    sourceSystem: "Stripe",
    eventName: "subscription_created",
    actor: "System",
    trigger: "payment_processed",
    status: "Instrumented" as const
  },
  {
    id: "3",
    metricName: "Page Views",
    sourceSystem: "Google Analytics",
    eventName: "page_view",
    actor: "User", 
    trigger: "page_load",
    status: "Needs QA" as const
  },
  {
    id: "4",
    metricName: "Feature Adoption Rate",
    sourceSystem: "Mixpanel",
    eventName: "feature_used",
    actor: "User",
    trigger: "feature_interaction",
    status: "Planned" as const
  }
];

type InstrumentationStatus = "Planned" | "Instrumented" | "Needs QA" | "Live";

export default function SourcePage() {
  const { canvasId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<InstrumentationStatus | "All">("All");

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

  const getStatusColor = (status: InstrumentationStatus) => {
    switch (status) {
      case "Live":
        return "bg-green-100 text-green-800";
      case "Instrumented":
        return "bg-blue-100 text-blue-800";
      case "Needs QA":
        return "bg-yellow-100 text-yellow-800";
      case "Planned":
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredSources = mockDataSources.filter(source => {
    const matchesSearch = source.metricName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         source.sourceSystem.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         source.eventName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || source.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = mockDataSources.reduce((acc, source) => {
    acc[source.status] = (acc[source.status] || 0) + 1;
    return acc;
  }, {} as Record<InstrumentationStatus, number>);

  return (
    <div className="h-full bg-background">
      {/* Header */}
      <div className="h-14 border-b border-border bg-card px-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">Source</h2>
          <p className="text-sm text-muted-foreground">Data governance & instrumentation</p>
        </div>
        <div className="text-sm text-muted-foreground">
          Canvas {canvasId}
        </div>
      </div>

      <div className="h-[calc(100%-3.5rem)] flex flex-col">
        {/* Status Overview */}
        <div className="px-6 py-4 border-b border-border bg-card">
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  {getStatusIcon(status as InstrumentationStatus)}
                  <span className="text-2xl font-bold text-card-foreground">{count}</span>
                </div>
                <div className="text-sm text-muted-foreground">{status}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="px-6 py-4 border-b border-border bg-card">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search metrics or systems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-border rounded-md bg-background"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as InstrumentationStatus | "All")}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="All">All Status</option>
              <option value="Planned">Planned</option>
              <option value="Instrumented">Instrumented</option>
              <option value="Needs QA">Needs QA</option>
              <option value="Live">Live</option>
            </select>

            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Data Sources Table */}
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Metric Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Source System
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Event Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Trigger
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {filteredSources.map((source) => (
                  <tr key={source.id} className="hover:bg-muted/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-card-foreground">{source.metricName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {source.sourceSystem}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="px-2 py-1 bg-muted text-sm rounded font-mono">
                        {source.eventName}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {source.actor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {source.trigger}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(source.status)}
                        <span className={`px-2 py-1 text-xs rounded ${getStatusColor(source.status)}`}>
                          {source.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSources.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                No data sources found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}