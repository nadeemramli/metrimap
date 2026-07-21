// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Relationship_historySumAggregateInputObjectSchema: z.ZodType<Prisma.Relationship_historySumAggregateInputType, Prisma.Relationship_historySumAggregateInputType> = z.object({
  weight: z.literal(true).optional()
}).strict();
export const Relationship_historySumAggregateInputObjectZodSchema = z.object({
  weight: z.literal(true).optional()
}).strict();
