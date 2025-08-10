import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableListFilterObjectSchema } from './StringNullableListFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema'

export const project_collaboratorsWhereInputObjectSchema: z.ZodType<Prisma.project_collaboratorsWhereInput, Prisma.project_collaboratorsWhereInput> = z.object({
  AND: z.union([z.lazy(() => project_collaboratorsWhereInputObjectSchema), z.lazy(() => project_collaboratorsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => project_collaboratorsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => project_collaboratorsWhereInputObjectSchema), z.lazy(() => project_collaboratorsWhereInputObjectSchema).array()]).optional(),
  project_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  user_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  role: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  permissions: z.lazy(() => StringNullableListFilterObjectSchema).optional(),
  invited_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.iso.datetime()])]).optional().nullable(),
  joined_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.iso.datetime()])]).optional().nullable()
}).strict();
export const project_collaboratorsWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => project_collaboratorsWhereInputObjectSchema), z.lazy(() => project_collaboratorsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => project_collaboratorsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => project_collaboratorsWhereInputObjectSchema), z.lazy(() => project_collaboratorsWhereInputObjectSchema).array()]).optional(),
  project_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  user_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  role: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  permissions: z.lazy(() => StringNullableListFilterObjectSchema).optional(),
  invited_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.iso.datetime()])]).optional().nullable(),
  joined_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.iso.datetime()])]).optional().nullable()
}).strict();
