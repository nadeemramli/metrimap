import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const comment_threadsCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.comment_threadsCountOrderByAggregateInput, Prisma.comment_threadsCountOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  source: SortOrderSchema.optional(),
  context: SortOrderSchema.optional(),
  is_resolved: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
export const comment_threadsCountOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  source: SortOrderSchema.optional(),
  context: SortOrderSchema.optional(),
  is_resolved: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
