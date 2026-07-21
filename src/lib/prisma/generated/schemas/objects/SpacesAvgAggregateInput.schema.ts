// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const SpacesAvgAggregateInputObjectSchema: z.ZodType<Prisma.SpacesAvgAggregateInputType, Prisma.SpacesAvgAggregateInputType> = z.object({
  sort_order: z.literal(true).optional()
}).strict();
export const SpacesAvgAggregateInputObjectZodSchema = z.object({
  sort_order: z.literal(true).optional()
}).strict();
