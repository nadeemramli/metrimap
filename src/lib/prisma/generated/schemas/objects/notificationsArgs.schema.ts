import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { notificationsSelectObjectSchema } from './notificationsSelect.schema'

export const notificationsArgsObjectSchema = z.object({
  select: z.lazy(() => notificationsSelectObjectSchema).optional()
}).strict();
export const notificationsArgsObjectZodSchema = z.object({
  select: z.lazy(() => notificationsSelectObjectSchema).optional()
}).strict();
