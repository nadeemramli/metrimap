// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema';
import { IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

export const connector_runsScalarWhereInputObjectSchema: z.ZodType<Prisma.connector_runsScalarWhereInput, Prisma.connector_runsScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => connector_runsScalarWhereInputObjectSchema), z.lazy(() => connector_runsScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => connector_runsScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => connector_runsScalarWhereInputObjectSchema), z.lazy(() => connector_runsScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  workspace_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  connected_account_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  connector_id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  stream: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  event: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  sync_mode: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  pages: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  fetched: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  accepted: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  skipped: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  rejected: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  materialized: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  cursor: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  error_class: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  error_message: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  resumable: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  duration_ms: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  started_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  finished_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
export const connector_runsScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => connector_runsScalarWhereInputObjectSchema), z.lazy(() => connector_runsScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => connector_runsScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => connector_runsScalarWhereInputObjectSchema), z.lazy(() => connector_runsScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  workspace_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  connected_account_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  connector_id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  stream: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  event: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  sync_mode: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  pages: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  fetched: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  accepted: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  skipped: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  rejected: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  materialized: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  cursor: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  error_class: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  error_message: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  resumable: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  duration_ms: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  started_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  finished_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
