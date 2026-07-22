// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const connector_runsMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.connector_runsMinOrderByAggregateInput, Prisma.connector_runsMinOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  workspace_id: SortOrderSchema.optional(),
  connected_account_id: SortOrderSchema.optional(),
  connector_id: SortOrderSchema.optional(),
  stream: SortOrderSchema.optional(),
  event: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  sync_mode: SortOrderSchema.optional(),
  pages: SortOrderSchema.optional(),
  fetched: SortOrderSchema.optional(),
  accepted: SortOrderSchema.optional(),
  skipped: SortOrderSchema.optional(),
  rejected: SortOrderSchema.optional(),
  materialized: SortOrderSchema.optional(),
  cursor: SortOrderSchema.optional(),
  error_class: SortOrderSchema.optional(),
  error_message: SortOrderSchema.optional(),
  resumable: SortOrderSchema.optional(),
  duration_ms: SortOrderSchema.optional(),
  started_at: SortOrderSchema.optional(),
  finished_at: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
export const connector_runsMinOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  workspace_id: SortOrderSchema.optional(),
  connected_account_id: SortOrderSchema.optional(),
  connector_id: SortOrderSchema.optional(),
  stream: SortOrderSchema.optional(),
  event: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  sync_mode: SortOrderSchema.optional(),
  pages: SortOrderSchema.optional(),
  fetched: SortOrderSchema.optional(),
  accepted: SortOrderSchema.optional(),
  skipped: SortOrderSchema.optional(),
  rejected: SortOrderSchema.optional(),
  materialized: SortOrderSchema.optional(),
  cursor: SortOrderSchema.optional(),
  error_class: SortOrderSchema.optional(),
  error_message: SortOrderSchema.optional(),
  resumable: SortOrderSchema.optional(),
  duration_ms: SortOrderSchema.optional(),
  started_at: SortOrderSchema.optional(),
  finished_at: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
