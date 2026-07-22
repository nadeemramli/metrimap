// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const source_connectionsMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.source_connectionsMinOrderByAggregateInput, Prisma.source_connectionsMinOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  warehouse_type: SortOrderSchema.optional(),
  host: SortOrderSchema.optional(),
  port: SortOrderSchema.optional(),
  database: SortOrderSchema.optional(),
  username: SortOrderSchema.optional(),
  ssl: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  workspace_id: SortOrderSchema.optional()
}).strict();
export const source_connectionsMinOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  warehouse_type: SortOrderSchema.optional(),
  host: SortOrderSchema.optional(),
  port: SortOrderSchema.optional(),
  database: SortOrderSchema.optional(),
  username: SortOrderSchema.optional(),
  ssl: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  workspace_id: SortOrderSchema.optional()
}).strict();
