// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const SpacesSumAggregateInputObjectSchema: z.ZodType<Prisma.SpacesSumAggregateInputType, Prisma.SpacesSumAggregateInputType> = z.object({
  sort_order: z.literal(true).optional()
}).strict();
export const SpacesSumAggregateInputObjectZodSchema = z.object({
  sort_order: z.literal(true).optional()
}).strict();
