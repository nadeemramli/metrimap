// Delimited-text parsing for the smart importer (CVS-151). Self-contained tokenizer:
// sniffs the delimiter, handles quoted fields (including embedded delimiters and
// newlines), and returns a raw grid — header detection happens later (marketplace
// exports often carry preamble/summary rows above the real header).

const CANDIDATE_DELIMITERS = [',', ';', '\t', '|'] as const;
export type Delimiter = (typeof CANDIDATE_DELIMITERS)[number];

const MAX_ROWS = 100_000; // guardrail: imports beyond this should go through chunking

/** Tokenize one delimited text into a grid of trimmed cells. */
export function parseDelimited(text: string, delimiter: Delimiter): string[][] {
  const grid: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;

  const pushCell = () => {
    row.push(cell.trim());
    cell = '';
  };
  const pushRow = () => {
    pushCell();
    // skip fully-empty rows (blank separators between preamble and data)
    if (row.some((c) => c.length > 0)) grid.push(row);
    row = [];
  };

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else inQuotes = false;
      } else cell += ch;
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === delimiter) {
      pushCell();
    } else if (ch === '\n') {
      pushRow();
      if (grid.length > MAX_ROWS) throw new Error(`import exceeds ${MAX_ROWS} rows`);
    } else if (ch !== '\r') {
      cell += ch;
    }
  }
  if (cell.length > 0 || row.length > 0) pushRow();
  return grid;
}

/**
 * Sniff the most likely delimiter: the candidate that yields the most columns with
 * the most consistent column count across the first rows (quotes respected).
 */
export function sniffDelimiter(text: string): Delimiter {
  let best: Delimiter = ',';
  let bestScore = -1;
  for (const d of CANDIDATE_DELIMITERS) {
    const rows = parseDelimited(text.slice(0, 20_000), d).slice(0, 20);
    if (rows.length === 0) continue;
    const widths = rows.map((r) => r.length);
    const maxWidth = Math.max(...widths);
    if (maxWidth < 2) continue; // a delimiter that never splits is not the delimiter
    const modal = widths.filter((w) => w === maxWidth).length / widths.length;
    const score = maxWidth * modal;
    if (score > bestScore) {
      bestScore = score;
      best = d;
    }
  }
  return best;
}

export interface ParsedTable {
  delimiter: Delimiter;
  grid: string[][];
}

/** Sniff + parse in one step. */
export function parseTable(text: string, delimiter?: Delimiter): ParsedTable {
  const d = delimiter ?? sniffDelimiter(text);
  return { delimiter: d, grid: parseDelimited(text, d) };
}
