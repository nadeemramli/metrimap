// Client access layer for the operational dashboard builder. Widgets are
// canvas-scoped (RLS via has_project_access). One implicit dashboard per canvas
// = all rows for a project_id. See the dashboard_widgets migration.

import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../client';
import type { Database, Json } from '../types';
import type {
  DashboardWidget,
  WidgetConfig,
  WidgetLayout,
  WidgetType,
} from '@/features/dashboard/types';

type Client = SupabaseClient<Database>;

const COLS = 'id, project_id, title, widget_type, config, layout, sort_index';

function rowToWidget(r: {
  id: string;
  project_id: string;
  title: string | null;
  widget_type: string;
  config: Json;
  layout: Json;
  sort_index: number;
}): DashboardWidget {
  return {
    id: r.id,
    project_id: r.project_id,
    title: r.title,
    widget_type: r.widget_type as WidgetType,
    config: (r.config ?? { source: 'card' }) as unknown as WidgetConfig,
    layout: (r.layout ?? { x: 0, y: 0, w: 6, h: 8 }) as unknown as WidgetLayout,
    sort_index: r.sort_index,
  };
}

/** List a canvas's widgets, ordered for stable initial layout. */
export async function listWidgets(
  projectId: string,
  client?: Client
): Promise<DashboardWidget[]> {
  const c = client || supabase();
  const { data, error } = await c
    .from('dashboard_widgets')
    .select(COLS)
    .eq('project_id', projectId)
    .order('sort_index', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToWidget);
}

export interface CreateWidgetInput {
  projectId: string;
  title?: string | null;
  widgetType: WidgetType;
  config: WidgetConfig;
  layout: WidgetLayout;
  sortIndex?: number;
}

export async function createWidget(
  input: CreateWidgetInput,
  client?: Client
): Promise<DashboardWidget> {
  const c = client || supabase();
  const { data, error } = await c
    .from('dashboard_widgets')
    .insert({
      project_id: input.projectId,
      title: input.title ?? null,
      widget_type: input.widgetType,
      config: input.config as unknown as Json,
      layout: input.layout as unknown as Json,
      sort_index: input.sortIndex ?? 0,
    })
    .select(COLS)
    .single();
  if (error) throw new Error(error.message);
  return rowToWidget(data);
}

export async function updateWidget(
  id: string,
  patch: Partial<{
    title: string | null;
    widgetType: WidgetType;
    config: WidgetConfig;
    layout: WidgetLayout;
    sortIndex: number;
  }>,
  client?: Client
): Promise<void> {
  const c = client || supabase();
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.title !== undefined) row.title = patch.title;
  if (patch.widgetType !== undefined) row.widget_type = patch.widgetType;
  if (patch.config !== undefined) row.config = patch.config;
  if (patch.layout !== undefined) row.layout = patch.layout;
  if (patch.sortIndex !== undefined) row.sort_index = patch.sortIndex;
  const { error } = await c
    .from('dashboard_widgets')
    .update(row)
    .eq('id', id);
  if (error) throw new Error(error.message);
}

/** Persist new positions for many widgets after a drag/resize. */
export async function updateLayouts(
  positions: Array<{ id: string; layout: WidgetLayout }>,
  client?: Client
): Promise<void> {
  if (!positions.length) return;
  const c = client || supabase();
  await Promise.all(
    positions.map(({ id, layout }) =>
      c
        .from('dashboard_widgets')
        .update({ layout: layout as unknown as Json })
        .eq('id', id)
    )
  );
}

export async function deleteWidget(
  id: string,
  client?: Client
): Promise<void> {
  const c = client || supabase();
  const { error } = await c.from('dashboard_widgets').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
