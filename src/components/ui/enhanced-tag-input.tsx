import React, { useState, useEffect, useRef, useCallback } from "react";
import { Badge } from "./badge";
import { Input } from "./input";
import { Button } from "./button";
import { X, Plus, Tag } from "lucide-react";
import { useTagStore } from "@/lib/stores/tagStore";
import { useParams } from "react-router-dom";

interface EnhancedTagInputProps {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  placeholder?: string;
  maxTags?: number;
  disabled?: boolean;
  className?: string;
  showCreateOption?: boolean;
  showSearchResults?: boolean;
}

export function EnhancedTagInput({
  tags = [],
  onAdd,
  onRemove,
  placeholder = "Add tags...",
  maxTags = 10,
  disabled = false,
  className = "",
  showCreateOption = true,
  showSearchResults = true,
}: EnhancedTagInputProps) {
  const { canvasId } = useParams();
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    searchResults,
    isSearching,
    loadProjectTags,
    searchTags,
    createProjectTag,
    clearSearchResults,
  } = useTagStore();

  // Load project tags when component mounts
  useEffect(() => {
    if (canvasId) {
      loadProjectTags(canvasId);
    }
  }, [canvasId, loadProjectTags]);

  // Debounced search tags when input changes
  const debouncedSearch = useCallback(
    (query: string) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        if (canvasId && query.length >= 2) {
          searchTags(canvasId, query);
        } else {
          clearSearchResults();
        }
      }, 300); // 300ms delay
    },
    [canvasId, searchTags, clearSearchResults]
  );

  // Search tags when input changes (debounced)
  useEffect(() => {
    debouncedSearch(inputValue);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [inputValue, debouncedSearch]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < searchResults.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
            handleSelectTag(searchResults[selectedIndex].name);
          } else if (inputValue.trim() && showCreateOption) {
            handleCreateTag(inputValue.trim());
          }
          break;
        case "Escape":
          setIsOpen(false);
          setSelectedIndex(-1);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, searchResults, inputValue, showCreateOption]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(newValue.length >= 2);
    setSelectedIndex(-1);
  };

  const handleSelectTag = (tagName: string) => {
    console.log("handleSelectTag called with:", tagName);
    if (!tags.includes(tagName) && tags.length < maxTags) {
      console.log("Calling onAdd with:", tagName);
      onAdd(tagName);
    }
    setInputValue("");
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleCreateTag = async (tagName: string) => {
    console.log("handleCreateTag called with:", tagName);
    if (!canvasId || tags.includes(tagName) || tags.length >= maxTags) return;

    // Always add to local state first
    console.log("Calling onAdd with:", tagName);
    onAdd(tagName);
    setInputValue("");
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();

    // Try to create the tag in the database (but don't block the UI)
    try {
      await createProjectTag(canvasId, { name: tagName });
      console.log("Tag created in database successfully");
    } catch (error) {
      console.error("Failed to create tag in database:", error);
      console.log("Tag added to local state only - database creation failed");
      // The tag is already added to local state, so we don't need to do anything else
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    console.log("handleRemoveTag called with:", tagToRemove);
    onRemove(tagToRemove);
  };

  const handleInputFocus = () => {
    if (inputValue.length >= 2) {
      setIsOpen(true);
    }
  };

  const handleInputBlur = () => {
    // Increase delay to allow for clicks on dropdown items
    setTimeout(() => {
      setIsOpen(false);
      setSelectedIndex(-1);
    }, 300); // Increased from 200ms to 300ms
  };

  const filteredSearchResults = searchResults.filter(
    (tag) => !tags.includes(tag.name)
  );

  return (
    <div className={`relative ${className}`}>
      <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-background">
        {tags.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="flex items-center gap-1"
          >
            <Tag className="h-3 w-3" />
            {tag}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => handleRemoveTag(tag)}
              disabled={disabled}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}

        {tags.length < maxTags && (
          <div className="relative flex-1 min-w-[120px]">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder={placeholder}
              disabled={disabled}
              className="border-0 p-0 h-6 text-sm focus:ring-0 focus:outline-none"
            />

            {/* Dropdown */}
            {isOpen && showSearchResults && (
              <div
                ref={dropdownRef}
                className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto"
                onMouseDown={(e) => {
                  // Prevent blur when clicking inside dropdown
                  e.preventDefault();
                }}
              >
                {isSearching && (
                  <div className="p-2 text-sm text-muted-foreground">
                    Searching...
                  </div>
                )}

                {!isSearching &&
                  filteredSearchResults.length === 0 &&
                  inputValue.trim() && (
                    <div className="p-2 text-sm text-muted-foreground">
                      No tags found
                    </div>
                  )}

                {filteredSearchResults.map((tag, index) => (
                  <div
                    key={tag.id}
                    className={`p-2 cursor-pointer hover:bg-muted ${
                      index === selectedIndex ? "bg-muted" : ""
                    }`}
                    onClick={() => handleSelectTag(tag.name)}
                  >
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{tag.name}</span>
                      {tag.description && (
                        <span className="text-xs text-muted-foreground">
                          {tag.description}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {showCreateOption &&
                  inputValue.trim() &&
                  !filteredSearchResults.some(
                    (tag) => tag.name.toLowerCase() === inputValue.toLowerCase()
                  ) && (
                    <div
                      className="p-2 cursor-pointer hover:bg-muted border-t"
                      onClick={() => handleCreateTag(inputValue.trim())}
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <Plus className="h-4 w-4 text-muted-foreground" />
                        <span>Create "{inputValue.trim()}"</span>
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>
        )}
      </div>

      {tags.length >= maxTags && (
        <p className="text-xs text-muted-foreground mt-1">
          Maximum {maxTags} tags reached
        </p>
      )}
    </div>
  );
}
