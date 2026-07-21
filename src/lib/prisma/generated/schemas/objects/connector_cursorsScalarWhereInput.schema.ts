// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

export const connector_cursorsScalarWhereInputObjectSchema: z.ZodType<Prisma.connector_cursorsScalarWhereInput, Prisma.connector_cursorsScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => connector_cursorsScalarWhereInputObjectSchema), z.lazy(() => connector_cursorsScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => connector_cursorsScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => connector_cursorsScalarWhereInputObjectSchema), z.lazy(() => connector_cursorsScalarWhereInputObjectSchema).array()]).optional(),
  connected_account_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  connector_id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  stream: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  cursor: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  workspace_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
export const connector_cursorsScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => connector_cursorsScalarWhereInputObjectSchema), z.lazy(() => connector_cursorsScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => connector_cursorsScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => connector_cursorsScalarWhereInputObjectSchema), z.lazy(() => connector_cursorsScalarWhereInputObjectSchema).array()]).optional(),
  connected_account_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  connector_id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  stream: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  cursor: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  workspace_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
