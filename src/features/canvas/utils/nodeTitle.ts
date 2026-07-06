// Older canvas nodes were auto-titled with the lowercase type name
// ('source' / 'chart' / 'operator' / 'comment'). Render those in proper case to
// match the card design pattern; user-chosen titles pass through unchanged.
const LEGACY_DEFAULT_TITLES: Record<string, string> = {
  source: 'Source',
  chart: 'Chart',
  operator: 'Operator',
  comment: 'Comment',
};

export function displayNodeTitle(
  title?: string | null,
  fallback = ''
): string {
  if (!title) return fallback;
  return LEGACY_DEFAULT_TITLES[title.toLowerCase()] ?? title;
}
