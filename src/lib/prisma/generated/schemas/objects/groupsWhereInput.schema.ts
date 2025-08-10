import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { FloatFilterObjectSchema } from './FloatFilter.schema';
import { StringNullableListFilterObjectSchema } from './StringNullableListFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema'

export const groupsWhereInputObjectSchema: z.ZodType<Prisma.groupsWhereInput, Prisma.groupsWhereInput> = z.object({
  AND: z.union([z.lazy(() => groupsWhereInputObjectSchema), z.lazy(() => groupsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => groupsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => groupsWhereInputObjectSchema), z.lazy(() => groupsWhereInputObjectSchema).array()]).optional(),
  project_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  color: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  position_x: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  position_y: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  width: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  height: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  node_ids: z.lazy(() => StringNullableListFilterObjectSchema).optional(),
  created_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.iso.datetime()])]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.iso.datetime()])]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional()
}).strict();
export const groupsWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => groupsWhereInputObjectSchema), z.lazy(() => groupsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => groupsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => groupsWhereInputObjectSchema), z.lazy(() => groupsWhereInputObjectSchema).array()]).optional(),
  project_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  color: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  position_x: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  position_y: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  width: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  height: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  node_ids: z.lazy(() => StringNullableListFilterObjectSchema).optional(),
  created_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.iso.datetime()])]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.iso.datetime()])]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional()
}).strict();
