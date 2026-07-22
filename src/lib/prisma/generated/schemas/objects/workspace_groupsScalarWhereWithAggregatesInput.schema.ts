// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

export const workspace_groupsScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.workspace_groupsScalarWhereWithAggregatesInput, Prisma.workspace_groupsScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => workspace_groupsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => workspace_groupsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => workspace_groupsScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => workspace_groupsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => workspace_groupsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  workspace_id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  color: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
export const workspace_groupsScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => workspace_groupsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => workspace_groupsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => workspace_groupsScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => workspace_groupsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => workspace_groupsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  workspace_id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  color: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
