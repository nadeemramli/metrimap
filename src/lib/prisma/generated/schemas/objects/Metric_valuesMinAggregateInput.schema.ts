// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Metric_valuesMinAggregateInputObjectSchema: z.ZodType<Prisma.Metric_valuesMinAggregateInputType, Prisma.Metric_valuesMinAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  tracked_metric_id: z.literal(true).optional(),
  period: z.literal(true).optional(),
  value: z.literal(true).optional(),
  change_percent: z.literal(true).optional(),
  trend: z.literal(true).optional(),
  source: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  workspace_id: z.literal(true).optional()
}).strict();
export const Metric_valuesMinAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  tracked_metric_id: z.literal(true).optional(),
  period: z.literal(true).optional(),
  value: z.literal(true).optional(),
  change_percent: z.literal(true).optional(),
  trend: z.literal(true).optional(),
  source: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  workspace_id: z.literal(true).optional()
}).strict();
