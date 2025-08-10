import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const relationship_tagsCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.relationship_tagsCountOrderByAggregateInput, Prisma.relationship_tagsCountOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  relationship_id: SortOrderSchema.optional(),
  tag_id: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
export const relationship_tagsCountOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  relationship_id: SortOrderSchema.optional(),
  tag_id: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
