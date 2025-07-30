import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Filter, ExternalLink } from "lucide-react";

type TabType = "metrics" | "relationships" | "repo";

// Mock data
const mockMetrics = [
  {
    id: "1",
    title: "Monthly Recurring Revenue",
    category: "Data/Metric",
    subCategory: "North Star Metric",
    owner: "John Doe",
    createdDate: "2024-01-10",
    lastUpdated: "2024-01-15",
    connections: 5,
    tags: ["Revenue", "Core"]
  },
  {
    id: "2", 
    title: "Customer Acquisition Cost",
    category: "Data/Metric",
    subCategory: "Leading KPI",
    owner: "Sarah Kim",
    createdDate: "2024-01-08",
    lastUpdated: "2024-01-14",
    connections: 3,
    tags: ["Marketing", "CAC"]
  }
];

const mockRelationships = [
  {
    id: "1",
    source: "Ad Spend",
    target: "New User Signups", 
    type: "Causal",
    confidence: "High",
    weight: 0.75,
    evidenceCount: 3
  },
  {
    id: "2",
    source: "New User Signups",
    target: "Monthly Recurring Revenue",
    type: "Probabilistic", 
    confidence: "Medium",
    weight: 0.62,
    evidenceCount: 2
  }
];

const mockRepo = [
  {
    id: "1",
    title: "Q3 Ad Creative A/B Test",
    type: "Experiment",
    date: "2024-01-10",
    owner: "Sarah Kim",
    associatedItem: "Ad Spend → New User Signups",
    link: "https://example.com/experiment"
  },
  {
    id: "2",
    title: "User Churn Analysis",
    type: "Analysis", 
    date: "2024-01-08",
    owner: "Mike Chen",
    associatedItem: "User Retention Rate",
    link: "https://example.com/analysis"
  }
];

export default function AssetsPage() {
  const { canvasId } = useParams();
  const [activeTab, setActiveTab] = useState<TabType>("metrics");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { id: "metrics" as const, label: "Metrics", count: mockMetrics.length },
    { id: "relationships" as const, label: "Relationships", count: mockRelationships.length },
    { id: "repo" as const, label: "Repo", count: mockRepo.length }
  ];

  return (
    <div className="h-full bg-background">
      {/* Header */}
      <div className="h-14 border-b border-border bg-card px-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">Assets</h2>
          <p className="text-sm text-muted-foreground">Knowledge repository</p>
        </div>
        <div className="text-sm text-muted-foreground">
          Canvas {canvasId}
        </div>
      </div>

      <div className="h-[calc(100%-3.5rem)] flex flex-col">
        {/* Tabs */}
        <div className="border-b border-border bg-card">
          <div className="px-6">
            <div className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="px-6 py-4 border-b border-border bg-card">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-border rounded-md bg-background"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === "metrics" && (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Card Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Connections
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Tags
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Last Updated
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {mockMetrics.map((metric) => (
                    <tr key={metric.id} className="hover:bg-muted/50 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-card-foreground">{metric.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-muted-foreground">
                          {metric.category} → {metric.subCategory}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {metric.owner}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {metric.connections}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-1">
                          {metric.tags.map((tag) => (
                            <span key={tag} className="px-2 py-1 text-xs bg-secondary rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {metric.lastUpdated}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "relationships" && (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Source → Target
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Confidence
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Weight
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Evidence
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {mockRelationships.map((rel) => (
                    <tr key={rel.id} className="hover:bg-muted/50 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-card-foreground">
                          {rel.source} → {rel.target}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">
                          {rel.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded ${
                          rel.confidence === "High" ? "bg-green-100 text-green-800" :
                          rel.confidence === "Medium" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {rel.confidence}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {rel.weight}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {rel.evidenceCount} items
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "repo" && (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Associated Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Link
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {mockRepo.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-card-foreground">{item.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {item.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {item.owner}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {item.associatedItem}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a 
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}