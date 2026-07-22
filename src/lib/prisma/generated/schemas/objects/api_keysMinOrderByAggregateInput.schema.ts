// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const api_keysMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.api_keysMinOrderByAggregateInput, Prisma.api_keysMinOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  workspace_id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  key_prefix: SortOrderSchema.optional(),
  key_hash: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  last_used_at: SortOrderSchema.optional()
}).strict();
export const api_keysMinOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  workspace_id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  key_prefix: SortOrderSchema.optional(),
  key_hash: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  last_used_at: SortOrderSchema.optional()
}).strict();
