// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const connector_cursorsMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.connector_cursorsMinOrderByAggregateInput, Prisma.connector_cursorsMinOrderByAggregateInput> = z.object({
  connected_account_id: SortOrderSchema.optional(),
  connector_id: SortOrderSchema.optional(),
  stream: SortOrderSchema.optional(),
  cursor: SortOrderSchema.optional(),
  workspace_id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
export const connector_cursorsMinOrderByAggregateInputObjectZodSchema = z.object({
  connected_account_id: SortOrderSchema.optional(),
  connector_id: SortOrderSchema.optional(),
  stream: SortOrderSchema.optional(),
  cursor: SortOrderSchema.optional(),
  workspace_id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
