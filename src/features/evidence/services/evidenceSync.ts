// Write-through sync for canvas evidence (CVS-337): the Zustand store stays
// the synchronous UI source of truth; this module mirrors content fields to
// evidence_items rows. Layout fields (position, isExpanded, links, …) never
// hit the table — CanvasPage persists them to projects.settings.evidenceLayout.
import { useEvidenceStore } from '@/features/evidence/stores/useEvidenceStore';
import {
  createCardEvidence,
  createProjectEvidence,
  isEvidenceUuid,
} from '@/shared/lib/supabase/services/evidence';
import {
  deleteEvidenceItem,
  updateEvidenceItem,
} from '@/shared/lib/supabase/services/relationships';
import { getAuthenticatedClient } from '@/shared/utils/authenticatedClient';
import { useAppStore } from '@/shared/stores/useAppStore';
import type { EvidenceItem } from '@/shared/types';
import { toast } from 'sonner';

/** Fields that live on the evidence_items row. Everything else is canvas
 *  layout/presentation and belongs to settings.evidenceLayout. */
const DB_FIELDS = new Set<keyof EvidenceItem>([
  'title',
  'type',
  'date',
  'summary',
  'hypothesis',
  'link',
  'impactOnConfidence',
  'content',
  'owner',
  'isPublic',
  'context',
]);

export function splitEvidenceUpdates(updates: Partial<EvidenceItem>): {
  db: Partial<EvidenceItem>;
  layout: Partial<EvidenceItem>;
} {
  const db: Partial<EvidenceItem> = {};
  const layout: Partial<EvidenceItem> = {};
  for (const [key, value] of Object.entries(updates)) {
    if (DB_FIELDS.has(key as keyof EvidenceItem)) {
      (db as Record<string, unknown>)[key] = value;
    } else {
      (layout as Record<string, unknown>)[key] = value;
    }
  }
  return { db, layout };
}

const DEBOUNCE_MS = 800;

const timers = new Map<string, ReturnType<typeof setTimeout>>();
const pendingDb = new Map<string, Partial<EvidenceItem>>();
/** Per-id promise chain so a create can never race its own updates. */
const chains = new Map<string, Promise<void>>();
/** Ids whose insert failed (or hasn't run) — retried on the next edit. */
const needsCreate = new Set<string>();
const projectOf = new Map<string, string>();

function chain(id: string, task: () => Promise<void>): void {
  const next = (chains.get(id) ?? Promise.resolve()).then(task).catch((e) => {
    console.error('🧾 evidenceSync: task failed for', id, e);
  });
  chains.set(id, next);
}

function runCreate(id: string): void {
  chain(id, async () => {
    if (!needsCreate.has(id)) return;
    const item = useEvidenceStore.getState().getEvidenceById(id);
    const projectId = projectOf.get(id);
    if (!item || !projectId) return;
    if (!isEvidenceUuid(id)) {
      console.warn('🧾 evidenceSync: non-UUID evidence id, cannot insert', id);
      return;
    }
    const client = getAuthenticatedClient() ?? undefined;
    const userId = useAppStore.getState().user?.id || 'unknown';
    try {
      if (item.context?.type === 'card' && item.context.targetId) {
        await createCardEvidence(
          item,
          item.context.targetId,
          projectId,
          userId,
          client
        );
      } else {
        await createProjectEvidence(item, projectId, userId, client);
      }
      needsCreate.delete(id);
    } catch (e) {
      // Keep the optimistic store copy; the next edit retries the insert.
      console.error('🧾 evidenceSync: create failed, will retry on edit', e);
      toast.error('Evidence could not be saved yet — it will retry on your next edit');
    }
  });
}

/** Optimistic store add + DB insert (project- or card-scoped by context). */
export function createEvidenceSynced(
  item: EvidenceItem,
  projectId: string
): void {
  useEvidenceStore.getState().addEvidence(item);
  projectOf.set(item.id, projectId);
  needsCreate.add(item.id);
  runCreate(item.id);
}

/** Ensure a DB row exists for an item already in the store (e.g. a
 *  store-side duplicate that minted a fresh UUID). */
export function ensureEvidenceRowSynced(id: string, projectId: string): void {
  projectOf.set(id, projectId);
  needsCreate.add(id);
  runCreate(id);
}

/** Optimistic store update; content-ish fields debounce into the row. */
export function updateEvidenceSynced(
  id: string,
  updates: Partial<EvidenceItem>,
  projectId?: string
): void {
  useEvidenceStore.getState().updateEvidence(id, updates);
  if (projectId) projectOf.set(id, projectId);

  const { db } = splitEvidenceUpdates(updates);
  if (Object.keys(db).length === 0) return;

  if (needsCreate.has(id)) {
    // Row doesn't exist yet — retry the insert (it reads the merged store item).
    runCreate(id);
    return;
  }

  pendingDb.set(id, { ...(pendingDb.get(id) ?? {}), ...db });
  const existing = timers.get(id);
  if (existing) clearTimeout(existing);
  timers.set(
    id,
    setTimeout(() => flushEvidenceSync(id), DEBOUNCE_MS)
  );
}

/** Push any pending debounced update for `id` to the DB now. */
export function flushEvidenceSync(id: string): void {
  const timer = timers.get(id);
  if (timer) {
    clearTimeout(timer);
    timers.delete(id);
  }
  const dbUpdates = pendingDb.get(id);
  pendingDb.delete(id);
  if (!dbUpdates || Object.keys(dbUpdates).length === 0) return;
  chain(id, async () => {
    try {
      await updateEvidenceItem(
        id,
        dbUpdates,
        getAuthenticatedClient() ?? undefined
      );
    } catch (e) {
      // Re-queue so the changes ride along with the next edit.
      console.error('🧾 evidenceSync: update failed, re-queued', e);
      pendingDb.set(id, { ...dbUpdates, ...(pendingDb.get(id) ?? {}) });
    }
  });
}

/** Optimistic store delete + DB delete (skips the DB when no row exists). */
export function deleteEvidenceSynced(id: string): void {
  useEvidenceStore.getState().deleteEvidence(id);
  const timer = timers.get(id);
  if (timer) clearTimeout(timer);
  timers.delete(id);
  pendingDb.delete(id);
  const neverInserted = needsCreate.has(id) || !isEvidenceUuid(id);
  needsCreate.delete(id);
  projectOf.delete(id);
  if (neverInserted) return;
  chain(id, async () => {
    try {
      await deleteEvidenceItem(id, getAuthenticatedClient() ?? undefined);
    } catch (e) {
      console.error('🧾 evidenceSync: delete failed', e);
      toast.error('Could not delete evidence from the database');
    }
  });
}

/** Reset in-flight bookkeeping (canvas switch / tests). Pending timers are
 *  dropped, not flushed — call flushEvidenceSync per id first if needed. */
export function resetEvidenceSync(): void {
  for (const t of timers.values()) clearTimeout(t);
  timers.clear();
  pendingDb.clear();
  chains.clear();
  needsCreate.clear();
  projectOf.clear();
}
