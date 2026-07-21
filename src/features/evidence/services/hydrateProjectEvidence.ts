// Hydration + one-time legacy migration for canvas evidence (CVS-337).
// evidence_items rows are the content truth; projects.settings.evidenceLayout
// (a map keyed by evidence id) carries canvas presentation: position,
// expansion, links, comments. The old projects.settings.evidence blob is
// migrated into rows once per project, then emptied (backup kept one release).
import {
  getProjectEvidence,
  insertProjectEvidenceBatch,
  isEvidenceUuid,
} from '@/shared/lib/supabase/services/evidence';
import { updateEvidenceItem } from '@/shared/lib/supabase/services/relationships';
import { mergeProjectSettings } from '@/shared/lib/supabase/services/projects';
import type { Database } from '@/shared/lib/supabase/types';
import type { EvidenceComment, EvidenceItem } from '@/shared/types';
import type { SupabaseClient } from '@supabase/supabase-js';

type Client = SupabaseClient<Database>;

export interface EvidenceLayoutEntry {
  position?: { x: number; y: number };
  isExpanded?: boolean;
  isVisible?: boolean;
  zIndex?: number | null;
  links?: Array<{ targetId: string; targetName: string }>;
  contextTargetName?: string;
  comments?: EvidenceComment[];
  tags?: string[];
  category?: string;
}

const LAYOUT_KEYS = [
  'position',
  'isExpanded',
  'isVisible',
  'zIndex',
  'links',
  'comments',
  'tags',
  'category',
] as const;

/** Extract the layout entry for one item; null when it carries no layout. */
export function buildEvidenceLayoutEntry(
  item: EvidenceItem
): EvidenceLayoutEntry | null {
  const entry: EvidenceLayoutEntry = {};
  for (const key of LAYOUT_KEYS) {
    const value = item[key as keyof EvidenceItem];
    if (value !== undefined) {
      (entry as Record<string, unknown>)[key] = value;
    }
  }
  if (item.context?.targetName) entry.contextTargetName = item.context.targetName;
  return Object.keys(entry).length ? entry : null;
}

/** The full layout map persisted to settings.evidenceLayout. */
export function buildEvidenceLayoutMap(
  items: EvidenceItem[]
): Record<string, EvidenceLayoutEntry> {
  const map: Record<string, EvidenceLayoutEntry> = {};
  for (const item of items) {
    const entry = buildEvidenceLayoutEntry(item);
    if (entry) map[item.id] = entry;
  }
  return map;
}

/** Overlay a layout entry onto a DB row. */
export function applyEvidenceLayout(
  row: EvidenceItem,
  entry: EvidenceLayoutEntry | undefined
): EvidenceItem {
  if (!entry) return row;
  const { contextTargetName, ...rest } = entry;
  return {
    ...row,
    ...rest,
    context:
      contextTargetName && row.context
        ? { ...row.context, targetName: contextTargetName }
        : row.context,
  };
}

export interface LegacyPartition {
  /** Blob item already has a row (by id, or by title/date/created-by match —
   *  the repository page used to dual-write). `row` is the DB copy. */
  existing: Array<{ blob: EvidenceItem; row: EvidenceItem }>;
  /** UUID-id blob items with no row — insert preserving the id. */
  insertKeepId: EvidenceItem[];
  /** Non-UUID (`evidence_...`) ids — insert with a fresh id, remap refs. */
  insertNewId: EvidenceItem[];
}

export function partitionLegacyEvidence(
  legacy: EvidenceItem[],
  rows: EvidenceItem[]
): LegacyPartition {
  const byId = new Map(rows.map((r) => [r.id, r]));
  const byFingerprint = new Map(
    rows.map((r) => [`${r.title}|${r.date}|${r.createdBy ?? ''}`, r])
  );
  const partition: LegacyPartition = {
    existing: [],
    insertKeepId: [],
    insertNewId: [],
  };
  for (const blob of legacy) {
    const row =
      byId.get(blob.id) ??
      byFingerprint.get(`${blob.title}|${blob.date}|${blob.createdBy ?? ''}`);
    if (row) partition.existing.push({ blob, row });
    else if (isEvidenceUuid(blob.id)) partition.insertKeepId.push(blob);
    else partition.insertNewId.push(blob);
  }
  return partition;
}

/** Rewrite reference edges after a non-UUID id remap. Returns null when
 *  nothing changed (so callers can skip the settings write). */
export function remapDataFlowEdges(
  edges: unknown,
  idRemap: Record<string, string>
): Array<Record<string, unknown>> | null {
  if (!Array.isArray(edges) || Object.keys(idRemap).length === 0) return null;
  let changed = false;
  const remapped = edges.map((edge) => {
    const e = edge as Record<string, unknown>;
    const source = idRemap[e.source as string];
    const target = idRemap[e.target as string];
    if (!source && !target) return e;
    changed = true;
    const next = { ...e };
    if (source) next.source = source;
    if (target) next.target = target;
    if (typeof e.id === 'string') {
      let id = e.id;
      for (const [oldId, newId] of Object.entries(idRemap)) {
        id = id.replace(oldId, newId);
      }
      next.id = id;
    }
    return next;
  });
  return changed ? remapped : null;
}

