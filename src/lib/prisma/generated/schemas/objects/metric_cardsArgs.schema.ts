import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsSelectObjectSchema } from './metric_cardsSelect.schema'

export const metric_cardsArgsObjectSchema = z.object({
  select: z.lazy(() => metric_cardsSelectObjectSchema).optional()
}).strict();
export const metric_cardsArgsObjectZodSchema = z.object({
  select: z.lazy(() => metric_cardsSelectObjectSchema).optional()
}).strict();
