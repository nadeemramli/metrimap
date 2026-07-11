// Header detection + column classification (CVS-151). Marketplace exports often put
// report titles / date ranges / summary lines above the real header row, so the
// header is *found*, not assumed. Columns are then typed over a sample of data rows.
import { looksLikeMoney, parseDateCell, parseMoney, parseNumberCell } from './values';

export type ColumnType = 'date' | 'money' | 'number' | 'id' | 'category' | 'text' | 'empty';

export interface ColumnProfile {
  index: number;
  header: string;
  type: ColumnType;
  /** Fraction of sampled non-empty cells matching the type (0..1). */
  confidence: number;
  /** Dominant ISO-4217 code seen in a money column, if any. */
  currency?: string;
  /** Distinct values for low-cardinality columns (status enums etc.). */
  values?: string[];
}

const SAMPLE_ROWS = 200;
const HEADER_SCAN_ROWS = 12;

function isNumericish(cell: string): boolean {
  return parseNumberCell(cell) !== null || parseMoney(cell) !== null || parseDateCell(cell) !== null;
}

/**
 * Find the header row: within the first rows, pick the one whose cells are texty,
 * unique, and non-empty, and whose FOLLOWING row looks like data (numeric/date cells
 * or a different shape than the candidate).
 */
export function detectHeaderRow(grid: string[][]): number {
  let best = 0;
  let bestScore = -Infinity;
  const scan = Math.min(grid.length, HEADER_SCAN_ROWS);
  for (let i = 0; i < scan; i++) {
    const row = grid[i];
    const next = grid[i + 1];
    if (!next) break;
    const nonEmpty = row.filter((c) => c.length > 0);
    if (nonEmpty.length < 2) continue;
    const unique = new Set(nonEmpty.map((c) => c.toLowerCase())).size / nonEmpty.length;
    const texty = nonEmpty.filter((c) => !isNumericish(c)).length / nonEmpty.length;
    const width = nonEmpty.length / row.length;
    const nextData = next.filter((c) => c.length > 0 && isNumericish(c)).length / Math.max(1, next.length);
    const score = unique * 2 + texty * 2 + width + nextData;
    if (score > bestScore) {
      bestScore = score;
      best = i;
    }
  }
  return best;
}

function classifyColumn(index: number, header: string, cells: string[]): ColumnProfile {
  const nonEmpty = cells.filter((c) => c.length > 0);
  if (nonEmpty.length === 0) return { index, header, type: 'empty', confidence: 1 };

  const share = (pred: (c: string) => boolean) => nonEmpty.filter(pred).length / nonEmpty.length;

  const dateShare = share((c) => parseDateCell(c) !== null);
  if (dateShare >= 0.8) return { index, header, type: 'date', confidence: dateShare };

  const moneyShare = share((c) => looksLikeMoney(c));
  if (moneyShare >= 0.8) {
    const currencies = nonEmpty.map((c) => parseMoney(c)?.currency).filter(Boolean) as string[];
    const currency = currencies.length
      ? [...new Set(currencies)].sort((a, b) =>
          currencies.filter((x) => x === b).length - currencies.filter((x) => x === a).length
        )[0]
      : undefined;
    return { index, header, type: 'money', confidence: moneyShare, currency };
  }

  const numberShare = share((c) => parseNumberCell(c) !== null);
  if (numberShare >= 0.8) return { index, header, type: 'number', confidence: numberShare };

  const distinct = new Set(nonEmpty);
  // every value unique + longish → identifier (order ids, transaction ids)
  if (distinct.size === nonEmpty.length && nonEmpty.length >= 3) {
    const idShare = share((c) => /^[A-Za-z0-9_\-#/]{6,}$/.test(c));
    if (idShare >= 0.8) return { index, header, type: 'id', confidence: idShare };
  }
  // low cardinality → category/status enum
  if (distinct.size <= Math.max(6, Math.ceil(nonEmpty.length * 0.2)) && nonEmpty.length >= 5) {
    return { index, header, type: 'category', confidence: 1, values: [...distinct].slice(0, 20) };
  }
  return { index, header, type: 'text', confidence: 1 };
}

export interface ClassifiedTable {
  headerRowIndex: number;
  headers: string[];
  columns: ColumnProfile[];
  /** Data rows (below the header), as raw string cells. */
  rows: string[][];
}

/** Detect the header row and type every column over a sample of the data rows. */
export function classifyTable(grid: string[][]): ClassifiedTable {
  if (grid.length === 0) return { headerRowIndex: 0, headers: [], columns: [], rows: [] };
  const headerRowIndex = detectHeaderRow(grid);
  const headers = grid[headerRowIndex].map((h) => h.trim());
  const rows = grid.slice(headerRowIndex + 1);
  const sample = rows.slice(0, SAMPLE_ROWS);
  const columns = headers.map((header, i) =>
    classifyColumn(i, header, sample.map((r) => r[i] ?? ''))
  );
  return { headerRowIndex, headers, columns, rows };
}
