import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const NotificationsMaxAggregateInputObjectSchema: z.ZodType<Prisma.NotificationsMaxAggregateInputType, Prisma.NotificationsMaxAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  user_id: z.literal(true).optional(),
  type: z.literal(true).optional(),
  title: z.literal(true).optional(),
  description: z.literal(true).optional(),
  read: z.literal(true).optional(),
  created_at: z.literal(true).optional()
}).strict();
export const NotificationsMaxAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  user_id: z.literal(true).optional(),
  type: z.literal(true).optional(),
  title: z.literal(true).optional(),
  description: z.literal(true).optional(),
  read: z.literal(true).optional(),
  created_at: z.literal(true).optional()
}).strict();
