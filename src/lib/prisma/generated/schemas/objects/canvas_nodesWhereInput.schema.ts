// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { FloatFilterObjectSchema } from './FloatFilter.schema';
import { JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { ProjectsScalarRelationFilterObjectSchema } from './ProjectsScalarRelationFilter.schema';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema'

export const canvas_nodesWhereInputObjectSchema: z.ZodType<Prisma.canvas_nodesWhereInput, Prisma.canvas_nodesWhereInput> = z.object({
  AND: z.union([z.lazy(() => canvas_nodesWhereInputObjectSchema), z.lazy(() => canvas_nodesWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => canvas_nodesWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => canvas_nodesWhereInputObjectSchema), z.lazy(() => canvas_nodesWhereInputObjectSchema).array()]).optional(),
  project_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  node_type: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  title: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  position_x: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  position_y: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  data: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  updated_by: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  z_index: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  projects: z.union([z.lazy(() => ProjectsScalarRelationFilterObjectSchema), z.lazy(() => projectsWhereInputObjectSchema)]).optional()
}).strict();
export const canvas_nodesWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => canvas_nodesWhereInputObjectSchema), z.lazy(() => canvas_nodesWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => canvas_nodesWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => canvas_nodesWhereInputObjectSchema), z.lazy(() => canvas_nodesWhereInputObjectSchema).array()]).optional(),
  project_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  node_type: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  title: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  position_x: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  position_y: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  data: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  updated_by: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  z_index: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  projects: z.union([z.lazy(() => ProjectsScalarRelationFilterObjectSchema), z.lazy(() => projectsWhereInputObjectSchema)]).optional()
}).strict();
