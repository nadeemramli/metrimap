// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tracked_metricsArgsObjectSchema } from './tracked_metricsArgs.schema'

export const metric_valuesSelectObjectSchema: z.ZodType<Prisma.metric_valuesSelect, Prisma.metric_valuesSelect> = z.object({
  id: z.boolean().optional(),
  tracked_metric_id: z.boolean().optional(),
  period: z.boolean().optional(),
  value: z.boolean().optional(),
  change_percent: z.boolean().optional(),
  trend: z.boolean().optional(),
  source: z.boolean().optional(),
  created_by: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  workspace_id: z.boolean().optional(),
  tracked_metrics: z.union([z.boolean(), z.lazy(() => tracked_metricsArgsObjectSchema)]).optional()
}).strict();
export const metric_valuesSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  tracked_metric_id: z.boolean().optional(),
  period: z.boolean().optional(),
  value: z.boolean().optional(),
  change_percent: z.boolean().optional(),
  trend: z.boolean().optional(),
  source: z.boolean().optional(),
  created_by: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  workspace_id: z.boolean().optional(),
  tracked_metrics: z.union([z.boolean(), z.lazy(() => tracked_metricsArgsObjectSchema)]).optional()
}).strict();
