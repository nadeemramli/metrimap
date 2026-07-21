// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

export const spacesScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.spacesScalarWhereWithAggregatesInput, Prisma.spacesScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => spacesScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => spacesScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => spacesScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => spacesScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => spacesScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  created_by: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  color: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  sort_order: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  workspace_id: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const spacesScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => spacesScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => spacesScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => spacesScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => spacesScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => spacesScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  created_by: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  color: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  sort_order: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  workspace_id: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
