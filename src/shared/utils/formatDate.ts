import { format, formatDistanceToNow, isValid } from 'date-fns';

/**
 * Consistent, locale-stable date formatting across the app.
 * Replaces ad-hoc `new Date(x).toLocaleDateString()` calls, which render
 * differently per browser locale.
 */
export function formatDate(
  date: string | number | Date | null | undefined,
  pattern = 'MMM d, yyyy'
): string {
  if (date == null || date === '') return '—';
  const d = date instanceof Date ? date : new Date(date);
  if (!isValid(d)) return '—';
  return format(d, pattern);
}

/** Date + time, e.g. "Jun 28, 2026 · 4:05 PM". */
export function formatDateTime(
  date: string | number | Date | null | undefined
): string {
  return formatDate(date, "MMM d, yyyy · h:mm a");
}

/** Relative time, e.g. "3 days ago". Falls back to em-dash for invalid input. */
export function formatRelative(
  date: string | number | Date | null | undefined
): string {
  if (date == null || date === '') return '—';
  const d = date instanceof Date ? date : new Date(date);
  if (!isValid(d)) return '—';
  return formatDistanceToNow(d, { addSuffix: true });
}
