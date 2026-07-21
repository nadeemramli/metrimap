// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Canvas_nodesSumAggregateInputObjectSchema: z.ZodType<Prisma.Canvas_nodesSumAggregateInputType, Prisma.Canvas_nodesSumAggregateInputType> = z.object({
  position_x: z.literal(true).optional(),
  position_y: z.literal(true).optional(),
  z_index: z.literal(true).optional()
}).strict();
export const Canvas_nodesSumAggregateInputObjectZodSchema = z.object({
  position_x: z.literal(true).optional(),
  position_y: z.literal(true).optional(),
  z_index: z.literal(true).optional()
}).strict();
