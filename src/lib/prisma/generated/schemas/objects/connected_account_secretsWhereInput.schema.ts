// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { Connected_accountsScalarRelationFilterObjectSchema } from './Connected_accountsScalarRelationFilter.schema';
import { connected_accountsWhereInputObjectSchema } from './connected_accountsWhereInput.schema'

export const connected_account_secretsWhereInputObjectSchema: z.ZodType<Prisma.connected_account_secretsWhereInput, Prisma.connected_account_secretsWhereInput> = z.object({
  AND: z.union([z.lazy(() => connected_account_secretsWhereInputObjectSchema), z.lazy(() => connected_account_secretsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => connected_account_secretsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => connected_account_secretsWhereInputObjectSchema), z.lazy(() => connected_account_secretsWhereInputObjectSchema).array()]).optional(),
  account_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  access_token: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  refresh_token: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  api_key: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  token_type: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  expires_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  connected_accounts: z.union([z.lazy(() => Connected_accountsScalarRelationFilterObjectSchema), z.lazy(() => connected_accountsWhereInputObjectSchema)]).optional()
}).strict();
export const connected_account_secretsWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => connected_account_secretsWhereInputObjectSchema), z.lazy(() => connected_account_secretsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => connected_account_secretsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => connected_account_secretsWhereInputObjectSchema), z.lazy(() => connected_account_secretsWhereInputObjectSchema).array()]).optional(),
  account_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  access_token: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  refresh_token: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  api_key: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  token_type: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  expires_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  connected_accounts: z.union([z.lazy(() => Connected_accountsScalarRelationFilterObjectSchema), z.lazy(() => connected_accountsWhereInputObjectSchema)]).optional()
}).strict();
