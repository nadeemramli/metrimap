// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_accountsCreategranted_scopesInputObjectSchema } from './connected_accountsCreategranted_scopesInput.schema';
import { connected_account_secretsCreateNestedOneWithoutConnected_accountsInputObjectSchema } from './connected_account_secretsCreateNestedOneWithoutConnected_accountsInput.schema';
import { connector_cursorsCreateNestedManyWithoutConnected_accountsInputObjectSchema } from './connector_cursorsCreateNestedManyWithoutConnected_accountsInput.schema';
import { connector_runsCreateNestedManyWithoutConnected_accountsInputObjectSchema } from './connector_runsCreateNestedManyWithoutConnected_accountsInput.schema';
import { metric_bindingsCreateNestedManyWithoutConnected_accountsInputObjectSchema } from './metric_bindingsCreateNestedManyWithoutConnected_accountsInput.schema'

export const connected_accountsCreateInputObjectSchema: z.ZodType<Prisma.connected_accountsCreateInput, Prisma.connected_accountsCreateInput> = z.object({
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
  connected_account_secrets: z.lazy(() => connected_account_secretsCreateNestedOneWithoutConnected_accountsInputObjectSchema).optional(),
  connector_cursors: z.lazy(() => connector_cursorsCreateNestedManyWithoutConnected_accountsInputObjectSchema).optional(),
  connector_runs: z.lazy(() => connector_runsCreateNestedManyWithoutConnected_accountsInputObjectSchema).optional(),
  metric_bindings: z.lazy(() => metric_bindingsCreateNestedManyWithoutConnected_accountsInputObjectSchema).optional()
}).strict();
export const connected_accountsCreateInputObjectZodSchema = z.object({
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
  connected_account_secrets: z.lazy(() => connected_account_secretsCreateNestedOneWithoutConnected_accountsInputObjectSchema).optional(),
  connector_cursors: z.lazy(() => connector_cursorsCreateNestedManyWithoutConnected_accountsInputObjectSchema).optional(),
  connector_runs: z.lazy(() => connector_runsCreateNestedManyWithoutConnected_accountsInputObjectSchema).optional(),
  metric_bindings: z.lazy(() => metric_bindingsCreateNestedManyWithoutConnected_accountsInputObjectSchema).optional()
}).strict();
