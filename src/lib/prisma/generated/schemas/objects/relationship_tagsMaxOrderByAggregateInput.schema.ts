import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const relationship_tagsMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.relationship_tagsMaxOrderByAggregateInput, Prisma.relationship_tagsMaxOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  relationship_id: SortOrderSchema.optional(),
  tag_id: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
export const relationship_tagsMaxOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  relationship_id: SortOrderSchema.optional(),
  tag_id: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
