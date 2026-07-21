// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Dashboard_widgetsAvgAggregateInputObjectSchema: z.ZodType<Prisma.Dashboard_widgetsAvgAggregateInputType, Prisma.Dashboard_widgetsAvgAggregateInputType> = z.object({
  sort_index: z.literal(true).optional()
}).strict();
export const Dashboard_widgetsAvgAggregateInputObjectZodSchema = z.object({
  sort_index: z.literal(true).optional()
}).strict();
