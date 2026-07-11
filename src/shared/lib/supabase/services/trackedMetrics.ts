// Semantic layer — the workspace Metric Catalog. A Tracked Metric is the shared
// definition of a real, sourced metric (see the product vault).
// Born when an operationalized card (Source Node -> Metric Card with real data) is
// explicitly catalogued; other canvases reference it via metric_cards.tracked_metric_id.
// Owner-scoped for now (created_by); re-scoped to the Clerk-org workspace later.

import type { SupabaseClient } from '@supabase/supabase-js';
import { resolveClient } from '@/shared/utils/authenticatedClient';
import type { MetricValue } from '@/shared/types';
import type { Database } from '../types';
import { cardsReadSource } from '../cardsReadSource';

type Client = SupabaseClient<Database>;

// ── B.2 value store ─────────────────────────────────────────────────────────
// The shared series for a Tracked Metric (one row per period). Cards that
// reference the metric read this single history, so values are consistent
// everywhere.

/** Read a Tracked Metric's shared series (ordered by period). */
export async function getMetricValues(
  trackedMetricId: string,
  client?: Client
): Promise<MetricValue[]> {
  const c = resolveClient(client);
  const { data, error } = await c
    .from('metric_values')
    .select('period, value, change_percent, trend')
    .eq('tracked_metric_id', trackedMetricId)
    .order('period', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => ({
    period: r.period,
    value: r.value,
    change_percent: r.change_percent ?? 0,
    trend: (r.trend as MetricValue['trend']) ?? 'neutral',
  }));
}

/** Batch-read shared series for many Tracked Metrics, grouped by metric id. */
export async function getMetricValuesByMetricIds(
  ids: string[],
  client?: Client
): Promise<Record<string, MetricValue[]>> {
  if (!ids.length) return {};
  const c = resolveClient(client);
  const { data, error } = await c
    .from('metric_values')
    .select('tracked_metric_id, period, value, change_percent, trend')
    .in('tracked_metric_id', ids)
    .order('period', { ascending: true });
  if (error) throw new Error(error.message);
  const out: Record<string, MetricValue[]> = {};
  for (const r of data ?? []) {
    (out[r.tracked_metric_id] ??= []).push({
      period: r.period,
      value: r.value,
      change_percent: r.change_percent ?? 0,
      trend: (r.trend as MetricValue['trend']) ?? 'neutral',
    });
  }
  return out;
}

/** Upsert a Tracked Metric's series (one row per period). */
export async function writeMetricValues(
  trackedMetricId: string,
  series: MetricValue[],
  source?: string,
  client?: Client
): Promise<void> {
  if (!series.length) return;
  const c = resolveClient(client);
  const rows = series.map((p) => ({
    tracked_metric_id: trackedMetricId,
    period: p.period,
    value: p.value,
    change_percent: p.change_percent,
    trend: p.trend,
    source: source ?? null,
    updated_at: new Date().toISOString(),
  }));
  const { error } = await c
    .from('metric_values')
    .upsert(rows, { onConflict: 'tracked_metric_id,period' });
  if (error) throw new Error(error.message);
}

/**
 * Sync a card's series into the shared store IF the card is catalogued. No-op
 * for uncatalogued cards. Call after any value change to a tracked card.
 */
export async function syncCardValuesToCatalog(
  trackedMetricId: string | null | undefined,
  series: MetricValue[] | undefined,
  source?: string,
  client?: Client
): Promise<void> {
  if (!trackedMetricId || !Array.isArray(series) || series.length === 0) return;
  await writeMetricValues(trackedMetricId, series, source, client);
}

export interface TrackedMetric {
  id: string;
  name: string;
  unit: string | null;
  formula: string | null;
  owner_label: string | null;
  state: string;
  origin_card_id: string | null;
  origin_project_id: string | null;
  source_kind: string | null;
  created_at: string;
}

/** A card that is operationalized (has data) but not yet catalogued. */
export interface CandidateCard {
  id: string;
  title: string;
  project_id: string | null;
  /** Canvas the card lives on — the "where does this metric belong" context. */
  canvas_name: string | null;
  category: string | null;
  sub_category: string | null;
  description: string | null;
  source_type: string | null;
  formula: string | null;
  points: number; // length of its MetricValue[] series
  updated_at: string | null;
  /** Last series point, for an at-a-glance current value + trend. */
  latest: {
    value: number;
    period: string;
    change_percent: number | null;
    trend: 'up' | 'down' | 'neutral' | null;
  } | null;
}

/**
 * Public example/showcase projects — their cards and seeded metrics are demo
 * content and must never surface in the workspace catalog (tracked list or
 * candidates). Filtering happens client-side: a SQL NOT IN would also drop
 * rows whose project id is NULL.
 */
