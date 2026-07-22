// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidWithAggregatesFilterObjectSchema } from './UuidWithAggregatesFilter.schema';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

export const connector_cursorsScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.connector_cursorsScalarWhereWithAggregatesInput, Prisma.connector_cursorsScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => connector_cursorsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => connector_cursorsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => connector_cursorsScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => connector_cursorsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => connector_cursorsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  connected_account_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  connector_id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  stream: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  cursor: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  workspace_id: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
export const connector_cursorsScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => connector_cursorsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => connector_cursorsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => connector_cursorsScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => connector_cursorsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => connector_cursorsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  connected_account_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  connector_id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  stream: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  cursor: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  workspace_id: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
