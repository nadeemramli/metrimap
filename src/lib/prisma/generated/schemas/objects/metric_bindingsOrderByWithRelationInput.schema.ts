// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { connected_accountsOrderByWithRelationInputObjectSchema } from './connected_accountsOrderByWithRelationInput.schema';
import { tracked_metricsOrderByWithRelationInputObjectSchema } from './tracked_metricsOrderByWithRelationInput.schema'

export const metric_bindingsOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.metric_bindingsOrderByWithRelationInput, Prisma.metric_bindingsOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  connected_account_id: SortOrderSchema.optional(),
  connector_id: SortOrderSchema.optional(),
  stream: SortOrderSchema.optional(),
  canonical_schema: SortOrderSchema.optional(),
  recipe: SortOrderSchema.optional(),
  tracked_metric_id: SortOrderSchema.optional(),
  enabled: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  connected_accounts: z.lazy(() => connected_accountsOrderByWithRelationInputObjectSchema).optional(),
  tracked_metrics: z.lazy(() => tracked_metricsOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const metric_bindingsOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  connected_account_id: SortOrderSchema.optional(),
  connector_id: SortOrderSchema.optional(),
  stream: SortOrderSchema.optional(),
  canonical_schema: SortOrderSchema.optional(),
  recipe: SortOrderSchema.optional(),
  tracked_metric_id: SortOrderSchema.optional(),
  enabled: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  connected_accounts: z.lazy(() => connected_accountsOrderByWithRelationInputObjectSchema).optional(),
  tracked_metrics: z.lazy(() => tracked_metricsOrderByWithRelationInputObjectSchema).optional()
}).strict();
