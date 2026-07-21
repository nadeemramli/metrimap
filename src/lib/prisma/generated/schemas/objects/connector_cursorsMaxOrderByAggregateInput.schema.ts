// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const connector_cursorsMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.connector_cursorsMaxOrderByAggregateInput, Prisma.connector_cursorsMaxOrderByAggregateInput> = z.object({
  connected_account_id: SortOrderSchema.optional(),
  connector_id: SortOrderSchema.optional(),
  stream: SortOrderSchema.optional(),
  cursor: SortOrderSchema.optional(),
  workspace_id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
export const connector_cursorsMaxOrderByAggregateInputObjectZodSchema = z.object({
  connected_account_id: SortOrderSchema.optional(),
  connector_id: SortOrderSchema.optional(),
  stream: SortOrderSchema.optional(),
  cursor: SortOrderSchema.optional(),
  workspace_id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
