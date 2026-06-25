import { useCanvasStore, useProjectsStore } from '@/lib/stores';
import { cn } from '@/shared/utils';
import { Check, Loader2, Pencil } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface CanvasTitleEditorProps {
  title: string;
  canvasId?: string;
}

type SaveStatus = 'idle' | 'saving' | 'saved';

/**
 * Canvas title shown in the header. Double-click to edit inline; Enter/blur to
 * save, Escape to cancel. Renames optimistically (so the header updates at once)
 * and persists via the projects store (DB + homepage), with a save animation.
 */
export default function CanvasTitleEditor({
  title,
  canvasId,
}: CanvasTitleEditorProps) {
  const renameCanvas = useCanvasStore((s) => s.renameCanvas);
  const updateProject = useProjectsStore((s) => s.updateProject);

  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(title);
  const [status, setStatus] = useState<SaveStatus>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  // Reflect external title changes (e.g. canvas load) while not actively editing.
  useEffect(() => {
    if (!isEditing) setValue(title);
  }, [title, isEditing]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const commit = async () => {
    const next = value.trim();
    setIsEditing(false);
    if (!next || next === title) {
      setValue(title);
      return;
    }
    if (!canvasId) return;

    // Optimistic: header reflects the new name immediately.
    renameCanvas(next);
    setStatus('saving');
    try {
      await updateProject(canvasId, { name: next });
      setStatus('saved');
      window.setTimeout(() => setStatus('idle'), 1500);
    } catch (e) {
      console.error('Rename failed', e);
      renameCanvas(title); // revert
      setValue(title);
      setStatus('idle');
      toast.error('Could not rename canvas');
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') {
            setValue(title);
            setIsEditing(false);
          }
        }}
        className="text-sm font-medium bg-transparent border-b border-primary outline-none px-0.5 py-0 max-w-[18rem] min-w-[6rem]"
        aria-label="Canvas name"
      />
    );
  }

  return (
    <button
      type="button"
      onDoubleClick={() => setIsEditing(true)}
      className="group/title flex items-center gap-1.5"
      title="Double-click to rename"
    >
      <span className="text-sm font-medium text-foreground truncate max-w-[18rem] decoration-dotted underline-offset-4 group-hover/title:underline">
        {title}
      </span>
      {status === 'idle' && (
        <Pencil className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover/title:opacity-100" />
      )}
      {status === 'saving' && (
        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          Saving…
        </span>
      )}
      {status === 'saved' && (
        <span
          className={cn(
            'flex items-center gap-1 text-[11px] text-emerald-600',
            'transition-opacity'
          )}
        >
          <Check className="h-3 w-3" />
          Saved
        </span>
      )}
    </button>
  );
}
