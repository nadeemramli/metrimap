import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/utils';
import { X } from 'lucide-react';
import { useMemo, useState } from 'react';

interface TagTokenInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  /** Optional suggestions filtered against the current query. */
  suggestions?: string[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  /** Max tags; further input is ignored once reached. */
  max?: number;
}

/**
 * Compact tokenized tag field (CVS-158) — controlled, presentational, and light.
 * Unlike the heavy `enhanced-tag-input` it owns no data fetching: the caller
 * supplies `suggestions`. Add on Enter/comma, remove with the token's × or
 * Backspace on an empty query.
 */
export function TagTokenInput({
  value,
  onChange,
  suggestions = [],
  placeholder = 'Add tag…',
  disabled,
  className,
  max,
}: TagTokenInputProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const atMax = max != null && value.length >= max;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return suggestions
      .filter((s) => !value.includes(s) && (!q || s.toLowerCase().includes(q)))
      .slice(0, 8);
  }, [suggestions, value, query]);

  const add = (raw: string) => {
    const tag = raw.trim();
    if (!tag || value.includes(tag) || atMax) return;
    onChange([...value, tag]);
    setQuery('');
    setOpen(false);
  };

  const remove = (tag: string) => onChange(value.filter((t) => t !== tag));

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'flex flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent px-2 py-1.5 text-sm focus-within:ring-2 focus-within:ring-ring/40',
          disabled && 'pointer-events-none opacity-60'
        )}
      >
        {value.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1 font-normal">
            {tag}
            <button
              type="button"
              onClick={() => remove(tag)}
              className="rounded-sm hover:text-destructive"
              aria-label={`Remove ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <input
          value={query}
          disabled={disabled || atMax}
          placeholder={atMax ? '' : value.length ? '' : placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              add(query);
            } else if (e.key === 'Backspace' && !query && value.length) {
              remove(value[value.length - 1]);
            }
          }}
          className="min-w-[6rem] flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
        />
      </div>

      {open && filtered.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-md border border-border bg-popover p-1 shadow-md">
          {filtered.map((s) => (
            <li key={s}>
              <button
                type="button"
                // onMouseDown (not onClick) so it fires before the input blur.
                onMouseDown={(e) => {
                  e.preventDefault();
                  add(s);
                }}
                className="w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent"
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
