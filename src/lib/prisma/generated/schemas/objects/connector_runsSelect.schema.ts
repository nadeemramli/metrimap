// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_accountsArgsObjectSchema } from './connected_accountsArgs.schema'

export const connector_runsSelectObjectSchema: z.ZodType<Prisma.connector_runsSelect, Prisma.connector_runsSelect> = z.object({
  id: z.boolean().optional(),
  created_by: z.boolean().optional(),
  workspace_id: z.boolean().optional(),
  connected_account_id: z.boolean().optional(),
  connector_id: z.boolean().optional(),
  stream: z.boolean().optional(),
  event: z.boolean().optional(),
  status: z.boolean().optional(),
  sync_mode: z.boolean().optional(),
  pages: z.boolean().optional(),
  fetched: z.boolean().optional(),
  accepted: z.boolean().optional(),
  skipped: z.boolean().optional(),
  rejected: z.boolean().optional(),
  materialized: z.boolean().optional(),
  cursor: z.boolean().optional(),
  error_class: z.boolean().optional(),
  error_message: z.boolean().optional(),
  resumable: z.boolean().optional(),
  duration_ms: z.boolean().optional(),
  started_at: z.boolean().optional(),
  finished_at: z.boolean().optional(),
  created_at: z.boolean().optional(),
  connected_accounts: z.union([z.boolean(), z.lazy(() => connected_accountsArgsObjectSchema)]).optional()
}).strict();
export const connector_runsSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  created_by: z.boolean().optional(),
  workspace_id: z.boolean().optional(),
  connected_account_id: z.boolean().optional(),
  connector_id: z.boolean().optional(),
  stream: z.boolean().optional(),
  event: z.boolean().optional(),
  status: z.boolean().optional(),
  sync_mode: z.boolean().optional(),
  pages: z.boolean().optional(),
  fetched: z.boolean().optional(),
  accepted: z.boolean().optional(),
  skipped: z.boolean().optional(),
  rejected: z.boolean().optional(),
  materialized: z.boolean().optional(),
  cursor: z.boolean().optional(),
  error_class: z.boolean().optional(),
  error_message: z.boolean().optional(),
  resumable: z.boolean().optional(),
  duration_ms: z.boolean().optional(),
  started_at: z.boolean().optional(),
  finished_at: z.boolean().optional(),
  created_at: z.boolean().optional(),
  connected_accounts: z.union([z.boolean(), z.lazy(() => connected_accountsArgsObjectSchema)]).optional()
}).strict();
