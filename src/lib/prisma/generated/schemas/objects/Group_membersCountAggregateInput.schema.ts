// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Group_membersCountAggregateInputObjectSchema: z.ZodType<Prisma.Group_membersCountAggregateInputType, Prisma.Group_membersCountAggregateInputType> = z.object({
  group_id: z.literal(true).optional(),
  user_id: z.literal(true).optional(),
  added_by: z.literal(true).optional(),
  added_at: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const Group_membersCountAggregateInputObjectZodSchema = z.object({
  group_id: z.literal(true).optional(),
  user_id: z.literal(true).optional(),
  added_by: z.literal(true).optional(),
  added_at: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
