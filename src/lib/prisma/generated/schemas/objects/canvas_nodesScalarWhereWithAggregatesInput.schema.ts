// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidWithAggregatesFilterObjectSchema } from './UuidWithAggregatesFilter.schema';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { FloatWithAggregatesFilterObjectSchema } from './FloatWithAggregatesFilter.schema';
import { JsonNullableWithAggregatesFilterObjectSchema } from './JsonNullableWithAggregatesFilter.schema';
import { DateTimeNullableWithAggregatesFilterObjectSchema } from './DateTimeNullableWithAggregatesFilter.schema'

export const canvas_nodesScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.canvas_nodesScalarWhereWithAggregatesInput, Prisma.canvas_nodesScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => canvas_nodesScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => canvas_nodesScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => canvas_nodesScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => canvas_nodesScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => canvas_nodesScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  project_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  node_type: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  title: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  position_x: z.union([z.lazy(() => FloatWithAggregatesFilterObjectSchema), z.number()]).optional(),
  position_y: z.union([z.lazy(() => FloatWithAggregatesFilterObjectSchema), z.number()]).optional(),
  data: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
  created_at: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.union([z.date(), z.iso.datetime()])]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.union([z.date(), z.iso.datetime()])]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional()
}).strict();
export const canvas_nodesScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => canvas_nodesScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => canvas_nodesScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => canvas_nodesScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => canvas_nodesScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => canvas_nodesScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  project_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  node_type: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  title: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  position_x: z.union([z.lazy(() => FloatWithAggregatesFilterObjectSchema), z.number()]).optional(),
  position_y: z.union([z.lazy(() => FloatWithAggregatesFilterObjectSchema), z.number()]).optional(),
  data: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
  created_at: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.union([z.date(), z.iso.datetime()])]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.union([z.date(), z.iso.datetime()])]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional()
}).strict();
