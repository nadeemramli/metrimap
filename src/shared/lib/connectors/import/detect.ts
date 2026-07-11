// Smart-import detection (CVS-151): parse → find the header → type the columns →
// match a template → suggest a mapping. Pure and payload-free in what it reports;
// the caller (UI / staging flow) decides what to do with the suggestion.
import { classifyTable, type ClassifiedTable, type ColumnProfile } from './classify';
import { parseTable, type Delimiter } from './table';
import { matchTemplate, type ImportTemplate, type TemplateMatch } from './templates';

export interface SeriesSuggestion {
  kind: 'series';
  periodColumn: string;
  valueColumn: string;
  /** Alternative value columns the user might pick instead. */
  valueCandidates: string[];
}

export interface TemplateSuggestion {
  kind: 'template';
  templateId: string;
  label: string;
  schema: string;
  score: number;
}

export interface DetectionResult {
  delimiter: Delimiter;
  table: ClassifiedTable;
  /** Set when a registered export format matched. */
  template?: TemplateMatch;
  /** What the importer would do by default. */
  suggestion: TemplateSuggestion | SeriesSuggestion | null;
}

function bestSeriesSuggestion(columns: ColumnProfile[]): SeriesSuggestion | null {
  const dates = columns.filter((c) => c.type === 'date');
  const numeric = columns
    .filter((c) => c.type === 'money' || c.type === 'number')
    .sort((a, b) => (a.type === 'money' ? -1 : 0) - (b.type === 'money' ? -1 : 0));
  if (dates.length === 0 || numeric.length === 0) return null;
  return {
    kind: 'series',
    periodColumn: dates[0].header,
    valueColumn: numeric[0].header,
    valueCandidates: numeric.map((c) => c.header),
  };
}

/** Detect everything about one delimited export. */
export function detectImport(
  text: string,
  opts: { delimiter?: Delimiter; templates?: ImportTemplate[] } = {}
): DetectionResult {
  const { delimiter, grid } = parseTable(text, opts.delimiter);
  const table = classifyTable(grid);
  const template = matchTemplate(table.headers, opts.templates) ?? undefined;

  const suggestion: DetectionResult['suggestion'] = template
    ? {
        kind: 'template',
        templateId: template.template.id,
        label: template.template.label,
        schema: template.template.schema,
        score: template.score,
      }
    : bestSeriesSuggestion(table.columns);

  return { delimiter, table, template, suggestion };
}
