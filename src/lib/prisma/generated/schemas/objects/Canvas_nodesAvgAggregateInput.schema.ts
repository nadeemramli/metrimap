// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Canvas_nodesAvgAggregateInputObjectSchema: z.ZodType<Prisma.Canvas_nodesAvgAggregateInputType, Prisma.Canvas_nodesAvgAggregateInputType> = z.object({
  position_x: z.literal(true).optional(),
  position_y: z.literal(true).optional(),
  z_index: z.literal(true).optional()
}).strict();
export const Canvas_nodesAvgAggregateInputObjectZodSchema = z.object({
  position_x: z.literal(true).optional(),
  position_y: z.literal(true).optional(),
  z_index: z.literal(true).optional()
}).strict();
