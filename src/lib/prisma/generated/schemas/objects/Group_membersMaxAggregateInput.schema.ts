// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Group_membersMaxAggregateInputObjectSchema: z.ZodType<Prisma.Group_membersMaxAggregateInputType, Prisma.Group_membersMaxAggregateInputType> = z.object({
  group_id: z.literal(true).optional(),
  user_id: z.literal(true).optional(),
  added_by: z.literal(true).optional(),
  added_at: z.literal(true).optional()
}).strict();
export const Group_membersMaxAggregateInputObjectZodSchema = z.object({
  group_id: z.literal(true).optional(),
  user_id: z.literal(true).optional(),
  added_by: z.literal(true).optional(),
  added_at: z.literal(true).optional()
}).strict();
