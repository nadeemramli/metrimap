// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema'

export const changelogScalarWhereInputObjectSchema: z.ZodType<Prisma.changelogScalarWhereInput, Prisma.changelogScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => changelogScalarWhereInputObjectSchema), z.lazy(() => changelogScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => changelogScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => changelogScalarWhereInputObjectSchema), z.lazy(() => changelogScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  project_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  user_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  action: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  target: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  target_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  target_name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  metadata: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  timestamp: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable()
}).strict();
export const changelogScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => changelogScalarWhereInputObjectSchema), z.lazy(() => changelogScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => changelogScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => changelogScalarWhereInputObjectSchema), z.lazy(() => changelogScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  project_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  user_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  action: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  target: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  target_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  target_name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  metadata: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  timestamp: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable()
}).strict();
