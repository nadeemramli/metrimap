import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const comment_mentionsOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.comment_mentionsOrderByWithRelationInput, Prisma.comment_mentionsOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  comment_id: SortOrderSchema.optional(),
  mentioned_user_id: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
export const comment_mentionsOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  comment_id: SortOrderSchema.optional(),
  mentioned_user_id: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
