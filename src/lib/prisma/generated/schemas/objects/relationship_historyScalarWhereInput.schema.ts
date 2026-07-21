// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { FloatNullableFilterObjectSchema } from './FloatNullableFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

export const relationship_historyScalarWhereInputObjectSchema: z.ZodType<Prisma.relationship_historyScalarWhereInput, Prisma.relationship_historyScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => relationship_historyScalarWhereInputObjectSchema), z.lazy(() => relationship_historyScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => relationship_historyScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => relationship_historyScalarWhereInputObjectSchema), z.lazy(() => relationship_historyScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  relationship_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  project_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  type: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  confidence: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  weight: z.union([z.lazy(() => FloatNullableFilterObjectSchema), z.number()]).optional().nullable(),
  changed_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
export const relationship_historyScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => relationship_historyScalarWhereInputObjectSchema), z.lazy(() => relationship_historyScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => relationship_historyScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => relationship_historyScalarWhereInputObjectSchema), z.lazy(() => relationship_historyScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  relationship_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  project_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  type: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  confidence: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  weight: z.union([z.lazy(() => FloatNullableFilterObjectSchema), z.number()]).optional().nullable(),
  changed_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
