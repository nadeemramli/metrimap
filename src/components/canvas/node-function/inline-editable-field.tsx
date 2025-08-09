"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface InlineEditableFieldProps {
  value: string;
  onSave: (value: string) => void;
  isEditing: boolean;
  onEditingChange: (editing: boolean) => void;
  multiline?: boolean;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
}

export function InlineEditableField({
  value,
  onSave,
  isEditing,
  onEditingChange,
  multiline = false,
  placeholder,
  className = "",
  readOnly = false,
}: InlineEditableFieldProps) {
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = () => {
    onSave(editValue);
    onEditingChange(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    onEditingChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (isEditing) {
    const InputComponent = multiline ? Textarea : Input;
    return (
      <div className="flex items-center gap-2">
        <InputComponent
          ref={inputRef as any}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          placeholder={placeholder}
          className={`${className} ${multiline ? "min-h-[60px]" : ""}`}
        />
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={handleSave}>
            <Check className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={handleCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${readOnly ? "cursor-default" : "cursor-pointer hover:bg-muted/50"} rounded px-2 py-1 transition-colors ${className}`}
      onDoubleClick={readOnly ? undefined : () => onEditingChange(true)}
      title={readOnly ? undefined : "Double-click to edit"}
    >
      {value || <span className="text-muted-foreground">{placeholder}</span>}
    </div>
  );
}
