// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const api_keysCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.api_keysCountOrderByAggregateInput, Prisma.api_keysCountOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  workspace_id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  key_prefix: SortOrderSchema.optional(),
  key_hash: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  last_used_at: SortOrderSchema.optional()
}).strict();
export const api_keysCountOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  workspace_id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  key_prefix: SortOrderSchema.optional(),
  key_hash: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  last_used_at: SortOrderSchema.optional()
}).strict();
