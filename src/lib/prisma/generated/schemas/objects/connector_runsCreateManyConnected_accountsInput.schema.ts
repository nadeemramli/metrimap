// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const connector_runsCreateManyConnected_accountsInputObjectSchema: z.ZodType<Prisma.connector_runsCreateManyConnected_accountsInput, Prisma.connector_runsCreateManyConnected_accountsInput> = z.object({
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
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const connector_runsCreateManyConnected_accountsInputObjectZodSchema = z.object({
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
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
