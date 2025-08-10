import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const metric_card_tagsMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.metric_card_tagsMinOrderByAggregateInput, Prisma.metric_card_tagsMinOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  metric_card_id: SortOrderSchema.optional(),
  tag_id: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
export const metric_card_tagsMinOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  metric_card_id: SortOrderSchema.optional(),
  tag_id: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
