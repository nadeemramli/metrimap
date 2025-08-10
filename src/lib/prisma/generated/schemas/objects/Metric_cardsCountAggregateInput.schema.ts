import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Metric_cardsCountAggregateInputObjectSchema: z.ZodType<Prisma.Metric_cardsCountAggregateInputType, Prisma.Metric_cardsCountAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  project_id: z.literal(true).optional(),
  title: z.literal(true).optional(),
  description: z.literal(true).optional(),
  category: z.literal(true).optional(),
  sub_category: z.literal(true).optional(),
  position_x: z.literal(true).optional(),
  position_y: z.literal(true).optional(),
  data: z.literal(true).optional(),
  source_type: z.literal(true).optional(),
  formula: z.literal(true).optional(),
  causal_factors: z.literal(true).optional(),
  dimensions: z.literal(true).optional(),
  owner_id: z.literal(true).optional(),
  assignees: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const Metric_cardsCountAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  project_id: z.literal(true).optional(),
  title: z.literal(true).optional(),
  description: z.literal(true).optional(),
  category: z.literal(true).optional(),
  sub_category: z.literal(true).optional(),
  position_x: z.literal(true).optional(),
  position_y: z.literal(true).optional(),
  data: z.literal(true).optional(),
  source_type: z.literal(true).optional(),
  formula: z.literal(true).optional(),
  causal_factors: z.literal(true).optional(),
  dimensions: z.literal(true).optional(),
  owner_id: z.literal(true).optional(),
  assignees: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
