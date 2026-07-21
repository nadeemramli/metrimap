// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Source_connectionsSumAggregateInputObjectSchema: z.ZodType<Prisma.Source_connectionsSumAggregateInputType, Prisma.Source_connectionsSumAggregateInputType> = z.object({
  port: z.literal(true).optional()
}).strict();
export const Source_connectionsSumAggregateInputObjectZodSchema = z.object({
  port: z.literal(true).optional()
}).strict();
