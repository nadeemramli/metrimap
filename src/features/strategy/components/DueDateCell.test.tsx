import { afterEach, describe, expect, it, vi } from 'vitest';
import { fmt, isOverdue, parseLocalDate } from './DueDateCell';

// Date-only strings must be treated as local dates: new Date('YYYY-MM-DD')
// parses as UTC midnight, which shifts the date back a day west of UTC.

afterEach(() => {
  vi.useRealTimers();
});

describe('parseLocalDate', () => {
  it('parses YYYY-MM-DD as local midnight', () => {
    const d = parseLocalDate('2026-07-10');
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(6);
    expect(d.getDate()).toBe(10);
    expect(d.getHours()).toBe(0);
  });
});

describe('isOverdue', () => {
  it('is not overdue on the due day itself', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 6, 10, 9, 30));
    expect(isOverdue('2026-07-10')).toBe(false);
  });

  it('is overdue the day after the due date', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 6, 11, 0, 5));
    expect(isOverdue('2026-07-10')).toBe(true);
  });

  it('is not overdue for a future date', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 6, 10, 12, 0));
    expect(isOverdue('2026-07-11')).toBe(false);
  });
});

describe('fmt', () => {
  it('formats the calendar day from the string, not a UTC-shifted day', () => {
    expect(fmt('2026-07-10')).toContain('10');
  });
});
