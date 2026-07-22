// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { connected_account_secretsOrderByWithRelationInputObjectSchema } from './connected_account_secretsOrderByWithRelationInput.schema';
import { connector_cursorsOrderByRelationAggregateInputObjectSchema } from './connector_cursorsOrderByRelationAggregateInput.schema';
import { connector_runsOrderByRelationAggregateInputObjectSchema } from './connector_runsOrderByRelationAggregateInput.schema';
import { metric_bindingsOrderByRelationAggregateInputObjectSchema } from './metric_bindingsOrderByRelationAggregateInput.schema'

export const connected_accountsOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.connected_accountsOrderByWithRelationInput, Prisma.connected_accountsOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  connector_id: SortOrderSchema.optional(),
  auth_type: SortOrderSchema.optional(),
  source_account_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  source_account_label: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  granted_scopes: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  status_detail: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  last_synced_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  last_query_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  revoked_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  connected_account_secrets: z.lazy(() => connected_account_secretsOrderByWithRelationInputObjectSchema).optional(),
  connector_cursors: z.lazy(() => connector_cursorsOrderByRelationAggregateInputObjectSchema).optional(),
  connector_runs: z.lazy(() => connector_runsOrderByRelationAggregateInputObjectSchema).optional(),
  metric_bindings: z.lazy(() => metric_bindingsOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const connected_accountsOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  connector_id: SortOrderSchema.optional(),
  auth_type: SortOrderSchema.optional(),
  source_account_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  source_account_label: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  granted_scopes: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  status_detail: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  last_synced_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  last_query_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  revoked_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  connected_account_secrets: z.lazy(() => connected_account_secretsOrderByWithRelationInputObjectSchema).optional(),
  connector_cursors: z.lazy(() => connector_cursorsOrderByRelationAggregateInputObjectSchema).optional(),
  connector_runs: z.lazy(() => connector_runsOrderByRelationAggregateInputObjectSchema).optional(),
  metric_bindings: z.lazy(() => metric_bindingsOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
