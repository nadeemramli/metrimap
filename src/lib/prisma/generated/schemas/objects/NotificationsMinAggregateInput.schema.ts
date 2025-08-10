import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const NotificationsMinAggregateInputObjectSchema: z.ZodType<Prisma.NotificationsMinAggregateInputType, Prisma.NotificationsMinAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  user_id: z.literal(true).optional(),
  type: z.literal(true).optional(),
  title: z.literal(true).optional(),
  description: z.literal(true).optional(),
  read: z.literal(true).optional(),
  created_at: z.literal(true).optional()
}).strict();
export const NotificationsMinAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  user_id: z.literal(true).optional(),
  type: z.literal(true).optional(),
  title: z.literal(true).optional(),
  description: z.literal(true).optional(),
  read: z.literal(true).optional(),
  created_at: z.literal(true).optional()
}).strict();
