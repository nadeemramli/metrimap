// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const alert_rulesAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.alert_rulesAvgOrderByAggregateInput, Prisma.alert_rulesAvgOrderByAggregateInput> = z.object({
  last_triggered_value: SortOrderSchema.optional()
}).strict();
export const alert_rulesAvgOrderByAggregateInputObjectZodSchema = z.object({
  last_triggered_value: SortOrderSchema.optional()
}).strict();
