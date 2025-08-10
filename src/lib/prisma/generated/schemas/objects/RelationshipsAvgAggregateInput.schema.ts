import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const RelationshipsAvgAggregateInputObjectSchema: z.ZodType<Prisma.RelationshipsAvgAggregateInputType, Prisma.RelationshipsAvgAggregateInputType> = z.object({
  weight: z.literal(true).optional()
}).strict();
export const RelationshipsAvgAggregateInputObjectZodSchema = z.object({
  weight: z.literal(true).optional()
}).strict();
