// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const canvas_nodesAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.canvas_nodesAvgOrderByAggregateInput, Prisma.canvas_nodesAvgOrderByAggregateInput> = z.object({
  position_x: SortOrderSchema.optional(),
  position_y: SortOrderSchema.optional(),
  z_index: SortOrderSchema.optional()
}).strict();
export const canvas_nodesAvgOrderByAggregateInputObjectZodSchema = z.object({
  position_x: SortOrderSchema.optional(),
  position_y: SortOrderSchema.optional(),
  z_index: SortOrderSchema.optional()
}).strict();
