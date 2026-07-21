// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tracked_metricsCreateNestedOneWithoutMetric_valuesInputObjectSchema } from './tracked_metricsCreateNestedOneWithoutMetric_valuesInput.schema'

export const metric_valuesCreateInputObjectSchema: z.ZodType<Prisma.metric_valuesCreateInput, Prisma.metric_valuesCreateInput> = z.object({
  id: z.string().optional(),
  period: z.string(),
  value: z.number(),
  change_percent: z.number().optional().nullable(),
  trend: z.string().optional().nullable(),
  source: z.string().optional().nullable(),
  created_by: z.string().optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  workspace_id: z.string().optional().nullable(),
  tracked_metrics: z.lazy(() => tracked_metricsCreateNestedOneWithoutMetric_valuesInputObjectSchema)
}).strict();
export const metric_valuesCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  period: z.string(),
  value: z.number(),
  change_percent: z.number().optional().nullable(),
  trend: z.string().optional().nullable(),
  source: z.string().optional().nullable(),
  created_by: z.string().optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  workspace_id: z.string().optional().nullable(),
  tracked_metrics: z.lazy(() => tracked_metricsCreateNestedOneWithoutMetric_valuesInputObjectSchema)
}).strict();
