// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const metric_bindingsCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.metric_bindingsCountOrderByAggregateInput, Prisma.metric_bindingsCountOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  workspace_id: SortOrderSchema.optional(),
  connected_account_id: SortOrderSchema.optional(),
  connector_id: SortOrderSchema.optional(),
  stream: SortOrderSchema.optional(),
  canonical_schema: SortOrderSchema.optional(),
  recipe: SortOrderSchema.optional(),
  tracked_metric_id: SortOrderSchema.optional(),
  enabled: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
export const metric_bindingsCountOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  workspace_id: SortOrderSchema.optional(),
  connected_account_id: SortOrderSchema.optional(),
  connector_id: SortOrderSchema.optional(),
  stream: SortOrderSchema.optional(),
  canonical_schema: SortOrderSchema.optional(),
  recipe: SortOrderSchema.optional(),
  tracked_metric_id: SortOrderSchema.optional(),
  enabled: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
