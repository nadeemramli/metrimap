// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const strategy_metric_linksMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.strategy_metric_linksMinOrderByAggregateInput, Prisma.strategy_metric_linksMinOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  contract_id: SortOrderSchema.optional(),
  workspace_id: SortOrderSchema.optional(),
  role: SortOrderSchema.optional(),
  ref_source: SortOrderSchema.optional(),
  tracked_metric_id: SortOrderSchema.optional(),
  card_id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
export const strategy_metric_linksMinOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  contract_id: SortOrderSchema.optional(),
  workspace_id: SortOrderSchema.optional(),
  role: SortOrderSchema.optional(),
  ref_source: SortOrderSchema.optional(),
  tracked_metric_id: SortOrderSchema.optional(),
  card_id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
