// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { StringNullableListFilterObjectSchema } from './StringNullableListFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { Connected_account_secretsNullableScalarRelationFilterObjectSchema } from './Connected_account_secretsNullableScalarRelationFilter.schema';
import { connected_account_secretsWhereInputObjectSchema } from './connected_account_secretsWhereInput.schema';
import { Connector_cursorsListRelationFilterObjectSchema } from './Connector_cursorsListRelationFilter.schema';
import { Connector_runsListRelationFilterObjectSchema } from './Connector_runsListRelationFilter.schema';
import { Metric_bindingsListRelationFilterObjectSchema } from './Metric_bindingsListRelationFilter.schema'

export const connected_accountsWhereInputObjectSchema: z.ZodType<Prisma.connected_accountsWhereInput, Prisma.connected_accountsWhereInput> = z.object({
  AND: z.union([z.lazy(() => connected_accountsWhereInputObjectSchema), z.lazy(() => connected_accountsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => connected_accountsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => connected_accountsWhereInputObjectSchema), z.lazy(() => connected_accountsWhereInputObjectSchema).array()]).optional(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  workspace_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  connector_id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  auth_type: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  source_account_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  source_account_label: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  granted_scopes: z.lazy(() => StringNullableListFilterObjectSchema).optional(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  status_detail: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  last_synced_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  last_query_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  revoked_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  connected_account_secrets: z.union([z.lazy(() => Connected_account_secretsNullableScalarRelationFilterObjectSchema), z.lazy(() => connected_account_secretsWhereInputObjectSchema)]).optional().nullable(),
  connector_cursors: z.lazy(() => Connector_cursorsListRelationFilterObjectSchema).optional(),
  connector_runs: z.lazy(() => Connector_runsListRelationFilterObjectSchema).optional(),
  metric_bindings: z.lazy(() => Metric_bindingsListRelationFilterObjectSchema).optional()
}).strict();
export const connected_accountsWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => connected_accountsWhereInputObjectSchema), z.lazy(() => connected_accountsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => connected_accountsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => connected_accountsWhereInputObjectSchema), z.lazy(() => connected_accountsWhereInputObjectSchema).array()]).optional(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  workspace_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  connector_id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  auth_type: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  source_account_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  source_account_label: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  granted_scopes: z.lazy(() => StringNullableListFilterObjectSchema).optional(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  status_detail: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  last_synced_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  last_query_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  revoked_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  connected_account_secrets: z.union([z.lazy(() => Connected_account_secretsNullableScalarRelationFilterObjectSchema), z.lazy(() => connected_account_secretsWhereInputObjectSchema)]).optional().nullable(),
  connector_cursors: z.lazy(() => Connector_cursorsListRelationFilterObjectSchema).optional(),
  connector_runs: z.lazy(() => Connector_runsListRelationFilterObjectSchema).optional(),
  metric_bindings: z.lazy(() => Metric_bindingsListRelationFilterObjectSchema).optional()
}).strict();
