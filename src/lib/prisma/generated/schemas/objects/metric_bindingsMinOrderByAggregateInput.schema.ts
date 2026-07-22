// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const metric_bindingsMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.metric_bindingsMinOrderByAggregateInput, Prisma.metric_bindingsMinOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  workspace_id: SortOrderSchema.optional(),
  connected_account_id: SortOrderSchema.optional(),
  connector_id: SortOrderSchema.optional(),
  stream: SortOrderSchema.optional(),
  canonical_schema: SortOrderSchema.optional(),
  tracked_metric_id: SortOrderSchema.optional(),
  enabled: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
export const metric_bindingsMinOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  workspace_id: SortOrderSchema.optional(),
  connected_account_id: SortOrderSchema.optional(),
  connector_id: SortOrderSchema.optional(),
  stream: SortOrderSchema.optional(),
  canonical_schema: SortOrderSchema.optional(),
  tracked_metric_id: SortOrderSchema.optional(),
  enabled: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
