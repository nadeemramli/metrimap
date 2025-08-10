import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Metric_card_tagsCountAggregateInputObjectSchema: z.ZodType<Prisma.Metric_card_tagsCountAggregateInputType, Prisma.Metric_card_tagsCountAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  metric_card_id: z.literal(true).optional(),
  tag_id: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const Metric_card_tagsCountAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  metric_card_id: z.literal(true).optional(),
  tag_id: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
