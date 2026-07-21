// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Connector_runsMinAggregateInputObjectSchema: z.ZodType<Prisma.Connector_runsMinAggregateInputType, Prisma.Connector_runsMinAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  workspace_id: z.literal(true).optional(),
  connected_account_id: z.literal(true).optional(),
  connector_id: z.literal(true).optional(),
  stream: z.literal(true).optional(),
  event: z.literal(true).optional(),
  status: z.literal(true).optional(),
  sync_mode: z.literal(true).optional(),
  pages: z.literal(true).optional(),
  fetched: z.literal(true).optional(),
  accepted: z.literal(true).optional(),
  skipped: z.literal(true).optional(),
  rejected: z.literal(true).optional(),
  materialized: z.literal(true).optional(),
  cursor: z.literal(true).optional(),
  error_class: z.literal(true).optional(),
  error_message: z.literal(true).optional(),
  resumable: z.literal(true).optional(),
  duration_ms: z.literal(true).optional(),
  started_at: z.literal(true).optional(),
  finished_at: z.literal(true).optional(),
  created_at: z.literal(true).optional()
}).strict();
export const Connector_runsMinAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  workspace_id: z.literal(true).optional(),
  connected_account_id: z.literal(true).optional(),
  connector_id: z.literal(true).optional(),
  stream: z.literal(true).optional(),
  event: z.literal(true).optional(),
  status: z.literal(true).optional(),
  sync_mode: z.literal(true).optional(),
  pages: z.literal(true).optional(),
  fetched: z.literal(true).optional(),
  accepted: z.literal(true).optional(),
  skipped: z.literal(true).optional(),
  rejected: z.literal(true).optional(),
  materialized: z.literal(true).optional(),
  cursor: z.literal(true).optional(),
  error_class: z.literal(true).optional(),
  error_message: z.literal(true).optional(),
  resumable: z.literal(true).optional(),
  duration_ms: z.literal(true).optional(),
  started_at: z.literal(true).optional(),
  finished_at: z.literal(true).optional(),
  created_at: z.literal(true).optional()
}).strict();