export interface HydratedEvidence {
  evidence: EvidenceItem[];
  /** Legacy blob items pending migration (non-empty ⇒ run
   *  migrateLegacyEvidence once the user is known to be an editor). */
  pendingLegacy: EvidenceItem[];
}

/**
 * Read-only hydration: DB rows + layout overlay, plus (pre-migration only)
 * any blob items that don't have a row yet so nothing disappears for
 * viewers or before the one-time migration runs.
 */
export async function hydrateProjectEvidence(
  projectId: string,
  settings: Record<string, unknown> | null | undefined,
  client?: Client
): Promise<HydratedEvidence> {
  const s = settings ?? {};
  const layout =
    (s.evidenceLayout as Record<string, EvidenceLayoutEntry> | undefined) ?? {};
  let rows: EvidenceItem[] = [];
  try {
    rows = await getProjectEvidence(projectId, client);
  } catch (e) {
    console.error('🧾 evidence hydration: failed to load rows', e);
  }
  const legacy: EvidenceItem[] =
    !s.evidenceMigratedAt && Array.isArray(s.evidence)
      ? (s.evidence as EvidenceItem[])
      : [];
  const rowIds = new Set(rows.map((r) => r.id));
  const evidence = [
    ...rows.map((r) => applyEvidenceLayout(r, layout[r.id])),
    ...legacy.filter((e) => !rowIds.has(e.id)),
  ];
  return { evidence, pendingLegacy: legacy };
}

export interface MigrationResult {
  /** oldId → newId for legacy non-UUID items. */
  idRemap: Record<string, string>;
  /** Remapped dataFlowEdges (only when a remap touched them). */
  dataFlowEdges: Array<Record<string, unknown>> | null;
}

/**
 * One-time migration of the settings.evidence blob into evidence_items rows.
 * Editor-only (RLS rejects viewer inserts). Idempotence: gated by the
 * evidenceMigratedAt stamp, plus id/fingerprint dedupe for partial-failure
 * re-runs. Finalizes with a single settings write: layout map + stamp +
 * backup + emptied blob (+ remapped edges when needed).
 */
export async function migrateLegacyEvidence(opts: {
  projectId: string;
  userId: string;
  legacy: EvidenceItem[];
  settings: Record<string, unknown>;
  client?: Client;
}): Promise<MigrationResult> {
  const { projectId, userId, legacy, settings, client } = opts;
  const rows = await getProjectEvidence(projectId, client);
  const partition = partitionLegacyEvidence(legacy, rows);
  const idRemap: Record<string, string> = {};

  // Existing rows: if the blob copy is newer (edited via the store-only canvas
  // path after a repository dual-write), push its content fields once.
  for (const { blob, row } of partition.existing) {
    if (blob.id !== row.id) idRemap[blob.id] = row.id;
    const blobNewer =
      blob.updatedAt && row.updatedAt
        ? blob.updatedAt > row.updatedAt
        : Boolean(blob.updatedAt && !row.updatedAt);
    if (blobNewer) {
      try {
        await updateEvidenceItem(
          row.id,
          {
            title: blob.title,
            summary: blob.summary,
            content: blob.content,
          },
          client
        );
      } catch (e) {
        console.error('🧾 evidence migration: content push failed', row.id, e);
      }
    }
  }

  const insertedKeep = await insertProjectEvidenceBatch(
    partition.insertKeepId,
    projectId,
    userId,
    client
  );
  void insertedKeep;
  const insertedNew = await insertProjectEvidenceBatch(
    partition.insertNewId,
    projectId,
    userId,
    client
  );
  partition.insertNewId.forEach((blob, i) => {
    const created = insertedNew[i];
    if (created) idRemap[blob.id] = created.id;
  });

  // Layout map from the blob (positions, expansion, links, comments), keyed
  // by the FINAL id.
  const evidenceLayout: Record<string, EvidenceLayoutEntry> = {
    ...((settings.evidenceLayout as Record<string, EvidenceLayoutEntry>) ?? {}),
  };
  for (const blob of legacy) {
    const entry = buildEvidenceLayoutEntry(blob);
    if (entry) evidenceLayout[idRemap[blob.id] ?? blob.id] = entry;
  }

  const dataFlowEdges = remapDataFlowEdges(settings.dataFlowEdges, idRemap);

  await mergeProjectSettings(
    projectId,
    {
      evidenceLayout,
      evidenceMigratedAt: new Date().toISOString(),
      evidenceLegacyBackup: legacy,
      evidence: [],
      ...(dataFlowEdges ? { dataFlowEdges } : {}),
    },
    client
  );

  return { idRemap, dataFlowEdges };
}
