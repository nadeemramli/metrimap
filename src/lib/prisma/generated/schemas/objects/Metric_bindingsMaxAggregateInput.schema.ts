// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Metric_bindingsMaxAggregateInputObjectSchema: z.ZodType<Prisma.Metric_bindingsMaxAggregateInputType, Prisma.Metric_bindingsMaxAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  workspace_id: z.literal(true).optional(),
  connected_account_id: z.literal(true).optional(),
  connector_id: z.literal(true).optional(),
  stream: z.literal(true).optional(),
  canonical_schema: z.literal(true).optional(),
  tracked_metric_id: z.literal(true).optional(),
  enabled: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional()
}).strict();
export const Metric_bindingsMaxAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  workspace_id: z.literal(true).optional(),
  connected_account_id: z.literal(true).optional(),
  connector_id: z.literal(true).optional(),
  stream: z.literal(true).optional(),
  canonical_schema: z.literal(true).optional(),
  tracked_metric_id: z.literal(true).optional(),
  enabled: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional()
}).strict();
