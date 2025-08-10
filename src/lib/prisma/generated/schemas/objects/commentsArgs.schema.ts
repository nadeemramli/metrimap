import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsSelectObjectSchema } from './commentsSelect.schema'

export const commentsArgsObjectSchema = z.object({
  select: z.lazy(() => commentsSelectObjectSchema).optional()
}).strict();
export const commentsArgsObjectZodSchema = z.object({
  select: z.lazy(() => commentsSelectObjectSchema).optional()
}).strict();
