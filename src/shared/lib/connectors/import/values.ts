// Cell-level value detection for the smart importer (CVS-151). Recognizes the
// date and money shapes that real exports carry — including Malaysian conventions:
// DD/MM/YYYY dates, `RM 1,234.56` amounts, and negatives in parentheses.

export interface ParsedMoney {
  /** Major units (e.g. 1234.56) — convert with canonical/money.toMinor at mapping time. */
  value: number;
  /** ISO-4217 code when the cell carried one (RM → MYR, $ → USD, …). */
  currency?: string;
}

const SYMBOL_CURRENCIES: Record<string, string> = {
  RM: 'MYR',
  S$: 'SGD',
  $: 'USD',
  '€': 'EUR',
  '£': 'GBP',
  '¥': 'JPY',
  '₱': 'PHP',
  '₫': 'VND',
  Rp: 'IDR',
  '฿': 'THB',
};

const CODE_RE = /^[A-Z]{3}$/;

/** Parse a money-looking cell into major units + optional currency. Null if not money. */
export function parseMoney(raw: string): ParsedMoney | null {
  let s = raw.trim();
  if (!s) return null;

  let negative = false;
  if (/^\(.*\)$/.test(s)) {
    negative = true;
    s = s.slice(1, -1).trim();
  }
  if (s.startsWith('-')) {
    negative = true;
    s = s.slice(1).trim();
  }

  let currency: string | undefined;
  // leading symbol/prefix (RM 1,234.56 / S$12 / $9.99) — longest match first
  for (const sym of Object.keys(SYMBOL_CURRENCIES).sort((a, b) => b.length - a.length)) {
    if (s.startsWith(sym)) {
      currency = SYMBOL_CURRENCIES[sym];
      s = s.slice(sym.length).trim();
      break;
    }
  }
  // leading or trailing ISO code (MYR 12.00 / 12.00 MYR)
  const lead = s.match(/^([A-Z]{3})\s+(.+)$/);
  if (!currency && lead && CODE_RE.test(lead[1])) {
    currency = lead[1];
    s = lead[2];
  }
  const trail = s.match(/^(.+?)\s+([A-Z]{3})$/);
  if (!currency && trail && CODE_RE.test(trail[2])) {
    currency = trail[2];
    s = trail[1];
  }

  // 1,234.56 (thousands commas) — reject anything else non-numeric
  if (!/^\d{1,3}(,\d{3})*(\.\d+)?$|^\d+(\.\d+)?$/.test(s)) return null;
  const value = Number(s.replace(/,/g, ''));
  if (!Number.isFinite(value)) return null;
  return { value: negative ? -value : value, currency };
}

/** Is the cell money-shaped AND carrying a currency marker or decimals? */
export function looksLikeMoney(raw: string): boolean {
  const m = parseMoney(raw);
  if (!m) return false;
  return m.currency !== undefined || /[.,]\d{2}\b/.test(raw);
}

const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

function iso(y: number, m: number, d: number, time = ''): string | null {
  if (y < 1990 || y > 2100 || m < 1 || m > 12 || d < 1 || d > 31) return null;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${y}-${pad(m)}-${pad(d)}T${time || '00:00:00'}Z`;
}

/**
 * Parse a date cell into ISO-8601 UTC. Understands ISO dates/timestamps, `YYYYMMDD`,
 * `DD/MM/YYYY` and `DD-MM-YYYY` (day-first — the SEA-export convention), and
 * `D MMM YYYY`. Returns null when not date-shaped.
 */
export function parseDateCell(raw: string): string | null {
  const s = raw.trim();
  if (!s) return null;

  // ISO date or timestamp (with optional zone) — normalize to UTC instant
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})([T ](\d{2}:\d{2}(:\d{2})?))?/);
  if (m) {
    const time = m[5] ? (m[6] ? m[5] : `${m[5]}:00`) : '';
    return iso(Number(m[1]), Number(m[2]), Number(m[3]), time);
  }
  // Compact YYYYMMDD (GA4-style)
  m = s.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (m) return iso(Number(m[1]), Number(m[2]), Number(m[3]));
  // Day-first DD/MM/YYYY or DD-MM-YYYY (+ optional time)
  m = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:[ T](\d{2}:\d{2}(?::\d{2})?))?$/);
  if (m) {
    const time = m[4] ? (m[4].length === 5 ? `${m[4]}:00` : m[4]) : '';
    return iso(Number(m[3]), Number(m[2]), Number(m[1]), time);
  }
  // D MMM YYYY ("3 Jul 2026", "03 July 2026")
  m = s.match(/^(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{4})$/);
  if (m) {
    const month = MONTHS[m[2].slice(0, 3).toLowerCase()];
    if (month) return iso(Number(m[3]), month, Number(m[1]));
  }
  return null;
}

/** Plain (non-money) numeric cell → number, else null. */
export function parseNumberCell(raw: string): number | null {
  const s = raw.trim().replace(/,/g, '');
  if (!/^-?\d+(\.\d+)?$/.test(s)) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}
