// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsArgsObjectSchema } from './projectsArgs.schema';
import { CommentsFindManySchema } from '../findManycomments.schema';
import { comment_threadsCountOutputTypeArgsObjectSchema } from './comment_threadsCountOutputTypeArgs.schema'

export const comment_threadsSelectObjectSchema: z.ZodType<Prisma.comment_threadsSelect, Prisma.comment_threadsSelect> = z.object({
  id: z.boolean().optional(),
  project_id: z.boolean().optional(),
  source: z.boolean().optional(),
  context: z.boolean().optional(),
  is_resolved: z.boolean().optional(),
  created_by: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional(),
  comments: z.union([z.boolean(), z.lazy(() => CommentsFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => comment_threadsCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const comment_threadsSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  project_id: z.boolean().optional(),
  source: z.boolean().optional(),
  context: z.boolean().optional(),
  is_resolved: z.boolean().optional(),
  created_by: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional(),
  comments: z.union([z.boolean(), z.lazy(() => CommentsFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => comment_threadsCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
