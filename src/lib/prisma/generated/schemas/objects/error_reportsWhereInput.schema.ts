// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

export const error_reportsWhereInputObjectSchema: z.ZodType<Prisma.error_reportsWhereInput, Prisma.error_reportsWhereInput> = z.object({
  AND: z.union([z.lazy(() => error_reportsWhereInputObjectSchema), z.lazy(() => error_reportsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => error_reportsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => error_reportsWhereInputObjectSchema), z.lazy(() => error_reportsWhereInputObjectSchema).array()]).optional(),
  clerk_user_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  reporter_user_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  reporter_email: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  message: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  error_stack: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  component_stack: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  note: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  url: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  user_agent: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  client_time: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  fingerprint: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const error_reportsWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => error_reportsWhereInputObjectSchema), z.lazy(() => error_reportsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => error_reportsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => error_reportsWhereInputObjectSchema), z.lazy(() => error_reportsWhereInputObjectSchema).array()]).optional(),
  clerk_user_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  reporter_user_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  reporter_email: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  message: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  error_stack: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  component_stack: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  note: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  url: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  user_agent: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  client_time: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  fingerprint: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
