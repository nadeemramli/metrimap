import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const groupsMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.groupsMinOrderByAggregateInput, Prisma.groupsMinOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  color: SortOrderSchema.optional(),
  position_x: SortOrderSchema.optional(),
  position_y: SortOrderSchema.optional(),
  width: SortOrderSchema.optional(),
  height: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional()
}).strict();
export const groupsMinOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  color: SortOrderSchema.optional(),
  position_x: SortOrderSchema.optional(),
  position_y: SortOrderSchema.optional(),
  width: SortOrderSchema.optional(),
  height: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional()
}).strict();
