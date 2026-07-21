// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsSelectObjectSchema } from './metric_cardsSelect.schema';
import { metric_cardsIncludeObjectSchema } from './metric_cardsInclude.schema'

export const metric_cardsArgsObjectSchema = z.object({
  select: z.lazy(() => metric_cardsSelectObjectSchema).optional(),
  include: z.lazy(() => metric_cardsIncludeObjectSchema).optional()
}).strict();
export const metric_cardsArgsObjectZodSchema = z.object({
  select: z.lazy(() => metric_cardsSelectObjectSchema).optional(),
  include: z.lazy(() => metric_cardsIncludeObjectSchema).optional()
}).strict();
