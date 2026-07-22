// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { Metric_cardsCountOutputTypeSelectObjectSchema } from './Metric_cardsCountOutputTypeSelect.schema'

export const Metric_cardsCountOutputTypeArgsObjectSchema = z.object({
  select: z.lazy(() => Metric_cardsCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const Metric_cardsCountOutputTypeArgsObjectZodSchema = z.object({
  select: z.lazy(() => Metric_cardsCountOutputTypeSelectObjectSchema).optional()
}).strict();
