import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const NotificationsCountAggregateInputObjectSchema: z.ZodType<Prisma.NotificationsCountAggregateInputType, Prisma.NotificationsCountAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  user_id: z.literal(true).optional(),
  type: z.literal(true).optional(),
  title: z.literal(true).optional(),
  description: z.literal(true).optional(),
  read: z.literal(true).optional(),
  metadata: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const NotificationsCountAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  user_id: z.literal(true).optional(),
  type: z.literal(true).optional(),
  title: z.literal(true).optional(),
  description: z.literal(true).optional(),
  read: z.literal(true).optional(),
  metadata: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
