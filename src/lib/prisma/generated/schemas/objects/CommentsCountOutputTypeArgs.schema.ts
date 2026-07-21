// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { CommentsCountOutputTypeSelectObjectSchema } from './CommentsCountOutputTypeSelect.schema'

export const CommentsCountOutputTypeArgsObjectSchema = z.object({
  select: z.lazy(() => CommentsCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const CommentsCountOutputTypeArgsObjectZodSchema = z.object({
  select: z.lazy(() => CommentsCountOutputTypeSelectObjectSchema).optional()
}).strict();
