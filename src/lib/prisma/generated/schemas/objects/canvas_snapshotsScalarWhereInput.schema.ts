// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { JsonFilterObjectSchema } from './JsonFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

export const canvas_snapshotsScalarWhereInputObjectSchema: z.ZodType<Prisma.canvas_snapshotsScalarWhereInput, Prisma.canvas_snapshotsScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => canvas_snapshotsScalarWhereInputObjectSchema), z.lazy(() => canvas_snapshotsScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => canvas_snapshotsScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => canvas_snapshotsScalarWhereInputObjectSchema), z.lazy(() => canvas_snapshotsScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  canvas_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  version: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  nodes: z.lazy(() => JsonFilterObjectSchema).optional(),
  edges: z.lazy(() => JsonFilterObjectSchema).optional(),
  groups: z.lazy(() => JsonFilterObjectSchema).optional(),
  metadata: z.lazy(() => JsonFilterObjectSchema).optional(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
export const canvas_snapshotsScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => canvas_snapshotsScalarWhereInputObjectSchema), z.lazy(() => canvas_snapshotsScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => canvas_snapshotsScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => canvas_snapshotsScalarWhereInputObjectSchema), z.lazy(() => canvas_snapshotsScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  canvas_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  version: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  nodes: z.lazy(() => JsonFilterObjectSchema).optional(),
  edges: z.lazy(() => JsonFilterObjectSchema).optional(),
  groups: z.lazy(() => JsonFilterObjectSchema).optional(),
  metadata: z.lazy(() => JsonFilterObjectSchema).optional(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
