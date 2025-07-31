import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
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
import {
  Search,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  BarChart3,
  Network,
  FileText,
  Calendar,
  Users,
  Star,
  CheckCircle,
  AlertTriangle,
  Clock,
  Grid3X3,
} from "lucide-react";
import { useProjectsStore } from "@/lib/stores";

type TabType = "metrics" | "relationships" | "repo";
type SortField =
  | "name"
  | "category"
  | "updated"
  | "connections"
  | "confidence"
  | "type";
type SortOrder = "asc" | "desc";

// Mock repository data with templates and components
const generateRepoData = () => [
  {
    id: "1",
    title: "SaaS Growth Model Template",
    type: "Template",
    date: "2024-01-10",
    owner: "Product Team",
    description: "Complete growth model for SaaS companies",
    associatedItems: ["MRR", "CAC", "LTV", "Churn Rate"],
    tags: ["SaaS", "Growth", "Template"],
    downloads: 15,
    starred: true,
  },
  {
    id: "2",
    title: "User Retention Analysis",
    type: "Analysis",
    date: "2024-01-08",
    owner: "Data Team",
    description: "Cohort-based retention analysis methodology",
    associatedItems: ["User Retention Rate", "Churn Rate"],
    tags: ["Retention", "Analysis", "Cohorts"],
    downloads: 8,
    starred: false,
  },
  {
    id: "3",
    title: "Marketing Attribution Model",
    type: "Component",
    date: "2024-01-05",
    owner: "Marketing Team",
    description: "Multi-touch attribution analysis component",
    associatedItems: ["CAC", "Ad Spend", "Conversion Rate"],
    tags: ["Marketing", "Attribution", "Component"],
    downloads: 12,
    starred: true,
  },
  {
    id: "4",
    title: "Financial Planning Framework",
    type: "Framework",
    date: "2024-01-03",
    owner: "Finance Team",
    description: "Strategic financial planning and forecasting",
    associatedItems: ["Revenue", "Expenses", "Cash Flow"],
    tags: ["Finance", "Planning", "Framework"],
    downloads: 6,
    starred: false,
  },
];

