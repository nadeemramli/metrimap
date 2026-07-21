// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

export const event_definitionsScalarWhereInputObjectSchema: z.ZodType<Prisma.event_definitionsScalarWhereInput, Prisma.event_definitionsScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => event_definitionsScalarWhereInputObjectSchema), z.lazy(() => event_definitionsScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => event_definitionsScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => event_definitionsScalarWhereInputObjectSchema), z.lazy(() => event_definitionsScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  key: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  category: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  lifecycle_state: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  source_kind: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  owner_label: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  tracked_metric_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
export const event_definitionsScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => event_definitionsScalarWhereInputObjectSchema), z.lazy(() => event_definitionsScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => event_definitionsScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => event_definitionsScalarWhereInputObjectSchema), z.lazy(() => event_definitionsScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  key: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  category: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  lifecycle_state: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  source_kind: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  owner_label: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  tracked_metric_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
