// Smart import engine tests (CVS-151, slice 1): delimiter sniffing, preamble-aware
// header detection, Malaysian value formats, column classification, template
// matching, and end-to-end mapping into validated canonical records / series.
import { describe, it, expect } from 'vitest';
import {
  applySeries,
  applyTemplate,
  classifyTable,
  detectImport,
  matchTemplate,
  parseDateCell,
  parseMoney,
  parseTable,
  sniffDelimiter,
} from './index';

const CTX = {
  sourceAccountId: 'upload-1',
  workspaceId: 'org_1',
  observedAt: '2026-07-11T00:00:00Z',
};

const STRIPE_CSV = [
  'id,Created date (UTC),Amount,Amount Refunded,Currency,Status,Description,Customer ID',
  'ch_1,2026-07-01 09:12:33,129.00,0.00,myr,Paid,Pro plan,cus_1',
  'ch_2,2026-07-01 18:40:02,49.00,0.00,myr,Paid,Starter,cus_2',
  'ch_3,2026-07-02 07:05:10,129.00,129.00,myr,Refunded,Pro plan,cus_3',
  'ch_4,2026-07-02 11:00:00,89.00,0.00,myr,Failed,,cus_4',
].join('\n');

// semicolon-delimited, preamble above the header, DD/MM/YYYY + RM amounts
const SEA_EXPORT = [
  'Sales Report;;;',
  'Period: 01/07/2026 - 02/07/2026;;;',
  ';;;',
  'Order Date;Order ID;Buyer;Order Amount',
  '01/07/2026;ORD-0001;a***n;RM 1,234.56',
  '01/07/2026;ORD-0002;b***t;RM 89.90',
  '02/07/2026;ORD-0003;c***z;(RM 50.00)',
].join('\n');

describe('value parsing (Malaysian conventions)', () => {
  it('parses RM money, parentheses negatives, and thousands separators', () => {
    expect(parseMoney('RM 1,234.56')).toEqual({ value: 1234.56, currency: 'MYR' });
    expect(parseMoney('(RM 50.00)')).toEqual({ value: -50, currency: 'MYR' });
    expect(parseMoney('MYR 12.00')).toEqual({ value: 12, currency: 'MYR' });
    expect(parseMoney('12.00 MYR')).toEqual({ value: 12, currency: 'MYR' });
    expect(parseMoney('S$9.90')).toEqual({ value: 9.9, currency: 'SGD' });
    expect(parseMoney('not money')).toBeNull();
  });

  it('parses day-first and compact dates to ISO UTC', () => {
    expect(parseDateCell('03/07/2026')).toBe('2026-07-03T00:00:00Z');
    expect(parseDateCell('3 Jul 2026')).toBe('2026-07-03T00:00:00Z');
    expect(parseDateCell('20260703')).toBe('2026-07-03T00:00:00Z');
    expect(parseDateCell('2026-07-03 09:12:33')).toBe('2026-07-03T09:12:33Z');
    expect(parseDateCell('13/13/2026')).toBeNull(); // impossible month, day-first stays strict
    expect(parseDateCell('hello')).toBeNull();
  });
});

describe('table parsing + header detection', () => {
  it('sniffs semicolon delimiters and skips preamble rows to the real header', () => {
    expect(sniffDelimiter(SEA_EXPORT)).toBe(';');
    const { grid } = parseTable(SEA_EXPORT);
    const table = classifyTable(grid);
    expect(table.headers).toEqual(['Order Date', 'Order ID', 'Buyer', 'Order Amount']);
    expect(table.rows).toHaveLength(3);
  });

  it('handles quoted fields with embedded delimiters and newlines', () => {
    const csv = 'a,b\n"1,5","line1\nline2"\n2,plain';
    const { grid } = parseTable(csv, ',');
    expect(grid[1]).toEqual(['1,5', 'line1\nline2']);
    expect(grid).toHaveLength(3);
  });

  it('classifies date/money/id/category columns', () => {
    const table = classifyTable(parseTable(SEA_EXPORT).grid);
    const types = Object.fromEntries(table.columns.map((c) => [c.header, c.type]));
    expect(types['Order Date']).toBe('date');
    expect(types['Order Amount']).toBe('money');
    expect(table.columns.find((c) => c.header === 'Order Amount')?.currency).toBe('MYR');
  });
});

describe('template matching', () => {
  it('fingerprints the Stripe payments export (case/space-insensitive)', () => {
    const { table, template, suggestion } = detectImport(STRIPE_CSV);
    expect(table.headers[0]).toBe('id');
    expect(template?.template.id).toBe('stripe_payments_export');
    expect(suggestion).toMatchObject({ kind: 'template', schema: 'payment' });
  });

  it('returns null when required headers are missing', () => {
    expect(matchTemplate(['id', 'Amount', 'Currency'])).toBeNull();
  });
});

describe('applyTemplate → canonical records through the shared pipeline', () => {
  it('maps, converts to minor units, remaps statuses, and validates', () => {
    const { table, template } = detectImport(STRIPE_CSV);
    const result = applyTemplate(table, template!.template, CTX);
    expect(result.unmappable).toBe(0);
    expect(result.report.rejectedCount).toBe(0);
    expect(result.report.acceptedCount).toBe(4);
    const first = result.report.accepted[0];
    expect(first).toMatchObject({
      schema: 'payment',
      source: 'stripe',
      source_object_id: 'ch_1',
      currency: 'MYR',
      amount: 12900, // 129.00 → minor units
      amount_unit: 'minor',
    });
    if (first.schema === 'payment') {
      expect(first.attributes.status).toBe('succeeded'); // 'Paid' remapped
    }
    const statuses = result.report.accepted.map((r) =>
      r.schema === 'payment' ? r.attributes.status : null
    );
    expect(statuses).toEqual(['succeeded', 'succeeded', 'refunded', 'failed']);
  });

  it('re-importing the same file dedupes to identical keys (no double count upstream)', () => {
    const { table, template } = detectImport(STRIPE_CSV);
    const a = applyTemplate(table, template!.template, CTX);
    const b = applyTemplate(table, template!.template, CTX);
    const keys = (r: typeof a) =>
      r.report.accepted.map((x) => `${x.source}:${x.source_account_id}:${x.schema}:${x.source_object_id}`);
    expect(keys(a)).toEqual(keys(b)); // dedupeKey inputs are stable across uploads
  });
});

describe('series fallback for unknown exports', () => {
  it('suggests date + money columns and aggregates per day', () => {
    const detection = detectImport(SEA_EXPORT);
    expect(detection.template).toBeUndefined();
    expect(detection.suggestion).toMatchObject({
      kind: 'series',
      periodColumn: 'Order Date',
      valueColumn: 'Order Amount',
    });
    const series = applySeries(detection.table, {
      kind: 'series',
      periodColumn: 'Order Date',
      valueColumn: 'Order Amount',
    });
    expect(series.points).toEqual([
      { period: '2026-07-01', value: 1234.56 + 89.9 },
      { period: '2026-07-02', value: -50 },
    ]);
    expect(series.unmappable).toBe(0);
  });
});
