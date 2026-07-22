// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { JsonFilterObjectSchema } from './JsonFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { ProjectsScalarRelationFilterObjectSchema } from './ProjectsScalarRelationFilter.schema';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema'

export const canvas_snapshotsWhereInputObjectSchema: z.ZodType<Prisma.canvas_snapshotsWhereInput, Prisma.canvas_snapshotsWhereInput> = z.object({
  AND: z.union([z.lazy(() => canvas_snapshotsWhereInputObjectSchema), z.lazy(() => canvas_snapshotsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => canvas_snapshotsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => canvas_snapshotsWhereInputObjectSchema), z.lazy(() => canvas_snapshotsWhereInputObjectSchema).array()]).optional(),
  canvas_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  version: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  nodes: z.lazy(() => JsonFilterObjectSchema).optional(),
  edges: z.lazy(() => JsonFilterObjectSchema).optional(),
  groups: z.lazy(() => JsonFilterObjectSchema).optional(),
  metadata: z.lazy(() => JsonFilterObjectSchema).optional(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  projects: z.union([z.lazy(() => ProjectsScalarRelationFilterObjectSchema), z.lazy(() => projectsWhereInputObjectSchema)]).optional()
}).strict();
export const canvas_snapshotsWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => canvas_snapshotsWhereInputObjectSchema), z.lazy(() => canvas_snapshotsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => canvas_snapshotsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => canvas_snapshotsWhereInputObjectSchema), z.lazy(() => canvas_snapshotsWhereInputObjectSchema).array()]).optional(),
  canvas_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  version: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  nodes: z.lazy(() => JsonFilterObjectSchema).optional(),
  edges: z.lazy(() => JsonFilterObjectSchema).optional(),
  groups: z.lazy(() => JsonFilterObjectSchema).optional(),
  metadata: z.lazy(() => JsonFilterObjectSchema).optional(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  projects: z.union([z.lazy(() => ProjectsScalarRelationFilterObjectSchema), z.lazy(() => projectsWhereInputObjectSchema)]).optional()
}).strict();
