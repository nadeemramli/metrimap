// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { Comment_threadsCountOutputTypeSelectObjectSchema } from './Comment_threadsCountOutputTypeSelect.schema'

export const Comment_threadsCountOutputTypeArgsObjectSchema = z.object({
  select: z.lazy(() => Comment_threadsCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const Comment_threadsCountOutputTypeArgsObjectZodSchema = z.object({
  select: z.lazy(() => Comment_threadsCountOutputTypeSelectObjectSchema).optional()
}).strict();
