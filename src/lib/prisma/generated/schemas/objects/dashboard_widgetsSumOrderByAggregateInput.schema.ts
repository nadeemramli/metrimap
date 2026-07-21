// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const dashboard_widgetsSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.dashboard_widgetsSumOrderByAggregateInput, Prisma.dashboard_widgetsSumOrderByAggregateInput> = z.object({
  sort_index: SortOrderSchema.optional()
}).strict();
export const dashboard_widgetsSumOrderByAggregateInputObjectZodSchema = z.object({
  sort_index: SortOrderSchema.optional()
}).strict();
