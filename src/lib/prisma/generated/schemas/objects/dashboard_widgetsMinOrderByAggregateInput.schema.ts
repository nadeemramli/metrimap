// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const dashboard_widgetsMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.dashboard_widgetsMinOrderByAggregateInput, Prisma.dashboard_widgetsMinOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  widget_type: SortOrderSchema.optional(),
  sort_index: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  group_id: SortOrderSchema.optional()
}).strict();
export const dashboard_widgetsMinOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  widget_type: SortOrderSchema.optional(),
  sort_index: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  group_id: SortOrderSchema.optional()
}).strict();
