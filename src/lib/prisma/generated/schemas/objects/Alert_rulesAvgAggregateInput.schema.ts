// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Alert_rulesAvgAggregateInputObjectSchema: z.ZodType<Prisma.Alert_rulesAvgAggregateInputType, Prisma.Alert_rulesAvgAggregateInputType> = z.object({
  last_triggered_value: z.literal(true).optional()
}).strict();
export const Alert_rulesAvgAggregateInputObjectZodSchema = z.object({
  last_triggered_value: z.literal(true).optional()
}).strict();
