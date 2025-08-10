import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Metric_card_tagsMaxAggregateInputObjectSchema: z.ZodType<Prisma.Metric_card_tagsMaxAggregateInputType, Prisma.Metric_card_tagsMaxAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  metric_card_id: z.literal(true).optional(),
  tag_id: z.literal(true).optional(),
  created_at: z.literal(true).optional()
}).strict();
export const Metric_card_tagsMaxAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  metric_card_id: z.literal(true).optional(),
  tag_id: z.literal(true).optional(),
  created_at: z.literal(true).optional()
}).strict();
