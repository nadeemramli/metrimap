// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { FloatNullableFilterObjectSchema } from './FloatNullableFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { ProjectsNullableScalarRelationFilterObjectSchema } from './ProjectsNullableScalarRelationFilter.schema';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema';
import { RelationshipsScalarRelationFilterObjectSchema } from './RelationshipsScalarRelationFilter.schema';
import { relationshipsWhereInputObjectSchema } from './relationshipsWhereInput.schema'

export const relationship_historyWhereInputObjectSchema: z.ZodType<Prisma.relationship_historyWhereInput, Prisma.relationship_historyWhereInput> = z.object({
  AND: z.union([z.lazy(() => relationship_historyWhereInputObjectSchema), z.lazy(() => relationship_historyWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => relationship_historyWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => relationship_historyWhereInputObjectSchema), z.lazy(() => relationship_historyWhereInputObjectSchema).array()]).optional(),
  relationship_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  project_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  type: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  confidence: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  weight: z.union([z.lazy(() => FloatNullableFilterObjectSchema), z.number()]).optional().nullable(),
  changed_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  projects: z.union([z.lazy(() => ProjectsNullableScalarRelationFilterObjectSchema), z.lazy(() => projectsWhereInputObjectSchema)]).optional().nullable(),
  relationships: z.union([z.lazy(() => RelationshipsScalarRelationFilterObjectSchema), z.lazy(() => relationshipsWhereInputObjectSchema)]).optional()
}).strict();
export const relationship_historyWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => relationship_historyWhereInputObjectSchema), z.lazy(() => relationship_historyWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => relationship_historyWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => relationship_historyWhereInputObjectSchema), z.lazy(() => relationship_historyWhereInputObjectSchema).array()]).optional(),
  relationship_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  project_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  type: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  confidence: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  weight: z.union([z.lazy(() => FloatNullableFilterObjectSchema), z.number()]).optional().nullable(),
  changed_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  projects: z.union([z.lazy(() => ProjectsNullableScalarRelationFilterObjectSchema), z.lazy(() => projectsWhereInputObjectSchema)]).optional().nullable(),
  relationships: z.union([z.lazy(() => RelationshipsScalarRelationFilterObjectSchema), z.lazy(() => relationshipsWhereInputObjectSchema)]).optional()
}).strict();
