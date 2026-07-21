// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const tracked_metricsCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.tracked_metricsCountOrderByAggregateInput, Prisma.tracked_metricsCountOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  unit: SortOrderSchema.optional(),
  formula: SortOrderSchema.optional(),
  owner_label: SortOrderSchema.optional(),
  state: SortOrderSchema.optional(),
  origin_card_id: SortOrderSchema.optional(),
  origin_project_id: SortOrderSchema.optional(),
  source_kind: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  workspace_id: SortOrderSchema.optional()
}).strict();
export const tracked_metricsCountOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  unit: SortOrderSchema.optional(),
  formula: SortOrderSchema.optional(),
  owner_label: SortOrderSchema.optional(),
  state: SortOrderSchema.optional(),
  origin_card_id: SortOrderSchema.optional(),
  origin_project_id: SortOrderSchema.optional(),
  source_kind: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  workspace_id: SortOrderSchema.optional()
}).strict();
