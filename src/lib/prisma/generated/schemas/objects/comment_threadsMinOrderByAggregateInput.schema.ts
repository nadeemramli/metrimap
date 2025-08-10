import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const comment_threadsMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.comment_threadsMinOrderByAggregateInput, Prisma.comment_threadsMinOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  source: SortOrderSchema.optional(),
  is_resolved: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
export const comment_threadsMinOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  source: SortOrderSchema.optional(),
  is_resolved: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
