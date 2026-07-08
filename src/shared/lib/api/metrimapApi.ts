// Metrimap programmatic API / service layer (CVS-98).
//
// A stable, versioned, RLS-scoped facade over the existing Supabase services —
// the foundation the MCP server (CVS-100/101) wraps and the app can reuse. It is
// built on the CANONICAL model: metric_cards + relationships + projects, with
// tracked-metric value series. It does NOT touch the parallel @ts-nocheck
// value_nodes/metric_nodes model.
//
// RLS-scoping guarantee: the factory REQUIRES a Clerk-authenticated Supabase
// client (createClerkSupabaseClient) + the authenticated userId. Every call runs
// under that user's RLS. The service-role key must never be passed here.
//
// Design authority: product vault "PRD/4. Product/3. MCP and Programmatic
// Building" (the CVS-97 spike). Ingest staging/mapping (import_batches, TTL) is
// CVS-102; this layer exposes the direct value upsert only.
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Edge, Node } from '@xyflow/react';
import type { Database } from '@/shared/lib/supabase/types';
import type { EvidenceItem, MetricCard, MetricValue, Relationship } from '@/shared/types';
import { applyAutoLayout, type LayoutDirection } from '@/shared/utils/autoLayout';

import {
  CreateCanvasInput,
  CreateCommentInput,
  CreateEvidenceInput,
  CreateGroupInput,
  CreateNodeInput,
  CreateRelationshipInput,
  CreateTagInput,
  CreateTypedNodeInput,
  GetMetricValuesInput,
  GroupMembershipInput,
  ListEvidenceInput,
  PromoteCardInput,
  PushValuesInput,
  TagCardInput,
  UpdateCanvasInput,
  UpdateEvidenceInput,
  UpdateGroupInput,
  UpdateNodeInput,
  UpdateRelationshipInput,
  type CreateNodeInputT,
  type CreateTypedNodeInputT,
} from './schemas';

import {
  createGroup,
  createProject,
  deleteGroup,
  deleteProject,
  getProjectById,
  getProjectGroups,
  getUserProjects,
  updateGroup,
  updateProject,
} from '@/shared/lib/supabase/services/projects';
import {
  createMetricCard,
  deleteMetricCard,
  getProjectMetricCards,
  updateMetricCard,
  updateMetricCardPosition,
} from '@/shared/lib/supabase/services/metric-cards';
import {
  createEvidenceItem,
  createRelationship,
  deleteRelationship,
  getProjectRelationships,
  updateEvidenceItem,
  updateRelationship,
} from '@/shared/lib/supabase/services/relationships';
import {
  createCardEvidence,
  createProjectEvidence,
  getCardEvidence,
  getProjectEvidence,
} from '@/shared/lib/supabase/services/evidence';
import {
  getMetricValues,
  listCandidateCards,
  listTrackedMetrics,
  promoteCardToTrackedMetric,
  writeMetricValues,
} from '@/shared/lib/supabase/services/trackedMetrics';
import {
  addTagsToMetricCard,
  createTag,
  getProjectTags,
  removeTagsFromMetricCard,
} from '@/shared/lib/supabase/services/tags';
import {
  createComment,
  createCommentThread,
  listComments,
  listCommentThreads,
} from '@/shared/lib/supabase/services/collaboration';
import { listWidgets } from '@/shared/lib/supabase/services/dashboards';
import { createIngest } from './ingest';

export const API_VERSION = 'v1' as const;

type Client = SupabaseClient<Database>;

const nowIso = () => new Date().toISOString();
const newId = () => crypto.randomUUID();

/**
 * Group bounding box from its members' current positions — the same padding
 * and nominal card size the canvas uses (canvasStore.groupSelectedNodes), so
 * MCP-created groups render like hand-drawn ones. Explicit position/size win.
 * Also validates membership: every nodeId must be a card on the project.
 */
