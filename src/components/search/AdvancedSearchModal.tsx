import { useState, useMemo, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  BarChart3,
  Network,
  FileText,
  Tag,
  SlidersHorizontal,
  ChevronRight,
} from "lucide-react";
import { useCanvasStore } from "@/lib/stores";
import { useEvidenceStore } from "@/lib/stores/evidenceStore";
import type {
  MetricCard,
  Relationship,
  EvidenceItem,
  ConfidenceLevel,
} from "@/lib/types";

interface SearchResult {
  id: string;
  type: "metric" | "relationship" | "evidence";
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  score: number;
  data: MetricCard | Relationship | EvidenceItem;
}

interface SearchFilters {
  types: string[];
  categories: string[];
  tags: string[];
  dateRange: {
    from?: string;
    to?: string;
  };
  owners: string[];
  confidence?: ConfidenceLevel;
}

interface AdvancedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResultSelect?: (result: SearchResult) => void;
}

export default function AdvancedSearchModal({
  isOpen,
  onClose,
  onResultSelect,
}: AdvancedSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({
    types: [],
    categories: [],
    tags: [],
    dateRange: {},
    owners: [],
  });
  const [activeTab, setActiveTab] = useState<"quick" | "advanced">("quick");

  const { canvas } = useCanvasStore();
  const { evidence } = useEvidenceStore();

  // Search logic
  const searchResults = useMemo(() => {
    if (
      !searchQuery.trim() &&
      Object.values(filters).every((f) =>
        Array.isArray(f) ? f.length === 0 : !f || Object.keys(f).length === 0
      )
    ) {
      return [];
    }

    const results: SearchResult[] = [];
    const query = searchQuery.toLowerCase();

    // Search metric cards
    if (!filters.types.length || filters.types.includes("metric")) {
      canvas?.nodes.forEach((card) => {
        let score = 0;

        // Title match (highest priority)
        if (card.title.toLowerCase().includes(query)) score += 100;

        // Description match
        if (card.description?.toLowerCase().includes(query)) score += 50;

        // Category match
        if (card.category.toLowerCase().includes(query)) score += 30;

        // Tags match
        card.tags?.forEach((tag) => {
          if (tag.toLowerCase().includes(query)) score += 20;
        });

        // Apply filters
        if (
          filters.categories.length &&
          !filters.categories.includes(card.category)
        )
          return;
        if (
          filters.tags.length &&
          !filters.tags.some((tag) => card.tags?.includes(tag))
        )
          return;
        if (
          filters.owners.length &&
          card.owner &&
          !filters.owners.includes(card.owner)
        )
          return;

        if (
          score > 0 ||
          (!searchQuery.trim() &&
            Object.values(filters).some((f) =>
              Array.isArray(f) ? f.length > 0 : !!f
            ))
        ) {
          results.push({
            id: card.id,
            type: "metric",
            title: card.title,
            description: card.description,
            category: card.category,
            tags: card.tags,
            score: score || 1,
            data: card,
          });
        }
      });
    }

    // Search relationships
    if (!filters.types.length || filters.types.includes("relationship")) {
      canvas?.edges.forEach((relationship) => {
        let score = 0;

        // Type match
        if (relationship.type.toLowerCase().includes(query)) score += 80;

        // Confidence match
        if (relationship.confidence.toLowerCase().includes(query)) score += 60;

        // Evidence title match
        relationship.evidence?.forEach((evidence) => {
          if (evidence.title.toLowerCase().includes(query)) score += 40;
          if (evidence.summary.toLowerCase().includes(query)) score += 30;
        });

        // Apply filters
        if (
          filters.confidence &&
          relationship.confidence !== filters.confidence
        )
          return;

        if (score > 0 || (!searchQuery.trim() && filters.confidence)) {
          const sourceNode = canvas?.nodes.find(
            (n) => n.id === relationship.sourceId
          );
          const targetNode = canvas?.nodes.find(
            (n) => n.id === relationship.targetId
          );

          results.push({
            id: relationship.id,
            type: "relationship",
            title: `${sourceNode?.title || "Unknown"} → ${targetNode?.title || "Unknown"}`,
            description: `${relationship.type} relationship with ${relationship.confidence} confidence`,
            category: relationship.type,
            score: score || 1,
            data: relationship,
          });
        }
      });
    }

    // Search evidence
    if (!filters.types.length || filters.types.includes("evidence")) {
      evidence.forEach((item) => {
        let score = 0;

        // Title match
        if (item.title.toLowerCase().includes(query)) score += 100;

        // Summary match
        if (item.summary.toLowerCase().includes(query)) score += 70;

        // Owner match
        if (item.owner.toLowerCase().includes(query)) score += 40;

        // Type match
        if (item.type.toLowerCase().includes(query)) score += 30;

        // Apply filters
        if (filters.owners.length && !filters.owners.includes(item.owner))
          return;

        if (score > 0 || (!searchQuery.trim() && filters.owners.length)) {
          results.push({
            id: item.id,
            type: "evidence",
            title: item.title,
            description: item.summary,
            category: item.type,
            tags: [],
            score: score || 1,
            data: item,
          });
        }
      });
    }

    return results.sort((a, b) => b.score - a.score);
  }, [searchQuery, filters, canvas, evidence]);

  // Get available filter options
  const filterOptions = useMemo(() => {
    const categories = new Set<string>();
    const tags = new Set<string>();
    const owners = new Set<string>();

    canvas?.nodes.forEach((card) => {
      categories.add(card.category);
      card.tags?.forEach((tag) => tags.add(tag));
      if (card.owner) owners.add(card.owner);
    });

    evidence.forEach((item) => {
      if (item.owner) owners.add(item.owner);
    });

    return {
      categories: Array.from(categories),
      tags: Array.from(tags),
      owners: Array.from(owners),
    };
  }, [canvas, evidence]);

  const updateFilter = useCallback((key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const toggleFilterItem = useCallback(
    (filterType: "types" | "categories" | "tags" | "owners", item: string) => {
      setFilters((prev) => ({
        ...prev,
        [filterType]: prev[filterType].includes(item)
          ? prev[filterType].filter((i) => i !== item)
          : [...prev[filterType], item],
      }));
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters({
      types: [],
      categories: [],
      tags: [],
      dateRange: {},
      owners: [],
    });
  }, []);

  const handleResultClick = useCallback(
    (result: SearchResult) => {
      onResultSelect?.(result);
      onClose();
    },
    [onResultSelect, onClose]
  );

  const getResultIcon = (type: string) => {
    switch (type) {
      case "metric":
        return <BarChart3 className="h-4 w-4" />;
      case "relationship":
        return <Network className="h-4 w-4" />;
      case "evidence":
        return <FileText className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const getResultColor = (type: string) => {
    switch (type) {
      case "metric":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "relationship":
        return "bg-green-50 text-green-700 border-green-200";
      case "evidence":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-hidden flex flex-col bg-background border-border z-[100]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Advanced Search
          </DialogTitle>
          <DialogDescription>
            Search across all metric cards, relationships, and evidence
          </DialogDescription>
        </DialogHeader>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search across all assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4"
            autoFocus
          />
        </div>

        {/* Search Mode Tabs */}
        <div className="flex items-center gap-4">
          <div className="flex border rounded-lg p-1">
            <Button
              variant={activeTab === "quick" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("quick")}
            >
              Quick Search
            </Button>
            <Button
              variant={activeTab === "advanced" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("advanced")}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Advanced
            </Button>
          </div>

          {/* Active Filters Display */}
          {Object.values(filters).some((f) =>
            Array.isArray(f) ? f.length > 0 : !!f
          ) && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {Object.values(filters).reduce(
                  (acc, f) => acc + (Array.isArray(f) ? f.length : f ? 1 : 0),
                  0
                )}{" "}
                filters
              </Badge>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
          )}
        </div>

        <div className="flex gap-4 flex-1 overflow-hidden">
          {/* Advanced Filters Sidebar */}
          {activeTab === "advanced" && (
            <div className="w-80 border-r pr-4 overflow-y-auto">
              <div className="space-y-4">
                <h3 className="font-medium text-sm">Filters</h3>

                <Accordion type="multiple" defaultValue={["type", "category"]}>
                  {/* Asset Type Filter */}
                  <AccordionItem value="type">
                    <AccordionTrigger className="text-sm">
                      Asset Type
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2">
                      {["metric", "relationship", "evidence"].map((type) => (
                        <label
                          key={type}
                          className="flex items-center space-x-2 text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={filters.types.includes(type)}
                            onChange={() => toggleFilterItem("types", type)}
                            className="rounded"
                          />
                          <span className="capitalize">{type}s</span>
                        </label>
                      ))}
                    </AccordionContent>
                  </AccordionItem>

                  {/* Category Filter */}
                  <AccordionItem value="category">
                    <AccordionTrigger className="text-sm">
                      Category
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2">
                      {filterOptions.categories.map((category) => (
                        <label
                          key={category}
                          className="flex items-center space-x-2 text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={filters.categories.includes(category)}
                            onChange={() =>
                              toggleFilterItem("categories", category)
                            }
                            className="rounded"
                          />
                          <span>{category}</span>
                        </label>
                      ))}
                    </AccordionContent>
                  </AccordionItem>

                  {/* Tags Filter */}
                  {filterOptions.tags.length > 0 && (
                    <AccordionItem value="tags">
                      <AccordionTrigger className="text-sm">
                        Tags
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2">
                        {filterOptions.tags.slice(0, 10).map((tag) => (
                          <label
                            key={tag}
                            className="flex items-center space-x-2 text-sm"
                          >
                            <input
                              type="checkbox"
                              checked={filters.tags.includes(tag)}
                              onChange={() => toggleFilterItem("tags", tag)}
                              className="rounded"
                            />
                            <span>{tag}</span>
                          </label>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Owner Filter */}
                  {filterOptions.owners.length > 0 && (
                    <AccordionItem value="owners">
                      <AccordionTrigger className="text-sm">
                        Owner
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2">
                        {filterOptions.owners.map((owner) => (
                          <label
                            key={owner}
                            className="flex items-center space-x-2 text-sm"
                          >
                            <input
                              type="checkbox"
                              checked={filters.owners.includes(owner)}
                              onChange={() => toggleFilterItem("owners", owner)}
                              className="rounded"
                            />
                            <span>{owner}</span>
                          </label>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Confidence Filter */}
                  <AccordionItem value="confidence">
                    <AccordionTrigger className="text-sm">
                      Confidence Level
                    </AccordionTrigger>
                    <AccordionContent>
                      <Select
                        value={filters.confidence || ""}
                        onValueChange={(value) =>
                          updateFilter("confidence", value || undefined)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All confidence levels" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All levels</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          )}

          {/* Search Results */}
          <div className="flex-1 overflow-y-auto">
            {searchResults.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-sm">
                    {searchResults.length} result
                    {searchResults.length === 1 ? "" : "s"}
                  </h3>
                </div>

                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className={`p-1 rounded border ${getResultColor(result.type)}`}
                          >
                            {getResultIcon(result.type)}
                          </div>
                          <h4 className="font-medium text-sm">
                            {result.title}
                          </h4>
                          <Badge
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {result.type}
                          </Badge>
                        </div>

                        {result.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {result.description}
                          </p>
                        )}

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {result.category && (
                            <span className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {result.category}
                            </span>
                          )}
                          {result.tags && result.tags.length > 0 && (
                            <span>• {result.tags.slice(0, 2).join(", ")}</span>
                          )}
                        </div>
                      </div>

                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            ) : searchQuery ||
              Object.values(filters).some((f) =>
                Array.isArray(f) ? f.length > 0 : !!f
              ) ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  No results found
                </h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search query or filters
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  Start Searching
                </h3>
                <p className="text-sm text-muted-foreground">
                  Enter a search query to find metric cards, relationships, and
                  evidence
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
