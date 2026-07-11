// Smart import engine (CVS-151, slice 1): delimited-text sniffing, header detection,
// column classification, template matching, and mapping into canonical records or
// direct metric series. Pure library — UI, XLSX, staging wiring and saved mappings
// are the follow-up slices.
export { parseTable, parseDelimited, sniffDelimiter, type Delimiter, type ParsedTable } from './table';
export { parseMoney, parseDateCell, parseNumberCell, looksLikeMoney, type ParsedMoney } from './values';
export { classifyTable, detectHeaderRow, type ClassifiedTable, type ColumnProfile, type ColumnType } from './classify';
export {
  IMPORT_TEMPLATES,
  matchTemplate,
  normalizeHeader,
  type ImportTemplate,
  type TemplateMatch,
  type FieldRef,
} from './templates';
export {
  applyTemplate,
  applySeries,
  draftFromTemplate,
  rowHash,
  type CanonicalImportResult,
  type SeriesImportResult,
  type SeriesMapping,
} from './apply';
export { detectImport, type DetectionResult, type SeriesSuggestion, type TemplateSuggestion } from './detect';
