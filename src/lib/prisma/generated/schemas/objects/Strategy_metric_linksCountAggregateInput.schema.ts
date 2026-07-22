// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Strategy_metric_linksCountAggregateInputObjectSchema: z.ZodType<Prisma.Strategy_metric_linksCountAggregateInputType, Prisma.Strategy_metric_linksCountAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  contract_id: z.literal(true).optional(),
  workspace_id: z.literal(true).optional(),
  role: z.literal(true).optional(),
  ref_source: z.literal(true).optional(),
  tracked_metric_id: z.literal(true).optional(),
  card_id: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const Strategy_metric_linksCountAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  contract_id: z.literal(true).optional(),
  workspace_id: z.literal(true).optional(),
  role: z.literal(true).optional(),
  ref_source: z.literal(true).optional(),
  tracked_metric_id: z.literal(true).optional(),
  card_id: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
