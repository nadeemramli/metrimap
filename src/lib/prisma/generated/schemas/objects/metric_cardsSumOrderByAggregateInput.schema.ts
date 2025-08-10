import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const metric_cardsSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.metric_cardsSumOrderByAggregateInput, Prisma.metric_cardsSumOrderByAggregateInput> = z.object({
  position_x: SortOrderSchema.optional(),
  position_y: SortOrderSchema.optional()
}).strict();
export const metric_cardsSumOrderByAggregateInputObjectZodSchema = z.object({
  position_x: SortOrderSchema.optional(),
  position_y: SortOrderSchema.optional()
}).strict();
