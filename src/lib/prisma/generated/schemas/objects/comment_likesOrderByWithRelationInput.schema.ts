// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { commentsOrderByWithRelationInputObjectSchema } from './commentsOrderByWithRelationInput.schema'

export const comment_likesOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.comment_likesOrderByWithRelationInput, Prisma.comment_likesOrderByWithRelationInput> = z.object({
  comment_id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  comments: z.lazy(() => commentsOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const comment_likesOrderByWithRelationInputObjectZodSchema = z.object({
  comment_id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  comments: z.lazy(() => commentsOrderByWithRelationInputObjectSchema).optional()
}).strict();
