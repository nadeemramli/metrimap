// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { ProjectsScalarRelationFilterObjectSchema } from './ProjectsScalarRelationFilter.schema';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema';
import { CommentsListRelationFilterObjectSchema } from './CommentsListRelationFilter.schema'

export const comment_threadsWhereInputObjectSchema: z.ZodType<Prisma.comment_threadsWhereInput, Prisma.comment_threadsWhereInput> = z.object({
  AND: z.union([z.lazy(() => comment_threadsWhereInputObjectSchema), z.lazy(() => comment_threadsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => comment_threadsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => comment_threadsWhereInputObjectSchema), z.lazy(() => comment_threadsWhereInputObjectSchema).array()]).optional(),
  project_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  source: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  context: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  is_resolved: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  created_by: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  projects: z.union([z.lazy(() => ProjectsScalarRelationFilterObjectSchema), z.lazy(() => projectsWhereInputObjectSchema)]).optional(),
  comments: z.lazy(() => CommentsListRelationFilterObjectSchema).optional()
}).strict();
export const comment_threadsWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => comment_threadsWhereInputObjectSchema), z.lazy(() => comment_threadsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => comment_threadsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => comment_threadsWhereInputObjectSchema), z.lazy(() => comment_threadsWhereInputObjectSchema).array()]).optional(),
  project_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  source: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  context: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  is_resolved: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  created_by: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  projects: z.union([z.lazy(() => ProjectsScalarRelationFilterObjectSchema), z.lazy(() => projectsWhereInputObjectSchema)]).optional(),
  comments: z.lazy(() => CommentsListRelationFilterObjectSchema).optional()
}).strict();
