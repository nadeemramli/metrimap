// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { Connected_accountsScalarRelationFilterObjectSchema } from './Connected_accountsScalarRelationFilter.schema';
import { connected_accountsWhereInputObjectSchema } from './connected_accountsWhereInput.schema'

export const connector_cursorsWhereInputObjectSchema: z.ZodType<Prisma.connector_cursorsWhereInput, Prisma.connector_cursorsWhereInput> = z.object({
  AND: z.union([z.lazy(() => connector_cursorsWhereInputObjectSchema), z.lazy(() => connector_cursorsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => connector_cursorsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => connector_cursorsWhereInputObjectSchema), z.lazy(() => connector_cursorsWhereInputObjectSchema).array()]).optional(),
  connected_account_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  connector_id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  stream: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  cursor: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  workspace_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  connected_accounts: z.union([z.lazy(() => Connected_accountsScalarRelationFilterObjectSchema), z.lazy(() => connected_accountsWhereInputObjectSchema)]).optional()
}).strict();
export const connector_cursorsWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => connector_cursorsWhereInputObjectSchema), z.lazy(() => connector_cursorsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => connector_cursorsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => connector_cursorsWhereInputObjectSchema), z.lazy(() => connector_cursorsWhereInputObjectSchema).array()]).optional(),
  connected_account_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  connector_id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  stream: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  cursor: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  workspace_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  connected_accounts: z.union([z.lazy(() => Connected_accountsScalarRelationFilterObjectSchema), z.lazy(() => connected_accountsWhereInputObjectSchema)]).optional()
}).strict();
