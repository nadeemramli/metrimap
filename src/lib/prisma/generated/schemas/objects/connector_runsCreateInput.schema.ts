// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_accountsCreateNestedOneWithoutConnector_runsInputObjectSchema } from './connected_accountsCreateNestedOneWithoutConnector_runsInput.schema'

export const connector_runsCreateInputObjectSchema: z.ZodType<Prisma.connector_runsCreateInput, Prisma.connector_runsCreateInput> = z.object({
  id: z.string().optional(),
  created_by: z.string().optional(),
  workspace_id: z.string().optional().nullable(),
  connector_id: z.string(),
  stream: z.string().optional().nullable(),
  event: z.string(),
  status: z.string().optional(),
  sync_mode: z.string().optional().nullable(),
  pages: z.number().int().optional(),
  fetched: z.number().int().optional(),
  accepted: z.number().int().optional(),
  skipped: z.number().int().optional(),
  rejected: z.number().int().optional(),
  materialized: z.number().int().optional(),
  cursor: z.string().optional().nullable(),
  error_class: z.string().optional().nullable(),
  error_message: z.string().optional().nullable(),
  resumable: z.boolean().optional(),
  duration_ms: z.number().int().optional().nullable(),
  started_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  finished_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  connected_accounts: z.lazy(() => connected_accountsCreateNestedOneWithoutConnector_runsInputObjectSchema).optional()
}).strict();
export const connector_runsCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  created_by: z.string().optional(),
  workspace_id: z.string().optional().nullable(),
  connector_id: z.string(),
  stream: z.string().optional().nullable(),
  event: z.string(),
  status: z.string().optional(),
  sync_mode: z.string().optional().nullable(),
  pages: z.number().int().optional(),
  fetched: z.number().int().optional(),
  accepted: z.number().int().optional(),
  skipped: z.number().int().optional(),
  rejected: z.number().int().optional(),
  materialized: z.number().int().optional(),
  cursor: z.string().optional().nullable(),
  error_class: z.string().optional().nullable(),
  error_message: z.string().optional().nullable(),
  resumable: z.boolean().optional(),
  duration_ms: z.number().int().optional().nullable(),
  started_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  finished_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  connected_accounts: z.lazy(() => connected_accountsCreateNestedOneWithoutConnector_runsInputObjectSchema).optional()
}).strict();
