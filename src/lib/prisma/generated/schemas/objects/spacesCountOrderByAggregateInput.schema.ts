// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const spacesCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.spacesCountOrderByAggregateInput, Prisma.spacesCountOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  color: SortOrderSchema.optional(),
  sort_order: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  workspace_id: SortOrderSchema.optional()
}).strict();
export const spacesCountOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  color: SortOrderSchema.optional(),
  sort_order: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  workspace_id: SortOrderSchema.optional()
}).strict();
