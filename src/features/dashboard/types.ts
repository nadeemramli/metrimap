import type { ChartType } from '@/shared/components/charts/MetricChart';

// A dashboard widget renders either a chart (line/area/bar/pie), a single-number
// KPI, or a table — all fed by the same metric series resolution. One implicit
// dashboard per canvas; persisted in `dashboard_widgets`.

export type WidgetType = ChartType | 'kpi' | 'table';

/** Where a widget sources its series from. */
export type WidgetSource = 'tracked' | 'card';

export interface WidgetDisplay {
  showLegend?: boolean;
  numberFormat?: 'compact' | 'full';
}

export interface WidgetConfig {
  source: WidgetSource;
  /** tracked_metric ids (source === 'tracked'). */
  trackedMetricIds?: string[];
  /** in-canvas card ids (source === 'card'). */
  cardIds?: string[];
  display?: WidgetDisplay;
  /** Provenance when the widget was imported from a canvas chart node. */
  importedFromNodeId?: string;
}

/** react-grid-layout position for the single (lg) breakpoint. */
export interface WidgetLayout {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface DashboardWidget {
  id: string;
  project_id: string;
  title: string | null;
  widget_type: WidgetType;
  config: WidgetConfig;
  layout: WidgetLayout;
  sort_index: number;
}

export const DEFAULT_WIDGET_LAYOUT: WidgetLayout = { x: 0, y: 0, w: 6, h: 8 };
