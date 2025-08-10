import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const GroupsAvgAggregateInputObjectSchema: z.ZodType<Prisma.GroupsAvgAggregateInputType, Prisma.GroupsAvgAggregateInputType> = z.object({
  position_x: z.literal(true).optional(),
  position_y: z.literal(true).optional(),
  width: z.literal(true).optional(),
  height: z.literal(true).optional()
}).strict();
export const GroupsAvgAggregateInputObjectZodSchema = z.object({
  position_x: z.literal(true).optional(),
  position_y: z.literal(true).optional(),
  width: z.literal(true).optional(),
  height: z.literal(true).optional()
}).strict();
