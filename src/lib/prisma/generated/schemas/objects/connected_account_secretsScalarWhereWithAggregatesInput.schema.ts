// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidWithAggregatesFilterObjectSchema } from './UuidWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { DateTimeNullableWithAggregatesFilterObjectSchema } from './DateTimeNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

export const connected_account_secretsScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.connected_account_secretsScalarWhereWithAggregatesInput, Prisma.connected_account_secretsScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => connected_account_secretsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => connected_account_secretsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => connected_account_secretsScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => connected_account_secretsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => connected_account_secretsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  account_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  access_token: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  refresh_token: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  api_key: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  token_type: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  expires_at: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
export const connected_account_secretsScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => connected_account_secretsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => connected_account_secretsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => connected_account_secretsScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => connected_account_secretsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => connected_account_secretsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  account_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  access_token: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  refresh_token: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  api_key: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  token_type: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  expires_at: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
