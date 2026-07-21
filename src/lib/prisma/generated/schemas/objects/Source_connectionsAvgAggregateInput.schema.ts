// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Source_connectionsAvgAggregateInputObjectSchema: z.ZodType<Prisma.Source_connectionsAvgAggregateInputType, Prisma.Source_connectionsAvgAggregateInputType> = z.object({
  port: z.literal(true).optional()
}).strict();
export const Source_connectionsAvgAggregateInputObjectZodSchema = z.object({
  port: z.literal(true).optional()
}).strict();
