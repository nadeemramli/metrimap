// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Group_membersMinAggregateInputObjectSchema: z.ZodType<Prisma.Group_membersMinAggregateInputType, Prisma.Group_membersMinAggregateInputType> = z.object({
  group_id: z.literal(true).optional(),
  user_id: z.literal(true).optional(),
  added_by: z.literal(true).optional(),
  added_at: z.literal(true).optional()
}).strict();
export const Group_membersMinAggregateInputObjectZodSchema = z.object({
  group_id: z.literal(true).optional(),
  user_id: z.literal(true).optional(),
  added_by: z.literal(true).optional(),
  added_at: z.literal(true).optional()
}).strict();
