// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const metric_valuesUncheckedCreateWithoutTracked_metricsInputObjectSchema: z.ZodType<Prisma.metric_valuesUncheckedCreateWithoutTracked_metricsInput, Prisma.metric_valuesUncheckedCreateWithoutTracked_metricsInput> = z.object({
  id: z.string().optional(),
  period: z.string(),
  value: z.number(),
  change_percent: z.number().optional().nullable(),
  trend: z.string().optional().nullable(),
  source: z.string().optional().nullable(),
  created_by: z.string().optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  workspace_id: z.string().optional().nullable()
}).strict();
export const metric_valuesUncheckedCreateWithoutTracked_metricsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  period: z.string(),
  value: z.number(),
  change_percent: z.number().optional().nullable(),
  trend: z.string().optional().nullable(),
  source: z.string().optional().nullable(),
  created_by: z.string().optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  workspace_id: z.string().optional().nullable()
}).strict();
