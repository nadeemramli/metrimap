// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const connected_accountsMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.connected_accountsMinOrderByAggregateInput, Prisma.connected_accountsMinOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  workspace_id: SortOrderSchema.optional(),
  connector_id: SortOrderSchema.optional(),
  auth_type: SortOrderSchema.optional(),
  source_account_id: SortOrderSchema.optional(),
  source_account_label: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  status_detail: SortOrderSchema.optional(),
  last_synced_at: SortOrderSchema.optional(),
  last_query_at: SortOrderSchema.optional(),
  revoked_at: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
export const connected_accountsMinOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  workspace_id: SortOrderSchema.optional(),
  connector_id: SortOrderSchema.optional(),
  auth_type: SortOrderSchema.optional(),
  source_account_id: SortOrderSchema.optional(),
  source_account_label: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  status_detail: SortOrderSchema.optional(),
  last_synced_at: SortOrderSchema.optional(),
  last_query_at: SortOrderSchema.optional(),
  revoked_at: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
