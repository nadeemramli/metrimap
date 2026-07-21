// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const metric_valuesMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.metric_valuesMaxOrderByAggregateInput, Prisma.metric_valuesMaxOrderByAggregateInput> = z.object({
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
export const metric_valuesMaxOrderByAggregateInputObjectZodSchema = z.object({
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
