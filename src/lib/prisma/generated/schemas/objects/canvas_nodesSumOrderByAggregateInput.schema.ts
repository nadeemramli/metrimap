// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const canvas_nodesSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.canvas_nodesSumOrderByAggregateInput, Prisma.canvas_nodesSumOrderByAggregateInput> = z.object({
  position_x: SortOrderSchema.optional(),
  position_y: SortOrderSchema.optional()
}).strict();
export const canvas_nodesSumOrderByAggregateInputObjectZodSchema = z.object({
  position_x: SortOrderSchema.optional(),
  position_y: SortOrderSchema.optional()
}).strict();
