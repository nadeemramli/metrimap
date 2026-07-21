// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const dashboard_widgetsAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.dashboard_widgetsAvgOrderByAggregateInput, Prisma.dashboard_widgetsAvgOrderByAggregateInput> = z.object({
  sort_index: SortOrderSchema.optional()
}).strict();
export const dashboard_widgetsAvgOrderByAggregateInputObjectZodSchema = z.object({
  sort_index: SortOrderSchema.optional()
}).strict();
