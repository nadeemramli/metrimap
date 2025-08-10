import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const notificationsSelectObjectSchema: z.ZodType<Prisma.notificationsSelect, Prisma.notificationsSelect> = z.object({
  id: z.boolean().optional(),
  user_id: z.boolean().optional(),
  type: z.boolean().optional(),
  title: z.boolean().optional(),
  description: z.boolean().optional(),
  read: z.boolean().optional(),
  metadata: z.boolean().optional(),
  created_at: z.boolean().optional()
}).strict();
export const notificationsSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  user_id: z.boolean().optional(),
  type: z.boolean().optional(),
  title: z.boolean().optional(),
  description: z.boolean().optional(),
  read: z.boolean().optional(),
  metadata: z.boolean().optional(),
  created_at: z.boolean().optional()
}).strict();
