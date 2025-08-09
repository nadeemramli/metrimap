import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  BarChart3,
  Network,
  FileText,
  Clock,
  ArrowRight,
  Command,
} from "lucide-react";
import { useSearch } from "@/lib/hooks/useSearch";
import {
  useKeyboardShortcuts,
  createShortcut,
} from "@/lib/hooks/useKeyboardShortcuts";
import type { SearchResult } from "@/lib/hooks/useSearch";

interface QuickSearchCommandProps {
  isOpen: boolean;
  onClose: () => void;
  onResultSelect?: (result: SearchResult) => void;
}

export default function QuickSearchCommand({
  isOpen,
  onClose,
  onResultSelect,
}: QuickSearchCommandProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const { quickSearch } = useSearch();
  const results = quickSearch(query, 8);

  // Reset on open/close
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Update selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results.length]);

  // Keyboard navigation within the modal
  const shortcuts = [
    createShortcut.key(
      "ArrowDown",
      () => {
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      },
      "Navigate down",
      "Navigation"
    ),
    createShortcut.key(
      "ArrowUp",
      () => {
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      },
      "Navigate up",
      "Navigation"
    ),
    createShortcut.key(
      "Enter",
      () => {
        if (results[selectedIndex]) {
          handleResultSelect(results[selectedIndex]);
        }
      },
      "Select result",
      "Navigation"
    ),
    createShortcut.key("Escape", onClose, "Close search", "Navigation"),
  ];

  useKeyboardShortcuts(shortcuts, { enabled: isOpen });

  const handleResultSelect = (result: SearchResult) => {
    // Call custom handler if provided
    if (onResultSelect) {
      onResultSelect(result);
      onClose();
      return;
    }

    // Default navigation behavior
    switch (result.type) {
      case "metric":
        // Focus on the metric card in canvas
        navigate(`/canvas/${result.data.id}`, {
          state: { focusNode: result.id },
        });
        break;
      case "relationship":
        // Open relationship details
        navigate(`/canvas/${result.data.id}`, {
          state: { openRelationship: result.id },
        });
        break;
      case "evidence":
        // Navigate to evidence repository with focus
        navigate(`/evidence`, { state: { focusEvidence: result.id } });
        break;
    }

    onClose();
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case "metric":
        return <BarChart3 className="h-4 w-4 text-blue-600" />;
      case "relationship":
        return <Network className="h-4 w-4 text-green-600" />;
      case "evidence":
        return <FileText className="h-4 w-4 text-purple-600" />;
      default:
        return <Search className="h-4 w-4 text-gray-600" />;
    }
  };

  const getResultTypeLabel = (type: string) => {
    switch (type) {
      case "metric":
        return "Metric Card";
      case "relationship":
        return "Relationship";
      case "evidence":
        return "Evidence";
      default:
        return "Asset";
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          className="bg-yellow-200 text-yellow-900 px-0.5 rounded"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const recentSearches = [
    "Revenue metrics",
    "Customer acquisition",
    "Correlation analysis",
    "High confidence relationships",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 bg-background text-foreground border-2 border-border shadow-2xl backdrop-blur-sm">
        <DialogHeader className="sr-only">
          <DialogTitle>Quick Search</DialogTitle>
          <DialogDescription>
            Search for metric cards, relationships, and evidence
          </DialogDescription>
        </DialogHeader>
        <div className="border-b px-4 py-3">
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Search metric cards, relationships, evidence..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-0 focus-visible:ring-0 text-lg h-auto p-0"
            />
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Command className="h-3 w-3" />
              <span>K</span>
            </div>
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {results.length > 0 ? (
            <div className="p-2">
              {results.map((result, index) => (
                <div
                  key={result.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    index === selectedIndex
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => handleResultSelect(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex-shrink-0">
                    {getResultIcon(result.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm truncate">
                        {highlightMatch(result.title, query)}
                      </h4>
                      <Badge variant="secondary" className="text-xs">
                        {getResultTypeLabel(result.type)}
                      </Badge>
                    </div>

                    {result.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {highlightMatch(result.description, query)}
                      </p>
                    )}

                    {result.category && (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {result.category}
                        </span>
                        {result.highlights && result.highlights.length > 0 && (
                          <span className="text-xs text-blue-600">
                            • {result.highlights.join(", ")}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="p-8 text-center">
              <Search className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-2">
                No results found for "{query}"
              </p>
              <p className="text-xs text-muted-foreground">
                Try searching for metric cards, relationships, or evidence
              </p>
            </div>
          ) : (
            <div className="p-4">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Recent searches
                </h3>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 cursor-pointer text-sm"
                      onClick={() => setQuery(search)}
                    >
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>{search}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Quick actions
                </h3>
                <div className="space-y-1">
                  <div
                    className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 cursor-pointer text-sm"
                    onClick={() => {
                      navigate("/evidence");
                      onClose();
                    }}
                  >
                    <FileText className="h-3 w-3 text-muted-foreground" />
                    <span>Browse Evidence Repository</span>
                  </div>
                  <div
                    className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 cursor-pointer text-sm"
                    onClick={() => {
                      // TODO: Open advanced search
                      onClose();
                    }}
                  >
                    <Search className="h-3 w-3 text-muted-foreground" />
                    <span>Advanced Search</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {results.length > 0 && (
          <div className="border-t px-4 py-2 text-xs text-muted-foreground flex items-center justify-between">
            <span>
              {results.length} result{results.length === 1 ? "" : "s"}
            </span>
            <div className="flex items-center gap-4">
              <span>↑↓ to navigate</span>
              <span>↵ to select</span>
              <span>esc to close</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Hook for managing quick search
export const useQuickSearch = () => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
};
