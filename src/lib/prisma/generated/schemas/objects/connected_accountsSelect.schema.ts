// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_account_secretsArgsObjectSchema } from './connected_account_secretsArgs.schema';
import { Connector_cursorsFindManySchema } from '../findManyconnector_cursors.schema';
import { Connector_runsFindManySchema } from '../findManyconnector_runs.schema';
import { Metric_bindingsFindManySchema } from '../findManymetric_bindings.schema';
import { connected_accountsCountOutputTypeArgsObjectSchema } from './connected_accountsCountOutputTypeArgs.schema'

export const connected_accountsSelectObjectSchema: z.ZodType<Prisma.connected_accountsSelect, Prisma.connected_accountsSelect> = z.object({
  id: z.boolean().optional(),
  created_by: z.boolean().optional(),
  workspace_id: z.boolean().optional(),
  connector_id: z.boolean().optional(),
  auth_type: z.boolean().optional(),
  source_account_id: z.boolean().optional(),
  source_account_label: z.boolean().optional(),
  granted_scopes: z.boolean().optional(),
  status: z.boolean().optional(),
  status_detail: z.boolean().optional(),
  last_synced_at: z.boolean().optional(),
  last_query_at: z.boolean().optional(),
  revoked_at: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  connected_account_secrets: z.union([z.boolean(), z.lazy(() => connected_account_secretsArgsObjectSchema)]).optional(),
  connector_cursors: z.union([z.boolean(), z.lazy(() => Connector_cursorsFindManySchema)]).optional(),
  connector_runs: z.union([z.boolean(), z.lazy(() => Connector_runsFindManySchema)]).optional(),
  metric_bindings: z.union([z.boolean(), z.lazy(() => Metric_bindingsFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => connected_accountsCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const connected_accountsSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  created_by: z.boolean().optional(),
  workspace_id: z.boolean().optional(),
  connector_id: z.boolean().optional(),
  auth_type: z.boolean().optional(),
  source_account_id: z.boolean().optional(),
  source_account_label: z.boolean().optional(),
  granted_scopes: z.boolean().optional(),
  status: z.boolean().optional(),
  status_detail: z.boolean().optional(),
  last_synced_at: z.boolean().optional(),
  last_query_at: z.boolean().optional(),
  revoked_at: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  connected_account_secrets: z.union([z.boolean(), z.lazy(() => connected_account_secretsArgsObjectSchema)]).optional(),
  connector_cursors: z.union([z.boolean(), z.lazy(() => Connector_cursorsFindManySchema)]).optional(),
  connector_runs: z.union([z.boolean(), z.lazy(() => Connector_runsFindManySchema)]).optional(),
  metric_bindings: z.union([z.boolean(), z.lazy(() => Metric_bindingsFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => connected_accountsCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