// PostgREST caps unranged selects (default 1000 rows), so exhaustive reads
// must page with .range() until a short page signals the end.
const FETCH_PAGE_SIZE = 1000;

async function getExampleProjectIds(c: Client): Promise<Set<string>> {
  const ids = new Set<string>();
  for (let offset = 0; ; offset += FETCH_PAGE_SIZE) {
    const { data, error } = await c
      .from('projects')
      .select('id')
      .contains('tags', ['example'])
      .eq('is_public', true)
      .order('id', { ascending: true })
      .range(offset, offset + FETCH_PAGE_SIZE - 1);
    if (error) throw new Error(error.message);
    const page = data ?? [];
    for (const r of page) ids.add(r.id);
    if (page.length < FETCH_PAGE_SIZE) break;
  }
  return ids;
}

/** List the workspace's catalogued (tracked) metrics (example data excluded). */
export async function listTrackedMetrics(
  client?: Client
): Promise<TrackedMetric[]> {
  const c = resolveClient(client);
  const [exampleIds, { data, error }] = await Promise.all([
    getExampleProjectIds(c),
    c
      .from('tracked_metrics')
      .select(
        'id, name, unit, formula, owner_label, state, origin_card_id, origin_project_id, source_kind, created_at'
      )
      .eq('state', 'tracked')
      .order('created_at', { ascending: false }),
  ]);
  if (error) throw new Error(error.message);
  return ((data ?? []) as TrackedMetric[]).filter(
    (m) => !m.origin_project_id || !exampleIds.has(m.origin_project_id)
  );
}

/**
 * Batch-read tracked-metric DEFINITIONS by id, keyed by id. Used to hydrate
 * referenced cards' name/formula from the catalog (single source of truth for
 * the definition, not just the values).
 */
export async function getTrackedMetricsByIds(
  ids: string[],
  client?: Client
): Promise<Record<string, TrackedMetric>> {
  if (!ids.length) return {};
  const c = resolveClient(client);
  const { data, error } = await c
    .from('tracked_metrics')
    .select(
      'id, name, unit, formula, owner_label, state, origin_card_id, origin_project_id, source_kind, created_at'
    )
    .in('id', ids);
  if (error) throw new Error(error.message);
  const map: Record<string, TrackedMetric> = {};
  for (const row of (data ?? []) as TrackedMetric[]) map[row.id] = row;
  return map;
}

/**
 * Candidate cards: operationalized (have a real MetricValue[] series) but not yet
 * catalogued (tracked_metric_id is null). The data-length check is client-side
 * because there's no cheap jsonb-array-length filter via PostgREST.
 */
export async function listCandidateCards(
  client?: Client
): Promise<CandidateCard[]> {
  const c = resolveClient(client);
  // Read `data` through the redacting view (base-table data reads are REVOKEd
  // post hide_value migration). A view can't carry a PostgREST embed, so the
  // projects(name) join is dropped here and the canvas names are batch-fetched
  // separately and re-attached as { projects: { name } } (unchanged shape).
  const cardsSrc = await cardsReadSource(c);
  const fetchAllCandidates = async () => {
    const all: any[] = [];
    // Page to exhaustion: an unranged select silently truncates at PostgREST's
    // max-rows cap (default 1000), hiding candidates in large workspaces.
    for (let offset = 0; ; offset += FETCH_PAGE_SIZE) {
      const { data, error } = await c
        .from(cardsSrc as 'metric_cards')
        .select(
          'id, title, project_id, category, sub_category, description, source_type, formula, data, updated_at, tracked_metric_id'
        )
        .is('tracked_metric_id', null)
        .order('id', { ascending: true })
        .range(offset, offset + FETCH_PAGE_SIZE - 1);
      if (error) throw new Error(error.message);
      const page = data ?? [];
      all.push(...page);
      if (page.length < FETCH_PAGE_SIZE) break;
    }
    // Attach canvas names via a batch lookup keyed by project_id, mirroring the
    // dropped projects(name) embed so the mapping below is unchanged.
    const projectIds = [
      ...new Set(
        all.map((card: any) => card.project_id).filter((id: any): id is string => !!id)
      ),
    ];
    if (projectIds.length) {
      const { data: projectRows, error: projErr } = await c
        .from('projects')
        .select('id, name')
        .in('id', projectIds);
      if (projErr) throw new Error(projErr.message);
      const nameById = new Map<string, string | null>(
        (projectRows ?? []).map((p: any) => [p.id, p.name ?? null])
      );
      for (const card of all) {
        card.projects = card.project_id
          ? { name: nameById.get(card.project_id) ?? null }
          : null;
      }
    }
    return all;
  };
  const [exampleIds, allCards] = await Promise.all([
    getExampleProjectIds(c),
    fetchAllCandidates(),
  ]);
  return allCards
    .filter(
      (card: any) =>
        Array.isArray(card.data) &&
        card.data.length > 0 &&
        !(card.project_id && exampleIds.has(card.project_id))
    )
    .map((card: any) => {
      const last = card.data[card.data.length - 1] ?? null;
      return {
        id: card.id,
        title: card.title,
        project_id: card.project_id,
        canvas_name: card.projects?.name ?? null,
        category: card.category ?? null,
        sub_category: card.sub_category ?? null,
        description: card.description || null,
        source_type: card.source_type,
        formula: card.formula,
        points: card.data.length,
        updated_at: card.updated_at ?? null,
        latest:
          last && typeof last.value === 'number'
            ? {
                value: last.value,
                period: String(last.period ?? ''),
                change_percent:
                  typeof last.change_percent === 'number'
                    ? last.change_percent
                    : null,
                trend: last.trend ?? null,
              }
            : null,
      };
    });
}

