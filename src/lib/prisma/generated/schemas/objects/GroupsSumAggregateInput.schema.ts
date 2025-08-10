import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const GroupsSumAggregateInputObjectSchema: z.ZodType<Prisma.GroupsSumAggregateInputType, Prisma.GroupsSumAggregateInputType> = z.object({
  position_x: z.literal(true).optional(),
  position_y: z.literal(true).optional(),
  width: z.literal(true).optional(),
  height: z.literal(true).optional()
}).strict();
export const GroupsSumAggregateInputObjectZodSchema = z.object({
  position_x: z.literal(true).optional(),
  position_y: z.literal(true).optional(),
  width: z.literal(true).optional(),
  height: z.literal(true).optional()
}).strict();
