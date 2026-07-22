// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { error_reportsSelectObjectSchema } from './error_reportsSelect.schema'

export const error_reportsArgsObjectSchema = z.object({
  select: z.lazy(() => error_reportsSelectObjectSchema).optional()
}).strict();
export const error_reportsArgsObjectZodSchema = z.object({
  select: z.lazy(() => error_reportsSelectObjectSchema).optional()
}).strict();
