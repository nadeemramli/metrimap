import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Check, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface InlineEditableFieldProps {
  value: string;
  // New/legacy API (controlled)
  onSave?: (value: string) => void;
  isEditing?: boolean;
  onEditingChange?: (editing: boolean) => void;
  multiline?: boolean;
  readOnly?: boolean;
  // Back-compat with simpler usage
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function InlineEditableField({
  value,
  onSave,
  isEditing,
  onEditingChange,
  multiline = false,
  readOnly = false,
  onChange,
  placeholder = 'Click to edit',
  className = '',
}: InlineEditableFieldProps) {
  const [internalEditing, setInternalEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const editing = isEditing ?? internalEditing;
  const setEditing = onEditingChange ?? setInternalEditing;

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      // @ts-expect-error both input and textarea support select
      inputRef.current.select?.();
    }
  }, [editing]);

  const handleCommit = () => {
    // Support both APIs
    if (onSave) onSave(editValue);
    if (onChange) onChange(editValue);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleCommit();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (editing) {
    const InputComponent = multiline ? Textarea : Input;
    return (
      <div className="flex items-center gap-2">
        <InputComponent
          ref={inputRef as any}
          value={editValue}
          onChange={(e: any) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleCommit}
          placeholder={placeholder}
          className={`${className} ${multiline ? 'min-h-[60px]' : ''}`}
        />
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={handleCommit}>
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
      className={`${readOnly ? 'cursor-default' : 'cursor-pointer hover:bg-muted/50'} rounded px-2 py-1 transition-colors ${className}`}
      onDoubleClick={readOnly ? undefined : () => setEditing(true)}
      title={readOnly ? undefined : 'Double-click to edit'}
    >
      {value || <span className="text-muted-foreground">{placeholder}</span>}
    </div>
  );
}
