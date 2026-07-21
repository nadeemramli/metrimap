// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { comment_likesOrderByRelationAggregateInputObjectSchema } from './comment_likesOrderByRelationAggregateInput.schema';
import { comment_mentionsOrderByRelationAggregateInputObjectSchema } from './comment_mentionsOrderByRelationAggregateInput.schema';
import { commentsOrderByRelationAggregateInputObjectSchema } from './commentsOrderByRelationAggregateInput.schema';
import { comment_threadsOrderByWithRelationInputObjectSchema } from './comment_threadsOrderByWithRelationInput.schema'

export const commentsOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.commentsOrderByWithRelationInput, Prisma.commentsOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  thread_id: SortOrderSchema.optional(),
  author_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  content: SortOrderSchema.optional(),
  resolved: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  parent_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  comment_likes: z.lazy(() => comment_likesOrderByRelationAggregateInputObjectSchema).optional(),
  comment_mentions: z.lazy(() => comment_mentionsOrderByRelationAggregateInputObjectSchema).optional(),
  comments: z.lazy(() => commentsOrderByWithRelationInputObjectSchema).optional(),
  other_comments: z.lazy(() => commentsOrderByRelationAggregateInputObjectSchema).optional(),
  comment_threads: z.lazy(() => comment_threadsOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const commentsOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  thread_id: SortOrderSchema.optional(),
  author_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  content: SortOrderSchema.optional(),
  resolved: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  parent_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  comment_likes: z.lazy(() => comment_likesOrderByRelationAggregateInputObjectSchema).optional(),
  comment_mentions: z.lazy(() => comment_mentionsOrderByRelationAggregateInputObjectSchema).optional(),
  comments: z.lazy(() => commentsOrderByWithRelationInputObjectSchema).optional(),
  other_comments: z.lazy(() => commentsOrderByRelationAggregateInputObjectSchema).optional(),
  comment_threads: z.lazy(() => comment_threadsOrderByWithRelationInputObjectSchema).optional()
}).strict();
