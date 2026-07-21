// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Relationship_historyAvgAggregateInputObjectSchema: z.ZodType<Prisma.Relationship_historyAvgAggregateInputType, Prisma.Relationship_historyAvgAggregateInputType> = z.object({
  weight: z.literal(true).optional()
}).strict();
export const Relationship_historyAvgAggregateInputObjectZodSchema = z.object({
  weight: z.literal(true).optional()
}).strict();
