import { useState, useRef } from "react";
import type { KeyboardEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTagColor } from "@/lib/utils/tag-colors";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  allowDuplicates?: boolean;
  className?: string;
  disabled?: boolean;
  variant?: "default" | "secondary" | "outline";
  suggestions?: string[];
}

export function TagInput({
  tags = [],
  onChange,
  placeholder = "Add tags...",
  maxTags,
  allowDuplicates = false,
  className,
  disabled = false,
  variant = "secondary",
  suggestions = [],
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter suggestions based on input and exclude already selected tags
  const filteredSuggestions = suggestions
    .filter(
      (suggestion) =>
        suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
        !tags.includes(suggestion)
    )
    .slice(0, 6); // Limit to 6 suggestions

  const addTag = (tagText: string) => {
    const trimmedTag = tagText.trim();

    if (!trimmedTag) return;

    // Check for duplicates if not allowed
    if (!allowDuplicates && tags.includes(trimmedTag)) return;

    // Check max tags limit
    if (maxTags && tags.length >= maxTags) return;

    onChange([...tags, trimmedTag]);
    setInputValue("");
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Enter":
      case ",":
        e.preventDefault();
        addTag(inputValue);
        break;
      case "Backspace":
        if (inputValue === "" && tags.length > 0) {
          removeTag(tags.length - 1);
        }
        break;
      case "Escape":
        setInputValue("");
        setIsInputVisible(false);
        break;
    }
  };

  const showInput = () => {
    setIsInputVisible(true);
    setShowSuggestions(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const hideInput = () => {
    if (inputValue.trim()) {
      addTag(inputValue);
    }
    setInputValue("");
    setIsInputVisible(false);
    setShowSuggestions(false);
  };

  const canAddMore = !maxTags || tags.length < maxTags;

  return (
    <div className={cn("space-y-2", className)}>
      {/* Tags Display */}
      <div className="flex flex-wrap gap-2 min-h-[2rem] p-2 border rounded-md bg-background">
        {tags.map((tag, index) => (
          <Badge
            key={index}
            variant={getTagColor(tag)}
            className="flex items-center gap-1 pr-1 font-medium px-2.5 py-1 shadow-sm"
          >
            <span>{tag}</span>
            {!disabled && (
              <Button
                variant="ghost"
                size="sm"
                className="p-0 w-4 h-4 hover:bg-transparent"
                onClick={() => removeTag(index)}
                type="button"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </Badge>
        ))}

        {/* Inline Input */}
        {isInputVisible && canAddMore && !disabled ? (
          <div className="relative">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyDown={handleKeyDown}
              onBlur={hideInput}
              placeholder={placeholder}
              className="h-6 min-w-[120px] max-w-[200px] border-none shadow-none p-1 focus-visible:ring-0"
            />

            {/* Suggestions Dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute top-full left-0 mt-1 bg-background border rounded-md shadow-lg z-50 min-w-[200px]">
                {filteredSuggestions.map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start h-8 px-2 rounded-none hover:bg-muted"
                    onClick={() => {
                      addTag(suggestion);
                      setShowSuggestions(false);
                    }}
                    type="button"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ) : (
          canAddMore &&
          !disabled && (
            <Button
              variant="ghost"
              size="sm"
              onClick={showInput}
              className="h-6 px-2 text-muted-foreground hover:text-foreground"
              type="button"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add tag
            </Button>
          )
        )}
      </div>

      {/* Helper Text */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Press Enter or comma to add tags</span>
        {maxTags && (
          <span>
            {tags.length}/{maxTags} tags
          </span>
        )}
      </div>
    </div>
  );
}

export default TagInput;
