// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidWithAggregatesFilterObjectSchema } from './UuidWithAggregatesFilter.schema';
import { IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { JsonWithAggregatesFilterObjectSchema } from './JsonWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

export const canvas_snapshotsScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.canvas_snapshotsScalarWhereWithAggregatesInput, Prisma.canvas_snapshotsScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => canvas_snapshotsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => canvas_snapshotsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => canvas_snapshotsScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => canvas_snapshotsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => canvas_snapshotsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  canvas_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  version: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  title: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  nodes: z.lazy(() => JsonWithAggregatesFilterObjectSchema).optional(),
  edges: z.lazy(() => JsonWithAggregatesFilterObjectSchema).optional(),
  groups: z.lazy(() => JsonWithAggregatesFilterObjectSchema).optional(),
  metadata: z.lazy(() => JsonWithAggregatesFilterObjectSchema).optional(),
  created_by: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
export const canvas_snapshotsScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => canvas_snapshotsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => canvas_snapshotsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => canvas_snapshotsScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => canvas_snapshotsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => canvas_snapshotsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  canvas_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  version: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  title: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  nodes: z.lazy(() => JsonWithAggregatesFilterObjectSchema).optional(),
  edges: z.lazy(() => JsonWithAggregatesFilterObjectSchema).optional(),
  groups: z.lazy(() => JsonWithAggregatesFilterObjectSchema).optional(),
  metadata: z.lazy(() => JsonWithAggregatesFilterObjectSchema).optional(),
  created_by: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
