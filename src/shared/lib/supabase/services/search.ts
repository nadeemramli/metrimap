import type { SupabaseClient } from '@supabase/supabase-js';
import { resolveClient } from '@/shared/utils/authenticatedClient';
import type { Database } from '../types';

type Client = SupabaseClient<Database>;

export type GlobalSearchResult = {
  type: 'metric' | 'evidence';
  id: string;
  title: string;
  /** e.g. "Growth canvas · Metric" — the owning canvas + a type/category hint. */
  subtitle: string;
  /** The owning canvas/project id, so the caller can navigate to it. */
  canvasId: string | null;
};

// Escape LIKE wildcards so a user typing "50%" doesn't match everything.
function escapeLike(term: string): string {
  return term.replace(/[\\%_]/g, (c) => `\\${c}`);
}

/**
 * Cross-canvas search (CVS-83): match metric cards and evidence items by title
 * across every canvas the viewer can access. RLS scopes the rows automatically,
 * so results are already limited to what the user is allowed to see. Distinct
 * from AdvancedSearchModal, which only searches the currently-open canvas.
 */
export async function searchAcrossCanvases(
  query: string,
  authenticatedClient?: Client
): Promise<GlobalSearchResult[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const client = resolveClient(authenticatedClient);
  const like = `%${escapeLike(q)}%`;

  const [cardsRes, evidenceRes] = await Promise.all([
    client
      .from('metric_cards')
      .select('id, title, category, project_id')
      .ilike('title', like)
      .limit(25),
    client
      .from('evidence_items')
      .select('id, title, type, project_id')
      .ilike('title', like)
      .limit(25),
  ]);

  if (cardsRes.error) throw new Error(cardsRes.error.message);
  if (evidenceRes.error) throw new Error(evidenceRes.error.message);

  const cards = cardsRes.data ?? [];
  const evidence = evidenceRes.data ?? [];

  // Resolve canvas/project names for the result subtitles (one batched query).
  const projectIds = Array.from(
    new Set(
      [...cards, ...evidence]
        .map((r) => r.project_id)
        .filter((id): id is string => Boolean(id))
    )
  );
  const nameById = new Map<string, string>();
  if (projectIds.length > 0) {
    const { data: projects, error: projectsError } = await client
      .from('projects')
      .select('id, name')
      .in('id', projectIds);
    // Subtitles are cosmetic — log and continue rather than failing the search.
    if (projectsError) {
      console.error('Global search: canvas name lookup failed:', projectsError.message);
    }
    for (const p of projects ?? []) {
      nameById.set(p.id, (p.name as string) ?? 'Untitled canvas');
    }
  }

  const subtitle = (projectId: string | null, hint?: string | null) =>
    [projectId ? nameById.get(projectId) : null, hint]
      .filter(Boolean)
      .join(' · ');

  const results: GlobalSearchResult[] = [];
  for (const card of cards) {
    results.push({
      type: 'metric',
      id: card.id,
      title: card.title,
      subtitle: subtitle(card.project_id, card.category),
      canvasId: card.project_id,
    });
  }
  for (const ev of evidence) {
    results.push({
      type: 'evidence',
      id: ev.id,
      title: ev.title,
      subtitle: subtitle(ev.project_id, ev.type),
      canvasId: ev.project_id,
    });
  }
  return results;
}
