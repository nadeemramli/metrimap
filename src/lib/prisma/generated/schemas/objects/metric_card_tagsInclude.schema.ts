// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsArgsObjectSchema } from './metric_cardsArgs.schema';
import { tagsArgsObjectSchema } from './tagsArgs.schema'

export const metric_card_tagsIncludeObjectSchema: z.ZodType<Prisma.metric_card_tagsInclude, Prisma.metric_card_tagsInclude> = z.object({
  metric_cards: z.union([z.boolean(), z.lazy(() => metric_cardsArgsObjectSchema)]).optional(),
  tags: z.union([z.boolean(), z.lazy(() => tagsArgsObjectSchema)]).optional()
}).strict();
export const metric_card_tagsIncludeObjectZodSchema = z.object({
  metric_cards: z.union([z.boolean(), z.lazy(() => metric_cardsArgsObjectSchema)]).optional(),
  tags: z.union([z.boolean(), z.lazy(() => tagsArgsObjectSchema)]).optional()
}).strict();
