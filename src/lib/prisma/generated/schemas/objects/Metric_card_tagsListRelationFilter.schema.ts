// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_card_tagsWhereInputObjectSchema } from './metric_card_tagsWhereInput.schema'

export const Metric_card_tagsListRelationFilterObjectSchema: z.ZodType<Prisma.Metric_card_tagsListRelationFilter, Prisma.Metric_card_tagsListRelationFilter> = z.object({
  every: z.lazy(() => metric_card_tagsWhereInputObjectSchema).optional(),
  some: z.lazy(() => metric_card_tagsWhereInputObjectSchema).optional(),
  none: z.lazy(() => metric_card_tagsWhereInputObjectSchema).optional()
}).strict();
export const Metric_card_tagsListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => metric_card_tagsWhereInputObjectSchema).optional(),
  some: z.lazy(() => metric_card_tagsWhereInputObjectSchema).optional(),
  none: z.lazy(() => metric_card_tagsWhereInputObjectSchema).optional()
}).strict();
