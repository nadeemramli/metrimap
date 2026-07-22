// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { projectsOrderByWithRelationInputObjectSchema } from './projectsOrderByWithRelationInput.schema';
import { commentsOrderByRelationAggregateInputObjectSchema } from './commentsOrderByRelationAggregateInput.schema'

export const comment_threadsOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.comment_threadsOrderByWithRelationInput, Prisma.comment_threadsOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  source: SortOrderSchema.optional(),
  context: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  is_resolved: SortOrderSchema.optional(),
  created_by: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  projects: z.lazy(() => projectsOrderByWithRelationInputObjectSchema).optional(),
  comments: z.lazy(() => commentsOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const comment_threadsOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  source: SortOrderSchema.optional(),
  context: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  is_resolved: SortOrderSchema.optional(),
  created_by: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  projects: z.lazy(() => projectsOrderByWithRelationInputObjectSchema).optional(),
  comments: z.lazy(() => commentsOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
