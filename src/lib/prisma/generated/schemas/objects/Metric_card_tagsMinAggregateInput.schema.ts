import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Metric_card_tagsMinAggregateInputObjectSchema: z.ZodType<Prisma.Metric_card_tagsMinAggregateInputType, Prisma.Metric_card_tagsMinAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  metric_card_id: z.literal(true).optional(),
  tag_id: z.literal(true).optional(),
  created_at: z.literal(true).optional()
}).strict();
export const Metric_card_tagsMinAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  metric_card_id: z.literal(true).optional(),
  tag_id: z.literal(true).optional(),
  created_at: z.literal(true).optional()
}).strict();
