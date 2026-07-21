// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidWithAggregatesFilterObjectSchema } from './UuidWithAggregatesFilter.schema';
import { UuidNullableWithAggregatesFilterObjectSchema } from './UuidNullableWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { FloatNullableWithAggregatesFilterObjectSchema } from './FloatNullableWithAggregatesFilter.schema';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

export const relationship_historyScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.relationship_historyScalarWhereWithAggregatesInput, Prisma.relationship_historyScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => relationship_historyScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => relationship_historyScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => relationship_historyScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => relationship_historyScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => relationship_historyScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  relationship_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  project_id: z.union([z.lazy(() => UuidNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  type: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  confidence: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  weight: z.union([z.lazy(() => FloatNullableWithAggregatesFilterObjectSchema), z.number()]).optional().nullable(),
  changed_by: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
export const relationship_historyScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => relationship_historyScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => relationship_historyScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => relationship_historyScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => relationship_historyScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => relationship_historyScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  relationship_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  project_id: z.union([z.lazy(() => UuidNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  type: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  confidence: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  weight: z.union([z.lazy(() => FloatNullableWithAggregatesFilterObjectSchema), z.number()]).optional().nullable(),
  changed_by: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