export default function AssetsPage() {
  const { canvasId } = useParams();
  const { getProjectById } = useProjectsStore();

  const [activeTab, setActiveTab] = useState<TabType>("metrics");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("updated");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const project = canvasId ? getProjectById(canvasId) : null;
  const metrics = project?.nodes || [];
  const relationships = project?.edges || [];
  const repoData = generateRepoData();

  // Enhanced filtering and sorting
  const filteredMetrics = useMemo(() => {
    let filtered = metrics.filter(
      (metric) =>
        metric.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        metric.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (metric) => metric.category === categoryFilter
      );
    }

    return filtered.sort((a, b) => {
      const multiplier = sortOrder === "asc" ? 1 : -1;
      switch (sortField) {
        case "name":
          return a.title.localeCompare(b.title) * multiplier;
        case "category":
          return a.category.localeCompare(b.category) * multiplier;
        case "updated":
          return (
            (new Date(a.updatedAt).getTime() -
              new Date(b.updatedAt).getTime()) *
            multiplier
          );
        default:
          return 0;
      }
    });
  }, [metrics, searchQuery, categoryFilter, sortField, sortOrder]);

  const filteredRelationships = useMemo(() => {
    return relationships.filter((rel) => {
      const sourceNode = metrics.find((m) => m.id === rel.sourceId);
      const targetNode = metrics.find((m) => m.id === rel.targetId);
      return (
        sourceNode?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        targetNode?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rel.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [relationships, metrics, searchQuery]);

  const filteredRepo = useMemo(() => {
    return repoData.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [repoData, searchQuery]);

  const metricCategories = useMemo(() => {
    const cats = new Set(metrics.map((m) => m.category));
    return Array.from(cats);
  }, [metrics]);

  const getNodeById = (id: string) => metrics.find((node) => node.id === id);

  const tabs = [
    { id: "metrics" as const, label: "Metrics", count: filteredMetrics.length },
    {
      id: "relationships" as const,
      label: "Relationships",
      count: filteredRelationships.length,
    },
    { id: "repo" as const, label: "Repo", count: filteredRepo.length },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Assets</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive repository of metrics, relationships, and templates
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Asset
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Metrics</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {metricCategories.length} categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Relationships</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{relationships.length}</div>
            <p className="text-xs text-muted-foreground">
              {relationships.filter((r) => r.confidence === "High").length} high
              confidence
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Repository Items
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{repoData.length}</div>
            <p className="text-xs text-muted-foreground">
              {repoData.filter((r) => r.starred).length} starred templates
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {activeTab === "metrics" && (
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {metricCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select
          value={`${sortField}-${sortOrder}`}
          onValueChange={(value) => {
            const [field, order] = value.split("-");
            setSortField(field as SortField);
            setSortOrder(order as SortOrder);
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated-desc">Latest First</SelectItem>
            <SelectItem value="updated-asc">Oldest First</SelectItem>
            <SelectItem value="name-asc">Name A-Z</SelectItem>
            <SelectItem value="name-desc">Name Z-A</SelectItem>
            {activeTab === "metrics" && (
              <SelectItem value="category-asc">Category A-Z</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === "metrics" && (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Metric
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Connections
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Updated
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredMetrics.map((metric) => (
                      <tr key={metric.id} className="hover:bg-muted/25">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                              <BarChart3 className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium text-foreground">
                                {metric.title}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {metric.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline">{metric.category}</Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium">
                            {metric.data && metric.data.length > 0
                              ? `${metric.data[0].value}`
                              : "No data"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {metric.data && metric.data.length > 0
                              ? `Period: ${metric.data[0].period}`
                              : ""}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <Network className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">
                              {
                                relationships.filter(
                                  (r) =>
                                    r.sourceId === metric.id ||
                                    r.targetId === metric.id
                                ).length
                              }
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(metric.updatedAt).toLocaleDateString()}
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
                                Edit Metric
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
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

        {activeTab === "relationships" && (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Relationship
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Confidence
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Evidence
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Updated
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredRelationships.map((rel) => {
                      const sourceNode = getNodeById(rel.sourceId);
                      const targetNode = getNodeById(rel.targetId);
                      return (
                        <tr key={rel.id} className="hover:bg-muted/25">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-medium">
                                {sourceNode?.title || "Unknown"}
                              </div>
                              <div className="text-muted-foreground">→</div>
                              <div className="text-sm font-medium">
                                {targetNode?.title || "Unknown"}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              variant={
                                rel.type === "Deterministic"
                                  ? "default"
                                  : rel.type === "Causal"
                                    ? "destructive"
                                    : rel.type === "Probabilistic"
                                      ? "secondary"
                                      : "outline"
                              }
                            >
                              {rel.type}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {rel.confidence === "High" && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                              {rel.confidence === "Medium" && (
                                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                              )}
                              {rel.confidence === "Low" && (
                                <Clock className="h-4 w-4 text-red-500" />
                              )}
                              <span className="text-sm">{rel.confidence}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">
                                {rel.evidence.length} items
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {new Date(rel.updatedAt).toLocaleDateString()}
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
                                  View Evidence
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Relationship
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "repo" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRepo.map((item) => (
              <Card
                key={item.id}
                className="group hover:shadow-lg transition-all duration-200"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                        {item.type === "Template" && (
                          <FileText className="h-4 w-4 text-primary" />
                        )}
                        {item.type === "Analysis" && (
                          <BarChart3 className="h-4 w-4 text-primary" />
                        )}
                        {item.type === "Component" && (
                          <Network className="h-4 w-4 text-primary" />
                        )}
                        {item.type === "Framework" && (
                          <Grid3X3 className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          {item.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{item.type}</Badge>
                          {item.starred && (
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          )}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Star className="mr-2 h-4 w-4" />
                          {item.starred ? "Remove Star" : "Add Star"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <CardDescription className="text-sm">
                      {item.description}
                    </CardDescription>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {item.owner}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(item.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {item.downloads}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="pt-2 border-t">
                      <div className="text-xs text-muted-foreground mb-1">
                        Associated with:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {item.associatedItems.map((assoc) => (
                          <Badge
                            key={assoc}
                            variant="outline"
                            className="text-xs"
                          >
                            {assoc}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