async function resolveGroupBox(
  client: Client,
  projectId: string | null,
  nodeIds: string[],
  position?: { x: number; y: number },
  size?: { width: number; height: number }
): Promise<{
  position: { x: number; y: number };
  size: { width: number; height: number };
}> {
  const { data, error } = await client
    .from('metric_cards')
    .select('id, position_x, position_y')
    .in('id', nodeIds)
    .eq('project_id', projectId ?? '');
  if (error) throw new Error(error.message);
  const found = new Set((data ?? []).map((r) => r.id));
  const missing = nodeIds.filter((id) => !found.has(id));
  if (missing.length) {
    throw new Error(
      `Not cards on this canvas: ${missing.join(', ')} — check nodeIds/projectId.`
    );
  }
  if (position && size) return { position, size };

  const xs = (data ?? []).map((r) => r.position_x ?? 0);
  const ys = (data ?? []).map((r) => r.position_y ?? 0);
  const [minX, maxX] = [Math.min(...xs), Math.max(...xs)];
  const [minY, maxY] = [Math.min(...ys), Math.max(...ys)];
  const padding = 50; // matches canvasStore.groupSelectedNodes
  return {
    position: position ?? { x: minX - padding, y: minY - padding },
    size: size ?? {
      width: maxX - minX + 200 + padding * 2,
      height: maxY - minY + 150 + padding * 2,
    },
  };
}

async function getGroupOrThrow(client: Client, id: string) {
  const { data, error } = await client
    .from('groups')
    .select('id, project_id, node_ids')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error(`No group with id ${id}`);
  return data;
}

/**
 * Build the RLS-scoped programmatic API bound to one authenticated user.
 * @param client Clerk-authenticated Supabase client (never the service-role key).
 * @param userId the authenticated user's id, for created_by attribution.
 */
