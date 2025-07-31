import { useState } from "react";
import { Filter, Calendar, Search, X, RefreshCw } from "lucide-react";
import { ControlButton } from "@xyflow/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useCanvasStore } from "@/lib/stores";
import type { CardCategory } from "@/lib/types";

interface FilterState {
  searchTerm: string;
  categories: CardCategory[];
  dateRange: {
    from: string;
    to: string;
  };
  tags: string[];
  owners: string[];
  showOnlyConnected: boolean;
}

const categoryOptions: Array<{ value: CardCategory; label: string }> = [
  { value: "Core/Value", label: "Core/Value" },
  { value: "Data/Metric", label: "Data/Metric" },
  { value: "Work/Action", label: "Work/Action" },
  { value: "Ideas/Hypothesis", label: "Ideas/Hypothesis" },
  { value: "Metadata", label: "Metadata" },
];

export default function FilterControls() {
  const { canvas, dateRange, setDateRange } = useCanvasStore();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    categories: [],
    dateRange: {
      from: dateRange.start,
      to: dateRange.end,
    },
    tags: [],
    owners: [],
    showOnlyConnected: false,
  });

  // Get unique tags and owners from canvas
  const availableTags = Array.from(
    new Set(canvas?.nodes.flatMap((node) => node.tags) || [])
  ).filter(Boolean);

  const availableOwners = Array.from(
    new Set(canvas?.nodes.map((node) => node.owner).filter(Boolean) || [])
  );

  const handleFilterChange = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleCategoryToggle = (category: CardCategory) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleTagToggle = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleOwnerToggle = (owner: string) => {
    setFilters((prev) => ({
      ...prev,
      owners: prev.owners.includes(owner)
        ? prev.owners.filter((o) => o !== owner)
        : [...prev.owners, owner],
    }));
  };

  const handleApplyFilters = () => {
    // Update date range in store
    setDateRange(filters.dateRange.from, filters.dateRange.to);

    // TODO: Apply filtering logic to canvas nodes
    // This would typically involve filtering the nodes and edges based on the criteria
    console.log("Applying filters:", filters);

    setShowFilters(false);
  };

  const handleResetFilters = () => {
    setFilters({
      searchTerm: "",
      categories: [],
      dateRange: {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        to: new Date().toISOString().split("T")[0],
      },
      tags: [],
      owners: [],
      showOnlyConnected: false,
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.categories.length > 0) count++;
    if (filters.tags.length > 0) count++;
    if (filters.owners.length > 0) count++;
    if (filters.showOnlyConnected) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <Dialog open={showFilters} onOpenChange={setShowFilters}>
      <DialogTrigger asChild>
        <ControlButton title="Filter & Date">
          <div className="relative">
            <Filter className="h-4 w-4" />
            {activeFilterCount > 0 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                {activeFilterCount}
              </div>
            )}
          </div>
        </ControlButton>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Filter & Date Range</DialogTitle>
          <DialogDescription>
            Filter canvas elements and set date ranges for analysis.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search */}
          <div className="space-y-2">
            <Label>Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search nodes, relationships, or descriptions..."
                value={filters.searchTerm}
                onChange={(e) =>
                  handleFilterChange("searchTerm", e.target.value)
                }
                className="pl-10"
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date Range
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">From</Label>
                <Input
                  type="date"
                  value={filters.dateRange.from}
                  onChange={(e) =>
                    handleFilterChange("dateRange", {
                      ...filters.dateRange,
                      from: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">To</Label>
                <Input
                  type="date"
                  value={filters.dateRange.to}
                  onChange={(e) =>
                    handleFilterChange("dateRange", {
                      ...filters.dateRange,
                      to: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <Label>Categories</Label>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((category) => (
                <div
                  key={category.value}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={`category-${category.value}`}
                    checked={filters.categories.includes(category.value)}
                    onCheckedChange={() => handleCategoryToggle(category.value)}
                  />
                  <Label
                    htmlFor={`category-${category.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {category.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          {availableTags.length > 0 && (
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {availableTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={filters.tags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Owners */}
          {availableOwners.length > 0 && (
            <div className="space-y-2">
              <Label>Owners</Label>
              <div className="flex flex-wrap gap-2">
                {availableOwners.map((owner) => (
                  <div key={owner} className="flex items-center space-x-2">
                    <Checkbox
                      id={`owner-${owner}`}
                      checked={filters.owners.includes(owner)}
                      onCheckedChange={() => handleOwnerToggle(owner)}
                    />
                    <Label
                      htmlFor={`owner-${owner}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {owner}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Connected Only */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="connected-only"
              checked={filters.showOnlyConnected}
              onCheckedChange={(checked) =>
                handleFilterChange("showOnlyConnected", checked)
              }
            />
            <Label htmlFor="connected-only" className="text-sm font-normal">
              Show only connected nodes
            </Label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button onClick={handleApplyFilters} className="flex-1">
              Apply Filters
            </Button>
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
          </div>

          {/* Active Filters Summary */}
          {activeFilterCount > 0 && (
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}{" "}
                  active
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                  className="text-xs"
                >
                  Clear all
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
