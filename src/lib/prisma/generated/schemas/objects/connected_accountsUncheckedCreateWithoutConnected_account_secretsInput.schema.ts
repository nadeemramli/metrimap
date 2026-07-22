// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_accountsCreategranted_scopesInputObjectSchema } from './connected_accountsCreategranted_scopesInput.schema';
import { connector_cursorsUncheckedCreateNestedManyWithoutConnected_accountsInputObjectSchema } from './connector_cursorsUncheckedCreateNestedManyWithoutConnected_accountsInput.schema';
import { connector_runsUncheckedCreateNestedManyWithoutConnected_accountsInputObjectSchema } from './connector_runsUncheckedCreateNestedManyWithoutConnected_accountsInput.schema';
import { metric_bindingsUncheckedCreateNestedManyWithoutConnected_accountsInputObjectSchema } from './metric_bindingsUncheckedCreateNestedManyWithoutConnected_accountsInput.schema'

export const connected_accountsUncheckedCreateWithoutConnected_account_secretsInputObjectSchema: z.ZodType<Prisma.connected_accountsUncheckedCreateWithoutConnected_account_secretsInput, Prisma.connected_accountsUncheckedCreateWithoutConnected_account_secretsInput> = z.object({
  id: z.string().optional(),
  created_by: z.string().optional(),
  workspace_id: z.string().optional().nullable(),
  connector_id: z.string(),
  auth_type: z.string(),
  source_account_id: z.string().optional().nullable(),
  source_account_label: z.string().optional().nullable(),
  granted_scopes: z.union([z.lazy(() => connected_accountsCreategranted_scopesInputObjectSchema), z.string().array()]).optional(),
  status: z.string().optional(),
  status_detail: z.string().optional().nullable(),
  last_synced_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  last_query_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  revoked_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  connector_cursors: z.lazy(() => connector_cursorsUncheckedCreateNestedManyWithoutConnected_accountsInputObjectSchema).optional(),
  connector_runs: z.lazy(() => connector_runsUncheckedCreateNestedManyWithoutConnected_accountsInputObjectSchema).optional(),
  metric_bindings: z.lazy(() => metric_bindingsUncheckedCreateNestedManyWithoutConnected_accountsInputObjectSchema).optional()
}).strict();
export const connected_accountsUncheckedCreateWithoutConnected_account_secretsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  created_by: z.string().optional(),
  workspace_id: z.string().optional().nullable(),
  connector_id: z.string(),
  auth_type: z.string(),
  source_account_id: z.string().optional().nullable(),
  source_account_label: z.string().optional().nullable(),
  granted_scopes: z.union([z.lazy(() => connected_accountsCreategranted_scopesInputObjectSchema), z.string().array()]).optional(),
  status: z.string().optional(),
  status_detail: z.string().optional().nullable(),
  last_synced_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  last_query_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  revoked_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  connector_cursors: z.lazy(() => connector_cursorsUncheckedCreateNestedManyWithoutConnected_accountsInputObjectSchema).optional(),
  connector_runs: z.lazy(() => connector_runsUncheckedCreateNestedManyWithoutConnected_accountsInputObjectSchema).optional(),
  metric_bindings: z.lazy(() => metric_bindingsUncheckedCreateNestedManyWithoutConnected_accountsInputObjectSchema).optional()
}).strict();
