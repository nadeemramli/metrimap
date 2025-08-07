import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { FilterOptions } from "@/lib/utils/filterUtils";
import type { CardCategory } from "@/lib/types";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (options: FilterOptions) => void;
  currentFilters: FilterOptions;
  availableOptions: {
    categories: CardCategory[];
    tags: string[];
    owners: string[];
    confidence: string[];
    relationshipTypes: string[];
  };
}

export default function FilterModal({
  isOpen,
  onClose,
  onApplyFilters,
  currentFilters,
  availableOptions,
}: FilterModalProps) {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);
  const [searchTerm, setSearchTerm] = useState(currentFilters.searchTerm || "");

  useEffect(() => {
    setFilters(currentFilters);
    setSearchTerm(currentFilters.searchTerm || "");
  }, [currentFilters]);

  const handleApply = () => {
    const finalFilters = {
      ...filters,
      searchTerm: searchTerm.trim() || undefined,
    };
    onApplyFilters(finalFilters);
    onClose();
  };

  const handleClear = () => {
    setFilters({});
    setSearchTerm("");
  };

  const handleCategoryToggle = (category: CardCategory) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories?.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...(prev.categories || []), category],
    }));
  };

  const handleTagToggle = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags?.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...(prev.tags || []), tag],
    }));
  };

  const handleOwnerToggle = (owner: string) => {
    setFilters((prev) => ({
      ...prev,
      owners: prev.owners?.includes(owner)
        ? prev.owners.filter((o) => o !== owner)
        : [...(prev.owners || []), owner],
    }));
  };

  const handleConfidenceToggle = (confidence: string) => {
    setFilters((prev) => ({
      ...prev,
      confidence: prev.confidence?.includes(confidence as any)
        ? prev.confidence.filter((c) => c !== confidence)
        : [...(prev.confidence || []), confidence as any],
    }));
  };

  const handleRelationshipTypeToggle = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      relationshipTypes: prev.relationshipTypes?.includes(type as any)
        ? prev.relationshipTypes.filter((t) => t !== type)
        : [...(prev.relationshipTypes || []), type as any],
    }));
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.categories?.length) count += filters.categories.length;
    if (filters.tags?.length) count += filters.tags.length;
    if (filters.owners?.length) count += filters.owners.length;
    if (filters.confidence?.length) count += filters.confidence.length;
    if (filters.relationshipTypes?.length)
      count += filters.relationshipTypes.length;
    if (searchTerm.trim()) count += 1;
    if (filters.dateRange) count += 1;
    return count;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Filter Canvas</DialogTitle>
          <DialogDescription>
            Filter metric cards and relationships by various criteria
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search Term */}
          <div className="space-y-2">
            <Label htmlFor="search">Search Term</Label>
            <Input
              id="search"
              placeholder="Search in titles, descriptions, and tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <Label>Categories</Label>
            <div className="flex flex-wrap gap-2">
              {availableOptions.categories.map((category) => (
                <Badge
                  key={category}
                  variant={
                    filters.categories?.includes(category)
                      ? "default"
                      : "outline"
                  }
                  className="cursor-pointer hover:bg-primary/10"
                  onClick={() => handleCategoryToggle(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {availableOptions.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant={filters.tags?.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/10"
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Owners */}
          <div className="space-y-2">
            <Label>Owners</Label>
            <div className="flex flex-wrap gap-2">
              {availableOptions.owners.map((owner) => (
                <Badge
                  key={owner}
                  variant={
                    filters.owners?.includes(owner) ? "default" : "outline"
                  }
                  className="cursor-pointer hover:bg-primary/10"
                  onClick={() => handleOwnerToggle(owner)}
                >
                  {owner}
                </Badge>
              ))}
            </div>
          </div>

          {/* Confidence Levels */}
          <div className="space-y-2">
            <Label>Confidence Levels</Label>
            <div className="flex flex-wrap gap-2">
              {availableOptions.confidence.map((confidence) => (
                <Badge
                  key={confidence}
                  variant={
                    filters.confidence?.includes(confidence as any)
                      ? "default"
                      : "outline"
                  }
                  className="cursor-pointer hover:bg-primary/10"
                  onClick={() => handleConfidenceToggle(confidence)}
                >
                  {confidence}
                </Badge>
              ))}
            </div>
          </div>

          {/* Relationship Types */}
          <div className="space-y-2">
            <Label>Relationship Types</Label>
            <div className="flex flex-wrap gap-2">
              {availableOptions.relationshipTypes.map((type) => (
                <Badge
                  key={type}
                  variant={
                    filters.relationshipTypes?.includes(type as any)
                      ? "default"
                      : "outline"
                  }
                  className="cursor-pointer hover:bg-primary/10"
                  onClick={() => handleRelationshipTypeToggle(type)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label>Date Range</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !filters.dateRange?.start && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange?.start
                      ? format(new Date(filters.dateRange.start), "PPP")
                      : "Start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      filters.dateRange?.start
                        ? new Date(filters.dateRange.start)
                        : undefined
                    }
                    onSelect={(date) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateRange: {
                          start: date?.toISOString() || "",
                          end: prev.dateRange?.end || date?.toISOString() || "",
                        },
                      }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !filters.dateRange?.end && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange?.end
                      ? format(new Date(filters.dateRange.end), "PPP")
                      : "End date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      filters.dateRange?.end
                        ? new Date(filters.dateRange.end)
                        : undefined
                    }
                    onSelect={(date) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateRange: {
                          start:
                            prev.dateRange?.start || date?.toISOString() || "",
                          end: date?.toISOString() || "",
                        },
                      }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Active Filters Summary */}
          {getActiveFilterCount() > 0 && (
            <div className="space-y-2">
              <Label>Active Filters</Label>
              <div className="flex flex-wrap gap-2">
                {filters.categories?.map((category) => (
                  <Badge key={category} variant="secondary" className="gap-1">
                    {category}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleCategoryToggle(category)}
                    />
                  </Badge>
                ))}
                {filters.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleTagToggle(tag)}
                    />
                  </Badge>
                ))}
                {searchTerm.trim() && (
                  <Badge variant="secondary" className="gap-1">
                    Search: "{searchTerm}"
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setSearchTerm("")}
                    />
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClear}>
            Clear All
          </Button>
          <Button onClick={handleApply}>
            Apply Filters ({getActiveFilterCount()})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