export function createMetrimapApi(client: Client, userId: string) {
  if (!client) {
    throw new Error(
      'createMetrimapApi requires an authenticated Supabase client (RLS-scoped). The service-role key must never be used here.'
    );
  }
  if (!userId || !userId.trim()) {
    throw new Error(
      'createMetrimapApi requires the authenticated userId for attribution.'
    );
  }

  const createNode = (input: CreateNodeInputT) => {
    const v = CreateNodeInput.parse(input);
    const card: MetricCard = {
      id: newId(),
      title: v.title,
      description: v.description ?? '',
      category: v.category,
      subCategory: v.subCategory as MetricCard['subCategory'],
      tags: [],
      causalFactors: [],
      dimensions: [],
      assignees: v.assignees ?? [],
      position: v.position ?? { x: 0, y: 0 },
      formula: v.formula,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    return createMetricCard(card, v.projectId, userId, client);
  };

  const typedNode =
    (category: MetricCard['category']) => (input: CreateTypedNodeInputT) => {
      const v = CreateTypedNodeInput.parse(input);
      return createNode({ ...v, category });
    };

  return {
    version: API_VERSION,

    canvases: {
      list: () => getUserProjects(userId, client),
      get: (id: string) => getProjectById(id, client),
      create: (input: unknown) => {
        const v = CreateCanvasInput.parse(input);
        return createProject(
          {
            name: v.name,
            description: v.description ?? null,
            is_public: v.isPublic ?? false,
            created_by: userId,
          },
          client
        );
      },
      update: (id: string, patch: unknown) => {
        const v = UpdateCanvasInput.parse(patch);
        return updateProject(
          id,
          {
            ...(v.name !== undefined ? { name: v.name } : {}),
            ...(v.description !== undefined ? { description: v.description } : {}),
            ...(v.isPublic !== undefined ? { is_public: v.isPublic } : {}),
          },
          client
        );
      },
      delete: (id: string) => deleteProject(id, client),
    },

    nodes: {
      create: createNode,
      // Named helpers map to metric_cards categories (design-doc tool surface).
      createMetric: typedNode('Data/Metric'),
      createValue: typedNode('Core/Value'),
      createAction: typedNode('Work/Action'),
      createHypothesis: typedNode('Ideas/Hypothesis'),
      // A driver is an input metric that drives an output metric/value.
      createDriver: (input: CreateTypedNodeInputT) => {
        const v = CreateTypedNodeInput.parse(input);
        return createNode({
          ...v,
          category: 'Data/Metric',
          subCategory: v.subCategory ?? 'Input Metric',
        });
      },
      update: (id: string, patch: unknown) => {
        const v = UpdateNodeInput.parse(patch);
        return updateMetricCard(id, v as Partial<MetricCard>, client);
      },
      delete: (id: string) => deleteMetricCard(id, client),
      list: (projectId: string) => getProjectMetricCards(projectId, client),
    },

    relationships: {
      create: (input: unknown) => {
        const v = CreateRelationshipInput.parse(input);
        const rel: Relationship = {
          id: newId(),
          sourceId: v.sourceId,
          targetId: v.targetId,
          type: v.type,
          confidence: v.confidence ?? 'Medium',
          weight: v.weight,
          evidence: [],
          notes: v.notes,
          createdAt: nowIso(),
          updatedAt: nowIso(),
        };
        return createRelationship(rel, v.projectId, userId, client);
      },
      update: (id: string, patch: unknown) => {
        const v = UpdateRelationshipInput.parse(patch);
        return updateRelationship(id, v as Partial<Relationship>, client);
      },
      delete: (id: string) => deleteRelationship(id, client),
      list: (projectId: string) => getProjectRelationships(projectId, client),
    },

    // Evidence: attach to a card, a relationship, or the project itself (general).
    evidence: {
      create: (input: unknown) => {
        const v = CreateEvidenceInput.parse(input);
        const item: EvidenceItem = {
          id: newId(),
          title: v.title,
          type: v.type,
          date: v.date ?? nowIso().slice(0, 10),
          owner: v.owner ?? userId,
          hypothesis: v.hypothesis,
          link: v.link,
          summary: v.summary,
          content: v.content as EvidenceItem['content'],
          createdAt: nowIso(),
          updatedAt: nowIso(),
        };
        if (v.cardId) return createCardEvidence(item, v.cardId, v.projectId, userId, client);
        if (v.relationshipId)
          return createEvidenceItem(item, v.relationshipId, userId, client);
        return createProjectEvidence(item, v.projectId, userId, client);
      },
      list: (input: unknown) => {
        const v = ListEvidenceInput.parse(input);
        return v.cardId
          ? getCardEvidence(v.cardId, client)
          : getProjectEvidence(v.projectId, client);
      },
      update: (id: string, patch: unknown) => {
        const v = UpdateEvidenceInput.parse(patch);
        return updateEvidenceItem(id, v as Partial<EvidenceItem>, client);
      },
    },

    // Project tags + card tagging (tags must exist before tagging — see create).
    tags: {
      list: (projectId: string) => getProjectTags(projectId, client),
      create: (input: unknown) => {
        const v = CreateTagInput.parse(input);
        return createTag(
          {
            name: v.name,
            color: v.color ?? null,
            description: v.description ?? null,
            project_id: v.projectId,
            created_by: userId,
          },
          client
        );
      },
      tagCard: (input: unknown) => {
        const v = TagCardInput.parse(input);
        return addTagsToMetricCard(v.cardId, v.tags, client);
      },
      untagCard: (input: unknown) => {
        const v = TagCardInput.parse(input);
        return removeTagsFromMetricCard(v.cardId, v.tags, client);
      },
    },

    // Tracked-metric catalog: discovery + promotion + shared value-series reads.
    catalog: {
      listTracked: () => listTrackedMetrics(client),
      listCandidates: () => listCandidateCards(client),
      promote: async (input: unknown) => {
        const v = PromoteCardInput.parse(input);
        const trackedMetricId = await promoteCardToTrackedMetric(
          {
            cardId: v.cardId,
            projectId: v.projectId ?? null,
            name: v.name,
            unit: v.unit ?? null,
            formula: v.formula ?? null,
            owner_label: v.ownerLabel ?? null,
            source_kind: v.sourceKind ?? null,
          },
          client
        );
        return { trackedMetricId };
      },
      values: (input: unknown) => {
        const v = GetMetricValuesInput.parse(input);
        return getMetricValues(v.trackedMetricId, client);
      },
    },

    // Comment threads (canvas-level or pinned to a card) + replies.
    comments: {
      list: async (projectId: string) => {
        const threads = await listCommentThreads(projectId, client);
        return Promise.all(
          threads.map(async (t) => ({
            ...t,
            comments: await listComments(t.id, client),
          }))
        );
      },
      create: async (input: unknown) => {
        const v = CreateCommentInput.parse(input);
        const threadId =
          v.threadId ??
          (
            await createCommentThread(
              {
                projectId: v.projectId,
                source: v.cardId ? 'node' : 'canvas',
                context: v.cardId ? { cardId: v.cardId } : null,
                createdBy: userId,
              },
              client
            )
          ).id;
        const comment = await createComment(
          { threadId, content: v.content, authorId: userId },
          client
        );
        return { threadId, comment };
      },
    },

    // Dashboards are widgets (group dashboards + Custom) over canvas groups.
    dashboards: {
      list: async (projectId: string) => ({
        widgets: await listWidgets(projectId, client),
        groups: await getProjectGroups(projectId, client),
      }),
    },

    groups: {
      list: (projectId: string) => getProjectGroups(projectId, client),
      create: async (input: unknown) => {
        const v = CreateGroupInput.parse(input);
        const box = await resolveGroupBox(
          client,
          v.projectId,
          v.nodeIds,
          v.position,
          v.size
        );
        return createGroup(
          {
            id: newId(),
            name: v.name,
            nodeIds: v.nodeIds,
            position: box.position,
            size: box.size,
            projectId: v.projectId,
            createdBy: userId,
            color: v.color ?? null,
            description: v.description ?? null,
          },
          client
        );
      },
      update: async (id: string, patch: unknown) => {
        const v = UpdateGroupInput.parse(patch);
        const current = await getGroupOrThrow(client, id);
        const nodeIds = v.nodeIds ?? (current.node_ids as string[]);
        // Membership changed or refit requested → re-derive the box from the
        // members' current positions unless an explicit box was supplied.
        const needsBox = v.refit || (v.nodeIds && !v.position && !v.size);
        const box = needsBox
          ? await resolveGroupBox(client, current.project_id, nodeIds)
          : { position: v.position, size: v.size };
        return updateGroup(
          id,
          {
            ...(v.name !== undefined ? { name: v.name } : {}),
            ...(v.color !== undefined ? { color: v.color } : {}),
            ...(v.description !== undefined
              ? { description: v.description }
              : {}),
            ...(v.nodeIds !== undefined ? { nodeIds: v.nodeIds } : {}),
            ...(box.position ? { position: box.position } : {}),
            ...(box.size ? { size: box.size } : {}),
          },
          client
        );
      },
      addCards: async (input: unknown) => {
        const v = GroupMembershipInput.parse(input);
        const current = await getGroupOrThrow(client, v.groupId);
        const merged = Array.from(
          new Set([...(current.node_ids as string[]), ...v.nodeIds])
        );
        const box = await resolveGroupBox(client, current.project_id, merged);
        return updateGroup(v.groupId, { nodeIds: merged, ...box }, client);
      },
      removeCards: async (input: unknown) => {
        const v = GroupMembershipInput.parse(input);
        const current = await getGroupOrThrow(client, v.groupId);
        const remaining = (current.node_ids as string[]).filter(
          (id) => !v.nodeIds.includes(id)
        );
        if (remaining.length === 0) {
          throw new Error(
            'Removing these cards would empty the group — delete_group instead.'
          );
        }
        const box = await resolveGroupBox(client, current.project_id, remaining);
        return updateGroup(v.groupId, { nodeIds: remaining, ...box }, client);
      },
      delete: (id: string) => deleteGroup(id, client),
    },

    // get_tree: full structure so agents extend rather than duplicate.
    tree: {
      get: async (projectId: string) => ({
        projectId,
        cards: await getProjectMetricCards(projectId, client),
        relationships: await getProjectRelationships(projectId, client),
      }),

      // Auto-layout (Dagre) so a programmatically-built tree renders sensibly.
      // Reuses the app's applyAutoLayout, then persists each new position.
      layout: async (projectId: string, direction: LayoutDirection = 'TB') => {
        const cards = await getProjectMetricCards(projectId, client);
        const rels = (await getProjectRelationships(projectId, client)) as Array<{
          id: string;
          sourceId: string;
          targetId: string;
        }>;
        const nodes: Node[] = cards.map(
          (c) => ({ id: c.id, position: c.position ?? { x: 0, y: 0 }, data: {} }) as Node
        );
        const edges: Edge[] = rels.map(
          (r) => ({ id: r.id, source: r.sourceId, target: r.targetId }) as Edge
        );
        const laid = applyAutoLayout(nodes, edges, { direction });
        await Promise.all(
          laid.map((n) => updateMetricCardPosition(n.id, n.position, client))
        );
        return {
          projectId,
          count: laid.length,
          positions: laid.map((n) => ({ id: n.id, position: n.position })),
        };
      },
    },

    values: {
      // Upsert a tracked-metric series directly into the two-tier value store.
      push: (input: unknown) => {
        const v = PushValuesInput.parse(input);
        const series: MetricValue[] = v.series.map((s) => ({
          period: s.period,
          value: s.value,
          change_percent: s.change_percent ?? 0,
          trend: s.trend ?? 'neutral',
        }));
        return writeMetricValues(v.trackedMetricId, series, v.source, client);
      },
    },

    // Data ingest: stage (series/CSV, TTL) → map → materialize onto a card.
    ingest: createIngest(client, userId),
  };
}

export type MetrimapApi = ReturnType<typeof createMetrimapApi>;
