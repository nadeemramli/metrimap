import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { cn } from '@/shared/utils';
import { Check } from 'lucide-react';

// A colored status/priority pill that opens a dropdown to change its value.
// Read-only (no chevron, no menu) when disabled.

export interface PillOption<V extends string> {
  value: V;
  label: string;
  className: string;
}

interface EditablePillProps<V extends string> {
  value: V | null | undefined;
  options: PillOption<V>[];
  onChange: (value: V) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function EditablePill<V extends string>({
  value,
  options,
  onChange,
  disabled,
  placeholder = '—',
}: EditablePillProps<V>) {
  const current = options.find((o) => o.value === value);

  const pill = (
    <span
      className={cn(
        'inline-flex items-center rounded px-2 py-0.5 text-xs font-medium',
        current ? current.className : 'bg-muted text-muted-foreground'
      )}
    >
      {current?.label ?? placeholder}
    </span>
  );

  if (disabled) return pill;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="rounded outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={(e) => e.stopPropagation()}
      >
        {pill}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" onClick={(e) => e.stopPropagation()}>
        {options.map((o) => (
          <DropdownMenuItem
            key={o.value}
            onSelect={() => onChange(o.value)}
            className="gap-2"
          >
            <span
              className={cn(
                'inline-flex flex-1 items-center rounded px-2 py-0.5 text-xs font-medium',
                o.className
              )}
            >
              {o.label}
            </span>
            {o.value === value && <Check className="h-3.5 w-3.5" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