export interface PromoteInput {
  cardId: string;
  projectId?: string | null;
  name: string;
  unit?: string | null;
  formula?: string | null;
  owner_label?: string | null;
  source_kind?: string | null;
}

/**
 * Promote an operationalized card into the catalog: create the tracked_metrics
 * row (state='tracked') and link the card to it. Returns the new metric id.
 * Idempotent: if the card is already linked to a tracked metric, returns that
 * id without inserting a duplicate catalog row.
 */
export async function promoteCardToTrackedMetric(
  input: PromoteInput,
  client?: Client
): Promise<string> {
  const c = resolveClient(client);
  const { data: existing, error: existingError } = await c
    .from('metric_cards')
    .select('tracked_metric_id')
    .eq('id', input.cardId)
    .single();
  if (existingError) throw new Error(existingError.message);
  if (existing?.tracked_metric_id) return existing.tracked_metric_id;
  const { data, error } = await c
    .from('tracked_metrics')
    .insert({
      name: input.name,
      unit: input.unit ?? null,
      formula: input.formula ?? null,
      owner_label: input.owner_label ?? null,
      state: 'tracked',
      origin_card_id: input.cardId,
      origin_project_id: input.projectId ?? null,
      source_kind: input.source_kind ?? null,
    })
    .select('id')
    .single();
  if (error) throw new Error(error.message);
  await linkCardToMetric(input.cardId, data.id, c);

  // Seed the shared store from the card's current series so the catalogued
  // metric carries its history immediately. Read `data` through the redacting
  // view (base-table data reads are REVOKEd post hide_value migration).
  const cardSrc = await cardsReadSource(c);
  const { data: cardRow } = await c
    .from(cardSrc as 'metric_cards')
    .select('data')
    .eq('id', input.cardId)
    .single();
  const series = Array.isArray(cardRow?.data)
    ? (cardRow.data as unknown as MetricValue[])
    : [];
  if (series.length) {
    await writeMetricValues(data.id, series, input.source_kind ?? undefined, c);
  }
  return data.id;
}

/**
 * Link (or unlink, with null) a card to a catalog metric. Direct update — bypasses
 * the metric-cards zod validator, which doesn't know `tracked_metric_id`.
 */
export async function linkCardToMetric(
  cardId: string,
  trackedMetricId: string | null,
  client?: Client
): Promise<void> {
  const c = resolveClient(client);
  const { error } = await c
    .from('metric_cards')
    .update({ tracked_metric_id: trackedMetricId })
    .eq('id', cardId);
  if (error) throw new Error(error.message);
}

export async function updateTrackedMetric(
  id: string,
  updates: Partial<Pick<TrackedMetric, 'name' | 'unit' | 'formula' | 'owner_label'>>,
  client?: Client
): Promise<void> {
  const c = resolveClient(client);
  const { error } = await c
    .from('tracked_metrics')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export interface MetricUsage {
  projectId: string;
  projectName: string;
  cardId: string;
  cardTitle: string;
}

/** Lineage: every card (across the workspace, RLS-scoped) that references this
 *  Tracked Metric — i.e. where the metric is used. */
export async function getMetricUsage(
  trackedMetricId: string,
  client?: Client
): Promise<MetricUsage[]> {
  const c = resolveClient(client);
  const { data, error } = await c
    .from('metric_cards')
    .select('id, title, project_id, projects(name)')
    .eq('tracked_metric_id', trackedMetricId);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r: any) => ({
    projectId: r.project_id,
    projectName: r.projects?.name ?? 'Untitled',
    cardId: r.id,
    cardTitle: r.title,
  }));
}

/** Delete a catalog metric (cards referencing it unlink via FK ON DELETE SET NULL). */
export async function deleteTrackedMetric(
  id: string,
  client?: Client
): Promise<void> {
  const c = resolveClient(client);
  const { error } = await c.from('tracked_metrics').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
