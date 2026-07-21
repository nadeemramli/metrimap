// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema'

export const error_report_groupsWhereInputObjectSchema: z.ZodType<Prisma.error_report_groupsWhereInput, Prisma.error_report_groupsWhereInput> = z.object({
  AND: z.union([z.lazy(() => error_report_groupsWhereInputObjectSchema), z.lazy(() => error_report_groupsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => error_report_groupsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => error_report_groupsWhereInputObjectSchema), z.lazy(() => error_report_groupsWhereInputObjectSchema).array()]).optional(),
  fingerprint: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  title: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  first_seen_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  last_seen_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  occurrence_count: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  last_synced_count: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  severity: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  sample_report_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  linear_issue_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  linear_issue_identifier: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  linear_issue_url: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  sync_status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  sync_error: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  linear_synced_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
export const error_report_groupsWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => error_report_groupsWhereInputObjectSchema), z.lazy(() => error_report_groupsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => error_report_groupsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => error_report_groupsWhereInputObjectSchema), z.lazy(() => error_report_groupsWhereInputObjectSchema).array()]).optional(),
  fingerprint: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  title: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  first_seen_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  last_seen_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  occurrence_count: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  last_synced_count: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  severity: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  sample_report_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  linear_issue_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  linear_issue_identifier: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  linear_issue_url: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  sync_status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  sync_error: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  linear_synced_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
