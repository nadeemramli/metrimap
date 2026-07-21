// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Strategy_metric_linksMaxAggregateInputObjectSchema: z.ZodType<Prisma.Strategy_metric_linksMaxAggregateInputType, Prisma.Strategy_metric_linksMaxAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  contract_id: z.literal(true).optional(),
  workspace_id: z.literal(true).optional(),
  role: z.literal(true).optional(),
  ref_source: z.literal(true).optional(),
  tracked_metric_id: z.literal(true).optional(),
  card_id: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  created_at: z.literal(true).optional()
}).strict();
export const Strategy_metric_linksMaxAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  contract_id: z.literal(true).optional(),
  workspace_id: z.literal(true).optional(),
  role: z.literal(true).optional(),
  ref_source: z.literal(true).optional(),
  tracked_metric_id: z.literal(true).optional(),
  card_id: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  created_at: z.literal(true).optional()
}).strict();
