// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const metric_valuesMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.metric_valuesMinOrderByAggregateInput, Prisma.metric_valuesMinOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  tracked_metric_id: SortOrderSchema.optional(),
  period: SortOrderSchema.optional(),
  value: SortOrderSchema.optional(),
  change_percent: SortOrderSchema.optional(),
  trend: SortOrderSchema.optional(),
  source: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  workspace_id: SortOrderSchema.optional()
}).strict();
export const metric_valuesMinOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  tracked_metric_id: SortOrderSchema.optional(),
  period: SortOrderSchema.optional(),
  value: SortOrderSchema.optional(),
  change_percent: SortOrderSchema.optional(),
  trend: SortOrderSchema.optional(),
  source: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  workspace_id: SortOrderSchema.optional()
}).strict();
