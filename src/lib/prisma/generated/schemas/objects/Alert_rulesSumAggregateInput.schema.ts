// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Alert_rulesSumAggregateInputObjectSchema: z.ZodType<Prisma.Alert_rulesSumAggregateInputType, Prisma.Alert_rulesSumAggregateInputType> = z.object({
  last_triggered_value: z.literal(true).optional()
}).strict();
export const Alert_rulesSumAggregateInputObjectZodSchema = z.object({
  last_triggered_value: z.literal(true).optional()
}).strict();
