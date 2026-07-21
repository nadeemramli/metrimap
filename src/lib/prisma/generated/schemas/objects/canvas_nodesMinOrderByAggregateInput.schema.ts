// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const canvas_nodesMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.canvas_nodesMinOrderByAggregateInput, Prisma.canvas_nodesMinOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  node_type: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  position_x: SortOrderSchema.optional(),
  position_y: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  updated_by: SortOrderSchema.optional(),
  z_index: SortOrderSchema.optional()
}).strict();
export const canvas_nodesMinOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  node_type: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  position_x: SortOrderSchema.optional(),
  position_y: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  updated_by: SortOrderSchema.optional(),
  z_index: SortOrderSchema.optional()
}).strict();
