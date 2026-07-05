// Date normalization helpers for source mappers (CVS-143). Canonical timestamps must
// be ISO-8601 with a zone (the envelope validates `.datetime({ offset: true })`), so a
// naive source datetime is treated as UTC. Bad inputs pass through unchanged and get
// caught by `validateRecord` (→ a rejection), never silently coerced.

/** Ensure an ISO datetime carries a zone; a bare `YYYY-MM-DDTHH:MM:SS` is read as UTC. */
export function isoUtc(s: string): string {
  if (typeof s !== 'string' || s.length === 0) return s;
  if (s.endsWith('Z') || /[+-]\d\d:\d\d$/.test(s)) return s;
  // date-only or naive datetime → treat as UTC
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return `${s}T00:00:00Z`;
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(s)) return `${s}Z`;
  return s; // unrecognized → let validation reject it
}

/** GA4 `YYYYMMDD` → ISO UTC midnight. Non-matching input passes through for rejection. */
export function ga4DateToIso(d: string): string {
  const m = /^(\d{4})(\d{2})(\d{2})$/.exec(d ?? '');
  return m ? `${m[1]}-${m[2]}-${m[3]}T00:00:00Z` : (d ?? '');
}
