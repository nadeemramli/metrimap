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
import type { MetricCard, MetricValue, Relationship } from '@/shared/types';
import { applyAutoLayout, type LayoutDirection } from '@/shared/utils/autoLayout';

import {
  CreateCanvasInput,
  CreateNodeInput,
  CreateRelationshipInput,
  CreateTypedNodeInput,
  PushValuesInput,
  UpdateCanvasInput,
  UpdateNodeInput,
  type CreateNodeInputT,
  type CreateTypedNodeInputT,
} from './schemas';

import {
  createProject,
  deleteProject,
  getProjectById,
  getUserProjects,
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
  createRelationship,
  deleteRelationship,
  getProjectRelationships,
} from '@/shared/lib/supabase/services/relationships';
import { writeMetricValues } from '@/shared/lib/supabase/services/trackedMetrics';

export const API_VERSION = 'v1' as const;

type Client = SupabaseClient<Database>;

const nowIso = () => new Date().toISOString();
const newId = () => crypto.randomUUID();

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
      delete: (id: string) => deleteRelationship(id, client),
      list: (projectId: string) => getProjectRelationships(projectId, client),
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
      // Upsert a tracked-metric series (two-tier value store). Full staging +
      // column mapping is CVS-102.
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
  };
}

export type MetrimapApi = ReturnType<typeof createMetrimapApi>;
