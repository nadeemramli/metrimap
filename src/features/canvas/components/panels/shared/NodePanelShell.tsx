import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '@/shared/components/ui/sheet';
import { Textarea } from '@/shared/components/ui/textarea';
import { cn } from '@/shared/utils';
import * as React from 'react';

// Shared right-side detail-panel shell for node-type-specific panels
// (task, value, …). Owns the Sheet, width, scroll, and an editable
// title/description header. Each panel supplies its own body + optional footer.

interface NodePanelShellProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  eyebrow?: React.ReactNode;
  readOnly?: boolean;
  onTitleChange?: (value: string) => void;
  onDescriptionChange?: (value: string) => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

// A borderless field that reads as text but commits on blur when changed.
function EditableText({
  value,
  placeholder,
  readOnly,
  multiline,
  onCommit,
  className,
}: {
  value: string;
  placeholder: string;
  readOnly?: boolean;
  multiline?: boolean;
  onCommit?: (value: string) => void;
  className?: string;
}) {
  const [draft, setDraft] = React.useState(value);
  React.useEffect(() => setDraft(value), [value]);

  const commit = () => {
    if (draft !== value) onCommit?.(draft);
  };

  if (readOnly) {
    return (
      <div className={cn(className, !value && 'text-muted-foreground')}>
        {value || placeholder}
      </div>
    );
  }

  if (multiline) {
    return (
      <Textarea
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        className={cn(
          'min-h-[40px] resize-none border-transparent px-2 shadow-none focus-visible:border-input',
          className
        )}
      />
    );
  }

  return (
    <input
      value={draft}
      placeholder={placeholder}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
      }}
      className={cn(
        'w-full rounded bg-transparent px-2 py-1 outline-none hover:bg-muted/50 focus:bg-muted/50',
        className
      )}
    />
  );
}

export function NodePanelShell({
  open,
  onOpenChange,
  title,
  description,
  eyebrow,
  readOnly,
  onTitleChange,
  onDescriptionChange,
  children,
  footer,
}: NodePanelShellProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-[640px] flex-col gap-0 overflow-hidden p-0 sm:max-w-[640px]"
      >
        <SheetTitle className="sr-only">{title || 'Details'}</SheetTitle>
        <SheetDescription className="sr-only">
          Node details panel
        </SheetDescription>

        <div className="border-b px-5 pb-4 pt-5">
          {eyebrow && <div className="mb-1.5">{eyebrow}</div>}
          <EditableText
            value={title}
            placeholder="Untitled"
            readOnly={readOnly}
            onCommit={onTitleChange}
            className="text-xl font-semibold"
          />
          <EditableText
            value={description ?? ''}
            placeholder="Add a description…"
            readOnly={readOnly}
            multiline
            onCommit={onDescriptionChange}
            className="mt-1 text-sm text-muted-foreground"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {footer && <div className="border-t px-5 py-3">{footer}</div>}
      </SheetContent>
    </Sheet>
  );
}
