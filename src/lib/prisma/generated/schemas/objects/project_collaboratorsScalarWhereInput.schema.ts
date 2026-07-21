// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableListFilterObjectSchema } from './StringNullableListFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema'

export const project_collaboratorsScalarWhereInputObjectSchema: z.ZodType<Prisma.project_collaboratorsScalarWhereInput, Prisma.project_collaboratorsScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => project_collaboratorsScalarWhereInputObjectSchema), z.lazy(() => project_collaboratorsScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => project_collaboratorsScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => project_collaboratorsScalarWhereInputObjectSchema), z.lazy(() => project_collaboratorsScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  project_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  user_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  role: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  permissions: z.lazy(() => StringNullableListFilterObjectSchema).optional(),
  invited_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  joined_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable()
}).strict();
export const project_collaboratorsScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => project_collaboratorsScalarWhereInputObjectSchema), z.lazy(() => project_collaboratorsScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => project_collaboratorsScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => project_collaboratorsScalarWhereInputObjectSchema), z.lazy(() => project_collaboratorsScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  project_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  user_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  role: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  permissions: z.lazy(() => StringNullableListFilterObjectSchema).optional(),
  invited_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  joined_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable()
}).strict();
