import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const metric_cardsCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.metric_cardsCountOrderByAggregateInput, Prisma.metric_cardsCountOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  category: SortOrderSchema.optional(),
  sub_category: SortOrderSchema.optional(),
  position_x: SortOrderSchema.optional(),
  position_y: SortOrderSchema.optional(),
  data: SortOrderSchema.optional(),
  source_type: SortOrderSchema.optional(),
  formula: SortOrderSchema.optional(),
  causal_factors: SortOrderSchema.optional(),
  dimensions: SortOrderSchema.optional(),
  owner_id: SortOrderSchema.optional(),
  assignees: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional()
}).strict();
export const metric_cardsCountOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  category: SortOrderSchema.optional(),
  sub_category: SortOrderSchema.optional(),
  position_x: SortOrderSchema.optional(),
  position_y: SortOrderSchema.optional(),
  data: SortOrderSchema.optional(),
  source_type: SortOrderSchema.optional(),
  formula: SortOrderSchema.optional(),
  causal_factors: SortOrderSchema.optional(),
  dimensions: SortOrderSchema.optional(),
  owner_id: SortOrderSchema.optional(),
  assignees: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional()
}).strict();
