import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const metric_cardsAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.metric_cardsAvgOrderByAggregateInput, Prisma.metric_cardsAvgOrderByAggregateInput> = z.object({
  position_x: SortOrderSchema.optional(),
  position_y: SortOrderSchema.optional()
}).strict();
export const metric_cardsAvgOrderByAggregateInputObjectZodSchema = z.object({
  position_x: SortOrderSchema.optional(),
  position_y: SortOrderSchema.optional()
}).strict();
