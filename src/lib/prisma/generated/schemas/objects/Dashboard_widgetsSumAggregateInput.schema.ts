// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Dashboard_widgetsSumAggregateInputObjectSchema: z.ZodType<Prisma.Dashboard_widgetsSumAggregateInputType, Prisma.Dashboard_widgetsSumAggregateInputType> = z.object({
  sort_index: z.literal(true).optional()
}).strict();
export const Dashboard_widgetsSumAggregateInputObjectZodSchema = z.object({
  sort_index: z.literal(true).optional()
}).strict();
