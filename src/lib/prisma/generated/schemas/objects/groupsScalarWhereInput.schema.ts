// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { FloatFilterObjectSchema } from './FloatFilter.schema';
import { StringNullableListFilterObjectSchema } from './StringNullableListFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema'

export const groupsScalarWhereInputObjectSchema: z.ZodType<Prisma.groupsScalarWhereInput, Prisma.groupsScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => groupsScalarWhereInputObjectSchema), z.lazy(() => groupsScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => groupsScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => groupsScalarWhereInputObjectSchema), z.lazy(() => groupsScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  project_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  color: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  position_x: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  position_y: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  width: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  height: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  node_ids: z.lazy(() => StringNullableListFilterObjectSchema).optional(),
  created_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional()
}).strict();
export const groupsScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => groupsScalarWhereInputObjectSchema), z.lazy(() => groupsScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => groupsScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => groupsScalarWhereInputObjectSchema), z.lazy(() => groupsScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  project_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  color: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  position_x: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  position_y: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  width: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  height: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  node_ids: z.lazy(() => StringNullableListFilterObjectSchema).optional(),
  created_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional()
}).strict();
