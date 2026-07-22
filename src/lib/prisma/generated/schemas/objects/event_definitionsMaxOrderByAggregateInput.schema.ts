// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const event_definitionsMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.event_definitionsMaxOrderByAggregateInput, Prisma.event_definitionsMaxOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  key: SortOrderSchema.optional(),
  category: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  lifecycle_state: SortOrderSchema.optional(),
  source_kind: SortOrderSchema.optional(),
  owner_label: SortOrderSchema.optional(),
  tracked_metric_id: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
export const event_definitionsMaxOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  key: SortOrderSchema.optional(),
  category: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  lifecycle_state: SortOrderSchema.optional(),
  source_kind: SortOrderSchema.optional(),
  owner_label: SortOrderSchema.optional(),
  tracked_metric_id: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
