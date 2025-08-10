import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema'

export const commentsOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.commentsOrderByWithRelationInput, Prisma.commentsOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  thread_id: SortOrderSchema.optional(),
  author_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  content: SortOrderSchema.optional(),
  resolved: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
export const commentsOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  thread_id: SortOrderSchema.optional(),
  author_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  content: SortOrderSchema.optional(),
  resolved: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
