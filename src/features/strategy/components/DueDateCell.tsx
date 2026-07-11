import { Input } from '@/shared/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { cn } from '@/shared/utils';
import { CalendarDays } from 'lucide-react';

// Due-date column: shows the date (red when overdue) with a native date input
// in a popover to change it. Read-only text when disabled.

// Parse 'YYYY-MM-DD' as local midnight (new Date(iso) would parse as UTC and
// shift the date back a day in timezones west of UTC).
export function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function isOverdue(iso: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parseLocalDate(iso) < today;
}

export function fmt(iso: string): string {
  return parseLocalDate(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

interface DueDateCellProps {
  value?: string;
  onChange: (iso: string | undefined) => void;
  disabled?: boolean;
}

export function DueDateCell({ value, onChange, disabled }: DueDateCellProps) {
  const overdue = value ? isOverdue(value) : false;

  const label = (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-xs',
        value
          ? overdue
            ? 'text-red-600 dark:text-red-400'
            : 'text-foreground'
          : 'text-muted-foreground'
      )}
    >
      <CalendarDays className="h-3 w-3" />
      {value ? fmt(value) : 'Set date'}
    </span>
  );

  if (disabled) {
    return value ? label : <span className="text-xs text-muted-foreground">—</span>;
  }

  return (
    <Popover>
      <PopoverTrigger
        className="rounded outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
        onClick={(e) => e.stopPropagation()}
      >
        {label}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-auto p-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value || undefined)}
            className="h-8"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
