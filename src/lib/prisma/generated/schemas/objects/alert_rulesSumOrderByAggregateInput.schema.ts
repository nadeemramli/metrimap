// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const alert_rulesSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.alert_rulesSumOrderByAggregateInput, Prisma.alert_rulesSumOrderByAggregateInput> = z.object({
  last_triggered_value: SortOrderSchema.optional()
}).strict();
export const alert_rulesSumOrderByAggregateInputObjectZodSchema = z.object({
  last_triggered_value: SortOrderSchema.optional()
}).strict();
