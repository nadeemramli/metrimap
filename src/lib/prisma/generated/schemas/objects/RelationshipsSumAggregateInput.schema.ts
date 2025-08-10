import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const RelationshipsSumAggregateInputObjectSchema: z.ZodType<Prisma.RelationshipsSumAggregateInputType, Prisma.RelationshipsSumAggregateInputType> = z.object({
  weight: z.literal(true).optional()
}).strict();
export const RelationshipsSumAggregateInputObjectZodSchema = z.object({
  weight: z.literal(true).optional()
}).strict();
