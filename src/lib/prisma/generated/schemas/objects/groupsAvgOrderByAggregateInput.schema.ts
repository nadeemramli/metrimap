import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const groupsAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.groupsAvgOrderByAggregateInput, Prisma.groupsAvgOrderByAggregateInput> = z.object({
  position_x: SortOrderSchema.optional(),
  position_y: SortOrderSchema.optional(),
  width: SortOrderSchema.optional(),
  height: SortOrderSchema.optional()
}).strict();
export const groupsAvgOrderByAggregateInputObjectZodSchema = z.object({
  position_x: SortOrderSchema.optional(),
  position_y: SortOrderSchema.optional(),
  width: SortOrderSchema.optional(),
  height: SortOrderSchema.optional()
}).strict();
