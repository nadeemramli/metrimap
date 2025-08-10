import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const metric_cardsMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.metric_cardsMinOrderByAggregateInput, Prisma.metric_cardsMinOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  category: SortOrderSchema.optional(),
  sub_category: SortOrderSchema.optional(),
  position_x: SortOrderSchema.optional(),
  position_y: SortOrderSchema.optional(),
  source_type: SortOrderSchema.optional(),
  formula: SortOrderSchema.optional(),
  owner_id: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional()
}).strict();
export const metric_cardsMinOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  category: SortOrderSchema.optional(),
  sub_category: SortOrderSchema.optional(),
  position_x: SortOrderSchema.optional(),
  position_y: SortOrderSchema.optional(),
  source_type: SortOrderSchema.optional(),
  formula: SortOrderSchema.optional(),
  owner_id: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional()
}).strict();
