import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_card_tagsSelectObjectSchema } from './metric_card_tagsSelect.schema'

export const metric_card_tagsArgsObjectSchema = z.object({
  select: z.lazy(() => metric_card_tagsSelectObjectSchema).optional()
}).strict();
export const metric_card_tagsArgsObjectZodSchema = z.object({
  select: z.lazy(() => metric_card_tagsSelectObjectSchema).optional()
}).strict();
